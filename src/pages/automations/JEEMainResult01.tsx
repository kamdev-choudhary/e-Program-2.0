import {
  Box,
  Button,
  CircularProgress,
  Paper,
  ToggleButton,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import ExcelJS from "exceljs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  CheckCircleRounded,
  CloudDownloadRounded,
  TableChartRounded,
} from "@mui/icons-material";
import { CustomToolbar } from "../../components/CustomToolbar";
import { downloadJsonToExcel } from "../../utils/commonfs";
import FileDropZone from "../../components/FileDropZone";
import axios from "../../hooks/AxiosInterceptor";
import { useNotification } from "../../contexts/NotificationProvider";
import { toProperCase } from "../../utils/commonfs";
import BorderLinearProgress from "../../components/BorderLineProgress";
import RangeDistribution from "./jee-main/RangeDistribution";
import AverageScore from "./jee-main/AverageScore";
interface ScholarData {
  drn: string;
  name: string;
  application: string;
  password?: string;
  status?: "idle" | "loading" | "fetched";
  error: string;
  // data
  rollNumber1?: string;
  rollNumber2?: string;
  candidateName?: string;
  motherName?: string;
  fatherName?: string;
  category?: string;
  personWithDisability?: string;
  gender?: string;
  dateOfBirth?: string;
  stateOfEligibility?: string;
  nationality?: string;
  mathematics?: string;
  physics?: string;
  chemistry?: string;
  total?: string;
  ntaScoreInWords?: string;
}

