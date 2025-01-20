import {
  Box,
  Button,
  Checkbox,
  IconButton,
  SelectChangeEvent,
  TextField,
  Tabs,
  Tab,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { CustomToolbar } from "../../../components/CustomToolbar";
import axios from "../../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../../contexts/GlobalProvider";
import { CustomModal } from "../../../components/CustomModal";
import Swal from "sweetalert2";
import { DeleteRounded, VisibilityRounded } from "@mui/icons-material";
import moment from "moment";
import CustomDropDown from "../../../components/CustomDropDown";
import ScholarDetails from "./parts/ScholarDetails";

interface UserProps {
  _id: string;
  email: string;
  name: string;
  mobile: string;
  role: string;
}

interface newUser {
  email: string;
  name: string;
  mobile: string;
  role: string;
}

const UserMaster: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("admin");
  const { isValidResponse } = useGlobalContext();
  const [users, setUsers] = useState<UserProps[] | null>(null);
  const [addAdminModal, setAddAdminModal] = useState<boolean>(false);
  const [showScholarDetails, setShowScholarDetails] = useState<boolean>(false);
  const [adminCount, setAdminCount] = useState<number | null>(0);
  const [studentCount, setStudentCount] = useState<number | null>(0);
  const [selectedScholar, setSelectedScholar] = useState<UserProps | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [newUser, setNewUser] = useState<newUser>({
    email: "",
    mobile: "",
    name: "",
    role: "admin",
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/user/role/${activeTab}`);
      if (isValidResponse(response)) {
        setUsers(response.data.users);
        setAdminCount(response.data.adminCount);
        setStudentCount(response.data.studentCount);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const handleSaveNewUser = async () => {
    try {
      const response = await axios.post("/auth/register/admin", {
        ...newUser,
      });
      if (isValidResponse(response)) {
        setUsers(response.data.users);
        setAddAdminModal(false);
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
            setUsers(users?.filter((student) => student._id !== id) || []);
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

  const handleStatusChange = async (user: UserProps) => {
    try {
      const response = await axios.patch(`/user/status/${user._id}`);
      if (isValidResponse(response)) {
        setUsers((prevData) => {
          if (!prevData) return null;
          return prevData.map((admin) =>
            admin._id === user._id
              ? {
                  ...admin,
                  status: response.data.status,
                }
              : admin
          );
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns: GridColDef[] = [
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
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "singleSelect",
      valueOptions: ["student", "admin"],
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Checkbox
          onClick={() => handleStatusChange(params.row)}
          checked={params.row.status === 1}
        />
      ),
      align: "center",
      headerAlign: "center",
      type: "boolean",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>{moment(params.row.createdAt).format("DD-MM-YYYY")}</>
      ),
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
            {activeTab === "student" && (
              <IconButton
                onClick={() => {
                  setSelectedScholar(params.row);
                  setShowScholarDetails(true);
                }}
              >
                <VisibilityRounded />
              </IconButton>
            )}
            <IconButton onClick={() => handleDeleteUser(params.row._id)}>
              <DeleteRounded />
            </IconButton>
          </Box>
        </>
      ),
    },
  ];

  const handleProcessRowUpdate = async (
    newRow: UserProps,
    oldRow: UserProps
  ): Promise<UserProps> => {
    const hasChanges = Object.keys(newRow).some(
      (key) => newRow[key as keyof UserProps] !== oldRow[key as keyof UserProps]
    );

    if (!hasChanges) {
      return oldRow;
    }
    setUsers((prevData) => {
      if (!prevData) return null;
      return prevData.map((item) =>
        item._id === oldRow._id ? { ...item, ...newRow } : item
      );
    });

    const { _id, ...updateField } = newRow;

    try {
      const response = await axios.patch(`/user/${oldRow._id}`, updateField);
      if (isValidResponse(response)) {
        setUsers(response.data.users);
      }
      return newRow;
    } catch (error) {
      console.error("Failed to update the row:", error);
      setUsers((prevData) => {
        if (!prevData) return null;
        return prevData.map((item) =>
          item._id === oldRow._id ? oldRow : item
        );
      });

      throw error;
    }
  };

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_: React.SyntheticEvent, value: string) =>
          setActiveTab(value)
        }
      >
        <Tab label={`Admin (${adminCount})`} value="admin" />
        <Tab label={`Students (${studentCount})`} value="student" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        <DataGrid
          columns={columns}
          rows={users || []}
          slots={{
            toolbar: () => (
              <CustomToolbar
                showAddButton={true}
                onAddButtonClick={() => setAddAdminModal(true)}
              />
            ),
          }}
          processRowUpdate={handleProcessRowUpdate}
          loading={loading}
          getRowId={(row) => row._id}
        />
      </Box>
      <CustomModal
        open={addAdminModal}
        onClose={() => setAddAdminModal(false)}
        height="auto"
        width="auto"
      >
        <Box
          sx={{
            minWidth: { xs: 200, md: 350 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: 2,
          }}
        >
          <CustomDropDown
            data={[
              { name: "Admin", value: "admin" },
              { name: "Student", value: "student" },
            ]}
            value={newUser.role}
            name="name"
            dropdownValue="value"
            onChange={(e: SelectChangeEvent) =>
              setNewUser((prev) => ({ ...prev, role: e.target.value }))
            }
            label="Account Type"
          />
          <TextField
            fullWidth
            label="Name"
            value={newUser.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewUser((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <TextField
            fullWidth
            label="Email"
            value={newUser.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewUser((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <TextField
            fullWidth
            label="Mobile"
            value={newUser.mobile}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewUser((prev) => ({ ...prev, mobile: e.target.value }))
            }
          />
          <Button onClick={handleSaveNewUser} variant="contained">
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

export default UserMaster;
