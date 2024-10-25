import React, { useState } from "react";
import { Box, Button, IconButton, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CustomToolbar from "../../components/CustomToolbar";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "../../constants/helper";
import { CustomModal } from "../../components/CustomModal";
import Loader from "../../components/Loader";
import { useGlobalProvider } from "../../GlobalProvider";

function OnlineExam() {
  const { isValidResponse } = useGlobalProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);
  const [showEditTemplate, setShowEditTemplate] = useState(false);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [showAssignedBatches, setShowAssignedBatches] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState([]);

  const getTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/exam/templates`);
      if (isValidResponse(response)) {
        setTemplates(response?.data?.templates);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // View Templates
  const handleViewTemplate = (template) => {
    setSelectedTemplate(template);
    setShowTemplateDetails(true);
  };
  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setShowEditTemplate(true);
  };
  const handleAssignTemplate = (template) => {
    setSelectedTemplate(template);
    setShowAssignedBatches(true);
  };
  const handleDeleteTemplate = (template) => {
    setSelectedTemplate(template);
    Swal.fire("Working");
  };

  const columns = [
    { field: "id", headerName: "Sn", width: 60 },
    { field: "name", headerName: "Template Name", minWidth: 200, flex: 1 },
    { field: "createdAt", headerName: "Date", minWidth: 100, flex: 1 },
    { field: "pattern", headerName: "Pattern", minWidth: 100, flex: 1 },
    {
      field: "assign",
      headerName: "Assign",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Button
            onClick={() => handleAssignTemplate(params.row)}
            variant="contained"
          >
            Batches
          </Button>
        </>
      ),
    },
    {
      field: "details",
      headerName: "Details",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Button
            onClick={() => handleViewTemplate(params.row)}
            variant="contained"
            color="secondary"
          >
            View
          </Button>
        </>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditTemplate(params.row)}>
            <EditRounded />
          </IconButton>
          <IconButton onClick={() => handleDeleteTemplate(params.row)}>
            <DeleteRounded />
          </IconButton>
        </>
      ),
    },
  ];
  const rows = [
    { id: 1, name: "Dummy", createdAt: "24-10-2024", pattern: "JEE" },
  ];
  return (
    <Box>
      <Box component={Paper}>
        <DataGrid
          columns={columns}
          rows={rows}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 20, 40, 80]}
          slots={{
            toolbar: () => (
              <CustomToolbar
                onAddButtonClick={() => setShowNewTemplate(true)}
              />
            ),
          }}
        />
      </Box>
      {/* Template Details */}
      <CustomModal
        open={showTemplateDetails}
        onClose={() => setShowTemplateDetails(false)}
        header="Template Details"
      ></CustomModal>

      {/* Edit Details */}
      <CustomModal
        open={showEditTemplate}
        onClose={() => setShowEditTemplate(false)}
        header="Edit Template"
      ></CustomModal>

      {/* Assign Template */}
      <CustomModal
        open={showAssignedBatches}
        onClose={() => setShowAssignedBatches(false)}
        header="Assign Template"
      ></CustomModal>

      {/* New Template */}
      <CustomModal
        open={showNewTemplate}
        onClose={() => setShowNewTemplate(false)}
        header="Template Details"
      ></CustomModal>

      {/* Loader */}
      <Loader open={isLoading} />
    </Box>
  );
}

export default OnlineExam;
