import { Box, Button, IconButton, TextField, Switch } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import { CustomToolbar } from "../../../../components/CustomToolbar";
import axios from "../../../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../../../contexts/GlobalProvider";
import { CustomModal } from "../../../../components/CustomModal";
import { DeleteRounded, RemoveRedEyeRounded } from "@mui/icons-material";
import Swal from "sweetalert2";
import ScholarDetails from "./ScholarDetails";

interface Student {
  _id: string;
  email: string;
  name: string;
  mobile: string;
}

interface NewStudent {
  email: string;
  name: string;
  mobile: string;
  role: string;
}

const AdminUser: React.FC = () => {
  const { isValidResponse } = useGlobalContext();
  const [students, setStudents] = useState<Student[] | null>(null);
  const [addStudentModal, setAddStudentModal] = useState<boolean>(false);
  const [showScholarDetails, setShowScholarDetails] = useState<boolean>(false);
  const [selectedScholar, setSelectedScholar] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newAdmin, setNewAdmin] = useState<NewStudent>({
    email: "",
    mobile: "",
    name: "",
    role: "student",
  });

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("/user/role/student");

      if (isValidResponse(response)) {
        setStudents(response.data.users);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSaveNewAdmin = async () => {
    try {
      const response = await axios.post("/auth/register/admin", {
        ...newAdmin,
      });
      if (isValidResponse(response)) {
        setStudents(response.data.users);
        setAddStudentModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (user: Student) => {
    try {
      const response = await axios.patch(`/user/status/${user._id}`);
      if (isValidResponse(response)) {
        setStudents((prevData) => {
          if (!prevData) return null;
          return prevData.map((student) =>
            student._id === user._id
              ? {
                  ...student,
                  status: response.data.status,
                }
              : student
          );
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = (id: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(`/user/${id}`);
          if (isValidResponse(response)) {
            setStudents(
              students?.filter((student) => student._id !== id) || []
            );
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleProcessRowUpdate = async (
    newRow: Student,
    oldRow: Student
  ): Promise<Student> => {
    const hasChanges = Object.keys(newRow).some(
      (key) => newRow[key as keyof Student] !== oldRow[key as keyof Student]
    );

    if (!hasChanges) {
      return oldRow;
    }
    setStudents((prevData) => {
      if (!prevData) return null;
      return prevData.map((item) =>
        item._id === oldRow._id ? { ...item, ...newRow } : item
      );
    });

    const { _id, ...updateField } = newRow;

    try {
      const response = await axios.patch(`/user/${oldRow._id}`, updateField);
      if (isValidResponse(response)) {
        setStudents(response.data.users);
      }
      return newRow;
    } catch (error) {
      console.error("Failed to update the row:", error);
      setStudents((prevData) => {
        if (!prevData) return null;
        return prevData.map((item) =>
          item._id === oldRow._id ? oldRow : item
        );
      });

      throw error;
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "SN",
      width: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 200,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      editable: true,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Switch
          onClick={() => handleStatusChange(params.row)}
          checked={params.row.status === 1}
        />
      ),
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <>{params.row.createdAt.split("T")[0]}</>,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "edit",
      headerName: "View / Delete",
      minWidth: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Box
            sx={{ display: "flex", gap: 2, mt: 1, justifyContent: "center" }}
          >
            <IconButton
              onClick={() => {
                setSelectedScholar(params.row);
                setShowScholarDetails(true);
              }}
            >
              <RemoveRedEyeRounded />
            </IconButton>
            <IconButton onClick={() => handleDeleteUser(params.row._id)}>
              <DeleteRounded />
            </IconButton>
          </Box>
        </>
      ),
    },
  ];

  const rows = useMemo(() => {
    return students?.map((admin, index) => ({ ...admin, id: index + 1 }));
  }, [students]);

  return (
    <Box>
      <Box sx={{ mt: 2 }}>
        <DataGrid
          columns={columns}
          rows={rows}
          slots={{
            toolbar: () => (
              <CustomToolbar
                showAddButton={true}
                onAddButtonClick={() => setAddStudentModal(true)}
              />
            ),
          }}
          loading={loading}
          processRowUpdate={handleProcessRowUpdate}
        />
      </Box>
      <CustomModal
        open={addStudentModal}
        onClose={() => setAddStudentModal(false)}
        height="auto"
        width="auto"
      >
        <Box
          sx={{
            minWidth: 250,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            size="small"
            fullWidth
            label="Name"
            value={newAdmin.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewAdmin((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <TextField
            size="small"
            fullWidth
            label="Email"
            value={newAdmin.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewAdmin((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <TextField
            size="small"
            fullWidth
            label="Mobile"
            value={newAdmin.mobile}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewAdmin((prev) => ({ ...prev, mobile: e.target.value }))
            }
          />
          <Button onClick={handleSaveNewAdmin} variant="contained">
            Save
          </Button>
        </Box>
      </CustomModal>

      <CustomModal
        open={showScholarDetails}
        onClose={() => setShowScholarDetails(false)}
        header="Scholar Details"
      >
        <ScholarDetails student={selectedScholar} />
      </CustomModal>
    </Box>
  );
};

export default AdminUser;
