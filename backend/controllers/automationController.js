import puppeteer from "puppeteer";
import { v4 as uuid } from "uuid";
import { captureAndSolveCaptcha } from "../utils/captchaResolver.js";
import logger from "../utils/logger.js";
import path from "path";
import fs from "fs-extra";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { convertDocxToPdf } from "../utils/docToPdf.js";
import { generateMockData } from "../utils/functions.js";

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
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
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
    rollNumber: "#lblRollNo",
  };

  const MAX_RETRIES = 10; // Define a maximum number of retries for captcha attempts.
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
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
          logger.info(`Attempt ${i + 1}: CAPTCHA did not match. Retrying...`);
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
        logger.info(`Attempt ${i + 1} failed: ${error.message}`);
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
          logger.info(`Attempt ${j + 1}: CAPTCHA did not match. Retrying...`);
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
        logger.info(`Attempt ${j + 1} failed: ${error.message}`);
      }
    }

    // Extract additional information
    const date = await page.$eval(SELECTORS.examDate, (el) => el.innerText);
    const shift = await page.$eval(SELECTORS.shift, (el) => el.innerText);
    const timing = await page.$eval(SELECTORS.timing, (el) => el.innerText);
    const center = await page.$eval(SELECTORS.centerName, (el) => el.innerText);
    const rollNumber = await page.$eval(
      SELECTORS.rollNumber,
      (el) => el.innerHTML
    );
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
      rollNumber,
    });

    // await page.click(SELECTORS.downloadPdf);

    // await new Promise((resolve) => setTimeout(resolve, 15000));
  } catch (error) {
    next(error);
  } finally {
    await browser.close();
  }
}

export async function generateAdmitCard(req, res, next) {
  const { scholar } = req.body;
  const uniqueId = uuid();
  try {
    // Load the Word template
    const templatePath = path.resolve("templates", "admit_card_template.docx");
    const content = await fs.readFile(templatePath, "binary");

    // Ensure the output folder exists
    const outputFolder = path.resolve("uploads", "admit_cards");
    await fs.ensureDir(outputFolder);

    // Create a new instance of PizZip and Docxtemplater
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Dynamically map fields from the Excel file (scholar object)
    const dynamicData = {};

    Object.keys(scholar).forEach((key) => {
      // Add fields to dynamicData based on keys in the scholar object
      dynamicData[key] = scholar[key];
    });

    // Render the template with scholar-specific data
    try {
      doc.render(dynamicData);
    } catch (error) {
      console.error("Error rendering template with dynamic fields:", error);
      return res.status(500).json({ error: "Template rendering error" });
    }

    const buffer = doc.getZip().generate({ type: "nodebuffer" });

    const docxFilePath = path.resolve(
      outputFolder,
      `${scholar?.drn || uniqueId}_Admit_card.docx`
    );

    // Save the rendered .docx file
    await fs.outputFile(docxFilePath, buffer);

    // Convert the saved .docx to .pdf
    try {
      await convertDocxToPdf(docxFilePath, outputFolder);
    } catch (error) {
      console.error("Error converting to PDF:", error);
      return res.status(200).json({ error: "Error generating PDF" });
    }

    res.status(200).json({
      message: "Admit Card Generated Successfully.",
    });
  } catch (error) {
    console.error("Error in generateAdmitCard:", error);
    next(error);
  }
}

