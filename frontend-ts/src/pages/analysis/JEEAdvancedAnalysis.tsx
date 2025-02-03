import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Grid2 as Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import FileDropZone from "../../components/FileDropZone";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ExcelJs from "exceljs";
import { DownloadRounded, ExpandMoreRounded } from "@mui/icons-material";
import { CustomModal } from "../../components/CustomModal";
import { CustomToolbar } from "../../components/CustomToolbar";
import { downloadJsonToExcel } from "../../utils/commonfs";
import SummaryTable from "./parts/SummaryTable";
import SubjectRangeDistribution from "./parts/SubjectRangeDistribution";
import Loader from "../../components/Loader";
import CutoffCreateria from "./parts/CutoffCreateria";
import SubjectStatistics from "./parts/SubjectStatistics";

// types
import {
  DataProps,
  SummaryProps,
  CategoryProp,
  CutoffDataProps,
} from "./types";
import { useNotification } from "../../contexts/NotificationProvider";
import axios from "../../hooks/AxiosInterceptor";

const JEEAdvancedAnalysis: React.FC = () => {
  const { showNotification } = useNotification();
  const [weightage, setWeightage] = useState<string | number>(1);
  const [jsonData, setJsonData] = useState<DataProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<SummaryProps | null>(null);
  const [cutoff, setCutoff] = useState<CutoffDataProps | null>(null);
  const [showScholars, setShowScholars] = useState<boolean>(false);
  const [scholars, setScholars] = useState<DataProps[]>([]);
  const [subjectMarks, setSubjectMarks] = useState({
    physics: "120",
    chemistry: "120",
    maths: "120",
    total: "360",
  });

  const getAdvancedRank = async () => {
    try {
      const res = await axios.post("/analysis/jeeadvanced/predict-rank", {
        students: jsonData,
        year: cutoff?.year || 2024,
      });

      if (res.data && Array.isArray(res.data)) {
        const rankDataMap = new Map();
        res.data.forEach((studentResult) => {
          if (studentResult.student && studentResult.student.uniqueId) {
            rankDataMap.set(studentResult.student.uniqueId, studentResult);
          }
        });

        const updatedJsonData = jsonData.map((student) => {
          const rankData = rankDataMap.get(student.uniqueId);
          if (rankData) {
            return {
              ...student,
              airRank: rankData.airRank,
              catRank: rankData.catRank,
            };
          }
          return student;
        });

        setJsonData(updatedJsonData); // Assuming you're using React state
      }
    } catch (error) {
      console.error("Error fetching rank:", error);
    }
  };

  const maxMarksObj = useMemo(
    () => ({
      physics: Number(subjectMarks.physics),
      chemistry: Number(subjectMarks.chemistry),
      maths: Number(subjectMarks.maths),
      total: Number(subjectMarks.total),
    }),
    [subjectMarks]
  );

  const generatePrediction = async (jsonData: DataProps[]) => {
    setIsLoading(true);
    try {
      const categoryMap: Record<string, keyof CutoffDataProps> = {
        gen: "general",
        general: "general",
        obc: "obc",
        "obc-ncl": "obc",
        obcncl: "obc",
        sc: "sc",
        st: "st",
        ews: "ews",
        "ews-ncl": "ews",
        ewsc: "ews",
        "general-pwd": "generalPwD",
        "gen-pwd": "generalPwD",
        "obc-pwd": "obcPwD",
        "obc-ncl-pwd": "obcPwD",
        "obcncl-pwd": "obcPwD",
        "sc-pwd": "scPwD",
        "st-pwd": "stPwD",
        "ews-pwd": "ewsPwD",
        "ews-ncl-pwd": "ewsPwD",
        preparatory: "preparatory",
        "gen-ews": "ews",
      };

      const newSummary: SummaryProps = {
        physicsQualified: [],
        chemistryQualified: [],
        mathsQualified: [],
        totalQualified: [],
        physicsDidNotQualified: [],
        chemistryDidNotQualified: [],
        mathsDidNotQualified: [],
        totalDidNotQualified: [],
        qualified: [],
        didNotQualified: [],
      };

      const predictions =
        jsonData?.map((student: DataProps) => {
          if (!student) return student;

          let categoryKey = student.category.toLowerCase();
          let mappedCategoryKey = categoryMap[categoryKey] || categoryKey;

          if (["yes", "y"].includes(student.pwd.toLowerCase())) {
            mappedCategoryKey += "PwD";
          }

          // **Corrected Line**: Type assertion ensures TypeScript recognizes mappedCategoryKey as a valid key
          const categoryCutoff = cutoff
            ? (cutoff[
                mappedCategoryKey as keyof CutoffDataProps
              ] as CategoryProp)
            : undefined;

          if (!categoryCutoff) {
            return {
              ...student,
              message: `Cutoff data not available`,
              error: "Error",
            };
          }

          const isPhysicsQualified = student.physics! >= categoryCutoff.subject;
          const isChemistryQualified =
            student.chemistry! >= categoryCutoff.subject;
          const isMathsQualified = student.maths! >= categoryCutoff.subject;
          const isTotalQualified = student.total! >= categoryCutoff.total;

          isPhysicsQualified
            ? newSummary.physicsQualified.push(student)
            : newSummary.physicsDidNotQualified.push(student);
          isChemistryQualified
            ? newSummary.chemistryQualified.push(student)
            : newSummary.chemistryDidNotQualified.push(student);
          isMathsQualified
            ? newSummary.mathsQualified.push(student)
            : newSummary.mathsDidNotQualified.push(student);
          isTotalQualified
            ? newSummary.totalQualified.push(student)
            : newSummary.totalDidNotQualified.push(student);

          if (
            isPhysicsQualified &&
            isChemistryQualified &&
            isMathsQualified &&
            isTotalQualified
          ) {
            newSummary.qualified.push(student);
          } else {
            newSummary.didNotQualified.push(student);
          }

          return {
            ...student,
            cutoff: categoryCutoff,
            isPhysicsQualified,
            isChemistryQualified,
            isMathsQualified,
            isTotalQualified,
            isQualified:
              isPhysicsQualified &&
              isChemistryQualified &&
              isMathsQualified &&
              isTotalQualified,
          };
        }) || [];

      setJsonData(predictions);
      setSummary(newSummary);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const workbook = new ExcelJs.Workbook();
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
        const json: DataProps[] = dataRows.map((row, index) => {
          const rowData = headers.reduce((acc, header, index) => {
            acc[header] = row[index] || "";
            return acc;
          }, {} as Partial<DataProps>);

          return {
            id: String(index + 1),
            name: rowData.name,
            uniqueId: rowData.uc || rowData.drn,
            category: rowData.category.toLowerCase(),
            pwd: rowData.pwd.toLowerCase(),
            physics_positive: Number(rowData.physics_positive) || 0,
            physics_negative: Number(rowData.physics_negative) || 0,
            physics: Number(rowData.physics) || 0,
            chemistry_positive: Number(rowData.chemistry_positive) || 0,
            chemistry_negative: Number(rowData.chemistry_negative) || 0,
            chemistry: Number(rowData.chemistry) || 0,
            maths_positive: Number(rowData.maths_positive) || 0,
            maths_negative: Number(rowData.maths_negative) || 0,
            maths: Number(rowData.maths) || 0,
            total_positive:
              Number(rowData.physics_positive) +
                Number(rowData.chemistry_positive) +
                Number(rowData.maths_positive) || 0,
            total_negative:
              Number(rowData.physics_negative) +
                Number(rowData.chemistry_negative) +
                Number(rowData.maths_negative) || 0,
            total:
              Number(rowData.physics) +
                Number(rowData.chemistry) +
                Number(rowData.maths) || 0,
          };
        });

        setJsonData(json);
        generatePrediction(json);
        showNotification({ message: "file Processed." });
      } catch (error) {
        console.error("Error reading the Excel file:", error);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "SN",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 60,
    },
    {
      field: "uniqueId",
      headerName: "DRN",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "category",
      headerName: "Category",
      align: "center",
      headerAlign: "center",
      minWidth: 80,
    },
    {
      field: "pwd",
      headerName: "PWD",
      align: "center",
      headerAlign: "center",
      minWidth: 80,
    },
    {
      field: "physics_positive",
      headerName: "Physics +ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "physics_negative",
      headerName: "Physics -ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "physics",
      headerName: "Physics",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      cellClassName: (params) => {
        if ("isPhysicsQualified" in params.row) {
          return params.row.isPhysicsQualified
            ? "status-success"
            : "status-error";
        }
        return "";
      },
    },
    {
      field: "chemistry_positive",
      headerName: "chemistry +ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chemistry_negative",
      headerName: "chemistry -ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chemistry",
      headerName: "chemistry ",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      cellClassName: (params) => {
        if ("isChemistryQualified" in params.row) {
          return params.row.isChemistryQualified
            ? "status-success"
            : "status-error";
        }
        return "";
      },
    },
    {
      field: "maths_positive",
      headerName: "maths +ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "maths_negative",
      headerName: "maths -ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "maths",
      headerName: "maths ",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      cellClassName: (params) => {
        if ("isMathsQualified" in params.row) {
          return params.row.isMathsQualified
            ? "status-success"
            : "status-error";
        }
        return "";
      },
    },
    {
      field: "total_positive",
      headerName: "total +ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "total_negative",
      headerName: "total -ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "total",
      headerName: "total ",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      cellClassName: (params) => {
        if ("isTotalQualified" in params.row) {
          return params.row.isTotalQualified
            ? "status-success"
            : "status-error";
        }
        return "";
      },
    },
    {
      field: "isQualified",
      headerName: "Q/DNQ",
      renderCell: (params) => (
        <>
          {"isQualified" in params.row
            ? params.row.isQualified
              ? "Q"
              : "DNQ"
            : ""}
        </>
      ),
      align: "center",
      headerAlign: "center",
      cellClassName: (params) => {
        if ("isQualified" in params.row) {
          return params.row.isQualified ? "status-success" : "status-error";
        }
        return "";
      },
    },
    {
      field: "cutoff",
      headerName: "Cut off",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <>
          <Chip
            label={`${params.row.cutoff?.subject ?? "N/A"}/${
              params.row.cutoff?.total ?? "N/A"
            }`}
          />
        </>
      ),
    },
    {
      field: "airRank",
      headerName: "AIR Rank",
      align: "center",
      headerAlign: "center",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "catRank",
      headerName: "CAT Rank",
      align: "center",
      headerAlign: "center",
      flex: 1,
      minWidth: 120,
    },
  ];

  const invisibleColumns = {
    physics_positive: false,
    physics_negative: false,
    chemistry_positive: false,
    chemistry_negative: false,
    maths_positive: false,
    maths_negative: false,
    total_positive: false,
    total_negative: false,
  };

  useEffect(() => {
    generatePrediction(jsonData);
  }, [cutoff]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FileDropZone onDrop={onDrop} acceptedExtensions={[".xlsx"]} />
          <Box
            sx={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              color="success"
              sx={{ border: "1px solid rgba(0,0,0,0.2)" }}
              component="a"
              href="/marksheet.xlsx"
              download // Ensure the file is downloaded
              variant="contained"
              startIcon={<DownloadRounded />}
            >
              Download Template
            </Button>
          </Box>
          <Button
            startIcon={<DownloadRounded />}
            variant="contained"
            sx={{ flexWrap: "none" }}
            onClick={() =>
              downloadJsonToExcel({
                jsonData,
                fileName: "JEE Advanced Analysis.xlsx",
              })
            }
            disabled={jsonData.length === 0}
          >
            Download Analysis
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Accordion sx={{ p: 0, m: 0 }}>
              <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                <Typography>
                  Cutoff Createria :{" "}
                  {cutoff ? (
                    <Chip label={`Year - ${cutoff?.year?.toString()}`} />
                  ) : (
                    "Select Cutoff"
                  )}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CutoffCreateria
                  cutoff={cutoff}
                  setCutoff={setCutoff}
                  weightage={weightage}
                  setWeightage={setWeightage}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                value={subjectMarks.physics}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSubjectMarks((prev) => ({
                    ...prev,
                    physics: e.target.value,
                    chemistry: e.target.value,
                    maths: e.target.value,
                  }))
                }
                type="number"
                label="Subject Mark"
              />
              <TextField
                value={subjectMarks.total}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSubjectMarks((prev) => ({
                    ...prev,
                    total: e.target.value,
                  }))
                }
                type="number"
                label="Total Mark"
              />
              <Button onClick={getAdvancedRank}>Get Rank</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Accordion sx={{ p: 0, m: 0 }}>
        <AccordionSummary expandIcon={<ExpandMoreRounded />}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Qualification Summary</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <SummaryTable
            jsonData={jsonData}
            setScholars={setScholars}
            setShowScholars={setShowScholars}
            summary={summary}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ p: 0, m: 0 }}>
        <AccordionSummary expandIcon={<ExpandMoreRounded />}>
          <Typography variant="h6">Subject Statistics</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SubjectStatistics
            jsonData={jsonData}
            subjects={["physics", "chemistry", "maths", "total"]}
            maxMarks={maxMarksObj}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ p: 0, m: 0 }}>
        <AccordionSummary expandIcon={<ExpandMoreRounded />}>
          <Typography variant="h6">Marks Range Distribution</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SubjectRangeDistribution
            jsonData={jsonData}
            subjects={["physics", "chemistry", "maths", "total"]}
            maxMarks={maxMarksObj}
          />
        </AccordionDetails>
      </Accordion>

      <DataGrid
        sx={{ mt: 2 }}
        aria-label="JEE Advanced Results"
        columns={columns}
        rows={jsonData}
        loading={isLoading}
        slots={{
          toolbar: () => (
            <CustomToolbar showAddButton={false} showExportButton={true} />
          ),
        }}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 30, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          columns: {
            columnVisibilityModel: invisibleColumns,
          },
        }}
      />

      <CustomModal
        open={showScholars}
        onClose={() => {
          setShowScholars(false);
          setScholars([]);
        }}
      >
        <DataGrid
          columns={columns}
          rows={scholars}
          pageSizeOptions={[10, 30, 50]}
          slots={{
            toolbar: () => (
              <CustomToolbar showAddButton={false} showExportButton={true} />
            ),
          }}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            columns: {
              columnVisibilityModel: invisibleColumns,
            },
          }}
        />
      </CustomModal>

      <Loader open={isLoading} />
    </Box>
  );
};

export default JEEAdvancedAnalysis;
