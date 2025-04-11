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
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { CustomToolbar } from "../../../components/CustomToolbar";
import { CustomModal } from "../../../components/CustomModal";
import Swal from "sweetalert2";
import {
  DeleteRounded,
  DevicesRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import moment from "moment";
import CustomDropDown from "../../../components/CustomDropDown";
import ScholarDetails from "./parts/ScholarDetails";
import Sessions from "./parts/Sessions";
import axios from "../../../hooks/AxiosInterceptor";
import { useNotification } from "../../../contexts/NotificationProvider";
import { UserRole } from "../../../constant/roles";
import UploadScholar from "./parts/UploadScholar";

interface UserProps {
  _id: string;
  email: string;
  name: string;
  mobile: string;
  role: UserRole;
}

interface newUser {
  email: string;
  name: string;
  mobile: string;
  role: string;
}

interface RolesWithCountProps {
  name: string;
  value: string;
  count: number;
}

const UserMaster: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UserRole>("admin");
  const { showNotification } = useNotification();

  const [users, setUsers] = useState<UserProps[] | null>(null);
  const [addAdminModal, setAddAdminModal] = useState<boolean>(false);
  const [showScholarDetails, setShowScholarDetails] = useState<boolean>(false);
  const [showUploadScholars, setShowUploadScholars] = useState<boolean>(false);
  const [rolesWithCount, setRolesWithCount] = useState<
    RolesWithCountProps[] | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newUser, setNewUser] = useState<newUser>({
    email: "",
    mobile: "",
    name: "",
    role: "admin",
  });
  const [showSessions, setShowSessions] = useState<boolean>(false);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const fetchUsers = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/user`, {
        params: {
          role: activeTab,
          page: page + 1,
          limit: pageSize,
        },
      });
      setUsers(response.data.users);
      setRolesWithCount(response.data.rolesWithCount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
  }, [activeTab]);

  useEffect(() => {
    const { page, pageSize } = paginationModel;
    fetchUsers(page, pageSize);
  }, [paginationModel]);

  const handleSaveNewUser = async () => {
    try {
      const response = await axios.post("/auth/register/admin", {
        ...newUser,
      });
      setUsers(response.data.users);
      setAddAdminModal(false);
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
          await axios.delete(`/user/${id}`);
          setUsers(users?.filter((scholar) => scholar._id !== id) || []);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (user: UserProps) => {
    try {
      const response = await axios.patch(`/user/status/${user._id}`);
      if (response.status === 200) {
        showNotification({
          message: "User Status Changes",

          type: "info",
        });
      }
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
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "singleSelect",
      valueOptions: rolesWithCount?.map((role) => role.value),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 80,
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
            <IconButton
              onClick={() => {
                setSelectedUser(params.row);
                setShowSessions(true);
              }}
            >
              <DevicesRounded />
            </IconButton>
            {activeTab === "scholar" && (
              <IconButton
                onClick={() => {
                  setSelectedUser(params.row);
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
    try {
      const { _id, ...updateField } = newRow;
      const res = await axios.patch(`/user/${oldRow._id}`, updateField);

      if (res.status === 200 || res.status === 204) {
        showNotification({ message: res.data?.message || "Update successful" });

        // Update the `users` array with the modified user data
        const updatedUsers =
          users &&
          users.map((user) =>
            user._id === oldRow._id ? { ...user, ...newRow } : user
          );
        // Assuming `setUsers` is a state setter function to update the `users` array
        setUsers(updatedUsers);

        return newRow;
      }
    } catch (error) {
      console.error("Failed to update the row:", error);
      Swal.fire("Error", "Row update failed. Please try again.", "error");
    }
    return oldRow;
  };
  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_: React.SyntheticEvent, value: UserRole) =>
          setActiveTab(value)
        }
        variant="scrollable" // Change to "scrollable" for scroll behavior
        scrollButtons="auto" // Automatically show scroll buttons when needed
        allowScrollButtonsMobile // Enable scroll buttons for mobile screens
        textColor="secondary"
        indicatorColor="secondary"
      >
        {rolesWithCount?.map((role) => (
          <Tab label={`${role.name} (${role.count})`} value={role.value} />
        ))}
      </Tabs>
      <Box sx={{ mt: 2 }}>
        <DataGrid
          columns={columns}
          rows={
            users
              ? users.map((user, index) => ({
                  id:
                    index + 1 + paginationModel.page * paginationModel.pageSize,
                  ...user,
                }))
              : []
          }
          slots={{
            toolbar: () => (
              <CustomToolbar
                onAdd={() => {
                  setNewUser((prev) => ({ ...prev, role: activeTab }));
                  setAddAdminModal(true);
                }}
                onUpload={() => setShowUploadScholars(true)}
              />
            ),
          }}
          onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
          processRowUpdate={handleProcessRowUpdate}
          paginationModel={paginationModel}
          pageSizeOptions={[10, 30, 50]}
          loading={loading}
          rowCount={
            rolesWithCount?.find((r) => r.value === activeTab)?.count || 0
          }
          paginationMode="server"
          disableRowSelectionOnClick
          disableColumnMenu
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
            data={rolesWithCount || []}
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

      {/* Scholar Details */}
      <CustomModal
        open={showScholarDetails}
        onClose={() => setShowScholarDetails(false)}
        header="Scholar Details"
      >
        <ScholarDetails scholar={selectedUser} />
      </CustomModal>

      {/* Sessions */}
      <CustomModal open={showSessions} onClose={() => setShowSessions(false)}>
        <Sessions user={selectedUser} />
      </CustomModal>

      {/* Upload Scholar */}
      <CustomModal
        open={showUploadScholars}
        onClose={() => setShowUploadScholars(false)}
        autoClose={false}
      >
        <UploadScholar />
      </CustomModal>
    </Box>
  );
};

export default UserMaster;
