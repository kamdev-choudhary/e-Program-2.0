import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  ToggleButton,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import ExcelJS from "exceljs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CloudDownloadRounded, TableChartRounded } from "@mui/icons-material";
import { CustomToolbar } from "../../components/CustomToolbar";
import { downloadJsonToExcel } from "../../utils/commonfs";
import FileDropZone from "../../components/FileDropZone";
import axios from "../../hooks/AxiosInterceptor";
import { useNotification } from "../../contexts/NotificationProvider";

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
  mathematics1?: string;
  mathematics2?: string;
  mathematics?: string;
  physics1?: string;
  physics2?: string;
  physics?: string;
  chemistry1?: string;
  chemistry2?: string;
  chemistry?: string;
  total1?: string;
  total2?: string;
  total?: string;
  ntaScoreInWords?: string;
  crlRank?: string;
  genEwsRank?: string;
  obcNclRank?: string;
  scRank?: string;
  stRank?: string;
  crlPwDRank?: string;
  genEwsPwDRank?: string;
  obcNclPwDRank?: string;
  scPwDRank?: string;
  stPwDRank?: string;
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
      const response = await axios.post("/automation/jee/main-result", {
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
                  rollNumber1: data?.rollNumber || "",
                  rollNumber2: data?.rollNumber || "",
                  candidateName: data?.candidateName || "",
                  motherName: data?.motherName || "",
                  fatherName: data?.fatherName || "",
                  category: data?.category || "",
                  personWithDisability: data?.personWithDisability || "",
                  gender: data?.gender || "",
                  dateOfBirth: data?.dateOfBirth || "",
                  stateOfEligibility: data?.stateOfEligibility || "",
                  nationality: data?.nationality,
                  mathematics1: data?.mathematics1 || "",
                  mathematics2: data?.mathematics2 || "",
                  mathematics: data?.mathematics || "",
                  physics1: data?.physics1 || "",
                  physics2: data?.physics2 || "",
                  physics: data?.physics || "",
                  chemistry1: data?.chemistry1 || "",
                  chemistry2: data?.chemistry2 || "",
                  chemistry: data?.chemistry || "",
                  total1: data?.total1 || "",
                  total2: data?.total2 || "",
                  total: data?.total || "",
                  ntaScoreInWords: data?.ntaScoreInWords || "",
                  crlRank: data?.crlRank || "",
                  genEwsRank: data?.genEwsRank || "",
                  obcNclRank: data?.obcNclRank || "",
                  scRank: data?.scRank || "",
                  stRank: data?.stRank || "",
                  crlPwDRank: data?.crlPwDRank || "",
                  genEwsPwDRank: data?.genEwsPwDRank || "",
                  obcNclPwDRank: data?.obcNclPwDRank || "",
                  scPwDRank: data?.scPwDRank || "",
                  stPwDRank: data?.stPwDRank || "",
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
        type: "success",
      });
    }
  };

  const handleDownloadInfo = async () => {
    try {
      if (jsonData) {
        await Promise.all(
          jsonData.map(async (data) => {
            if (data?.status === "idle") {
              await handleDownloadMainScorecard(data);
            }
          })
        );
      }
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
        const json: ScholarData[] = dataRows.map((row) => {
          const rowData = headers.reduce((acc, header, index) => {
            acc[header] = row[index] || "";
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

  const columns: GridColDef[] = [
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
              ) : (
                <CloudDownloadRounded />
              )
            }
            disabled={
              params.row.status === "fetched" || params.row.status === "loading"
            }
            variant="outlined"
          >
            {params.row.status === "loading" ? "Loading" : "Fetch Data"}
          </Button>
        </Box>
      ),
      editable: true,
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
    {
      field: "rollNumber1",
      headerName: "Roll Number 1",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "rollNumber2",
      headerName: "Roll Number 2",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "candidateName",
      headerName: "Candidate Name",
      flex: 1.5,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "motherName",
      headerName: "Mother's Name",
      flex: 1.5,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "fatherName",
      headerName: "Father's Name",
      flex: 1.5,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "personWithDisability",
      headerName: "PwD",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "stateOfEligibility",
      headerName: "State of Eligibility",
      flex: 1.5,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "nationality",
      headerName: "Nationality",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
    },

    // Scores
    {
      field: "mathematics1",
      headerName: "Math 1",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mathematics2",
      headerName: "Math 2",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mathematics",
      headerName: "Math Total",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "physics1",
      headerName: "Physics 1",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "physics2",
      headerName: "Physics 2",
      flex: 1,
      minWidth: 100,
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
      field: "chemistry1",
      headerName: "Chemistry 1",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "chemistry2",
      headerName: "Chemistry 2",
      flex: 1,
      minWidth: 100,
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
      field: "total1",
      headerName: "Total 1",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "total2",
      headerName: "Total 2",
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

    {
      field: "ntaScoreInWords",
      headerName: "NTA Score",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
    },

    // Ranks
    {
      field: "crlRank",
      headerName: "CRL Rank",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "genEwsRank",
      headerName: "GEN-EWS Rank",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "obcNclRank",
      headerName: "OBC-NCL Rank",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "scRank",
      headerName: "SC Rank",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "stRank",
      headerName: "ST Rank",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },

    // PwD Ranks
    {
      field: "crlPwDRank",
      headerName: "CRL PwD Rank",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "genEwsPwDRank",
      headerName: "GEN-EWS PwD Rank",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "obcNclPwDRank",
      headerName: "OBC-NCL PwD Rank",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "scPwDRank",
      headerName: "SC PwD Rank",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "stPwDRank",
      headerName: "ST PwD Rank",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
  ];

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Paper sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <FileDropZone onDrop={onDrop} acceptedExtensions={[".xlsx", "xls"]} />
          <Box
            sx={{
              display: "flex",
              gap: 1,

              flexWrap: "wrap",
            }}
          >
            <Button
              sx={{ px: 3 }}
              variant="contained"
              onClick={handleDownloadInfo}
              disabled={isLoading || !jsonData}
              startIcon={<CloudDownloadRounded sx={{ color: "#fff" }} />}
            >
              {isLoading ? "Loading..." : "Fetch Data"} (
              {/* {jsonData?.filter((data) => !data?.center).length}) */}
            </Button>
            <Button
              startIcon={<TableChartRounded />}
              sx={{ px: 3 }}
              variant="contained"
              disabled={!jsonData}
              onClick={() => {
                if (jsonData) {
                  downloadJsonToExcel({
                    jsonData: jsonData,
                    fileName: "JEE Main AdmitCard Info",
                  });
                }
              }}
            >
              Download Excel
              {/* ({jsonData?.filter((data) => data?.center).length}) */}
            </Button>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",

            gap: 2,
            justifyContent: "space-between",
            px: 2,
            overflow: "auto",
          }}
        >
          <ToggleButton
            value="total"
            color="success"
            aria-label="Platform"
            selected={selectedStatus === ""}
            onClick={() => setSelectedStatus("")}
            sx={{ px: 4, minWidth: 150 }}
          >
            <strong>Total &nbsp;&nbsp;</strong> ({jsonData?.length || 0})
          </ToggleButton>
          <ToggleButton
            value="total"
            color="primary"
            aria-label="Platform"
            selected={selectedStatus === "fetched"}
            onClick={() => setSelectedStatus("fetched")}
            sx={{ px: 4, minWidth: 150 }}
          >
            <strong>fetched &nbsp;&nbsp;</strong> (
            {jsonData?.filter((item) => item.status === "fetched").length || 0})
          </ToggleButton>
          <ToggleButton
            value="total"
            aria-label="Platform"
            selected={selectedStatus === "loading"}
            onClick={() => setSelectedStatus("loading")}
            sx={{ px: 4, minWidth: 150 }}
          >
            <strong>Loading &nbsp;&nbsp;</strong> (
            {jsonData?.filter((item) => item.status === "loading").length || 0})
          </ToggleButton>
          <ToggleButton
            value="total"
            color="error"
            aria-label="Platform"
            selected={selectedStatus === "error"}
            onClick={() => setSelectedStatus("error")}
            sx={{ px: 4, minWidth: 150 }}
          >
            <strong>Error &nbsp;&nbsp;</strong> (
            {jsonData?.filter((item) => item?.error !== "").length || 0})
          </ToggleButton>
        </Box>
      </Paper>

      <Box>
        <DataGrid
          slots={{
            toolbar: () => <CustomToolbar showAddButton={false} />,
          }}
          columns={columns}
          rows={filteredData || []}
          loading={isLoading}
          processRowUpdate={handleProcessRowUpdate}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 30, 50, 100, 200]}
        />
      </Box>
    </Box>
  );
};

export default JEEMainResult;
