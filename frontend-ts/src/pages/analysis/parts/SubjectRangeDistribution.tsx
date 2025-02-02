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
  IconButton,
  Box,
} from "@mui/material";
import { captureElementAsPNG } from "../../../utils/caputureAsPNG";
import { PhotoCameraRounded } from "@mui/icons-material";

interface DataProps {
  physics: number;
  chemistry: number;
  maths: number;
}

interface SubjectRangeDistributionProps {
  jsonData: DataProps[];
  subjects: string[];
  // Changed maxMarks from array to object mapping subject names to their max marks
  maxMarks: { [subject: string]: number };
}

const SubjectRangeDistribution: React.FC<SubjectRangeDistributionProps> = ({
  jsonData,
  subjects,
  maxMarks,
}) => {
  // Define percentage range labels
  const percentageRanges = [
    "0-10%",
    "10-20%",
    "20-30%",
    "30-40%",
    "40-50%",
    "50-60%",
    "60-70%",
    "70-80%",
    "80-90%",
    "90-100%",
  ];

  // Function to calculate range distribution
  const calculateRangeDistribution = (
    subjectData: number[],
    maxMark: number
  ) => {
    const ranges = Array(10).fill(0); // Array of 10 buckets for each range

    subjectData.forEach((marks) => {
      const percentage = (marks / maxMark) * 100;
      const index = Math.min(Math.floor(percentage / 10), 9); // Ensure within 0-9 range
      ranges[index]++;
    });

    return ranges;
  };

  // Compute range data for all subjects
  const subjectRangeData = subjects.map((subject) => {
    // Convert subject name to lower case to match the keys in DataProps and maxMarks
    const subjectKey = subject.toLowerCase();
    const subjectData = jsonData.map(
      (student) => student[subjectKey as keyof DataProps]
    );
    const maxMark = maxMarks[subjectKey];
    return {
      name: subject,
      ranges: calculateRangeDistribution(subjectData, maxMark),
    };
  });

  return (
    <Paper id="range-map" sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Marks Range Distribution</Typography>
        <IconButton
          size="small"
          onClick={() => captureElementAsPNG("range-map", "capture.png")}
        >
          <PhotoCameraRounded />
        </IconButton>
      </Box>
      <Divider sx={{ my: 2 }} />
      <div>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <b>Range</b>
                </TableCell>
                {subjects.map((subject) => (
                  <TableCell align="center" key={subject}>
                    <b>{subject.toUpperCase()}</b>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {percentageRanges.map((range, rangeIndex) => (
                <TableRow key={range}>
                  <TableCell sx={{ minWidth: 120 }} align="center">
                    {range}
                  </TableCell>
                  {subjectRangeData.map((subject) => (
                    <TableCell align="center" key={subject.name}>
                      {subject.ranges[rangeIndex]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Paper>
  );
};

export default SubjectRangeDistribution;
