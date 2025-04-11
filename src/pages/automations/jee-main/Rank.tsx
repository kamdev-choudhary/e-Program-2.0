import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import { VisibilityRounded } from "@mui/icons-material";

interface ScholarData {
  drn: string;
  name: string;
  application: string;
  password?: string;
  status?: "idle" | "loading" | "success";
  error: string;
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

interface RankProps {
  jsonData: ScholarData[] | null;
  handleShowScholarCard: (value: ScholarData) => void;
}

const rankCategories: { key: keyof ScholarData; label: string }[] = [
  { key: "crlRank", label: "CRL" },
  { key: "genEwsRank", label: "GEN-EWS" },
  { key: "obcNclRank", label: "OBC-NCL" },
  { key: "scRank", label: "SC" },
  { key: "stRank", label: "ST" },
  { key: "crlPwDRank", label: "CRL-PwD" },
  { key: "genEwsPwDRank", label: "GEN-EWS-PwD" },
  { key: "obcNclPwDRank", label: "OBC-NCL-PwD" },
  { key: "scPwDRank", label: "SC-PwD" },
  { key: "stPwDRank", label: "ST-PwD" },
];

const getMinRankStudent = (
  data: ScholarData[],
  rankKey: keyof ScholarData
): ScholarData | null => {
  return data
    .filter((student) => student[rankKey] && !isNaN(Number(student[rankKey])))
    .reduce(
      (min, student) =>
        min && Number(min[rankKey]) < Number(student[rankKey]) ? min : student,
      null as ScholarData | null
    );
};

const Rank: React.FC<RankProps> = ({ jsonData, handleShowScholarCard }) => {
  if (!jsonData || jsonData.length === 0) {
    return null;
  }

  const minRankStudents = rankCategories.map(({ key, label }) => {
    const student = getMinRankStudent(jsonData, key);
    return {
      category: label,
      student,
      rank: student ? student[key] : "N/A",
    };
  });

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6">Minimum Rank Students by Category</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Category</strong>
            </TableCell>
            <TableCell>
              <strong>Name</strong>
            </TableCell>
            <TableCell>
              <strong>Gender</strong>
            </TableCell>
            <TableCell>
              <strong>Disability</strong>
            </TableCell>
            <TableCell>
              <strong>Rank</strong>
            </TableCell>
            <TableCell>
              <strong>Total </strong>
            </TableCell>
            <TableCell>
              <strong>View</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {minRankStudents.map(({ category, student, rank }) =>
            student ? (
              <TableRow key={category}>
                <TableCell>{category}</TableCell>
                <TableCell>
                  {student.name || student.candidateName || "N/A"}
                </TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>{student.personWithDisability}</TableCell>
                <TableCell>{rank}</TableCell>
                <TableCell>{student.total}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleShowScholarCard(student)}>
                    <VisibilityRounded />
                  </IconButton>
                </TableCell>
              </TableRow>
            ) : null
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Rank;
