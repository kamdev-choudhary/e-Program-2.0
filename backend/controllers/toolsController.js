import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Manually define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gsPath = `"C:\\Program Files\\gs\\gs10.04.0\\bin\\gswin64.exe"`;

const compressPDF = async (inputPath, outputPath, maxSizeKB = 500) => {
  // Order from least to most aggressive compression
  const qualitySettings = ["/prepress", "/printer", "/ebook", "/screen"];
  let fileSizeKB = fs.statSync(inputPath).size / 1024;

  // Try each quality setting to find the smallest acceptable file
  for (const setting of qualitySettings) {
    const gsCommand = `${gsPath} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${setting} -o "${outputPath}" "${inputPath}"`;

    await new Promise((resolve, reject) => {
      exec(gsCommand, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Ghostscript failed: ${stderr || error.message}`));
        } else {
          resolve();
        }
      });
    });

    fileSizeKB = fs.statSync(outputPath).size / 1024;
    if (fileSizeKB <= maxSizeKB) {
      return { outputPath, fileSizeKB };
    }
  }

  // Apply additional compression with lower QFactor after /screen
  let qFactor = 0.7; // Start below /screen's default QFactor
  while (fileSizeKB > maxSizeKB && qFactor >= 0.1) {
    const gsCommand =
      `${gsPath} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 ` +
      `-dPDFSETTINGS=/screen ` +
      `-dColorImageDict="<< /QFactor ${qFactor} /Blend 1 /HSamples [2 1 1 2] /VSamples [2 1 1 2] >>" ` +
      `-dGrayImageDict="<< /QFactor ${qFactor} /Blend 1 /HSamples [2 1 1 2] /VSamples [2 1 1 2] >>" ` +
      `-o "${outputPath}" "${inputPath}"`;

    await new Promise((resolve, reject) => {
      exec(gsCommand, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Ghostscript failed: ${stderr || error.message}`));
        } else {
          resolve();
        }
      });
    });

    fileSizeKB = fs.statSync(outputPath).size / 1024;
    if (fileSizeKB <= maxSizeKB) break;
    qFactor = Math.round((qFactor - 0.1) * 10) / 10;
  }

  // Further reduce DPI if needed
  if (fileSizeKB > maxSizeKB) {
    let dpi = 72;
    while (fileSizeKB > maxSizeKB && dpi >= 50) {
      const gsCommand =
        `${gsPath} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 ` +
        `-dPDFSETTINGS=/screen ` +
        `-dColorImageResolution=${dpi} ` +
        `-dGrayImageResolution=${dpi} ` +
        `-dMonoImageResolution=${dpi} ` +
        `-dColorImageDict="<< /QFactor 0.1 /Blend 1 /HSamples [2 1 1 2] /VSamples [2 1 1 2] >>" ` +
        `-dGrayImageDict="<< /QFactor 0.1 /Blend 1 /HSamples [2 1 1 2] /VSamples [2 1 1 2] >>" ` +
        `-o "${outputPath}" "${inputPath}"`;

      await new Promise((resolve, reject) => {
        exec(gsCommand, (error, stdout, stderr) => {
          if (error) {
            reject(new Error(`Ghostscript failed: ${stderr || error.message}`));
          } else {
            resolve();
          }
        });
      });

      fileSizeKB = fs.statSync(outputPath).size / 1024;
      if (fileSizeKB <= maxSizeKB) break;
      dpi -= 10;
    }
  }

  return { outputPath, fileSizeKB };
};

// Middleware function to handle PDF compression
export async function compressPDFs(req, res, next) {
  try {
    const { maxSizeInKB } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No PDF provided." });
    }
    const inputPath = req.file.path;
    const outputDir = path.join(process.cwd(), "uploads", "compressed");
    const outputPath = path.join(outputDir, `${Date.now()}-compressed.pdf`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const { outputPath: compressedFilePath, fileSizeKB } = await compressPDF(
      inputPath,
      outputPath,
      maxSizeInKB
    );

    res.status(200).json({
      message: "PDF compressed successfully",
      compressedFile: compressedFilePath.replace(__dirname, ""),
      compressedSizeKB: fileSizeKB,
    });
  } catch (error) {
    next(error);
  }
}
