import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const URL = "https://medium.com/tag/nodejs";

try {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "networkidle2" });

  const articles = await page.$$('article[data-testid="post-preview"');
  for (const article of articles) {
    const title = await article.$eval("h2", (el) => el.textContent?.trim() ?? "");
    const url = await article.$eval('a', (el) => el.getAttribute("href"));
    console.(title, url);
  }

  await browser.close();
} catch (e) {
  console.log("error", e.message);
}
