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
  Grid as MuiGrid,
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

// Function to compute the average, min, and max scores for a subject
const computeStats = (
  data: ScholarData[],
  subjectKey: keyof ScholarData
): { average: number; min: number; max: number } => {
  const validScores = data
    .map((student) => Number(student[subjectKey]))
    .filter((score) => !isNaN(score));

  if (validScores.length === 0) return { average: 0, min: 0, max: 0 };

  const sum = validScores.reduce((acc, score) => acc + score, 0);
  return {
    average: parseFloat((sum / validScores.length).toFixed(2)),
    min: Math.min(...validScores),
    max: Math.max(...validScores),
  };
};

const AverageScore: React.FC<AverageScoreProps> = ({ jsonData }) => {
  if (!jsonData || jsonData.length === 0) {
    return null;
  }

  const subjects = ["mathematics", "physics", "chemistry", "total"] as const;

  const stats = subjects.map((subject) => ({
    subject,
    ...computeStats(jsonData, subject),
  }));

  const chartData = {
    labels: subjects.map(
      (subject) => subject.charAt(0).toUpperCase() + subject.slice(1)
    ),
    datasets: [
      {
        label: "Average Score",
        data: stats.map(({ average }) => average),
        backgroundColor: "rgba(75,192,192,0.6)",
        borderWidth: 1,
      },
      {
        label: "Min Score",
        data: stats.map(({ min }) => min),
        backgroundColor: "rgba(255,99,132,0.6)",
        borderWidth: 1,
      },
      {
        label: "Max Score",
        data: stats.map(({ max }) => max),
        backgroundColor: "rgba(255,206,86,0.6)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Score Statistics per Subject
      </Typography>
      <MuiGrid container spacing={2} sx={{ mb: 2 }}>
        <MuiGrid item xs={12} md={6}>
          <Paper>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom" },
                  title: { display: true, text: "Scores Statistics" },
                },
              }}
            />
          </Paper>
        </MuiGrid>
        <MuiGrid item xs={12} md={6}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Subject</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Average Score</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Min Score</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Max Score</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.map(({ subject, average, min, max }) => (
                  <TableRow key={subject}>
                    <TableCell>
                      {subject.charAt(0).toUpperCase() + subject.slice(1)}
                    </TableCell>
                    <TableCell>{average}</TableCell>
                    <TableCell>{min}</TableCell>
                    <TableCell>{max}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MuiGrid>
      </MuiGrid>
    </Paper>
  );
};

export default AverageScore;
