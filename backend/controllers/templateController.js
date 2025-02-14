import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function downloadMarksheet(req, res, next) {
  try {
    const filePath = resolve(__dirname, "../templates/marksheet.xlsx");

    // Ensure the file exists before downloading
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    res.download(filePath);
  } catch (error) {
    next(error);
  }
}
