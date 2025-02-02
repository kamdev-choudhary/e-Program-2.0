import {
  Box,
  Button,
  Grid2 as Grid,
  IconButton,
  Paper,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import FileDropZone from "../../components/FileDropZone";
import CustomDropDown from "../../components/CustomDropDown";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ExcelJs from "exceljs";
import {
  DownloadRounded,
  InfoRounded,
  RefreshRounded,
} from "@mui/icons-material";
import axios from "../../hooks/AxiosInterceptor";
import { CustomModal } from "../../components/CustomModal";
import { CustomToolbar } from "../../components/CustomToolbar";
import { downloadJsonToExcel } from "../../utils/commonfs";
import { motion } from "framer-motion";
import SummaryTable from "./parts/SummaryTable";
import SubjectRangeDistribution from "./parts/SubjectRangeDistribution";
import Loader from "../../components/Loader";
import CutoffCreateria from "./parts/CutoffCreateria";

interface AdjustedScores {
  physics?: number;
  chemistry?: number;
  maths?: number;
  total?: number;
}

interface CutOff {
  subject?: number;
  total?: number;
}

interface DataProps {
  id?: string;
  name: string;
  uniqueId: string;
  category: "general" | "obc" | "st" | "sc" | "sc";
  pwd: "yes" | "no";
  physics_positive?: number;
  physics_negative?: number;
  physics: number;
  chemistry_positive?: number;
  chemistry_negative?: number;
  chemistry: number;
  maths_positive?: number;
  maths_negative?: number;
  maths: number;
  total_positive?: number;
  total_negative?: number;
  total: number;
  percetile?: number;
  rank?: number;
  isPhysicsQualified?: boolean;
  isChemistryQualified?: boolean;
  isMathsQualified?: boolean;
  isTotalQualified?: boolean;
  adjustedScores?: AdjustedScores;
  cutoff?: CutOff;
}

interface SummaryProps {
  physicsQualified: DataProps[];
  chemistryQualified: DataProps[];
  mathsQualified: DataProps[];
  totalQualified: DataProps[];
  physicsDidNotQualified: DataProps[];
  chemistryDidNotQualified: DataProps[];
  mathsDidNotQualified: DataProps[];
  totalDidNotQualified: DataProps[];
  qualified: DataProps[];
  didNotQualified: DataProps[];
}

const years = [{ name: "2024", value: "2024" }];

interface CategoryProp {
  subject: number;
  total: number;
}

interface CutoffDataProps {
  _id: string;
  general: CategoryProp;
  ews: CategoryProp;
  obc: CategoryProp;
  st: CategoryProp;
  sc: CategoryProp;
  generalPwD: CategoryProp;
  ewsPwD: CategoryProp;
  obcPwD: CategoryProp;
  stPwD: CategoryProp;
  scPwD: CategoryProp;
  preparatory: CategoryProp;
}

const JEEAdvancedAnalysis: React.FC = () => {
  const [weightage, setWieghtage] = useState<string>("1");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [jsonData, setJsonData] = useState<DataProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<SummaryProps | null>(null);
  const [cutoff, setCutoff] = useState<CutoffDataProps | null>(null);
  const [showScholars, setShowScholars] = useState<boolean>(false);
  const [showCutoff, setShowCutoff] = useState<boolean>(false);
  const [scholars, setScholars] = useState<DataProps[]>([]);
  const [subjectMarks, setSubjectMarks] = useState({
    physics: "120",
    chemistry: "120",
    maths: "120",
    total: "360",
  });

  // Memoized subjects and max marks
  const subjects = useMemo(
    () => ["physics", "chemistry", "maths", "total"],
    []
  );
  const maxMarksArray = useMemo(
    () => [
      Number(subjectMarks.physics),
      Number(subjectMarks.chemistry),
      Number(subjectMarks.maths),
      Number(subjectMarks.total),
    ],
    [subjectMarks]
  );

  const getCutoff = useCallback(async () => {
    try {
      const res = await axios.get("/analysis/cutoff/jeeadvanced", {
        params: { year: selectedYear },
      });
      setCutoff(res.data.data);
    } catch (error) {
      console.error(error);
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedYear) getCutoff();
  }, [selectedYear, getCutoff]);

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

          const adjustedScores: AdjustedScores = {
            physics: student.physics * Number(weightage),
            chemistry: student.chemistry * Number(weightage),
            maths: student.maths * Number(weightage),
            total: student.total * Number(weightage),
          };

          const isPhysicsQualified =
            adjustedScores.physics! >= categoryCutoff.subject;
          const isChemistryQualified =
            adjustedScores.chemistry! >= categoryCutoff.subject;
          const isMathsQualified =
            adjustedScores.maths! >= categoryCutoff.subject;
          const isTotalQualified =
            adjustedScores.total! >= categoryCutoff.total;

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
            adjustedScores,
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
            physics_positive: rowData.physics_positive || 0,
            physics_negative: rowData.physics_negative || 0,
            physics: rowData.physics || 0,
            chemistry_positive: rowData.chemistry_positive || 0,
            chemistry_negative: rowData.chemistry_negative || 0,
            chemistry: rowData.chemistry || 0,
            maths_positive: rowData.maths_positive || 0,
            maths_negative: rowData.maths_negative || 0,
            maths: rowData.maths || 0,
            total_positive:
              rowData.physics_positive +
                rowData.chemistry_positive +
                rowData.maths_positive || 0,
            total_negative:
              rowData.physics_negative +
                rowData.chemistry_negative +
                rowData.maths_negative || 0,
            total: rowData.physics + rowData.chemistry + rowData.maths || 0,
          };
        });

        setJsonData(json);
        generatePrediction(json);
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
          return params.row.isPhysicsQualified ? "high-score" : "low-score";
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
          return params.row.isChemistryQualified ? "high-score" : "low-score";
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
          return params.row.isMathsQualified ? "high-score" : "low-score";
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
          return params.row.isTotalQualified ? "high-score" : "low-score";
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
          return params.row.isQualified ? "high-score" : "low-score";
        }
        return "";
      },
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

  const rows = useMemo(() => {
    return jsonData;
  }, [jsonData]);

  useEffect(() => {
    generatePrediction(jsonData);
  }, [selectedYear, weightage]);

  const shouldShowSummary = useMemo(
    () => summary && jsonData.length > 0,
    [summary, jsonData]
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexWrap: "wrap",
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
              href="/marksheet.xlsx" // Link to the file in the public folder
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
        <Box sx={{ display: "flex", gap: 2, flex: 1, flexWrap: "wrap" }}>
          <Box sx={{ maxWidth: 350, flexGrow: 1 }}>
            <CustomDropDown
              value={selectedYear}
              onChange={(e: SelectChangeEvent) =>
                setSelectedYear(e.target.value)
              }
              label="Select Year"
              data={years}
              name="name"
              dropdownValue="value"
              error={!cutoff}
              showClearButton={false}
            />
          </Box>
          <IconButton onClick={() => setShowCutoff(true)}>
            <InfoRounded />
          </IconButton>
          <TextField
            value={weightage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWieghtage(e.target.value)
            }
            label="Weightage"
            type="number"
          />
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
              setSubjectMarks((prev) => ({ ...prev, total: e.target.value }))
            }
            type="number"
            label="Total Mark"
          />
          <Button
            disabled={!selectedYear || jsonData.length === 0}
            onClick={() => generatePrediction(jsonData)}
            variant="contained"
            startIcon={<RefreshRounded />}
            color="success"
          >
            Regenerate
          </Button>
        </Box>
      </Paper>
      {shouldShowSummary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <SubjectRangeDistribution
                jsonData={jsonData}
                subjects={subjects}
                maxMarks={maxMarksArray}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <SummaryTable
                jsonData={jsonData}
                setScholars={setScholars}
                setShowScholars={setShowScholars}
                summary={summary}
              />
            </Grid>
          </Grid>
        </motion.div>
      )}

      <DataGrid
        columns={columns}
        rows={rows}
        loading={isLoading}
        slots={{ toolbar: () => <CustomToolbar showAddButton={false} /> }}
        pageSizeOptions={[10, 30, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          columns: {
            columnVisibilityModel: {
              physics_positive: false,
              physics_negative: false,
              chemistry_positive: false,
              chemistry_negative: false,
              maths_positive: false,
              maths_negative: false,
              total_positive: false,
              total_negative: false,
            },
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
          slots={{ toolbar: () => <CustomToolbar showAddButton={false} /> }}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            columns: {
              columnVisibilityModel: {
                id: false,
                physics_positive: false,
                physics_negative: false,
                chemistry_positive: false,
                chemistry_negative: false,
                maths_positive: false,
                maths_negative: false,
                total_positive: false,
                total_negative: false,
                status: false,
              },
            },
          }}
        />
      </CustomModal>

      {/* Cutoff */}
      <CustomModal
        open={showCutoff}
        onClose={() => setShowCutoff(false)}
        showHeader={false}
      >
        <CutoffCreateria
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          cutoff={cutoff}
          setCutoff={setCutoff}
        />
      </CustomModal>
      <Loader open={isLoading} />
    </Box>
  );
};

export default JEEAdvancedAnalysis;
