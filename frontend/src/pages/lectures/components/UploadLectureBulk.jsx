import React, { useState } from "react";
import {
  Box,
  OutlinedInput,
  Button,
  Typography,
  Grid2 as Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ExcelJS from "exceljs";
import { addLecturesMultiple } from "../../../api/lectures";
import { useGlobalProvider } from "../../../GlobalProvider";

function UploadLectureBulk({ setShowBulkUploadLecture }) {
  const { isValidResponse } = useGlobalProvider();
  const [excelData, setExcelData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [file, setFile] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFile(file);

    // Validate file type
    const fileType = file.type;
    if (
      fileType !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      alert("Please upload a valid Excel file.");
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.worksheets[0]; // Assume the first sheet is to be processed
      const rows = [];
      const headers = worksheet.getRow(1).values.slice(1); // Get header row values
      const tempColumns = headers.map((header, index) => ({
        field: `col${index}`,
        headerName: header,
        width: 150,
        flex: 1,
      }));
      setColumns(tempColumns);

      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return; // Skip header row
        const rowData = {};
        row.values.slice(1).forEach((value, index) => {
          rowData[`col${index}`] = value;
        });
        rows.push({ id: rowIndex, ...rowData }); // Add `id` for DataGrid
      });

      setExcelData(rows); // Update state with parsed data
    } catch (error) {
      console.error("Error reading Excel file:", error);
      alert("Failed to process the Excel file.");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload an Excel file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await addLecturesMultiple({ formData: formData });
      if (isValidResponse(response)) {
        if (isValidResponse(response)) {
          setShowBulkUploadLecture(false);
        }
      }
    } catch (error) {
      console.error("Error uploading file to server:", error);
      alert("Failed to upload the file.");
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <OutlinedInput
            size="small"
            type="file"
            fullWidth
            inputProps={{ accept: ".xlsx" }} // Restrict file types
            onChange={handleFileUpload}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!file}
          >
            Upload to Backend
          </Button>
        </Grid>
      </Grid>

      {excelData.length > 0 && (
        <Box mt={3} height={400}>
          <Typography variant="h6" gutterBottom>
            Preview Excel Data
          </Typography>
          <DataGrid
            rows={excelData}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Box>
      )}
    </Box>
  );
}

export default UploadLectureBulk;
