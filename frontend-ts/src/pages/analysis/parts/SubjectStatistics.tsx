import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Paper,
  Divider,
  Grid2 as Grid,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataProps {
  physics: number;
  chemistry: number;
  maths: number;
}

interface SubjectStatisticsProps {
  jsonData: DataProps[];
  subjects: string[];
}

const calculateMean = (numbers: number[]) => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
};

const calculateMedian = (numbers: number[]) => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
};

const SubjectStatistics: React.FC<SubjectStatisticsProps> = ({
  jsonData,
  subjects,
}) => {
  const subjectStats = subjects.map((subject) => {
    const subjectData = jsonData.map(
      (student) => student[subject.toLowerCase() as keyof DataProps]
    );
    return {
      name: subject,
      mean: calculateMean(subjectData),
      median: calculateMedian(subjectData),
    };
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Subject Statistics</Typography>
      <Divider sx={{ my: 2 }} />
      <Grid container>
        <Grid size={{ xs: 12, md: 6 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <b>Subject</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Average</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Median</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjectStats.map((subject) => (
                  <TableRow key={subject.name}>
                    <TableCell align="center">{subject.name}</TableCell>
                    <TableCell align="center">{subject.mean}</TableCell>
                    <TableCell align="center">{subject.median}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectStats}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="mean" fill="#3f51b5" name="Mean" />
              <Bar dataKey="median" fill="#f44336" name="Median" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SubjectStatistics;
