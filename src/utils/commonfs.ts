import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import CryptoJS from "crypto-js";
import { SECRET } from "../config/config";

interface EncryptedObject {
  iv: string;
  data: string;
}

// Encrypt JSON Data
export function encryptJson(json: object): EncryptedObject {
  const iv = CryptoJS.lib.WordArray.random(16);
  const jsonString = JSON.stringify(json);

  const encrypted = CryptoJS.AES.encrypt(
    jsonString,
    CryptoJS.enc.Utf8.parse(SECRET),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return {
    iv: iv.toString(CryptoJS.enc.Base64),
    data: encrypted.toString(),
  };
}

// Decrypt JSON File
export function decryptJson(encryptedObject: EncryptedObject): object {
  const { iv, data } = encryptedObject;

  const decrypted = CryptoJS.AES.decrypt(
    data,
    CryptoJS.enc.Utf8.parse(SECRET),
    {
      iv: CryptoJS.enc.Base64.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}

// Download JSON TO Excel
export const downloadJsonToExcel = async ({
  jsonData,
  fileName = "data.xlsx",
}: {
  jsonData: Record<string, any>[];
  fileName?: string;
}) => {
  if (!jsonData || jsonData.length === 0) {
    console.error("No data to export");
    return;
  }
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");
  const headers = Object.keys(jsonData[0]);
  worksheet.addRow(headers);
  jsonData.forEach((row) => {
    const rowData = headers.map((header) => row[header] ?? null); // Ensure data corresponds to headers
    worksheet.addRow(rowData);
  });
  worksheet.columns.forEach((column) => {
    const maxLength =
      column.values?.reduce(
        (max: number, value: any) =>
          Math.max(max, value?.toString().length || 0),
        0
      ) || 10;
    column.width = maxLength + 2; // Add padding
  });

  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, fileName);
  } catch (error) {
    console.error("Error generating Excel file:", error);
  }
};

// Download PDF From URL
export const downloadPdfFromUrl = async (
  path: string,
  name: string
): Promise<void> => {
  try {
    const response = await fetch(path);
    if (response.ok) {
      const blob = await response.blob();
      saveAs(blob, name);
    } else {
      console.error(
        `Failed to fetch the PDF file from URL: ${response.statusText}`
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

// Check Valid Email ID
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check Valid Mobile Number
export const isValidMobileNumber = (
  mobile: string,
  minLength: number = 10,
  maxLength: number = 10
): boolean => {
  // Regular expression for validating numeric mobile numbers
  const mobileRegex = /^[0-9]+$/;
  return (
    mobileRegex.test(mobile) &&
    mobile.length >= minLength &&
    mobile.length <= maxLength
  );
};

// YouTube ID
export function getYouTubeId(url: string): string | null {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Youtube Thumbnail
export const getYouTubeThumbnail = (url: string) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);

  if (match && match[1]) {
    const videoId = match[1];
    return `https://img.youtube.com/vi/${videoId}/default.jpg`;
  }

  return "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png";
};

// To Propercase
export function toProperCase(str: string) {
  // Check if input is a valid string
  if (typeof str !== "string") {
    console.error("Invalid input: Expected a string but received", typeof str);
    return ""; // Return empty string for invalid input
  }

  return str
    .toLowerCase()
    .replace(/(?:^|\s|[-'])\w/g, (match) => match.toUpperCase());
}
