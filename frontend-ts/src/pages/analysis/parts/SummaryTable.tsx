import React from "react";
import {
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Grid2 as Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { captureElementAsPNG } from "../../../utils/caputureAsPNG";
import { PhotoCameraRounded } from "@mui/icons-material";

// Recharts imports
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

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

interface SummaryTableProps {
  jsonData: DataProps[];
  setScholars: (value: any) => void;
  summary: SummaryProps | null;
  setShowScholars: (value: boolean) => void;
}

const SummaryTable: React.FC<SummaryTableProps> = ({
  jsonData,
  setScholars,
  summary,
  setShowScholars,
}) => {
  if (!summary) {
    return <Box>Summary Not Generated</Box>;
  }

  // Function to render half pie chart
  const renderPieChart = (qualifiedCount: number, dnqCount: number) => {
    const data = [
      { name: "Qualified", value: qualifiedCount },
      { name: "Not Qualified", value: dnqCount },
    ];

    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="70%"
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            paddingAngle={5}
            fill="#8884d8"
            style={{ paddingTop: 0 }}
          >
            <Cell fill="#00C853" />
            <Cell fill="#F44336" />
          </Pie>
          <Legend verticalAlign="bottom" align="center" iconSize={14} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Paper
      id="summary-table"
      sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Qualification Summary</Typography>
        <IconButton
          size="small"
          onClick={() => captureElementAsPNG("summary-table", "Summary.png")}
        >
          <PhotoCameraRounded />
        </IconButton>
      </Box>
      <Divider />
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 0,
              flexWrap: "wrap",
              gap: 2,
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Chip label={`Total: ${jsonData.length}`} />
            <Chip
              color="success"
              label={`Qualified: ${summary?.qualified?.length} (${(
                (summary && summary?.qualified?.length / jsonData?.length) * 100
              ).toFixed(2)}%)`}
            />
            <Chip
              color="error"
              label={`DNQ: ${summary?.didNotQualified?.length} (${(
                (summary &&
                  summary?.didNotQualified?.length / jsonData?.length) * 100
              ).toFixed(2)}%)`}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {renderPieChart(
            summary?.qualified?.length,
            summary?.didNotQualified?.length
          )}
        </Grid>
      </Grid>

      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <b>Category</b>
              </TableCell>
              <TableCell align="center">
                <b>Qualified</b>
              </TableCell>
              <TableCell align="center">
                <b>Not Qualified</b>
              </TableCell>
              <TableCell align="center">
                <b>Qualifying %</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {["physics", "chemistry", "maths", "total"].map((subject) => {
              const qualifiedCount =
                summary[`${subject}Qualified` as keyof SummaryProps].length;
              const dnqCount =
                summary[`${subject}DidNotQualified` as keyof SummaryProps]
                  .length;

              return (
                <motion.tr
                  key={subject}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: 0.1,
                  }}
                >
                  <TableCell align="center">
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      sx={{ minWidth: 65 }}
                      onClick={() => {
                        setScholars(
                          summary[`${subject}Qualified` as keyof SummaryProps]
                        );
                        setShowScholars(true);
                      }}
                      label={qualifiedCount}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      sx={{ minWidth: 65 }}
                      onClick={() => {
                        setScholars(
                          summary[
                            `${subject}DidNotQualified` as keyof SummaryProps
                          ]
                        );
                        setShowScholars(true);
                      }}
                      label={dnqCount}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      color={
                        (qualifiedCount / (qualifiedCount + dnqCount)) * 100 >
                        75
                          ? "success"
                          : "error"
                      }
                      label={(
                        (qualifiedCount / (qualifiedCount + dnqCount)) *
                        100
                      ).toFixed(2)}
                    />
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SummaryTable;
