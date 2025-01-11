import { post } from "axios";
import { existsSync, createReadStream } from "fs";
import FormData from "form-data";
import { ocrSpaceKey } from "../config/config";

/**
 * Perform OCR on an image using OCR.Space API
 * @param {string} filePath - Path to the image file
 * @param {string} apiKey - Your OCR.Space API key
 * @returns {Promise<string>} - Recognized text from the image
 */

async function getOCRFromImage(filePath) {
  // Ensure the file exists
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Prepare form data for OCR.Space API
  const formData = new FormData();
  formData.append("file", createReadStream(filePath)); // Attach the image file
  formData.append("apikey", ocrSpaceKey); // Add your API key
  formData.append("language", "eng"); // Specify the language (adjust as needed)

  try {
    // Send POST request to OCR.Space API
    const response = await post("https://api.ocr.space/parse/image", formData, {
      headers: formData.getHeaders(), // Set the headers for form data
    });

    // Extract the recognized text
    const parsedResults = response.data.ParsedResults;
    if (parsedResults && parsedResults.length > 0) {
      const recognizedText = parsedResults[0].ParsedText.trim();
      return recognizedText;
    }

    throw new Error("No text recognized in the image.");
  } catch (error) {
    console.error("Error during OCR:", error.response?.data || error.message);
    throw new Error("OCR failed. Please check the image or API key.");
  }
}

export default getOCRFromImage;
