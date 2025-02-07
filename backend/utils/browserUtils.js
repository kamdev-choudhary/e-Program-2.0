import puppeteer from "puppeteer";

let browser = null;

export async function initializeBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({ headless: true });
  }
}

export async function createPage() {
  if (!browser) {
    await initializeBrowser();
  }
  return await browser.newPage();
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
