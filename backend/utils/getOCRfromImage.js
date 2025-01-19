import axios from "axios";
import FormData from "form-data";
import config from "../config/config.js";

async function getOCRFromImageBinary(imageBinary) {
  if (!imageBinary) {
    throw new Error("No image binary provided.");
  }
  const formData = new FormData();
  formData.append("file", imageBinary, { filename: "image.png" }); // Provide a filename for the buffer
  formData.append("apikey", config.OCR_SPACE_KEY);
  formData.append("language", "eng");
  try {
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
