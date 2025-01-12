import puppeteer from "puppeteer";
import { v4 as uuid } from "uuid";
import { captureAndSolveCaptcha } from "../utils/captchaResolver.js";
import logger from "../utils/logger.js";

const cityInfoSite =
  "https://examinationservices.nic.in/jeemain2025/DownloadAdmitCard/frmAuthforCity.aspx?enc=WPJ5WSCVWOMNiXoyyomJgDUffqDdG1LTsAPBKFcEC9W88CTkt2ITzilIsFR7gKxO";

const SELECTORS = {
  applicationNumber: 'input[name="ctl00$ContentPlaceHolder1$txtRegno"]',
  day: "#ctl00_ContentPlaceHolder1_ddlday",
  month: "#ctl00_ContentPlaceHolder1_ddlmonth",
  year: "#ctl00_ContentPlaceHolder1_ddlyear",
  captchaInput: 'input[name="ctl00$ContentPlaceHolder1$txtsecpin"]',
  loginButton: '[name="ctl00$ContentPlaceHolder1$btnsignin"]',
  captchaImage: "#ctl00_ContentPlaceHolder1_captchaimage",
  successPanel: "#ctl00_ContentPlaceHolder1_pnlAdmitcard",
  examDate: "#ctl00_ContentPlaceHolder1_dateofexamP1",
  examCity: "#ctl00_ContentPlaceHolder1_cityofexamP1",
  errorSelector: "#ctl00_ContentPlaceHolder1_lblerror1",
};

const MAX_RETRIES = 3;

export async function downloadCityInformation(req, res, next) {
  const { applicationNumber, day, month, year } = req.body;

  // Validate input
  if (!applicationNumber || !day || !month || !year) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const formattedDay = String(day).padStart(2, "0");
  const formattedMonth = String(month).padStart(2, "0");
  const uniqueId = uuid();

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to the site
    await page.goto(cityInfoSite);

    // Fill in the form
    await page.type(SELECTORS.applicationNumber, String(applicationNumber));
    await page.select(SELECTORS.day, formattedDay);
    await page.select(SELECTORS.month, formattedMonth);
    await page.select(SELECTORS.year, String(year));

    // Handle CAPTCHA with retries
    let success = false;
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        await page.waitForSelector(SELECTORS.captchaImage, { timeout: 5000 });
        const captchaText = await captureAndSolveCaptcha(
          page,
          SELECTORS.captchaImage
        );

        await page.type(SELECTORS.captchaInput, captchaText);
        await page.click(SELECTORS.loginButton);
        const error = await page.$eval(
          SELECTORS.errorSelector,
          (el) => el.innerText
        );
        if (error && error === "Invalid Application No or Date of Birth.") {
          return res.status(200).json({ error });
        }
        await page.waitForNetworkIdle({ timeout: 10000 });
        // Wait for success panel
        const successSelector = await page.waitForSelector(
          SELECTORS.successPanel,
          {
            timeout: 4000,
          }
        );
        if (successSelector) {
          success = true;
          break;
        }
      } catch (err) {
        logger.error(`Retry ${i + 1} failed:`, err.message);
        if (i === MAX_RETRIES - 1) {
          throw new Error("Failed to process CAPTCHA after maximum retries.");
        }
      }
    }

    if (!success) {
      return res.status(400).json({ error: "Failed to get City info." });
    }

    // Extract exam information
    const date = await page.$eval(SELECTORS.examDate, (el) => el.innerText);
    const city = await page.$eval(SELECTORS.examCity, (el) => el.innerText);

    // Save the PDF
    const pdfPath = `./uploads/${applicationNumber}_${uniqueId}.pdf`;
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    });

    const fullPdfUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${applicationNumber}_${uniqueId}.pdf`;
    res.status(200).json({
      pdfUrl: fullPdfUrl,
      date,
      city,
    });
  } catch (error) {
    next(error);
  } finally {
    await browser.close();
  }
}
export async function downloadAdmitCard(req, res, next) {
  try {
    res.status(200).json({ message: "Success" });
  } catch (error) {
    next(error);
  }
}
