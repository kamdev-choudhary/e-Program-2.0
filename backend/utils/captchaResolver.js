import Tesseract from "tesseract.js";
import sharp from "sharp";

export async function captureAndSolveCaptcha(page, captchaSelector) {
  const captchaElement = await page.$(captchaSelector);
  const boundingBox = await captchaElement.boundingBox();
  if (!boundingBox) {
    throw new Error("Failed to locate CAPTCHA image.");
  }

  const screenshotBuffer = await page.screenshot({
    clip: {
      x: Math.floor(boundingBox.x),
      y: Math.floor(boundingBox.y),
      width: Math.ceil(boundingBox.width),
      height: Math.ceil(boundingBox.height),
    },
    omitBackground: true,
  });

  const processedBuffer = await sharp(screenshotBuffer)
    .grayscale()
    .threshold(200)
    .toBuffer();

  const {
    data: { text },
  } = await Tesseract.recognize(processedBuffer, "eng");

  const captchaText = text.trim().replace(/\s/g, "").toUpperCase();

  if (!/^[A-Z0-9]+$/.test(captchaText)) {
    throw new Error("CAPTCHA text is invalid.");
  }

  return captchaText;
}
