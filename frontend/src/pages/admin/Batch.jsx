import React, { useMemo, useState } from "react";
import { Box, IconButton, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CustomToolbar from "../../components/CustomToolbar";
import { useGlobalProvider } from "../../GlobalProvider";
import axios from "axios";
import { API_URL } from "../../constants/helper";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { CustomModal } from "../../components/CustomModal";

function Batch() {
  const { isValidResponse } = useGlobalProvider();
  const [batches, setBatches] = useState([]);

  const getBatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/batch`);
      if (isValidResponse(response)) {
        setBatches(response?.data?.batches);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditBatch = () => {};
  const handleDeleteBatch = (id) => {};

  const columns = [
    { field: "id", headerName: "SN", minWidth: 40, flex: 1 },
    { field: "name", headerName: "Name", minWidth: 150, flex: 1 },
    {
      field: "targetClass",
      headerName: "Target Class",
      minWidth: 150,
      flex: 1,
    },
    { field: "scholars", headerName: "Scholars", minWidth: 150, flex: 1 },
    {
      field: "action",
      headerName: "Action",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditBatch(params.row)}>
            <EditRounded />
          </IconButton>
          <IconButton onClick={() => handleDeleteBatch(params.row, _id)}>
            <DeleteRounded />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = useMemo(() => {
    return batches?.map((b, index) => ({
      id: index + 1,
      ...b,
    }));
  }, [batches]);

  return (
    <>
      <Box component={Paper}>
        <DataGrid
          columns={columns}
          rows={rows}
          initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
          pageSizeOptions={[20, 30, 50]}
          slots={{ toolbar: () => <CustomToolbar /> }}
        />
      </Box>
      {/* Custom Modal */}
      <CustomModal></CustomModal>
    </>
  );
}

export default Batch;
