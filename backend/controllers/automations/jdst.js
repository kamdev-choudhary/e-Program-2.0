import { v4 as uuid } from "uuid";

import path from "path";
import fs from "fs-extra";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { convertDocxToPdf } from "../../utils/docToPdf.js";

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
