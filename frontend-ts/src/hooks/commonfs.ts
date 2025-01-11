import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

interface DownloadJsonToExcelProps {
  jsonData: Record<string, any>[];
  fileName?: string;
}

/**
 *
 * @param jsonData
 * @param filenmae
 * @returns
 */

export const downloadJsonToExcel = async ({
  jsonData,
  fileName = "data.xlsx",
}: DownloadJsonToExcelProps) => {
  if (!jsonData || jsonData.length === 0) {
    console.error("No data to export");
    return;
  }

  // Create a new workbook and add a worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Extract headers from the first object's keys
  const headers = Object.keys(jsonData[0]);

  // Add headers to the worksheet
  worksheet.addRow(headers);

  // Add data rows
  jsonData.forEach((row) => {
    const rowData = headers.map((header) => row[header] ?? null); // Ensure data corresponds to headers
    worksheet.addRow(rowData);
  });

  // Adjust column widths
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
    // Generate Excel file as a blob
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
