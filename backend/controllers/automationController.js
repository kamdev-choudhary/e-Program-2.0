const puppeteer = require("puppeteer");
const Tesseract = require("tesseract.js");
const sharp = require("sharp");
const { stubTrue } = require("lodash");

const { getFormattedDate } = require("../utils/functions");

const siteUrl =
  "https://examinationservices.nic.in/jeemain2025/DownloadAdmitCard/frmAuthforCity.aspx?enc=WPJ5WSCVWOMNiXoyyomJgDUffqDdG1LTsAPBKFcEC9W88CTkt2ITzilIsFR7gKxO";

const applicationNumberIdSelector =
  'input[name="ctl00$ContentPlaceHolder1$txtRegno"]';
const daySelector = "#ctl00_ContentPlaceHolder1_ddlday";
const monthSelector = "#ctl00_ContentPlaceHolder1_ddlmonth";
const yearSelector = "#ctl00_ContentPlaceHolder1_ddlyear";
const captchaInputSelector =
  'input[name="ctl00$ContentPlaceHolder1$txtsecpin"]';
const loginButtonSelector = '[name="ctl00$ContentPlaceHolder1$btnsignin"]';

module.exports = {
  downloadCityInformation: async (req, res, next) => {
    const { applicationNumber, day, month, year } = req.body;

    if (!applicationNumber || !day || !month || !year) {
      res.status(204).json({ message: "Missing Required field" });
    }
    // Ensure day and month are strings and add leading zero if needed
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");

    const browser = await puppeteer.launch({ headless: stubTrue });
    const page = await browser.newPage();

    try {
      // Set viewport for better resolution
      await page.setViewport({ width: 1920, height: 1080 });

      // Navigate to the page
      await page.goto(siteUrl);

      // Type into form fields with formatted values
      await page.type(applicationNumberIdSelector, String(applicationNumber));
      await page.select(daySelector, formattedDay);
      await page.select(monthSelector, formattedMonth);
      await page.select(yearSelector, String(year));

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
          const formattedDate = getFormattedDate(now);
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

          let captchaText = "";
          // Get and validate captcha text
          // const captchaText = await getOCRFromImage(captchaPath);
          const {
            data: { text },
          } = await Tesseract.recognize(
            captchaPath,
            "eng" // Language code for English
          );
          captchaText = text.trim();

          if (!/^[A-Z0-9]+$/.test(captchaText)) {
            throw new Error("Captcha text is not valid");
          }

          // Enter captcha and submit form
          await page.type(captchaInputSelector, captchaText);
          await page.click(loginButtonSelector);

          // Wait for the success page to load
          const successSelector = "#ctl00_ContentPlaceHolder1_pnlAdmitcard";
          try {
            await page.waitForSelector(successSelector, { timeout: 60000 });
            success = true;
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

      const date = await page.$eval(
        "#ctl00_ContentPlaceHolder1_dateofexamP1",
        (element) => element.innerText
      );

      const city = await page.$eval(
        "#ctl00_ContentPlaceHolder1_cityofexamP1",
        (element) => element.innerText
      );

      // If successSelector was found, generate the PDF
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(
        now.getHours()
      ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(
        now.getSeconds()
      ).padStart(2, "0")}`;
      const pdfPath = `./uploads/${formattedDate}_${applicationNumber}.pdf`;
      await page.pdf({
        path: pdfPath,
        format: "A4",
        printBackground: true,
        margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
      });

      const fullFilePath = `http://localhost:5000/uploads/${formattedDate}_${applicationNumber}.pdf`;
      res.status(200).json({ pdfUrl: fullFilePath, date, city });
    } catch (error) {
      console.error("Error during the process:", error);
      next(error); // Pass error to Express error handler
    } finally {
      await browser.close();
    }
  },
};
