const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");
const getOCRFromImage = require("../utils/getOCRfromImage");

const applicationNumber = "250310153075";
const date = "31";
const month = "12";
const year = "2006";

module.exports = {
  downloadAdmitcard: async (req, res, next) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    try {
      // Set viewport for better resolution
      await page.setViewport({ width: 1920, height: 1080 });

      // Navigate to the page
      const url =
        "https://examinationservices.nic.in/jeemain2025/DownloadAdmitCard/frmAuthforCity.aspx?enc=WPJ5WSCVWOMNiXoyyomJgDUffqDdG1LTsAPBKFcEC9W88CTkt2ITzilIsFR7gKxO";
      await page.goto(url);

      await page.type(
        'input[name="ctl00$ContentPlaceHolder1$txtRegno"]',
        applicationNumber
      );
      await page.select("#ctl00_ContentPlaceHolder1_ddlday", date);
      await page.select("#ctl00_ContentPlaceHolder1_ddlmonth", month);
      await page.select("#ctl00_ContentPlaceHolder1_ddlyear", year);

      // Retry logic for CAPTCHA and form submission
      let retryAttempts = 3; // Number of attempts to retry CAPTCHA
      let success = false;
      while (retryAttempts > 0 && !success) {
        try {
          // Wait for the captcha to appear
          const captchaSelector = "#ctl00_ContentPlaceHolder1_captchaimage";
          await page.waitForSelector(captchaSelector, { timeout: 5000 });

          // Capture the captcha element
          const captchaElement = await page.$(captchaSelector);
          const boundingBox = await captchaElement.boundingBox();

          if (!boundingBox) {
            throw new Error("Failed to get bounding box for the CAPTCHA.");
          }

          // Generate and capture CAPTCHA image
          const now = new Date();
          const formattedDate = `${now.getFullYear()}-${String(
            now.getMonth() + 1
          ).padStart(2, "0")}-${String(now.getDate()).padStart(
            2,
            "0"
          )}_${String(now.getHours()).padStart(2, "0")}-${String(
            now.getMinutes()
          ).padStart(2, "0")}-${String(now.getSeconds()).padStart(2, "0")}`;
          const captchaPath = `./uploads/${formattedDate}_captcha.png`;

          await page.screenshot({
            path: captchaPath,
            clip: {
              x: boundingBox.x,
              y: boundingBox.y,
              width: boundingBox.width,
              height: boundingBox.height,
            },
          });

          // Get and validate captcha text
          const captchaText = await getOCRFromImage(captchaPath);
          if (!/^[A-Za-z0-9]+$/.test(captchaText)) {
            throw new Error("Captcha text is not valid");
          }

          // Enter captcha and submit form
          await page.type(
            'input[name="ctl00$ContentPlaceHolder1$txtsecpin"]',
            captchaText
          );
          await page.click('[name="ctl00$ContentPlaceHolder1$btnsignin"]');

          // Wait for the success page to load
          const successSelector = "#ctl00_ContentPlaceHolder1_pnlAdmitcard";
          try {
            await page.waitForSelector(successSelector, { timeout: 60000 });
            success = true; // If successSelector appears, mark the success flag
          } catch (error) {
            console.error("Success page not found, retrying CAPTCHA...");
            retryAttempts -= 1; // Decrease retry count and continue with the next attempt
            if (retryAttempts === 0) {
              throw new Error(
                "Failed to access admit card after multiple attempts."
              );
            }
          }
        } catch (error) {
          console.error("Error in CAPTCHA or form submission:", error);
          retryAttempts -= 1; // Decrease retry count
          if (retryAttempts === 0) {
            throw new Error(
              "Failed to process CAPTCHA after multiple attempts."
            );
          }
        }
      }

      // If successSelector was found, generate the PDF
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(
        now.getHours()
      ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(
        now.getSeconds()
      ).padStart(2, "0")}`;
      const pdfPath = `./uploads/${formattedDate}_output_page.pdf`;
      await page.pdf({
        path: pdfPath,
        format: "A4",
        printBackground: true,
        margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
      });

      const fullFilePath = `http://localhost:5000/uploads/${formattedDate}_output_page.pdf`;
      res.status(200).json({ pdfUrl: fullFilePath });
    } catch (error) {
      console.error("Error during the process:", error);
      next(error); // Pass error to Express error handler
    } finally {
      await browser.close();
    }
  },
};
