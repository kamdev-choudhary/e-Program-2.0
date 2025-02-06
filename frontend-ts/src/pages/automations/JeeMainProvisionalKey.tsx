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
  questionType: "SA" | "MCQ";
  questionID: string;
  optionIDs?: Options[];
  status: "Not Answered" | "Answered" | "Not Attempted and Marked For Review";
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

  function calculateExamResults(scholar: ScholarData): ScholarData {
    // Initialize subject-wise counters
    let physicsPositive = 0,
      physicsNegative = 0;
    let chemistryPositive = 0,
      chemistryNegative = 0;
    let mathsPositive = 0,
      mathsNegative = 0;

    // Process each section in the question paper
    scholar.questionPaper?.forEach((section) => {
      const subject = getSubjectFromSection(section.sectionName);

      section.questions.forEach((question) => {
        // Skip unanswered questions
        if (
          question.status === "Not Answered" ||
          question.status === "Not Attempted and Marked For Review"
        )
          return;

        // Find the correct answer from the answer key
        const answerKey = scholar.answeyKey?.find(
          (ak) => ak.questionID === question.questionID
        );

        if (!answerKey) {
          console.warn(
            `Missing answer key for ${subject} question ${question.questionID}`
          );
          return;
        }

        // Determine the student's answer
        let studentAnswerID: string | undefined;

        if (question.questionType === "MCQ" && question.optionIDs) {
          // Step 1: Get chosen option number (e.g., "3")
          const chosenOptionNumber = (question.optionIDs as any)[
            "Chosen Option"
          ];

          // Step 2: Use chosenOptionNumber to get the correct option ID
          studentAnswerID = (question.optionIDs as any)[
            `Option ${chosenOptionNumber} ID`
          ];
        } else if (question.questionType === "SA") {
          studentAnswerID =
            question.givenAnswer !== "--" ? question.givenAnswer : undefined;
        }

        if (!studentAnswerID) return; // Ignore if no valid answer is provided

        let isCorrect = false;
        if (question.questionType === "SA") {
          isCorrect =
            parseInt(studentAnswerID) === parseInt(answerKey.correctAnswer);
          if (subject === "Chemistry") {
            console.log(isCorrect);
          }
        } else {
          isCorrect = studentAnswerID === answerKey.correctAnswer;
        }

        // Scoring logic
        if (question.questionType === "MCQ" || question.questionType === "SA") {
          isCorrect
            ? addMarks(4, "positive", subject)
            : addMarks(1, "negative", subject);
        }
      });
    });

    // Calculate total scores
    const physicsTotal = physicsPositive - physicsNegative;
    const chemistryTotal = chemistryPositive - chemistryNegative;
    const mathsTotal = mathsPositive - mathsNegative;
    const totalPositive = physicsPositive + chemistryPositive + mathsPositive;
    const totalNegative = physicsNegative + chemistryNegative + mathsNegative;
    const totalTotal = totalPositive - totalNegative;

    setJsonData((prevData) => {
      if (!prevData) return null; // If jsonData is null, maintain null state
      return prevData.map((item) =>
        item.drn === scholar.drn
          ? {
              ...item,
              physicsPositive,
              physicsNegative,
              physicsTotal,
              chemistryPositive,
              chemistryNegative,
              chemistryTotal,
              mathsPositive,
              mathsNegative,
              mathsTotal,
              totalPositive,
              totalNegative,
              totalTotal,
            }
          : item
      );
    });

    // Return updated scholar object
    return {
      ...scholar,
      physicsPositive,
      physicsNegative,
      physicsTotal,
      chemistryPositive,
      chemistryNegative,
      chemistryTotal,
      mathsPositive,
      mathsNegative,
      mathsTotal,
      totalPositive,
      totalNegative,
      totalTotal,
    };

    // Helper function to determine the subject from section names
    function getSubjectFromSection(section: string): string {
      if (section.includes("Mathematics")) return "Maths";
      if (section.includes("Physics")) return "Physics";
      if (section.includes("Chemistry")) return "Chemistry";
      return "Unknown";
    }

    // Helper function to update subject marks
    function addMarks(
      marks: number,
      type: "positive" | "negative",
      subject: string
    ) {
      switch (subject) {
        case "Physics":
          type === "positive"
            ? (physicsPositive += marks)
            : (physicsNegative += marks);
          break;
        case "Chemistry":
          type === "positive"
            ? (chemistryPositive += marks)
            : (chemistryNegative += marks);
          break;
        case "Maths":
          type === "positive"
            ? (mathsPositive += marks)
            : (mathsNegative += marks);
          break;
      }
    }
  }

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

  const generateResult = async () => {
    try {
      if (jsonData) {
        await Promise.all(
          jsonData.map(async (data) => {
            calculateExamResults(data);
          })
        );
      }
    } catch (error) {
      console.error("Error handling download info:", error);
    }
  };

  const handleGetQuestionInfo = async (scholar: ScholarData) => {
    try {
      setJsonData((prevData) => {
        if (!prevData) return null; // If jsonData is null, maintain null state
        return prevData.map((item) =>
          item.drn === scholar.drn
            ? {
                ...item,
                error: "",
                status2: "loading",
              }
            : item
        );
      });
      const response = await axios.post(
        "/automation/jee/data-from-provisional-answer-key",
        {
          website: scholar.paperUrl,
          drn: scholar.drn,
          application: scholar.application,
        }
      );
      if (response.status === 200) {
        setJsonData((prevData) => {
          if (!prevData) return null; // If jsonData is null, maintain null state
          return prevData.map((item) =>
            item.drn === scholar.drn
              ? {
                  ...item,

                  error: "",
                  status2: "fetched",
                  questionPaper: response.data.questionPaper,
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
                status2: "idle",
              }
            : item
        );
      });
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
          <Button
            variant="contained"
            target="_blank"
            component="a"
            href={params.row.paperUrl}
            disabled={!params.row.paperUrl}
          >
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
            variant="contained"
          >
            {params.row.status2 === "loading" ? "loading" : "Fetch Data"}
          </Button>
        </>
      ),
    },
    {
      field: "calculateResult",
      headerName: "Calculate",
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            onClick={() => {
              calculateExamResults(params.row);
            }}
          >
            Result
          </Button>
        </>
      ),
    },
    {
      field: "physicsPositive",
      headerName: "Physics +ve",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "physicsNegative",
      headerName: "Physics +ve",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "physicsTotal",
      headerName: "Physics +ve",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "chemistryPositive",
      headerName: "chemistry +ve",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "chemistryNegative",
      headerName: "chemistry +ve",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "chemistryTotal",
      headerName: "chemistry +ve",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mathsPositive",
      headerName: "maths +ve",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mathsNegative",
      headerName: "maths +ve",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mathsTotal",
      headerName: "maths +ve",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalPositive",
      headerName: "total +ve",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalNegative",
      headerName: "total +ve",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalTotal",
      headerName: "total +ve",
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
              {jsonData?.filter((data) => !data.paperUrl).length})
            </Button>
            <Button variant="contained" onClick={handleGetBatchQuestionInfo}>
              Fetch Question Info
            </Button>
            <Button variant="contained" onClick={generateResult}>
              Generate Result
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
                    fileName: "Provisional Answer Key",
                  });
                }
              }}
              color="success"
            >
              Download Excel ({jsonData?.filter((data) => data.paperUrl).length}
              )
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
