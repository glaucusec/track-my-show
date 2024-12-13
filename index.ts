import dotenv from "dotenv";
import puppeteerextra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
dotenv.config();

const URL = process.env.THEATRE_URL;

declare const UAPI: any;

(async () => {
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
          }
        } catch (error) {
          console.warn("Error evaluating script:", error);
        }
      });

      return UAPIValue;
    });

    console.log(result.ShowDetails[0].Event);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
})();
