import React, { useMemo, useState } from "react";
import { DataProps } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
  Chip,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CustomModal } from "../../../components/CustomModal";

// Helper function to determine the rank range based on the given rank
const getRankRange = (rank: number | string): string => {
  if (Number(rank) >= 1 && Number(rank) <= 100) {
    return "1-100";
  } else if (Number(rank) > 100 && Number(rank) <= 1000) {
    return "101-1000";
  } else if (Number(rank) > 1000 && Number(rank) <= 5000) {
    return "1001-5000";
  } else if (Number(rank) > 5000 && Number(rank) <= 10000) {
    return "5001-10000";
  } else {
    return "10001+";
  }
};

interface Stats {
  totalScholar: number;
  qualified: number;
  notQualified: number;
  qualifiedScholars: DataProps[];
  notQualifiedScholars: DataProps[];
}

interface RankRangeProps {
  jsonData: DataProps[];
}

const RankRangeWise: React.FC<RankRangeProps> = ({ jsonData }) => {
  const [selectedScholar, setSelectedScholars] = useState<DataProps[] | null>(
    null
  );
  const [showScholars, setShowScholars] = useState<boolean>(false);

  const rankStats = useMemo(() => {
    return jsonData.reduce(
      (acc, scholar) => {
        const { airRank, catRank, isQualified } = scholar;

        // Group by airRank range (only if airRank is defined)
        if (airRank !== null && airRank !== undefined) {
          const airRange = getRankRange(airRank);
          if (!acc["airRank"][airRange]) {
            acc["airRank"][airRange] = {
              totalScholar: 0,
              qualified: 0,
              notQualified: 0,
              qualifiedScholars: [],
              notQualifiedScholars: [],
            };
          }

          acc["airRank"][airRange].totalScholar += 1;

          if (isQualified) {
            acc["airRank"][airRange].qualified += 1;
            acc["airRank"][airRange].qualifiedScholars.push(scholar);
          } else {
            acc["airRank"][airRange].notQualified += 1;
            acc["airRank"][airRange].notQualifiedScholars.push(scholar);
          }
        }

        // Group by catRank range (only if catRank is defined)
        if (catRank !== null && catRank !== undefined) {
          const catRange = getRankRange(catRank);
          if (!acc["catRank"][catRange]) {
            acc["catRank"][catRange] = {
              totalScholar: 0,
              qualified: 0,
              notQualified: 0,
              qualifiedScholars: [],
              notQualifiedScholars: [],
            };
          }

          acc["catRank"][catRange].totalScholar += 1;

          if (isQualified) {
            acc["catRank"][catRange].qualified += 1;
            acc["catRank"][catRange].qualifiedScholars.push(scholar);
          } else {
            acc["catRank"][catRange].notQualified += 1;
            acc["catRank"][catRange].notQualifiedScholars.push(scholar);
          }
        }

        return acc;
      },
      { airRank: {}, catRank: {} } as {
        airRank: Record<string, Stats>;
        catRank: Record<string, Stats>;
      }
    );
  }, [jsonData]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "SN",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 60,
    },
    {
      field: "uniqueId",
      headerName: "DRN",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "category",
      headerName: "Category",
      align: "center",
      headerAlign: "center",
      minWidth: 80,
    },
    {
      field: "pwd",
      headerName: "PWD",
      align: "center",
      headerAlign: "center",
      minWidth: 80,
    },
    {
      field: "physics_positive",
      headerName: "Physics +ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "physics_negative",
      headerName: "Physics -ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "physics",
      headerName: "Physics",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      cellClassName: (params) => {
        if ("isPhysicsQualified" in params.row) {
          return params.row.isPhysicsQualified
            ? "status-success"
            : "status-error";
        }
        return "";
      },
    },
    {
      field: "chemistry_positive",
      headerName: "chemistry +ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chemistry_negative",
      headerName: "chemistry -ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chemistry",
      headerName: "chemistry ",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      cellClassName: (params) => {
        if ("isChemistryQualified" in params.row) {
          return params.row.isChemistryQualified
            ? "status-success"
            : "status-error";
        }
        return "";
      },
    },
    {
      field: "maths_positive",
      headerName: "maths +ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "maths_negative",
      headerName: "maths -ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "maths",
      headerName: "maths ",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      cellClassName: (params) => {
        if ("isMathsQualified" in params.row) {
          return params.row.isMathsQualified
            ? "status-success"
            : "status-error";
        }
        return "";
      },
    },
    {
      field: "total_positive",
      headerName: "total +ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "total_negative",
      headerName: "total -ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "total",
      headerName: "total ",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      cellClassName: (params) => {
        if ("isTotalQualified" in params.row) {
          return params.row.isTotalQualified
            ? "status-success"
            : "status-error";
        }
        return "";
      },
    },
    {
      field: "isQualified",
      headerName: "Q/DNQ",
      renderCell: (params) => (
        <>
          {"isQualified" in params.row
            ? params.row.isQualified
              ? "Q"
              : "DNQ"
            : ""}
        </>
      ),
      align: "center",
      headerAlign: "center",
      cellClassName: (params) => {
        if ("isQualified" in params.row) {
          return params.row.isQualified ? "status-success" : "status-error";
        }
        return "";
      },
    },
    {
      field: "cutoff",
      headerName: "Cut off",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <>
          <Chip
            label={`${params.row.cutoff?.subject ?? "N/A"}/${
              params.row.cutoff?.total ?? "N/A"
            }`}
          />
        </>
      ),
    },
    {
      field: "airRank",
      headerName: "AIR Rank",
      align: "center",
      headerAlign: "center",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "catRank",
      headerName: "CAT Rank",
      align: "center",
      headerAlign: "center",
      flex: 1,
      minWidth: 120,
    },
  ];

  const invisibleColumns = {
    physics_positive: false,
    physics_negative: false,
    chemistry_positive: false,
    chemistry_negative: false,
    maths_positive: false,
    maths_negative: false,
    total_positive: false,
    total_negative: false,
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* AirRank Table */}
      <Typography variant="h5" gutterBottom>
        Grouped by AIR Rank Range
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">AIR Rank Range</TableCell>
              <TableCell align="center">Total Scholars</TableCell>
              <TableCell align="center">Qualified</TableCell>
              <TableCell align="center">Not Qualified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(rankStats.airRank).map(([airRange, stats]) => (
              <TableRow key={airRange}>
                <TableCell align="center">{airRange}</TableCell>
                <TableCell align="center">
                  <Chip sx={{ minWidth: 60 }} label={stats.totalScholar} />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    sx={{ minWidth: 60 }}
                    onClick={() => {
                      setSelectedScholars(stats.qualifiedScholars);
                      setShowScholars(true);
                    }}
                    label={stats.qualified}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    sx={{ minWidth: 60 }}
                    onClick={() => {
                      setSelectedScholars(stats.notQualifiedScholars);
                      setShowScholars(true);
                    }}
                    label={stats.notQualified}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* CAT Rank Table */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Grouped by CAT Rank Range
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">CAT Rank Range</TableCell>
              <TableCell align="center">Total Scholars</TableCell>
              <TableCell align="center">Qualified</TableCell>
              <TableCell align="center">Not Qualified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(rankStats.catRank).map(([catRange, stats]) => (
              <TableRow key={catRange}>
                <TableCell align="center">{catRange}</TableCell>
                <TableCell align="center">
                  <Chip sx={{ minWidth: 60 }} label={stats.totalScholar} />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    sx={{ minWidth: 60 }}
                    onClick={() => {
                      setSelectedScholars(stats.qualifiedScholars);
                      setShowScholars(true);
                    }}
                    label={stats.qualified}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    sx={{ minWidth: 60 }}
                    onClick={() => {
                      setSelectedScholars(stats.notQualifiedScholars);
                      setShowScholars(true);
                    }}
                    label={stats.notQualified}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomModal open={showScholars} onClose={() => setShowScholars(false)}>
        <DataGrid
          initialState={{
            columns: { columnVisibilityModel: invisibleColumns },
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 30, 50]}
          columns={columns}
          rows={selectedScholar || []}
        />
      </CustomModal>
    </Box>
  );
};

export default RankRangeWise;
