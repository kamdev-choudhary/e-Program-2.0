import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
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
  status?: "idle" | "loading" | "fetched";
  error?: string;
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
  mathematics?: string;
  physics?: string;
  chemistry?: string;
  total?: string;
  ntaScoreInWords?: string;
  crlRank?: string;
  genEwsRank?: string;
  obcNclRank?: string;
  scRank?: string;
  stRank?: string;
}

interface ScholarCardProps {
  data: ScholarData | null;
}

const ScholarCard: React.FC<ScholarCardProps> = ({ data }) => {
  if (!data) return <Typography variant="h6">No Data Available</Typography>;

  const {
    drn,
    name,
    application,
    status,
    error,
    rollNumber1,
    rollNumber2,
    candidateName,
    motherName,
    fatherName,
    category,
    personWithDisability,
    gender,
    dateOfBirth,
    stateOfEligibility,
    nationality,
    mathematics,
    physics,
    chemistry,
    total,
    ntaScoreInWords,
    crlRank,
    genEwsRank,
    obcNclRank,
    scRank,
    stRank,
  } = data;

  const chartData = {
    labels: ["Mathematics", "Physics", "Chemistry"],
    datasets: [
      {
        label: "Scores",
        data: [
          mathematics ? parseFloat(mathematics) : 0,
          physics ? parseFloat(physics) : 0,
          chemistry ? parseFloat(chemistry) : 0,
        ],
        backgroundColor: ["#3f51b5", "#ff9800", "#f44336"],
      },
    ],
  };

  return (
    <Card sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Scholar Information
        </Typography>
        <Grid container spacing={2}>
          {(
            [
              ["DRN", drn],
              ["Name", name],
              ["Application", application],
              ["Status", status],
              ["Error", error],
              ["Roll Number 1", rollNumber1],
              ["Roll Number 2", rollNumber2],
              ["Candidate Name", candidateName],
              ["Mother's Name", motherName],
              ["Father's Name", fatherName],
              ["Category", category],
              ["PWD", personWithDisability],
              ["Gender", gender],
              ["DOB", dateOfBirth],
              ["State Eligibility", stateOfEligibility],
              ["Nationality", nationality],
              ["Mathematics", mathematics],
              ["Physics", physics],
              ["Chemistry", chemistry],
              ["Total", total],
              ["NTA Score", ntaScoreInWords],
              ["CRL Rank", crlRank],
              ["GEN EWS Rank", genEwsRank],
              ["OBC NCL Rank", obcNclRank],
              ["SC Rank", scRank],
              ["ST Rank", stRank],
            ] as const
          ).map(([label, value], index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Typography variant="body1">
                <strong>{label}:</strong> {value || "N/A"}
              </Typography>
            </Grid>
          ))}
        </Grid>
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
  );
};

export default ScholarCard;
