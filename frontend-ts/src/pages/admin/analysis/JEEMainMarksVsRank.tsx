import { Box, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import { CustomToolbar } from "../../../components/CustomToolbar";
import { CustomModal } from "../../../components/CustomModal";
import UploadJeeMainMarksVsRank from "./part/UploadJeeMainMarksVsRank";
import axios from "../../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../../contexts/GlobalProvider";
import { DeleteRounded } from "@mui/icons-material";
import Swal from "sweetalert2";

interface JEEMainMarksVsRankProps {
  _id?: string; // Optional field for MongoDB document ID
  examYear: number; // Exam year, e.g., 2024
  examSession: string; // Session, e.g., "January", "April"
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
  const { isValidResponse } = useGlobalContext();
  const [data, setData] = useState<JEEMainMarksVsRankProps[]>([]);
  const [showUploadData, setShowUploadData] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("/analysis/jeemainmarksvsrank");
      if (isValidResponse(response)) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        const response = await axios.delete(
          `/analysis/jeemainmarksvsrank/${item?._id}`
        );
        if (isValidResponse(response)) {
          setData((data) => data?.filter((d) => d._id !== item._id) || []);
          Swal.fire("Deleted!", "The item has been deleted.", "success");
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
    // Check if there are any changes between the new and old rows
    const hasChanges = Object.keys(newRow).some(
      (key) =>
        newRow[key as keyof JEEMainMarksVsRankProps] !==
        oldRow[key as keyof JEEMainMarksVsRankProps]
    );

    // If no changes, return the old row
    if (!hasChanges) {
      return oldRow;
    }

    // Optimistically update the row locally
    setData((prevData) => {
      if (!prevData) return [];
      return prevData.map((item) =>
        item._id === oldRow._id ? { ...item, ...newRow } : item
      );
    });

    const { _id, ...updateField } = newRow; // Extract the `_id` and the fields to be updated

    try {
      // Send the update request to the backend
      await axios.patch(
        `/analysis/jeemainmarksvsrank/${oldRow._id}`,
        updateField
      );

      // If successful, return the new row
      return newRow;
    } catch (error) {
      console.error("Failed to update the row:", error);

      // Revert the local state to the old row if the update fails
      setData((prevData) => {
        if (!prevData) return [];
        return prevData.map((item) =>
          item._id === oldRow._id ? oldRow : item
        );
      });

      // Re-throw the error to notify the caller of the failure
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
      editable: false, // Serial number shouldn't be editable
    },
    {
      field: "examYear",
      headerName: "Exam Year",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: true,
    },
    {
      field: "examSession",
      headerName: "Session",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: true,
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
    <Box>
      <Box></Box>
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
