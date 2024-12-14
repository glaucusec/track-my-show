import dotenv from "dotenv";
dotenv.config();
import { Agenda } from "@hokify/agenda";
import { ShowTypeEvent } from "./types";
import puppeteerextra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { telNotification } from "./telegram";
import { checkForSameEvents } from "./utils";
import "./telegram";

const URL = process.env.THEATRE_URL;
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

declare const UAPI: any;
const agenda = new Agenda({ db: { address: MONGO_CONNECTION_STRING } });

let count = 0;

async function main() {
  puppeteerextra.use(StealthPlugin());
  const browser = await puppeteerextra.launch();
  const page = await browser.newPage();

  let cachedShowDetails: ShowTypeEvent[];

  try {
    console.log("running ...");
    telNotification({ msg: `scraping book-my-show (${count})` });
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
          }
        } catch (error) {
          console.log(error);
          telNotification({ msg: "Error evaluating script:" });
        }
      });

      return UAPIValue;
    });

    const showDetails: ShowTypeEvent[] = result.ShowDetails[0].Event;
    // if showDetails doesn't match cached showDetails trigger the notification
    if (checkForSameEvents(cachedShowDetails, showDetails)) {
      telNotification({ msg: "You have new shows available. check now!" });
    }
    cachedShowDetails = showDetails;
  } catch (error) {
    console.log(error);
    await telNotification({ msg: "", type: "error" });
  } finally {
    await browser.close();
    count += 1;
  }
}

agenda.define("main-agenda", async (job) => {
  main();
});

(async function () {
  await agenda.start();
  await agenda.every("3 minutes", "main-agenda");
})();
