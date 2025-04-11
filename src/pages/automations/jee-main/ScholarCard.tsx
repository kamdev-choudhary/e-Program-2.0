import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid2 as MuiGrid,
  Divider,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

interface ScholarCardProps {
  data: ScholarData | null;
}

const ScholarCard: React.FC<ScholarCardProps> = ({ data }) => {
  if (!data) return <Typography variant="h6">No Data Available</Typography>;

  const chartData = {
    labels: ["Mathematics", "Physics", "Chemistry"],
    datasets: [
      {
        label: "Scores",
        data: [
          data.mathematics ? parseFloat(data.mathematics) : 0,
          data.physics ? parseFloat(data.physics) : 0,
          data.chemistry ? parseFloat(data.chemistry) : 0,
        ],
        backgroundColor: ["#3f51b5", "#ff9800", "#f44336"],
      },
    ],
  };

  const renderCard = (
    title: string,
    fields: [string, string | undefined][]
  ) => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <MuiGrid container spacing={2}>
          {fields.map(([label, value], index) => (
            <MuiGrid size={{ xs: 12, md: 6 }} key={index}>
              <Typography variant="body1">
                <strong>{label}:</strong> {value || "N/A"}
              </Typography>
            </MuiGrid>
          ))}
        </MuiGrid>
      </CardContent>
    </Card>
  );

  return (
    <MuiGrid
      container
      spacing={2}
      sx={{ maxWidth: 800, margin: "auto", padding: 2 }}
    >
      <MuiGrid size={{ xs: 12 }}>
        {renderCard("Basic Information", [
          ["DRN", data.drn],
          ["Name", data.name],
          ["Application", data.application],
          ["Status", data.status],
          ["Error", data.error],
          ["Roll Number 1", data.rollNumber1],
          ["Roll Number 2", data.rollNumber2],
          ["Candidate Name", data.candidateName],
          ["Mother's Name", data.motherName],
          ["Father's Name", data.fatherName],
          ["Category", data.category],
          ["PWD", data.personWithDisability],
          ["Gender", data.gender],
          ["DOB", data.dateOfBirth],
          ["State Eligibility", data.stateOfEligibility],
          ["Nationality", data.nationality],
        ])}
      </MuiGrid>

      <MuiGrid size={{ xs: 12 }}>
        <TableContainer component={Paper}>
          <Typography variant="h6" gutterBottom>
            Marks
          </Typography>
          <Divider />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>Session 1</TableCell>
                <TableCell>Session 2</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Maths</TableCell>
                <TableCell>{data.mathematics1}</TableCell>
                <TableCell>{data.mathematics2}</TableCell>
                <TableCell>{data.mathematics}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Physics</TableCell>
                <TableCell>{data.physics1}</TableCell>
                <TableCell>{data.physics2}</TableCell>
                <TableCell>{data.physics}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Chemistry</TableCell>
                <TableCell>{data.chemistry1}</TableCell>
                <TableCell>{data.chemistry2}</TableCell>
                <TableCell>{data.chemistry}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>{data.total1}</TableCell>
                <TableCell>{data.total2}</TableCell>
                <TableCell>{data.total}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </MuiGrid>

      <MuiGrid size={{ xs: 12 }}>
        {renderCard("Ranks", [
          ["CRL Rank", data.crlRank],
          ["GEN EWS Rank", data.genEwsRank],
          ["OBC NCL Rank", data.obcNclRank],
          ["SC Rank", data.scRank],
          ["ST Rank", data.stRank],
          ["CRL PWD Rank", data.crlPwDRank],
          ["Gen-EWS PWD Rank", data.genEwsPwDRank],
          ["OBC-NCL PWD Rank", data.obcNclPwDRank],
          ["SC PWD Rank", data.scPwDRank],
          ["ST PWD Rank", data.stPwDRank],
        ])}
      </MuiGrid>

      <MuiGrid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Score Distribution
            </Typography>
            <div style={{ marginTop: 20, maxHeight: 300 }}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </MuiGrid>
    </MuiGrid>
  );
};

export default ScholarCard;
