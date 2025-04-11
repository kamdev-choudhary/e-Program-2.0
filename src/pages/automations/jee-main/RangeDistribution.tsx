import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Grid2 as Grid,
  Box,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

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

interface RangeDistributionProps {
  jsonData: ScholarData[] | null;
}

const scoreRanges = [
  { min: 0.0, max: 39.99, label: "0 - 39.99" },
  { min: 40.0, max: 59.0, label: "40.00 - 59.00" },
  { min: 60.0, max: 69.99, label: "60.00 - 69.99" },
  { min: 70.0, max: 79.0, label: "70.00 - 79.00" },
  { min: 80.0, max: 84.99, label: "80.00 - 84.99" },
  { min: 85.0, max: 89.99, label: "85.00 - 89.99" },
  { min: 90.0, max: 94.99, label: "90.00 - 94.99" },
  { min: 95.0, max: 97.99, label: "95.00 - 97.99" },
  { min: 98.0, max: 98.99, label: "98.00 - 98.99" },
  { min: 99.0, max: 100.0, label: "99.00 - 100.00" },
];

// Function to compute distribution
const calculateDistribution = (
  data: ScholarData[],
  subjectKey: keyof ScholarData
) => {
  const distribution = new Array(scoreRanges.length).fill(0);

  data.forEach((student) => {
    const score = Number(student[subjectKey]);
    if (!isNaN(score)) {
      for (let i = 0; i < scoreRanges.length; i++) {
        if (score >= scoreRanges[i].min && score <= scoreRanges[i].max) {
          distribution[i]++;
          break;
        }
      }
    }
  });

  return distribution;
};

// Function to filter students by range
const filterStudentsByRange = (
  data: ScholarData[],
  subjectKey: keyof ScholarData,
  rangeIndex: number
) => {
  return data.filter((student) => {
    const score = Number(student[subjectKey]);
    return (
      !isNaN(score) &&
      score >= scoreRanges[rangeIndex].min &&
      score <= scoreRanges[rangeIndex].max
    );
  });
};

const RangeDistribution: React.FC<RangeDistributionProps> = ({ jsonData }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<ScholarData[]>([]);
  const [selectedRangeLabel, setSelectedRangeLabel] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  if (!jsonData || jsonData.length === 0) {
    return null;
  }

  const subjects = ["mathematics", "physics", "chemistry", "total"] as const;

  const subjectDistributions = subjects.map((subject) => ({
    subject,
    distribution: calculateDistribution(jsonData, subject),
  }));

  const chartData = {
    labels: scoreRanges.map((range) => range.label),
    datasets: subjectDistributions.map(({ subject, distribution }) => ({
      label: subject.charAt(0).toUpperCase() + subject.slice(1),
      data: distribution,
      borderColor:
        subject === "mathematics"
          ? "rgba(75,192,192,1)"
          : subject === "physics"
          ? "rgba(255,99,132,1)"
          : subject === "chemistry"
          ? "rgba(255,206,86,1)"
          : "rgba(153,102,255,1)",
      borderWidth: 2,
      fill: false, // No area fill
      pointRadius: 4, // Add points for better visibility
      tension: 0.3, // Smooth curves
    })),
  };

  // Handle cell click
  const handleCellClick = (subject: string, rangeIndex: number) => {
    const studentsInRange = filterStudentsByRange(
      jsonData,
      subject as keyof ScholarData,
      rangeIndex
    );
    setSelectedStudents(studentsInRange);
    setSelectedRangeLabel(scoreRanges[rangeIndex].label);
    setSelectedSubject(subject.charAt(0).toUpperCase() + subject.slice(1));
    setOpenModal(true);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Percentile Range Distribution
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component={Paper}
            sx={{ height: "100%", display: "flex", flexGrow: 1 }}
          >
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom" },
                  title: { text: "Range Distribution", display: true },
                },
                elements: { line: { tension: 0.3 } },
              }}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong> Range</strong>
                  </TableCell>
                  {subjects.map((subject) => (
                    <TableCell key={subject}>
                      <strong>
                        {subject.charAt(0).toUpperCase() + subject.slice(1)}
                      </strong>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {scoreRanges.map((range, index) => (
                  <TableRow key={range.label}>
                    <TableCell>{range.label}</TableCell>
                    {subjectDistributions.map(({ subject, distribution }) => (
                      <TableCell
                        key={subject}
                        sx={{
                          cursor: "pointer",
                        }}
                        onClick={() => handleCellClick(subject, index)}
                      >
                        <Chip
                          label={distribution[index]}
                          sx={{ minWidth: 70 }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Modal for showing students */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>
          Students in {selectedSubject} ({selectedRangeLabel})
        </DialogTitle>
        <DialogContent>
          {selectedStudents.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>DRN</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Mathematics</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Physics</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Chemistry</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Total Marks</strong>
                    </TableCell>
                    <TableCell>
                      <strong>CRL Rank</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Gen EWS Rank</strong>
                    </TableCell>
                    <TableCell>
                      <strong>OBC Rank</strong>
                    </TableCell>
                    <TableCell>
                      <strong>SC Rank</strong>
                    </TableCell>
                    <TableCell>
                      <strong>ST Rank</strong>
                    </TableCell>
                    <TableCell>
                      <strong>CRL-PwD Rank</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Gen-EWS-PwD Rank</strong>
                    </TableCell>
                    <TableCell>
                      <strong>OBC-PwD Rank</strong>
                    </TableCell>
                    <TableCell>
                      <strong>SC-PwD Rank</strong>
                    </TableCell>
                    <TableCell>
                      <strong>ST-PwD Rank</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedStudents.map((student) => (
                    <TableRow key={student.drn}>
                      <TableCell>{student.drn}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.mathematics || "N/A"}</TableCell>
                      <TableCell>{student.physics || "N/A"}</TableCell>
                      <TableCell>{student.chemistry || "N/A"}</TableCell>
                      <TableCell>{student.total || "N/A"}</TableCell>
                      <TableCell>{student.crlRank || "N/A"}</TableCell>
                      <TableCell>{student.genEwsRank || "N/A"}</TableCell>
                      <TableCell>{student.obcNclRank || "N/A"}</TableCell>
                      <TableCell>{student.scRank || "N/A"}</TableCell>
                      <TableCell>{student.stRank || "N/A"}</TableCell>
                      <TableCell>{student.crlPwDRank || "N/A"}</TableCell>
                      <TableCell>{student.genEwsPwDRank || "N/A"}</TableCell>
                      <TableCell>{student.obcNclPwDRank || "N/A"}</TableCell>
                      <TableCell>{student.scPwDRank || "N/A"}</TableCell>
                      <TableCell>{student.stPwDRank || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No students in this range.</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default RangeDistribution;
