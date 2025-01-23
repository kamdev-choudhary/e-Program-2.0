import { exec } from "child_process";
import path from "path";
import fs from "fs-extra";

// Convert .docx to .pdf with retry logic and delete original .docx after conversion
export async function convertDocxToPdf(docxFilePath, outputDir, retries = 3) {
  try {
    const pdfOutputPath = path.resolve(
      outputDir,
      path.basename(docxFilePath, ".docx") + ".pdf"
    );

    // Ensure output directory exists
    await fs.ensureDir(outputDir);

    // Retry logic
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await new Promise((resolve, reject) => {
          exec(
            `"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf "${docxFilePath}" --outdir "${outputDir}"`,
            (error, stdout, stderr) => {
              if (error) {
                reject(`Error during conversion: ${error.message}`);
                return;
              }
              if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject(stderr);
                return;
              }
              console.log(`Conversion successful: ${stdout}`);
              resolve();
            }
          );
        });

        // After successful conversion, delete the .docx file
        await fs.remove(docxFilePath);
        console.log(`Original .docx file removed: ${docxFilePath}`);
        console.log(`PDF saved at: ${pdfOutputPath}`);
        return; // Exit the retry loop if successful
      } catch (error) {
        if (attempt === retries) {
          throw new Error(
            `Conversion failed after ${retries} attempts: ${error}`
          );
        }
        console.log(`Retrying conversion... Attempt ${attempt + 1}`);
      }
    }
  } catch (error) {
    throw error;
  }
}