export async function downloadProvisionalAnswerKey(req, res, next) {
  const website =
    "https://examinationservices.nic.in/JeeMain2025/root/CandidateLogin.aspx?enc=Ei4cajBkK1gZSfgr53ImFVj34FesvYg1WX45sPjGXBpvTjwcqEoJcZ5VnHgmpgmK";

  const SELECTORS = {
    applicationNumber: 'input[name="ctl00$ContentPlaceHolder1$txtRegno"]',
    password: 'input[name="ctl00$ContentPlaceHolder1$txtPassword"]',
    captchaInput: 'input[name="ctl00$ContentPlaceHolder1$txtsecpin"]',
    captchaImage: "#ctl00_ContentPlaceHolder1_captchaimage",
    loginButton: '[name="ctl00$ContentPlaceHolder1$btnsignin"]',
    errorSelector: "#ctl00_ContentPlaceHolder1_lblerror1",
    showPaper: "#ctl00_LoginContent_rptViewQuestionPaper_ctl01_lnkviewKey",
    keyChallenegbtn: "#ctl00_LoginContent_lnkkeychallenge",
  };

  const MAX_RETRIES = 10;
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  try {
    const { applicationNumber, password } = req.body;
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(website, { waitUntil: "networkidle2" });

    let success = false;

    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        await page.reload();
        await page.waitForSelector(SELECTORS.applicationNumber, {
          timeout: 10000,
        });
        await page.type(SELECTORS.applicationNumber, String(applicationNumber));
        await page.type(SELECTORS.password, String(password));
        await page.waitForSelector(SELECTORS.captchaImage, { timeout: 10000 });

        // Capture and solve CAPTCHA
        const captchaText = await captureAndSolveCaptcha(
          page,
          SELECTORS.captchaImage
        );

        await page.type(SELECTORS.captchaInput, captchaText);

        // Click Login
        await page.click(SELECTORS.loginButton);
        await page.waitForNetworkIdle({ idleTime: 500, timeout: 10000 });

        // Check for CAPTCHA error
        const error = await page
          .$eval(SELECTORS.errorSelector, (el) => el.innerText)
          .catch(() => null);
        if (
          error &&
          error.includes("CAPTCHA did not match. Please Re-enter.")
        ) {
          console.info(`Attempt ${i + 1}: CAPTCHA did not match. Retrying...`);
          continue;
        }
        if (
          await page.waitForSelector(SELECTORS.showPaper, { timeout: 4000 })
        ) {
          success = true;
          break;
        }
      } catch (error) {
        console.info(`Attempt ${i + 1} failed: ${error.message}`);
      }
    }

    if (!success) {
      return res.status(400).json({ error: "CAPTCHA verification failed" });
    }

    // Wait for the "Show Paper" button to appear
    await page.waitForSelector(SELECTORS.showPaper, { timeout: 5000 });

    // Extract the `href` value from the button
    const paperUrl = await page.$eval(SELECTORS.showPaper, (el) =>
      el.getAttribute("href")
    );

    await page.click(SELECTORS.keyChallenegbtn);

    await page.waitForSelector("#ctl00_LoginContent_pnl_Entry", {
      timeout: 5000,
    });

    const tableData = await page.evaluate(() => {
      let data = [];
      let rows = document.querySelectorAll(
        "#ctl00_LoginContent_grAnswerKey tr"
      );

      for (let i = 1; i < rows.length; i++) {
        // Skip header row
        let cells = rows[i].querySelectorAll("td");

        if (cells.length >= 3) {
          // Ensure there are at least 3 columns
          data.push({
            section: cells[0].innerText.trim(),
            questionID: cells[1].innerText.trim(),
            correctAnswer: cells[2].innerText.trim(),
          });
        }
      }
      return data;
    });

    // Send JSON response and PDF file
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      success: "Success",
      paperUrl,
      answerKey: tableData,
    });
  } catch (error) {
    next(error);
  } finally {
    await browser.close();
  }
}