const JEEMainResult: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<ScholarData[] | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const { showNotification } = useNotification();

  const handleDownloadMainScorecard = async (scholar: ScholarData) => {
    try {
      setJsonData((prevData) => {
        if (!prevData) return null; // If jsonData is null, maintain null state
        return prevData.map((item) =>
          item.drn === scholar.drn
            ? {
                ...item,
                status: "loading",
                error: "",
              }
            : item
        );
      });
      // Request to get the PDF file path
      const response = await axios.post("/automation/jee/main-result-01", {
        drn: scholar.drn,
        application: scholar.application,
        password: scholar.password,
      });

      if (response.status === 200 && response.data?.message) {
        const data = response.data;
        setJsonData((prevData) => {
          if (!prevData) return null;
          return prevData.map((item) =>
            item.drn === scholar.drn
              ? {
                  ...item,
                  error: "",
                  status: "fetched",
                  mathematics: data?.mathematics || "",
                  physics: data?.physics || "",
                  chemistry: data?.chemistry || "",
                  total: data?.total || "",
                }
              : item
          );
        });
        showNotification({
          message: `Data fetched for ${scholar.drn}`,
          type: "success",
        });
      }
    } catch (error: any) {
      setJsonData((prevData) => {
        if (!prevData) return null; // If jsonData is null, maintain null state
        const errorMessage = error?.response?.data?.message || "Unknown error";
        return prevData.map((item) =>
          item.drn === scholar.drn
            ? {
                ...item,
                error: errorMessage,
                status: "idle",
              }
            : item
        );
      });
      showNotification({
        message: `Error fetching data for ${scholar.drn}`,
        type: "error",
      });
    }
  };

  const handleDownloadInfo = async () => {
    if (!jsonData) return;

    try {
      await Promise.all(
        jsonData
          .filter((data) => data?.status === "idle")
          .map(handleDownloadMainScorecard)
      );
    } catch (error) {
      console.error("Error handling download info:", error);
    }
  };

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
        showNotification({
          message: "FileReader result is not an ArrayBuffer.",
          type: "error",
        });
        return;
      }

      try {
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];

        const rows: Array<any[]> = [];
        worksheet.eachRow((row) => {
          if (!row.values) return; // Ensure row.values is defined

          const rowValues = Array.isArray(row.values)
            ? row.values.slice(1)
            : [];

          // Convert hyperlink/email cells to plain text if needed
          const processedRow = rowValues.map((cell) => {
            if (typeof cell === "object" && cell !== null && "text" in cell) {
              return cell.text; // Extract the plain text from a hyperlink/email
            }
            return cell ?? ""; // Ensure no `undefined` values
          });

          rows.push(processedRow);
        });

        if (rows.length === 0) {
          setJsonData([]);
          setIsLoading(false);
          return;
        }

        const [headers, ...dataRows] = rows;
        const json: ScholarData[] = dataRows.map((row) => {
          const rowData = headers.reduce((acc, header, index) => {
            let value = row[index] ?? "";

            if (
              typeof value === "object" &&
              value !== null &&
              "text" in value
            ) {
              value = value.text; // Extract text from hyperlinks or formatted cells
            } else if (typeof value !== "string") {
              value = String(value); // Convert to string to ensure uniformity
            }

            acc[header] = value;
            return acc;
          }, {} as Partial<ScholarData>);

          return {
            drn: rowData.drn || "",
            name: rowData.name || "",
            application: rowData.application || "",
            password: rowData.password || "",
            error: "",
            status: "idle",
          };
        });
        showNotification({
          message: "Excel file Processed Successfully",
          type: "success",
        });
        setJsonData(json);
      } catch (error) {
        showNotification({
          message: "Error reading the Excel file",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleProcessRowUpdate = (
    newRow: ScholarData,
    oldRow: ScholarData
  ): ScholarData => {
    setJsonData((prevData) => {
      if (!prevData) return null; // Handle case when prevData is null
      return prevData.map((item) =>
        item.drn === oldRow.drn
          ? { ...item, ...newRow } // Update the matching row
          : item
      );
    });

    return newRow;
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "drn",
        headerName: "Dakshana Roll #",
        width: 150,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "name",
        headerName: "Name",
        minWidth: 200,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "application",
        headerName: "Application #",
        minWidth: 150,
        align: "center",
        headerAlign: "center",
        editable: true,
        flex: 1,
      },
      {
        field: "password",
        headerName: "Password",
        minWidth: 150,
        align: "center",
        headerAlign: "center",
        editable: true,
        flex: 1,
      },

      {
        field: "status",
        headerName: "Data",
        align: "center",
        headerAlign: "center",
        minWidth: 200,
        flex: 1,
        renderCell: (params) => (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Button
              onClick={() => handleDownloadMainScorecard(params.row)}
              startIcon={
                params.row.status === "loading" ? (
                  <CircularProgress size={20} />
                ) : params.row.status === "fetched" ? (
                  <CheckCircleRounded color="success" />
                ) : (
                  <CloudDownloadRounded />
                )
              }
              disabled={
                params.row.status === "fetched" ||
                params.row.status === "loading"
              }
              variant="outlined"
            >
              {params.row.status === "idle"
                ? "Fetch Data"
                : toProperCase(params.row.status)}
            </Button>
          </Box>
        ),
        editable: true,
        type: "singleSelect",
        valueOptions: ["Idle", "Loading", "Fetched"],
      },
      {
        field: "error",
        headerName: "Error",
        flex: 1,
        minWidth: 250,
        headerAlign: "center",
        renderCell: (params) => (
          <span style={{ color: "red" }}>{params.row.error}</span>
        ),
      },

      // Scores

      {
        field: "mathematics",
        headerName: "Math Total",
        flex: 1,
        minWidth: 120,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "physics",
        headerName: "Physics Total",
        flex: 1,
        minWidth: 120,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "chemistry",
        headerName: "Chemistry Total",
        flex: 1,
        minWidth: 120,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "total",
        headerName: "Grand Total",
        flex: 1,
        minWidth: 150,
        headerAlign: "center",
        align: "center",
      },

      // PwD Ranks
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (!jsonData) return [];

    return jsonData
      .filter((data) => {
        if (selectedStatus === "loading" || selectedStatus === "fetched") {
          return data.status === selectedStatus;
        } else if (selectedStatus === "error") {
          return data.error !== "";
        } else {
          return true; // Include all data for other cases
        }
      })
      .map((data, index) => ({
        ...data,
        id: index + 1, // Add an id field based on the index (1-based)
      }));
  }, [jsonData, selectedStatus]);

  const fetchedCount = useMemo(() => {
    if (!jsonData) return 0;
    const count =
      jsonData?.filter((data) => data.status === "fetched").length || 0;

    return (count / jsonData.length) * 100;
  }, [jsonData]);

  const downloadJsonFile = () => {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Paper sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <FileDropZone onDrop={onDrop} acceptedExtensions={[".xlsx", "xls"]} />
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              onClick={handleDownloadInfo}
              disabled={
                isLoading ||
                !jsonData ||
                jsonData.every((data) => data.status !== "idle")
              }
              startIcon={<CloudDownloadRounded />}
            >
              {isLoading ? "Loading..." : "Fetch Data"} (
              {jsonData?.filter((data) => data?.status === "idle").length || 0})
            </Button>

            <Button
              startIcon={<TableChartRounded />}
              variant="contained"
              disabled={!jsonData}
              onClick={() => {
                if (jsonData) {
                  downloadJsonToExcel({
                    jsonData: jsonData,
                    fileName: "JEE Main Result Session 01",
                  });
                  downloadJsonFile();
                }
              }}
              color="success"
            >
              Download Excel (
              {jsonData?.filter((data) => data?.status === "fetched").length ||
                0}
              )
            </Button>
          </Box>
        </Box>
        <BorderLinearProgress value={fetchedCount} />
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "space-between",
            overflow: "auto",
            flexWrap: "wrap",
          }}
        >
          <ToggleButton
            value="total"
            aria-label="Platform"
            selected={selectedStatus === ""}
            onClick={() => setSelectedStatus("")}
            sx={{ px: 4, minWidth: 150, flexGrow: 1, maxWidth: 200 }}
            size="small"
          >
            <strong>Total &nbsp;&nbsp;</strong> ({jsonData?.length || 0})
          </ToggleButton>
          <ToggleButton
            value="total"
            color="success"
            aria-label="Platform"
            selected={selectedStatus === "fetched"}
            onClick={() => setSelectedStatus("fetched")}
            size="small"
            sx={{ px: 4, minWidth: 150, flexGrow: 1, maxWidth: 200 }}
          >
            <strong>fetched &nbsp;&nbsp;</strong> (
            {jsonData?.filter((item) => item.status === "fetched").length || 0})
          </ToggleButton>
          <ToggleButton
            color="primary"
            value="total"
            aria-label="Platform"
            selected={selectedStatus === "loading"}
            onClick={() => setSelectedStatus("loading")}
            size="small"
            sx={{ px: 4, minWidth: 150, flexGrow: 1, maxWidth: 200 }}
          >
            <strong>Loading &nbsp;&nbsp;</strong> (
            {jsonData?.filter((item) => item.status === "loading").length || 0})
          </ToggleButton>
          <ToggleButton
            size="small"
            value="total"
            color="error"
            aria-label="Platform"
            selected={selectedStatus === "error"}
            onClick={() => setSelectedStatus("error")}
            sx={{ px: 4, minWidth: 150, flexGrow: 1, maxWidth: 200 }}
          >
            <strong>Error &nbsp;&nbsp;</strong> (
            {jsonData?.filter((item) => item?.error !== "").length || 0})
          </ToggleButton>
        </Box>
      </Paper>

      <Box>
        <DataGrid
          slots={{
            toolbar: () => <CustomToolbar />,
          }}
          columns={columns}
          rows={filteredData || []}
          loading={isLoading}
          processRowUpdate={handleProcessRowUpdate}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 30, 50, 100, 200]}
        />
      </Box>

      <RangeDistribution jsonData={jsonData} />
      <AverageScore jsonData={jsonData} />
    </Box>
  );
};

export default JEEMainResult;
