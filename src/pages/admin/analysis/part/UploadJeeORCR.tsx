import { Box, Button, Typography, Divider } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import ExcelJS from "exceljs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CloudUploadRounded, DownloadRounded } from "@mui/icons-material";
import { CustomToolbar } from "../../../../components/CustomToolbar";
import axios from "../../../../hooks/AxiosInterceptor";

interface DataProps {
  year: string;
  institute: string;
  programName: string;

  quota: string;
  seatType: string;
  gender: string;
  openingRank: string;
  closingRank: string;
  jee: string;
}

interface UploadJeeMainORCRProps {
  setShowUploadData: (value: boolean) => void;
}

const UploadJeeMainORCR: React.FC<UploadJeeMainORCRProps> = ({
  setShowUploadData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<DataProps[] | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setIsLoading(true);

    const file = acceptedFiles[0];
    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async (e) => {
      const buffer = e.target?.result;
      if (!(buffer instanceof ArrayBuffer)) {
        setIsLoading(false);
        console.error("FileReader result is not an ArrayBuffer.");
        return;
      }

      try {
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];

        const rows: Array<any[]> = [];
        worksheet.eachRow((row) => {
          const rowValues = Array.isArray(row.values)
            ? row.values.slice(1)
            : [];
          rows.push(rowValues);
        });

        if (rows.length === 0) {
          setJsonData([]);
          setIsLoading(false);
          return;
        }

        const [headers, ...dataRows] = rows;
        const json: DataProps[] = dataRows.map((row) => {
          const rowData = headers.reduce((acc, header, index) => {
            acc[header] = row[index] || "";
            return acc;
          }, {} as Partial<DataProps>);
          return {
            year: rowData.year || "",
            institute: rowData.institute || "",
            programName: rowData.programName || "",
            seatType: rowData.seatType || "",
            gender: rowData.gender || "",
            openingRank: rowData.openingRank || "",
            closingRank: rowData.closingRank || "",
            quota: rowData.quota || "",
            jee: rowData.jee || "",
          };
        });

        setJsonData(json);
      } catch (error) {
        console.error("Error reading the Excel file:", error);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUploadData = async () => {
    try {
      await axios.post("/analysis/jeemain", {
        data: JSON.stringify(jsonData),
      });
      setShowUploadData(false);
      setJsonData(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  const rows = useMemo(
    () =>
      jsonData?.map((data, index) => ({
        ...data,
        id: index + 1,
      })) || [],
    [jsonData]
  );

  const columns: GridColDef[] = [
    { field: "id", headerName: "SN", width: 90 },
    {
      field: "year",
      headerName: "Year",
      width: 120,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "jee",
      headerName: "JEE",
      width: 120,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    { field: "institute", headerName: "Institute", width: 200, flex: 1 },
    { field: "programName", headerName: "Program Name", width: 200, flex: 1 },
    {
      field: "quota",
      headerName: "Quota",
      width: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "seatType",
      headerName: "Seat Type",
      width: 120,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "openingRank",
      headerName: "Opening Rank",
      width: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "closingRank",
      headerName: "Closing Rank",
      width: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Box
          {...getRootProps()}
          sx={{
            border: "1px dashed #1976d2",
            borderRadius: 20,
            cursor: "pointer",
            flexGrow: 1,
            alignContent: "center",
            p: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadRounded sx={{ mr: 1 }} />
          <Typography variant="body1">
            Drag & drop an Excel file here, or click to select a file
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,

            flexWrap: "wrap",
          }}
        >
          <Button
            startIcon={<DownloadRounded />}
            variant="contained"
            component="a"
            href="/sample1.xlsx"
            download
          >
            Sample
          </Button>
          <Button disabled={isLoading || !jsonData} onClick={handleUploadData}>
            Upload
          </Button>
        </Box>
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Box sx={{ mt: 2 }}>
        <DataGrid
          slots={{
            toolbar: () => <CustomToolbar />,
          }}
          columns={columns}
          rows={rows}
          loading={isLoading}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 30, 50, 100, 200]}
        />
      </Box>
    </Box>
  );
};

export default UploadJeeMainORCR;
