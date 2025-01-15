import axios from "axios";
import FormData from "form-data";
import config from "../config/config.js";

/**
 * Perform OCR on an image using OCR.Space API
 * @param {Buffer|Blob} imageBinary - Binary data of the image
 * @returns {Promise<string>} - Recognized text from the image
 */

async function getOCRFromImageBinary(imageBinary) {
  if (!imageBinary) {
    throw new Error("No image binary provided.");
  }

  // Prepare form data for OCR.Space API
  const formData = new FormData();

  // Make sure to append image as a buffer
  formData.append("file", imageBinary, { filename: "image.png" }); // Provide a filename for the buffer
  formData.append("apikey", config.OCR_SPACE_KEY);
  formData.append("language", "eng");

  try {
    // Send POST request to OCR.Space API
    const response = await axios.post(
      "https://api.ocr.space/parse/image",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "Content-Length": formData.getLengthSync(), // Ensure content length is correctly set
        },
      }
    );

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

export default getOCRFromImageBinary;
