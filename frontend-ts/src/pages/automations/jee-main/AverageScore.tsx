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
  Grid2 as Grid,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

interface ScholarData {
  drn: string;
  name: string;
  application: string;
  password?: string;
  status?: "idle" | "loading" | "fetched";
  error: string;
  mathematics?: string;
  physics?: string;
  chemistry?: string;
  total?: string;
}

interface AverageScoreProps {
  jsonData: ScholarData[] | null;
}

// Function to compute the average score for a subject
const calculateAverage = (
  data: ScholarData[],
  subjectKey: keyof ScholarData
): number => {
  const validScores = data
    .map((student) => Number(student[subjectKey]))
    .filter((score) => !isNaN(score));

  if (validScores.length === 0) return 0;

  const sum = validScores.reduce((acc, score) => acc + score, 0);
  return parseFloat((sum / validScores.length).toFixed(2)); // Round to 2 decimal places
};

const AverageScore: React.FC<AverageScoreProps> = ({ jsonData }) => {
  if (!jsonData || jsonData.length === 0) {
    return null;
  }

  const subjects = ["mathematics", "physics", "chemistry", "total"] as const;

  const averages = subjects.map((subject) => ({
    subject,
    average: calculateAverage(jsonData, subject),
  }));

  const chartData = {
    labels: subjects.map(
      (subject) => subject.charAt(0).toUpperCase() + subject.slice(1)
    ),
    datasets: [
      {
        label: "Average Score",
        data: averages.map(({ average }) => average),
        backgroundColor: [
          "rgba(75,192,192,0.6)",
          "rgba(255,99,132,0.6)",
          "rgba(255,206,86,0.6)",
          "rgba(153,102,255,0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Average Score per Subject
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Subject</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Average Score</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {averages.map(({ subject, average }) => (
                  <TableRow key={subject}>
                    <TableCell>
                      {subject.charAt(0).toUpperCase() + subject.slice(1)}
                    </TableCell>
                    <TableCell>{average}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AverageScore;
