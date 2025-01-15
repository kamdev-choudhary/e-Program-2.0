import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

interface DownloadJsonToExcelProps {
  jsonData: Record<string, any>[];
  fileName?: string;
}

export const downloadJsonToExcel = async ({
  jsonData,
  fileName = "data.xlsx",
}: DownloadJsonToExcelProps) => {
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

/**
 * Download PDF from link
 */
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

export const isValidEmail = (email: string): boolean => {
  // Regular expression for validating email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

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

export const reverseDate = (date: string): string => {
  if (!date) {
    throw new Error("Invalid date string");
  }
  const parts = date.split("-");
  if (parts.length !== 3) {
    throw new Error("Date format must be YYYY-MM-DD");
  }
  const [year, month, day] = parts;
  return `${day}-${month}-${year}`;
};