export async function getDetailsFromMainQuestionPaper(req, res, next) {
  const { website, drn } = req.body;
  const uniqueId = uuid();

  if (!website || !website.startsWith("http")) {
    return res.status(400).json({ error: "Invalid website URL" });
  }

  const browser = await puppeteer.launch({
    headless: false, // Use "new" mode to bypass bot detection
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const [page] = await browser.pages();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    await page.goto(website, { waitUntil: "networkidle2" });

    // Wait for questions to load
    await page.waitForSelector(".section-cntnr", { timeout: 30000 });

    const extractedData = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll(".section-cntnr"));
      return sections.map((section) => {
        const sectionName =
          section.querySelector(".section-lbl .bold")?.innerText?.trim() ||
          "Unknown Section";

        const questions = Array.from(
          section.querySelectorAll(".question-pnl")
        ).map((questionDiv, index) => {
          const mainTable = questionDiv.querySelector("table.questionPnlTbl");
          if (!mainTable) return null;

          // Extract Question Number
          const questionNumberElement = mainTable.querySelector(
            ".questionRowTbl td.bold"
          );
          const questionNumber = questionNumberElement
            ? questionNumberElement.innerText.trim()
            : "N/A";

          // Extract Given Answer
          let givenAnswer = "No Answer";
          const givenAnswerRow = [
            ...mainTable.querySelectorAll(".questionRowTbl tr"),
          ].find(
            (row) =>
              row.innerText.includes("Given Answer") ||
              row.innerText.includes("Chosen Option")
          );

          if (givenAnswerRow) {
            const answerColumn =
              givenAnswerRow.querySelector("td:nth-child(2)");
            if (answerColumn) {
              givenAnswer = answerColumn.innerText.trim() || "No Answer";
            }
          }

          // Extract Metadata
          const metadataTable = mainTable.querySelector(".menu-tbl");
          const metadataRows = metadataTable
            ? metadataTable.querySelectorAll("tr")
            : [];

          let questionType = "N/A",
            questionID = "N/A",
            status = "N/A",
            optionIDs = {};

          metadataRows.forEach((row) => {
            const label = row
              .querySelector("td:nth-child(1)")
              ?.innerText?.trim();
            const value = row
              .querySelector("td:nth-child(2)")
              ?.innerText?.trim();

            if (label?.includes("Question Type")) questionType = value;
            if (label?.includes("Question ID")) questionID = value;
            if (label?.includes("Status")) status = value;

            if (label?.includes("Option")) {
              optionIDs[label.replace(" :", "")] = value;
            }
          });

          return {
            questionIndex: index + 1,
            questionNumber,
            givenAnswer,
            questionType,
            questionID,
            optionIDs,
            status,
          };
        });

        return {
          sectionName,
          questions: questions.filter(Boolean),
        };
      });
    });

    const pdfPath = `./uploads/${drn}_${uniqueId}.pdf`;
    await page.pdf({
      path: pdfPath,
      format: "A4",

      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    });

    res.status(200).json({
      success: "Success",
      questionPaper: extractedData,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    next(error);
  } finally {
    await browser.close();
  }
}

