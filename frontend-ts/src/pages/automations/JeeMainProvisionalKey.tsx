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
import {
  CloudDownloadRounded,
  DownloadRounded,
  TableChartRounded,
} from "@mui/icons-material";
import { CustomToolbar } from "../../components/CustomToolbar";
import { downloadJsonToExcel } from "../../utils/commonfs";
import FileDropZone from "../../components/FileDropZone";
import axios from "../../hooks/AxiosInterceptor";

interface AnswerKey {
  section: string;
  questionID: string;
  correctAnswer: string;
}

interface Options {
  "Option 1 ID": string;
  "Option 2 ID": string;
  "Option 3 ID": string;
  "Option 4 ID": string;
  "Chosen Option": string;
}

interface Questions {
  questionIndex: string | number;
  questionNumber: string;
  givenAnswer: string;
  questionType: string;
  questionID: string;
  optionIDs: Options[];
  status: string;
}

interface QuestionPaper {
  sectionName: string;
  questions: Questions[];
}

interface ScholarData {
  drn: string;
  name?: string;
  application: string;
  password?: string;
  status?: string;
  status2?: string;
  error: string;
  paperUrl?: string;
  answeyKey?: AnswerKey[];
  questionPaper?: QuestionPaper[];
  physicsPositive?: number;
  physicsNegative?: number;
  physicsTotal?: number;
  chemistryPositive?: number;
  chemistryNegative?: number;
  chemistryTotal?: number;
  mathsPositive?: number;
  mathsNegative?: number;
  mathsTotal?: number;
  totalPositive?: number;
  totalNegative?: number;
  totalTotal?: number;
}

const JeeMainProvisionalKey: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<ScholarData[] | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleFetchPaperUrl = async (scholar: ScholarData) => {
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
      const response = await axios.post(
        "/automation/jee/provisional-answer-key",
        {
          drn: scholar.drn,
          applicationNumber: scholar.application,
          password: scholar.password,
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setJsonData((prevData) => {
          if (!prevData) return null; // If jsonData is null, maintain null state
          return prevData.map((item) =>
            item.drn === scholar.drn
              ? {
                  ...item,
                  error: "",
                  status: "fetched",
                  paperUrl: response.data.paperUrl,
                  answeyKey: response.data.answerKey,
                }
              : item
          );
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
    }
  };

  const handleDownloadInfo = async () => {
    try {
      if (jsonData) {
        await Promise.all(
          jsonData.map(async (data) => {
            if (!data.paperUrl && data?.status === "idle") {
              await handleFetchPaperUrl(data);
            }
          })
        );
      }
    } catch (error) {
      console.error("Error handling download info:", error);
    }
  };

  const handleGetQuestionInfo = async (scholar: ScholarData) => {
    try {
      const response = await axios.post(
        "/automation/jee/data-from-provisional-answer-key",
        {
          website: scholar.paperUrl,
          drn: scholar.drn,
        }
      );
      if (response.status === 200) {
        setJsonData((prevData) => {
          if (!prevData) return null; // If jsonData is null, maintain null state
          return prevData.map((item) =>
            item.drn === scholar.drn
              ? {
                  ...item,
                  date: response.data.date,
                  error: "",
                  status2: "fetched",
                  questionPaper: response.data.questionPaper,
                }
              : item
          );
        });
      }
    } catch (error) {
      console.error("Error handling download info:", error);
    }
  };

  const handleGetBatchQuestionInfo = async () => {
    try {
      if (jsonData) {
        await Promise.all(
          jsonData.map(async (data) => {
            if (
              data.paperUrl &&
              data?.status === "fetched" &&
              data.status2 !== "fetched"
            ) {
              await handleGetQuestionInfo(data);
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
            status: rowData.status || "idle",
            status2: rowData.status2 || "idle",
            paperUrl: rowData.paperUrl || "",
            answeyKey: safeParseJSON(rowData.answeyKey, []),
            questionPaper: safeParseJSON(rowData.questionPaper, []),
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

  function safeParseJSON(jsonString: string, fallback: []) {
    try {
      return jsonString ? JSON.parse(jsonString) : fallback;
    } catch (error) {
      console.error("JSON parse error:", error);
      return fallback;
    }
  }

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

  console.log(jsonData);

  const columns: GridColDef[] = [
    {
      field: "drn",
      headerName: "Dakshana Roll #",
      width: 150,
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
      field: "paperUrl",
      headerName: "Paper URL",
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
      renderCell: (params) => (
        <>
          <Button target="_blank" component="a" href={params.row.paperUrl}>
            Paper
          </Button>
        </>
      ),
    },
    {
      field: "pdfDownload",
      headerName: "Data",
      align: "center",
      headerAlign: "center",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%", // Ensure it spans the full cell width
              height: "100%", // Ensure it spans the full cell height
            }}
          >
            <Button
              onClick={() => handleFetchPaperUrl(params.row)}
              startIcon={
                params.row.status === "loading" ? (
                  <CircularProgress size={20} />
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
              {params.row.status === "loading" ? "loading" : "Fetch Data"}
            </Button>
          </Box>
        </>
      ),
    },
    {
      field: "error",
      headerName: "Error",
      flex: 1,
      minWidth: 250,
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <span style={{ color: "red" }}>{params.row.error}</span>
        </>
      ),
    },
    {
      field: "questionPaper",
      headerName: "Question Paper",
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Button
            onClick={() => handleGetQuestionInfo(params.row)}
            startIcon={
              params.row.status2 === "loading" ? (
                <CircularProgress size={20} />
              ) : (
                <CloudDownloadRounded />
              )
            }
            disabled={
              params.row.status2 === "fetched" ||
              params.row.status2 === "loading" ||
              params.row.paperUrl === "" ||
              params.row.paperUrl === null ||
              params.row.paperUrl === undefined ||
              params.row?.questionPaper?.length !== 0
            }
            variant="outlined"
          >
            {params.row.status2 === "loading" ? "loading" : "Fetch Data"}
          </Button>
        </>
      ),
    },
  ];

  console.log(jsonData);

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
              {jsonData?.filter((data) => !data.paperUrl).length})
            </Button>
            <Button onClick={handleGetBatchQuestionInfo} variant="contained">
              Fetch Question Info
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
                    fileName: "JEE Main City Info",
                  });
                }
              }}
            >
              Download Excel ({jsonData?.filter((data) => data.paperUrl).length}
              )
            </Button>

            <Button
              startIcon={<DownloadRounded />}
              variant="contained"
              component="a"
              href="/jee_main_admit_card_sample.xlsx"
              download
            >
              Sample
            </Button>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
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

export default JeeMainProvisionalKey;
