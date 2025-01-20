import React, { useState } from "react";
import ExcelJs from "exceljs";
import { Box } from "@mui/material";
import FileDropZone from "../../components/FileDropZone";

interface DataProps {
  id: string;
  data: string;
}

const JEEmainAnalysis: React.FC = () => {
  const [jsonData, setJsonData] = useState<DataProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setIsLoading(true);

    const file = acceptedFiles[0];
    const reader = new FileReader();
    const workbook = new ExcelJs.Workbook();

    reader.onload = async (e) => {
      const buffer = e.target?.result;
      if (!(buffer instanceof ArrayBuffer)) {
        setIsLoading(false);
        console.error("File reader error");
        return;
      }
      try {
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];
        const rows: Array<any[]> = [];
        worksheet.eachRow((row) => {
          const rowValue = Array.isArray(row.values) ? row.values.slice(1) : [];
          rows.push(rowValue);
        });

        if (rows.length === 0) {
          console.error("No rows found in the Excel file.");
          setJsonData([]);
          setIsLoading(false);
          return;
        }

        const [header, ...dataRows] = rows;

        if (!header || header.length === 0) {
          console.error("No valid headers found in the file.");
          setJsonData([]);
          setIsLoading(false);
          return;
        }

        const json: DataProps[] = dataRows.map((row) => {
          const rowData = header.reduce((acc, header, index) => {
            if (typeof header === "string") {
              acc[header] = row[index] || "";
            }
            return acc;
          }, {} as Partial<DataProps>);
          return {
            id: row[0]?.toString() || "",
            data: rowData?.data || "Hello",
          };
        });

        setJsonData(json);
      } catch (error) {
        console.error("Error reading Excel file:", error);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  console.log(jsonData);

  return (
    <Box>
      <Box>
        <FileDropZone onDrop={onDrop} acceptedExtensions={[".xlsx", ".xls"]} />
      </Box>
    </Box>
  );
};

export default JEEmainAnalysis;