export async function jeeMainResultDownload(req, res, next) {
  const website = "https://www.google.com";
  const SELECTORS = {
    applicationNumber: 'input[name="ctl00$ContentPlaceHolder1$txtRegno"]',
    password: 'input[name="ctl00$ContentPlaceHolder1$txtPassword"]',
    captchaInput: 'input[name="ctl00$ContentPlaceHolder1$txtsecpin"]',
    captcha: "#ctl00_ContentPlaceHolder1_captchaimage",
    loginButton: '[name="ctl00$ContentPlaceHolder1$btnsignin"]',
    errorSelector: "#ctl00_ContentPlaceHolder1_lblerror1",
  };

  const { application, password, drn } = req.body;
  const uniqueId = uuid();

  // Return if no application number or password
  if (!application || !password)
    return res
      .status(400)
      .json({ message: "Application number or password missing" });

  const browser = await puppeteer.launch({
    headless: "new", // Use "new" mode to bypass bot detection
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage", // Prevents crashes in Docker
      "--disable-gpu", // Disables GPU hardware acceleration
      "--disable-features=IsolateOrigins,site-per-process", // Reduces process overhead
    ],
    defaultViewport: { width: 1920, height: 1080 },
  });

  const [page] = await browser.pages();
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.resourceType() === "image") {
      request.abort();
    } else {
      request.continue();
    }
  });

  try {
    await page.goto(website);
    let success = false;

    // Testing
    await page.pdf({
      path: `./uploads/${drn}_${uniqueId}_1.pdf`,
      format: "A4",
    });

    // for (let i = 0; i < MAX_RETRIES; i++) {
    //   try {
    //     if (i > 0) {
    //       logger.info(`Reloading page for attempt ${i + 1}...`);
    //       await page.reload(); // More readable than short-circuiting
    //     }
    //     await page.waitForSelector(SELECTORS.applicationNumber, {
    //       timeout: 10000,
    //     });
    //     await page.type(SELECTORS.applicationNumber, String(applicationNumber));
    //     await page.type(SELECTORS.password, String(password));
    //     await page.waitForSelector(SELECTORS.captcha, { timeout: 10000 });

    //     // Capture and solve CAPTCHA
    //     const captchaText = await captureAndSolveCaptcha(
    //       page,
    //       SELECTORS.captcha
    //     );

    //     if (captchaText.length < 6) {
    //       continue;
    //     }

    //     await page.type(SELECTORS.captchaInput, captchaText);

    //     // Click Login
    //     await page.click(SELECTORS.loginButton);
    //     await page.waitForNetworkIdle({ idleTime: 500, timeout: 10000 });

    //     // Check for error message on the page
    //     const errorElement = await page.$(SELECTORS.errorSelector);
    //     if (errorElement) {
    //       const errorText = await page.evaluate(
    //         (el) => el.innerText,
    //         errorElement
    //       );

    //       // Break out of the loop if the error text indicates an invalid application
    //       if (errorText.toLowerCase().includes("invalid application")) {
    //         return res
    //           .status(400)
    //           .json({ message: "Invalid application or Password number." });
    //       }

    //       // Continue retrying if the error indicates a CAPTCHA mismatch
    //       if (errorText.includes("CAPTCHA did not match. Please Re-enter.")) {
    //         console.warn(
    //           `Attempt ${i + 1}: CAPTCHA did not match. Retrying...`
    //         );
    //         continue;
    //       }
    //     }

    //     // Check if login is successful
    //     const paperElement = await page
    //       .waitForSelector(SELECTORS.showPaper, { timeout: 4000 })
    //       .catch(() => null);
    //     if (paperElement) {
    //       console.info("Login successful!");
    //       success = true;
    //       break;
    //     }
    //   } catch (error) {
    //     logger.info(`Attempt ${i + 1} failed: ${error.message}`);
    //   }
    // }

    // if (!success) {
    //   return res.status(400).json({ message: "Failed to verify captch." });
    // }

    const data = generateMockData();
    res.status(200).json({
      message: "Successfully fetched the Data.",
      rollNumber1: data?.rollNumber1 || "",
      rollNumber2: data?.rollNumber2 || "",
      candidateName: data?.candidateName || "",
      motherName: data?.motherName || "",
      fatherName: data?.fatherName || "",
      category: data?.category || "",
      personWithDisability: data?.personWithDisability || "",
      gender: data?.gender || "",
      dateOfBirth: data?.dateOfBirth || "",
      stateOfEligibility: data?.stateOfEligibility || "",
      nationality: data?.nationality,
      mathematics1: data?.mathematics1 || "",
      mathematics2: data?.mathematics2 || "",
      mathematics: data?.mathematics || "",
      physics1: data?.physics1 || "",
      physics2: data?.physics2 || "",
      physics: data?.physics || "",
      chemistry1: data?.chemistry1 || "",
      chemistry2: data?.chemistry2 || "",
      chemistry: data?.chemistry || "",
      total1: data?.total1 || "",
      total2: data?.total2 || "",
      total: data?.total || "",
      ntaScoreInWords: data?.ntaScoreInWords || "",
      crlRank: data?.crlRank || "",
      genEwsRank: data?.genEwsRank || "",
      obcNclRank: data?.obcNclRank || "",
      scRank: data?.scRank || "",
      stRank: data?.stRank || "",
      crlPwDRank: data?.crlPwDRank || "",
      genEwsPwDRank: data?.genEwsPwDRank || "",
      obcNclPwDRank: data?.obcNclPwDRank || "",
      scPwDRank: data?.scPwDRank || "",
      stPwDRank: data?.stPwDRank || "",
    });
  } catch (error) {
    next(error);
  } finally {
    await browser.close();
  }
}
