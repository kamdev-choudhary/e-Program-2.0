import React, { useMemo, useState } from "react";
import { DataProps } from "../types";
import {
  Box,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { CustomModal } from "../../../components/CustomModal";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface CategoryWiseProps {
  jsonData: DataProps[];
}

interface Stats {
  totalScholar: number;
  qualified: number;
  notQualified: number;
  qualifiedScholar: DataProps[];
  notQualifiedScholars: DataProps[];
}

const CategoryWise: React.FC<CategoryWiseProps> = ({ jsonData }) => {
  const [selectedScholar, setSelectedScholars] = useState<DataProps[] | null>(
    null
  );
  const [showScholars, setShowScholars] = useState<boolean>(false);

  const categoryStats = useMemo(() => {
    return jsonData.reduce((acc, scholar) => {
      const { category, isQualified, pwd } = scholar;

      // If scholar has pwd = "no", group them by their category
      if (pwd === "n" || pwd === "no") {
        if (!acc[category]) {
          acc[category] = {
            totalScholar: 0,
            qualified: 0,
            notQualified: 0,
            qualifiedScholar: [],
            notQualifiedScholars: [],
          };
        }

        acc[category].totalScholar += 1;

        if (isQualified) {
          acc[category].qualified += 1;
          acc[category].qualifiedScholar.push(scholar);
        } else {
          acc[category].notQualified += 1;
          acc[category].notQualifiedScholars.push(scholar);
        }
      }

      // If scholar has pwd = "yes", group them under the "pwd" category
      if (pwd === "yes" || pwd === "y") {
        if (!acc["pwd"]) {
          acc["pwd"] = {
            totalScholar: 0,
            qualified: 0,
            notQualified: 0,
            qualifiedScholar: [],
            notQualifiedScholars: [],
          };
        }

        acc["pwd"].totalScholar += 1;

        if (isQualified) {
          acc["pwd"].qualified += 1;
          acc["pwd"].qualifiedScholar.push(scholar);
        } else {
          acc["pwd"].notQualified += 1;
          acc["pwd"].notQualifiedScholars.push(scholar);
        }
      }

      return acc;
    }, {} as Record<string, Stats>);
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
    <Box>
      <Box sx={{ p: 1 }}>
        <Typography variant="h6">Qualification Summary</Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Category
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Total Scholar
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Qualified
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Not Qualified
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Qualification %
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(categoryStats).map(([category, stats]) => (
                <TableRow key={category}>
                  <TableCell align="center">
                    {category?.toUpperCase()}
                  </TableCell>
                  <TableCell align="center">{stats.totalScholar}</TableCell>
                  <TableCell align="center">
                    <Chip
                      onClick={() => {
                        setSelectedScholars(stats.qualifiedScholar);
                        setShowScholars(true);
                      }}
                      color="success"
                      label={stats.qualified}
                      sx={{ minWidth: 80 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      onClick={() => {
                        setSelectedScholars(stats.notQualifiedScholars);
                        setShowScholars(true);
                      }}
                      color="error"
                      sx={{ minWidth: 80 }}
                      label={stats.notQualified}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      color="warning"
                      sx={{ minWidth: 80 }}
                      label={(
                        (stats.notQualified /
                          (stats.notQualified + stats.qualified)) *
                        100
                      ).toFixed(2)}
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
      </Paper>
    </Box>
  );
};

export default CategoryWise;
