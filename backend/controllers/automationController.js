import puppeteer from "puppeteer";
import { v4 as uuid } from "uuid";
import {
  captureAndSolveCaptcha,
  captureAnsSolveWithPython,
} from "../utils/captchaResolver.js";
import logger from "../utils/logger.js";
import fs from "fs";
import path from "path";

const MAX_RETRIES = 10;

export async function downloadCityInformation(req, res, next) {
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
    // await browser.close();
  }
}

export async function downloadAdmitCard(req, res, next) {
  // const website =
  //   "https://cnr.nic.in/emsadmitcard/downloadadmitcard/LoginPWD.aspx?enc=Ei4cajBkK1gZSfgr53ImFVj34FesvYg1WX45sPjGXBpvTjwcqEoJcZ5VnHgmpgmK";

  const website =
    "https://examinationservices.nic.in/JEEMain2025/downloadadmitcard/LoginPWD.aspx?enc=Ei4cajBkK1gZSfgr53ImFVj34FesvYg1WX45sPjGXBpvTjwcqEoJcZ5VnHgmpgmK";

  const SELECTORS = {
    applicationNumber: 'input[name="ctl00$ContentPlaceHolder1$txtRegno"]',
    password: 'input[name="ctl00$ContentPlaceHolder1$txtPassword"]',
    captchaInput: 'input[name="ctl00$ContentPlaceHolder1$txtsecpin"]',
    captchaImage: "#ctl00_ContentPlaceHolder1_captchaimage",
    loginButton: '[name="ctl00$ContentPlaceHolder1$btnsignin"]',
    errorSelector: "#ctl00_ContentPlaceHolder1_lblerror1",
    paperSelector: '[name="ctl00$ContentPlaceHolder1$ddlExamSession"]',
    loginButton2: '[name="ctl00$ContentPlaceHolder1$btnDownloadAdmitCard"]',
    examDate: "#lblExamDate",
    shift: "#lblShift",
    timing: "#lblTimeofTest",
    centerName: "#lblCentName",
    centerAddress: "#lblCentAdd",
    downloadPdf: "#i-downloadbtn",
  };

  const MAX_RETRIES = 10; // Define a maximum number of retries for captcha attempts.
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const { applicationNumber, password } = req.body;

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(website);
    await page.type(SELECTORS.applicationNumber, String(applicationNumber));
    let success = false;
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        await page.type(SELECTORS.password, "");
        await page.type(SELECTORS.password, String(password));
        await page.waitForSelector(SELECTORS.captchaImage, { timeout: 10000 });

        // Capture and solve CAPTCHA
        const captchaText = await captureAndSolveCaptcha(
          page,
          SELECTORS.captchaImage
        );

        // Enter CAPTCHA
        await page.type(SELECTORS.captchaInput, captchaText);

        // Click Login
        await page.click(SELECTORS.loginButton);
        await page.waitForNetworkIdle({
          idleTime: 500,
          timeout: 10000,
        });

        // Check for error
        const error = await page.$eval(
          SELECTORS.errorSelector,
          (el) => el.innerText
        );

        if (
          error &&
          error.includes("CAPTCHA did not match. Please enter correct CAPTCHA.")
        ) {
          console.log(`Attempt ${i + 1}: CAPTCHA did not match. Retrying...`);
          continue;
        }

        // Wait for the success panel
        const successSelector = await page.waitForSelector(
          SELECTORS.paperSelector,
          { timeout: 4000 }
        );

        if (successSelector) {
          success = true;
          break;
        }
      } catch (error) {
        console.log(`Attempt ${i + 1} failed: ${error.message}`);
      }
    }

    if (!success) {
      await browser.close();
      return res.status(200).json({ error: "CAPTCHA verification failed" });
    }

    // Select Paper
    await page.select(SELECTORS.paperSelector, "P1");

    success = false;

    // Retry CAPTCHA for downloading admit card
    for (let j = 0; j < MAX_RETRIES; j++) {
      try {
        const captchaText = await captureAndSolveCaptcha(
          page,
          SELECTORS.captchaImage
        );
        await page.type(SELECTORS.captchaInput, captchaText);

        await page.click(SELECTORS.loginButton2);
        await page.waitForNetworkIdle({
          idleTime: 500,
          timeout: 10000,
        });

        // Check for errors
        const error = await page.$eval(
          SELECTORS.errorSelector,
          (el) => el.innerText
        );

        if (
          error &&
          error.includes("CAPTCHA did not match. Please enter correct CAPTCHA.")
        ) {
          console.log(`Attempt ${j + 1}: CAPTCHA did not match. Retrying...`);
          continue;
        }

        const successSelector = await page.waitForSelector(SELECTORS.shift, {
          timeout: 3000,
        });
        if (successSelector) {
          success = true;
          break;
        }
      } catch (error) {
        console.log(`Attempt ${j + 1} failed: ${error.message}`);
      }
    }

    // Extract additional information
    const date = await page.$eval(SELECTORS.examDate, (el) => el.innerText);
    const shift = await page.$eval(SELECTORS.shift, (el) => el.innerText);
    const timing = await page.$eval(SELECTORS.timing, (el) => el.innerText);
    const center = await page.$eval(SELECTORS.centerName, (el) => el.innerText);
    const address = await page.$eval(
      SELECTORS.centerAddress,
      (el) => el.innerText
    );

    // Return extracted information
    res.status(200).json({
      success: "Success",
      date,
      shift,
      timing,
      center,
      address,
    });

    await page.click(SELECTORS.downloadPdf);

    await new Promise((resolve) => setTimeout(resolve, 15000));
  } catch (error) {
    next(error);
  } finally {
    await browser.close();
  }
}
