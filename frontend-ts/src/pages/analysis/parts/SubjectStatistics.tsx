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
  Legend,
} from "recharts";

interface DataProps {
  physics: number;
  chemistry: number;
  maths: number;
}

interface SubjectStatisticsProps {
  jsonData: DataProps[];
  subjects: string[];
  maxMarks: { [subject: string]: number };
}

const calculateMean = (numbers: number[]) => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

const calculateMedian = (numbers: number[]) => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
};

const calculateMax = (numbers: number[]) => Math.max(...numbers);
const calculateMin = (numbers: number[]) => Math.min(...numbers);

const SubjectStatistics: React.FC<SubjectStatisticsProps> = ({
  jsonData,
  subjects,
  maxMarks,
}) => {
  const subjectStats = subjects.map((subject) => {
    const subjectKey = subject.toLowerCase() as keyof DataProps;
    const subjectData = jsonData.map((student) => student[subjectKey]);
    const maxMark = maxMarks[subject];
    const mean = calculateMean(subjectData);
    const meanPercentage = (mean / maxMark) * 100;

    return {
      name: subject,
      mean,
      meanPercentage,
      median: calculateMedian(subjectData),
      max: ((calculateMax(subjectData) / maxMark) * 100).toFixed(2),
      min: ((calculateMin(subjectData) / maxMark) * 100).toFixed(2),
    };
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Subject Statistics</Typography>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TableContainer component={Paper}>
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
                    <b>Average %</b>
                  </TableCell>
                  {/* <TableCell align="center">
                    <b>Median</b>
                  </TableCell> */}
                  <TableCell align="center">
                    <b>Topper</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Bottom</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjectStats.map((subject) => (
                  <TableRow key={subject.name}>
                    <TableCell align="center">{subject.name}</TableCell>
                    <TableCell align="center">
                      {subject.mean.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {subject.meanPercentage.toFixed(2)} %
                    </TableCell>
                    {/* <TableCell align="center">
                      {subject.median.toFixed(2)}
                    </TableCell> */}
                    <TableCell align="center">{subject.max} %</TableCell>
                    <TableCell align="center">{subject.min} %</TableCell>
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
              <Bar dataKey="meanPercentage" fill="#3f51b5" name="Average %" />
              <Bar dataKey="max" fill="#4caf50" name="Topper Marks" />
              <Bar dataKey="min" fill="#ff9800" name="Bottom Marks" />
              {/* <Bar dataKey="median" fill="#f44336" name="Median" /> */}
              {/* Add Legend */}
              <Legend
                wrapperStyle={{
                  paddingTop: "8px",
                }}
                payload={[
                  {
                    value: "Average %",
                    type: "square",
                    id: "meanPercentage",
                    color: "#3f51b5",
                  },
                  {
                    value: "Topper Marks",
                    type: "square",
                    id: "max",
                    color: "#4caf50",
                  },
                  {
                    value: "Bottom Marks",
                    type: "square",
                    id: "min",
                    color: "#ff9800",
                  },
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SubjectStatistics;
