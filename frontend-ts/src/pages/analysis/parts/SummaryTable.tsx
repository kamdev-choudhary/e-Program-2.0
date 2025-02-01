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
} from "@mui/material";
import { motion } from "framer-motion";
import { captureElementAsPNG } from "../../../utils/caputureAsPNG";
import { ScreenshotRounded } from "@mui/icons-material";

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
          <ScreenshotRounded />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 0 }}>
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
            (summary && summary?.didNotQualified?.length / jsonData?.length) *
            100
          ).toFixed(2)}%)`}
        />
      </Box>
      <Divider />
      <TableContainer>
        <Table size="small">
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
            {["physics", "chemistry", "maths", "total"].map((subject) => (
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
                    label={
                      summary[`${subject}Qualified` as keyof SummaryProps]
                        .length
                    }
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
                    label={
                      summary[`${subject}DidNotQualified` as keyof SummaryProps]
                        .length
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    color={
                      (summary[`${subject}Qualified` as keyof SummaryProps]
                        .length /
                        (summary[`${subject}Qualified` as keyof SummaryProps]
                          .length +
                          summary[
                            `${subject}DidNotQualified` as keyof SummaryProps
                          ].length)) *
                        100 >
                      75
                        ? "success"
                        : "error"
                    }
                    label={(
                      (summary[`${subject}Qualified` as keyof SummaryProps]
                        .length /
                        (summary[`${subject}Qualified` as keyof SummaryProps]
                          .length +
                          summary[
                            `${subject}DidNotQualified` as keyof SummaryProps
                          ].length)) *
                      100
                    ).toFixed(2)}
                  />
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SummaryTable;
