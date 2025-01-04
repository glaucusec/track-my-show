import dotenv from "dotenv";
dotenv.config();
import { ShowEventType } from "./types";
import puppeteerextra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { telnotify } from "./src/telegram";
import { checkForSameEvents } from "./utils";
import logger from "./utils/logger";
import agenda from "./utils/agenda";

const URL = process.env.THEATRE_URL;

declare const UAPI: any;

let count = 0;
let cachedShowTitles: ShowEventType[];

async function main() {
  logger.info("starting the main script...");
  puppeteerextra.use(StealthPlugin());
  const browser = await puppeteerextra.launch();
  const page = await browser.newPage();

  try {
    await page.goto(URL, { waitUntil: "domcontentloaded" });

    const result = await page.evaluate(() => {
      const scripts = document.querySelectorAll("script");
      let UAPIValue = null;

      scripts.forEach((script) => {
        try {
          if (script.innerHTML) {
            eval(script.innerHTML);
          }

          if (typeof UAPI !== "undefined") {
            UAPIValue = UAPI;
          } else {
            const err = "UAPI variable is undefined";
            logger.fatal(err);
            throw new Error(err);
          }
        } catch (error) {
          console.log(error);
        }
      });

      return UAPIValue;
    });

    // if shows for new dates are listed
    const ShowDatesArray = result.ShowDatesArray;
    const showListedDates = ShowDatesArray.filter(
      (dates) => dates.isDisabled === false
    );

    const showDetails: ShowEventType[] = result.ShowDetails[0].Event;

    // if showDetails doesn't match cached showDetails trigger the notification
    if (!checkForSameEvents(cachedShowTitles, showDetails)) {
      telnotify({ msg: "You have new shows available. check now!" });
    }
    cachedShowTitles = showDetails;
  } catch (error) {
    console.log(error);
    await telnotify({ msg: "Something went wrong" });
  } finally {
    await browser.close();
    count += 1;
  }
}

agenda.define("main-agenda", async () => {
  main();
});

(async function () {
  await agenda.start();
  await agenda.every("1 minutes", "main-agenda");
})();
