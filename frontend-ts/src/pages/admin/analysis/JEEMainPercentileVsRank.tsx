import { Box, Grid2 as Grid, SelectChangeEvent } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import { CustomToolbar } from "../../../components/CustomToolbar";
import { CustomModal } from "../../../components/CustomModal";
import UploadJeeMainMarksVsPercentile from "./part/PercentileVsRankUploadService";
import CustomDropDown from "../../../components/CustomDropDown";
import axios from "../../../hooks/AxiosInterceptor";

interface JEEMainMarksVsRankProps {
  _id?: string;
  year: number;
  session: string;
  date: string;
  marks: number;
  percentile: number;
}

const JEEMainMarksVsRank: React.FC = () => {
  const [data, setData] = useState<JEEMainMarksVsRankProps[]>([]);
  const [showUploadData, setShowUploadData] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/analysis/jeemain-percentile-vs-rank", {
        params: {
          year: selectedYear || undefined,
        },
      });
      setData(response.data.data);
    } catch (error: any) {
      if (error.response?.status >= 400) {
        setData([]);
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedYear) return;
    fetchData();
  }, [selectedYear]);

  const handleProcessRowUpdate = async (
    newRow: JEEMainMarksVsRankProps,
    oldRow: JEEMainMarksVsRankProps
  ): Promise<JEEMainMarksVsRankProps> => {
    const hasChanges = Object.keys(newRow).some(
      (key) =>
        newRow[key as keyof JEEMainMarksVsRankProps] !==
        oldRow[key as keyof JEEMainMarksVsRankProps]
    );

    if (!hasChanges) {
      return oldRow;
    }
    setData((prevData) =>
      prevData.map((item) =>
        item._id === oldRow._id ? { ...item, ...newRow } : item
      )
    );

    const { _id, ...updateField } = newRow;
    try {
      await axios.patch(
        `/analysis/jeemain-percentile-vs-rank/${oldRow._id}`,
        updateField
      );
      return newRow;
    } catch (error) {
      console.error("Failed to update the row:", error);
      setData((prevData) =>
        prevData.map((item) => (item._id === oldRow._id ? oldRow : item))
      );
      throw error;
    }
  };

  const rows = useMemo(
    () => data.map((d, index) => ({ ...d, id: index + 1 })),
    [data]
  );

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "SN",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      field: "year",
      headerName: "Year",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: true,
      minWidth: 120,
    },
    {
      field: "percentile",
      headerName: "Percentile",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "generalRank",
      headerName: "General Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "generalPwdRank",
      headerName: "General PwD Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      flex: 1,
      editable: true,
    },
    {
      field: "obcRank",
      headerName: "OBC Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "obcPwdRank",
      headerName: "OBC PwD Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      flex: 1,
      editable: true,
    },
    {
      field: "scRank",
      headerName: "SC Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "scPwdRank",
      headerName: "SC PwD Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      flex: 1,
      editable: true,
    },
    {
      field: "stRank",
      headerName: "ST Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "stPwdRank",
      headerName: "ST PwD Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      flex: 1,
      editable: true,
    },
    {
      field: "ewsRank",
      headerName: "EWS Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "ewsPwdRank",
      headerName: "EWS PwD Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      flex: 1,
      editable: true,
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <CustomDropDown
              data={[
                { name: 2023, value: 2023 },
                { name: 2024, value: 2024 },
              ]}
              value={selectedYear}
              label="Year"
              onChange={(e: SelectChangeEvent) => {
                setSelectedYear(e.target.value);
              }}
              name="name"
              dropdownValue="value"
            />
          </Grid>
        </Grid>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{
          toolbar: () => (
            <CustomToolbar
              onAdd={() => setShowUploadData(true)}
              onRefresh={fetchData}
            />
          ),
        }}
        loading={isLoading}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[10, 30, 50]}
        processRowUpdate={handleProcessRowUpdate}
      />
      <CustomModal
        open={showUploadData}
        onClose={() => setShowUploadData(false)}
        header="Upload JEE Main Marks Vs Rank"
      >
        <UploadJeeMainMarksVsPercentile
          onClose={() => setShowUploadData(false)}
        />
      </CustomModal>
    </Box>
  );
};

export default JEEMainMarksVsRank;
