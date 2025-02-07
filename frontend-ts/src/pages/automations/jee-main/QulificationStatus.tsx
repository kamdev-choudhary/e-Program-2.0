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
  Grid2 as Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
} from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

interface ScholarData {
  drn: string;
  name: string;
  category?: string;
  personWithDisability?: string;
  total?: string;
}

interface QualificationStatusProps {
  jsonData: ScholarData[] | null;
}

// Cutoff marks for each category
const categoryCutoffs: Record<string, number> = {
  GEN: 93.2362181,
  "GEN-EWS": 81.3266412,
  "OBC-NCL": 79.6757881,
  SC: 60.0923182,
  ST: 46.697584,
  PwD: 0.00187,
};

// Function to determine if a student is qualified
const isQualified = (
  category: string | undefined,
  personWithDisability: string | undefined,
  total: string | undefined
): boolean => {
  if (!category || !total) return false;
  const score = Number(total);
  let cutoff = Infinity;
  if (personWithDisability && personWithDisability.toLowerCase() === "yes") {
    cutoff = categoryCutoffs["PwD"] ?? Infinity;
  } else {
    cutoff = categoryCutoffs[category] ?? Infinity;
  }
  return score >= cutoff;
};

// Helper to determine the effective category for grouping
const getEffectiveCategory = (scholar: ScholarData): string => {
  if (
    scholar.personWithDisability &&
    scholar.personWithDisability.toLowerCase() === "yes"
  ) {
    return "PwD";
  }
  return scholar.category || "Unknown";
};

const QualificationStatus: React.FC<QualificationStatusProps> = ({
  jsonData,
}) => {
  if (!jsonData || jsonData.length === 0) {
    return null;
  }

  // Classify scholars into qualified and disqualified
  const qualified = jsonData.filter((scholar) =>
    isQualified(scholar.category, scholar.personWithDisability, scholar.total)
  );
  const disqualified = jsonData.filter(
    (scholar) =>
      !isQualified(
        scholar.category,
        scholar.personWithDisability,
        scholar.total
      )
  );

  // Toggle states for showing tables
  const [showQualified, setShowQualified] = useState(false);
  const [showDisqualified, setShowDisqualified] = useState(false);

  // Prepare data for charts
  const pieChartData = {
    labels: ["Qualified", "Disqualified"],
    datasets: [
      {
        data: [qualified.length, disqualified.length],
        backgroundColor: ["#4CAF50", "#F44336"],
      },
    ],
  };

  // Build category-wise data using the effective category (which separates PwD)
  const categoryWiseData: Record<
    string,
    { qualified: number; disqualified: number }
  > = {};

  // Ensure all categories from cutoffs appear (even if count is zero)
  Object.keys(categoryCutoffs).forEach((category) => {
    categoryWiseData[category] = { qualified: 0, disqualified: 0 };
  });

  // Aggregate qualified scholars by effective category
  qualified.forEach((scholar) => {
    const effectiveCategory = getEffectiveCategory(scholar);
    if (!categoryWiseData[effectiveCategory]) {
      categoryWiseData[effectiveCategory] = { qualified: 0, disqualified: 0 };
    }
    categoryWiseData[effectiveCategory].qualified++;
  });

  // Aggregate disqualified scholars by effective category
  disqualified.forEach((scholar) => {
    const effectiveCategory = getEffectiveCategory(scholar);
    if (!categoryWiseData[effectiveCategory]) {
      categoryWiseData[effectiveCategory] = { qualified: 0, disqualified: 0 };
    }
    categoryWiseData[effectiveCategory].disqualified++;
  });

  const barChartData = {
    labels: Object.keys(categoryWiseData),
    datasets: [
      {
        label: "Qualified Students",
        data: Object.values(categoryWiseData).map((data) => data.qualified),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "DisQualified Students",
        data: Object.values(categoryWiseData).map((data) => data.disqualified),
        backgroundColor: "rgba(235, 54, 54, 0.6)",
      },
    ],
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Qualification Status
      </Typography>

      <Grid container spacing={2}>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Pie Chart */}
          <Box sx={{ height: 300 }}>
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
            />
          </Box>
          {/* Summary Table */}
          <TableContainer component={Paper} sx={{ mt: 3, flexGrow: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Count</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  onClick={() => setShowQualified(!showQualified)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>Qualified</TableCell>
                  <TableCell>{qualified.length}</TableCell>
                </TableRow>
                <TableRow
                  onClick={() => setShowDisqualified(!showDisqualified)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>Disqualified</TableCell>
                  <TableCell>{disqualified.length}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            height: 350,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Bar Chart */}
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </Grid>
      </Grid>

      {/* Dialog for Qualified Scholars */}
      <Dialog
        open={showQualified}
        onClose={() => setShowQualified(false)}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>Qualified Scholars</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              Qualified Scholars
            </Typography>
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
                    <strong>Category</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total Marks</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {qualified.map((scholar) => (
                  <TableRow key={scholar.drn}>
                    <TableCell>{scholar.drn}</TableCell>
                    <TableCell>{scholar.name}</TableCell>
                    {/* Show effective category */}
                    <TableCell>{getEffectiveCategory(scholar)}</TableCell>
                    <TableCell>{scholar.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Dialog for Disqualified Scholars */}
      <Dialog
        open={showDisqualified}
        onClose={() => setShowDisqualified(false)}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>Disqualified Scholars</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
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
                    <strong>Category</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total Marks</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {disqualified.map((scholar) => (
                  <TableRow key={scholar.drn}>
                    <TableCell>{scholar.drn}</TableCell>
                    <TableCell>{scholar.name}</TableCell>
                    {/* Show effective category */}
                    <TableCell>{getEffectiveCategory(scholar)}</TableCell>
                    <TableCell>{scholar.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Category-Wise Qualification Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Category-Wise Qualification Status
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Category</strong>
              </TableCell>
              <TableCell>
                <strong>Qualified</strong>
              </TableCell>
              <TableCell>
                <strong>Disqualified</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(categoryWiseData).map(([category, data]) => (
              <TableRow key={category}>
                <TableCell>{category}</TableCell>
                <TableCell>{data.qualified}</TableCell>
                <TableCell>{data.disqualified}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default QualificationStatus;
