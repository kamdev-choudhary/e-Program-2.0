import {
  Box,
  IconButton,
  Grid2 as Grid,
  SelectChangeEvent,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import { CustomToolbar } from "../../../components/CustomToolbar";
import { CustomModal } from "../../../components/CustomModal";
import UploadJeeMainMarksVsRank from "./part/UploadJeeMainMarksVsRank";
import { DeleteRounded } from "@mui/icons-material";
import Swal from "sweetalert2";
import CustomDropDown from "../../../components/CustomDropDown";
import useAxios from "../../../hooks/useAxios";

interface JEEMainMarksVsRankProps {
  _id?: string; // Optional field for MongoDB document ID
  year: number; // Exam year, e.g., 2024
  session: string; // Session, e.g., "January", "April"
  date: string;
  marks: number; // Specific marks (e.g., 200)
  percentile: number; // Percentile corresponding to the marks (e.g., 99.5)
  rank: number; // Overall rank for the specific marks
  generalRank: number; // Rank for General category
  obcRank?: number; // Rank for OBC category (optional)
  scRank?: number; // Rank for SC category (optional)
  stRank?: number; // Rank for ST category (optional)
  ewsRank?: number; // Rank for EWS category (optional)
  pwdRank?: number; // Rank for PwD category (optional)
}

const JEEMainMarksVsRank: React.FC = () => {
  const axios = useAxios();
  const [data, setData] = useState<JEEMainMarksVsRankProps[]>([]);
  const [showUploadData, setShowUploadData] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/analysis/jeemainmarksvsrank", {
        params: {
          year: selectedYear || undefined,
        },
      });
      setData(response.data.data);
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

  const handleDeleteItem = async (item: JEEMainMarksVsRankProps) => {
    if (!item?._id) return;
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        try {
          await axios.delete(`/analysis/jeemainmarksvsrank/${item?._id}`);
          setData((data) => data?.filter((d) => d._id !== item._id) || []);
          Swal.fire("Deleted!", "The item has been deleted.", "success");
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the item.",
        "error"
      );
    }
  };

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
    setData((prevData) => {
      if (!prevData) return [];
      return prevData.map((item) =>
        item._id === oldRow._id ? { ...item, ...newRow } : item
      );
    });

    const { _id, ...updateField } = newRow;

    try {
      await axios.patch(
        `/analysis/jeemainmarksvsrank/${oldRow._id}`,
        updateField
      );

      return newRow;
    } catch (error) {
      console.error("Failed to update the row:", error);
      setData((prevData) => {
        if (!prevData) return [];
        return prevData.map((item) =>
          item._id === oldRow._id ? oldRow : item
        );
      });
      throw error;
    }
  };

  const rows = useMemo(() => {
    if (!data) return [];
    return data.map((d, index) => ({ ...d, id: index + 1 }));
  }, [data]);

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
      field: "session",
      headerName: "Session",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: true,
      minWidth: 150,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: true,
      minWidth: 150,
    },
    {
      field: "marks",
      headerName: "Marks",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      editable: true,
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
      field: "rank",
      headerName: "Overall Rank",
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
      field: "obcRank",
      headerName: "OBC Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
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
      field: "stRank",
      headerName: "ST Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
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
      field: "pwdRank",
      headerName: "PwD Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "delete",
      headerName: "Delete",
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleDeleteItem(params.row)}>
            <DeleteRounded />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              data={[
                { name: 2023, value: 2023 },
                { name: 2024, value: 2024 },
              ]}
              value={selectedYear}
              label="Year"
              onChange={(e: SelectChangeEvent) =>
                setSelectedYear(e.target.value)
              }
              name="name"
              dropdownValue="value"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}></Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}></Grid>
        </Grid>
      </Box>
      <DataGrid
        rows={rows} // Ensure data is not null
        columns={columns}
        slots={{
          toolbar: () => (
            <CustomToolbar
              showAddButton={true}
              onAddButtonClick={() => setShowUploadData(true)}
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
        <UploadJeeMainMarksVsRank onClose={() => setShowUploadData(false)} />
      </CustomModal>
    </Box>
  );
};

export default JEEMainMarksVsRank;
