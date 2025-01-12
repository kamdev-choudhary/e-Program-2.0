import Tesseract from "tesseract.js";
import sharp from "sharp";
import logger from "./logger.js";

/**
 * Captures and solves the CAPTCHA using Tesseract.js
 */
export async function captureAndSolveCaptcha(page, captchaSelector) {
  const captchaElement = await page.$(captchaSelector);
  const boundingBox = await captchaElement.boundingBox();
  if (!boundingBox) {
    throw new Error("Failed to locate CAPTCHA image.");
  }

  // Capture the screenshot as a buffer
  const screenshotBuffer = await page.screenshot({
    clip: {
      x: Math.floor(boundingBox.x),
      y: Math.floor(boundingBox.y),
      width: Math.ceil(boundingBox.width),
      height: Math.ceil(boundingBox.height),
    },
    omitBackground: true,
  });

  // Preprocess the image using sharp (in-memory processing)
  const processedBuffer = await sharp(screenshotBuffer)
    .grayscale() // Convert to grayscale
    .threshold(200) // Apply threshold for binarization
    .toBuffer(); // Return the processed image as a buffer

  // Recognize text with Tesseract directly from processed buffer
  const {
    data: { text },
  } = await Tesseract.recognize(processedBuffer, "eng");

  // Clean up the recognized text
  const captchaText = text.trim().replace(/\s/g, "").toUpperCase();

  // Validate the CAPTCHA text
  if (!/^[A-Z0-9]+$/.test(captchaText)) {
    throw new Error("CAPTCHA text is invalid.");
  }

  return captchaText;
}
