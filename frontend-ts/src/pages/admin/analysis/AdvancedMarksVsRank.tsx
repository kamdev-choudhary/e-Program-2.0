import { Box, Grid2 as Grid, SelectChangeEvent } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import { CustomToolbar } from "../../../components/CustomToolbar";
import { CustomModal } from "../../../components/CustomModal";
import CustomDropDown from "../../../components/CustomDropDown";
import axios from "../../../hooks/AxiosInterceptor";
import UploadJEEAdvancedMarksVsRank from "./part/UploadAdvancedMarksVsRank";
import { useNotification } from "../../../contexts/NotificationProvider";

interface JEEMainMarksVsRankProps {
  _id?: string;
  year: number;
  session: string;
  date: string;
  marks: number;
  percentile: number;
}

interface YearsProps {
  name: string | number;
  value: string | number;
}

const AdvancedMarksVsRank: React.FC = () => {
  const { showNotification } = useNotification();
  const [data, setData] = useState<JEEMainMarksVsRankProps[]>([]);
  const [showUploadData, setShowUploadData] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [years, setYears] = useState<YearsProps[] | null>(null);

  const fetchInitialData = async () => {
    try {
      const res = await axios.get(
        "/analysis/jeeadvanced-marks-vs-rank/metadata"
      );
      setYears(res.data.years);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/analysis/jeeadvanced-marks-vs-rank", {
        params: {
          year: selectedYear || undefined,
        },
      });
      setData(response.data.data);
      showNotification({ message: response.data.message || "Record Found" });
    } catch (error) {
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
        `/analysis/jeeadvaned-marks-vs-rank/${oldRow._id}`,
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
      field: "maxMarks",
      headerName: "Max Marks",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: true,
      minWidth: 120,
    },
    {
      field: "marks",
      headerName: "Marks",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: true,
      minWidth: 120,
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
      field: "generalPwDRank",
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
      field: "obcPwDRank",
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
      field: "scPwDRank",
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
      field: "stPwDRank",
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
      field: "ewsPwDRank",
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
              data={years || []}
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
            <CustomToolbar onAdd={() => setShowUploadData(true)} />
          ),
        }}
        loading={isLoading}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          columns: {
            columnVisibilityModel: {
              generalPwDRank: false,
              obcPwDRank: false,
              stPwDRank: false,
              scPwDRank: false,
              ewsPwDRank: false,
              maxMarks: false,
            },
          },
        }}
        pageSizeOptions={[10, 30, 50]}
        processRowUpdate={handleProcessRowUpdate}
      />
      <CustomModal
        open={showUploadData}
        onClose={() => setShowUploadData(false)}
        header="Upload JEE Main Marks Vs Rank"
      >
        <UploadJEEAdvancedMarksVsRank
          onClose={() => setShowUploadData(false)}
        />
      </CustomModal>
    </Box>
  );
};

export default AdvancedMarksVsRank;
