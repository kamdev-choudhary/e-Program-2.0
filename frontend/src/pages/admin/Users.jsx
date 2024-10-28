import React, { useEffect, useMemo, useState } from "react";
import ScrollableTabs from "../../components/ScrollableTabs";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { API_URL, icons } from "../../constants/helper";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useGlobalProvider } from "../../GlobalProvider";
import CustomToolbar from "../../components/CustomToolbar";
import { CustomModal } from "../../components/CustomModal";
import CustomDropDown from "../../components/CustomDropDown";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";

const tabs = [
  { name: "Admin", value: "admin", icon: icons.admin },
  { name: "Students", value: "student", icon: icons.users },
];

function Users() {
  const { isValidResponse } = useGlobalProvider();
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("admin");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [showUser, setShowUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
    name: "",
    role: "",
  });

  const getUsersByRole = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.get(`${API_URL}/user/role/${selectedTab}`);
      if (isValidResponse(response)) {
        setUsers(response?.data?.users);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    getUsersByRole();
  }, [selectedTab]);

  const columns = [
    { field: "id", headerName: "SN", width: 60 },
    { field: "name", headerName: "Name", width: 150, flex: 1 },
    { field: "email", headerName: "Email", width: 150, flex: 1 },
    { field: "mobile", headerName: "Mobile", width: 150, flex: 1 },
    {
      field: "details",
      headerName: "Details",
      width: 150,
      flex: 1,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleShowDetails(params.row)}>View</Button>
        </>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      flex: 1,
      renderCell: (params) => (
        <>
          <Box>
            <IconButton onClick={() => handleEditUser(params.row)}>
              <EditRounded />
            </IconButton>
            <IconButton onClick={() => handleDeleteUser(params.row)}>
              <DeleteRounded />
            </IconButton>
          </Box>
        </>
      ),
    },
  ];

  const rows = useMemo(() => {
    return users?.map((u, index) => ({
      id: index + 1,
      ...u,
    }));
  }, [users]);

  const handleShowDetails = (user) => {
    setSelectedUser(user);
    setShowUser(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUser(true);
  };

  const handleDeleteUser = async (user) => {
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
        dispatch({ type: "SET_LOADING", payload: true });
        const response = await axios.delete(`${API_URL}/user/${user._id}`);
        if (isValidResponse(response)) {
          setUsers(response.data.users);
          Swal.fire({
            title: "Deleted!",
            text: "The user has been deleted.",
            icon: "success",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "There was an error deleting the user.",
          icon: "error",
        });
        console.error("Delete user error:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }
  };

  const handleSaveNewUser = async () => {
    if (validateFields(newUser)) {
      const response = await axios.post(`${API_URL}/auth/register`, {
        ...newUser,
        method: "admin",
        password: "Password",
      });
      if (isValidResponse(response)) {
        setShowAddUserModal(false);
        setNewUser({ name: "", email: "", mobile: "", role: "" });
      }
    }
  };

  const handleSaveEditUser = async () => {
    if (validateFields(selectedUser)) {
      const response = await axios.patch(
        `${API_URL}/user/${selectedUser?._id}`,
        {
          ...selectedUser,
        }
      );
      if (isValidResponse(response)) {
        setShowEditUser(false);
        setSelectedUser({ name: "", email: "", mobile: "", role: "" });
      }
    }
  };

  const validateFields = (user) => {
    const newErrors = {
      email: "",
      mobile: "",
      name: "",
      password: "",
    };
    let isValid = true;

    if (!user.name) {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    if (!user.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Email is invalid.";
      isValid = false;
    }
    if (!user.mobile) {
      newErrors.mobile = "Mobile number is required.";
      isValid = false;
    }
    if (!user.role) {
      newErrors.role = "Role is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChanges = (e) => {
    setNewUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors.email || errors.name || errors.mobile || errors.role) {
      setErrors({
        email: "",
        mobile: "",
        name: "",
        role: "",
      });
    }
  };

  return (
    <Box>
      <Box>
        <ScrollableTabs
          tabs={tabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </Box>

      <Box component={Paper}>
        <DataGrid
          columns={columns}
          rows={rows}
          slots={{
            toolbar: () => (
              <CustomToolbar
                onAddButtonClick={() => setShowAddUserModal(true)}
              />
            ),
          }}
          initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
          pageSizeOptions={[10, 20, 50]}
        />
      </Box>

      {/* Add User */}
      <CustomModal
        open={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        header="Add User"
        height="auto"
        width="auto"
        showFullScreenButton={false}
      >
        <Box sx={{ minWidth: 400, rowGap: 1.5, display: "grid" }}>
          <CustomDropDown
            data={tabs}
            value={newUser.role}
            onChange={(e) => {
              setNewUser((prev) => ({ ...prev, role: e.target.value }));
              if (errors.role) {
                setErrors((prev) => ({ ...prev, role: "" }));
              }
            }}
            label="Account Type"
            dropdownValue="value"
            name="name"
            error={!!errors.role}
            helperText={errors.role}
          />

          <TextField
            label="Name"
            size="small"
            fullWidth
            value={newUser.name}
            onChange={(e) => handleInputChanges(e)}
            name="name"
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            size="small"
            fullWidth
            value={newUser.email}
            onChange={(e) => handleInputChanges(e)}
            name="email"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Mobile"
            size="small"
            fullWidth
            value={newUser.mobile}
            onChange={(e) => handleInputChanges(e)}
            name="mobile"
            error={!!errors.mobile}
            helperText={errors.mobile}
          />
          <Button onClick={handleSaveNewUser} variant="contained" fullWidth>
            Save
          </Button>
        </Box>
      </CustomModal>

      {/* Show User */}
      <CustomModal
        open={showUser}
        header="User Details"
        onClose={() => setShowUser(false)}
        height="auto"
        width="450px"
      >
        <Box sx={{ display: "grid", rowGap: 1 }}>
          <Typography>
            <span style={{ fontWeight: 600 }}>Name : </span>
            {selectedUser?.name}
          </Typography>{" "}
          <Typography>
            <span style={{ fontWeight: 600 }}>Email : </span>
            {selectedUser?.email}
          </Typography>
          <Typography>
            <span style={{ fontWeight: 600 }}>Mobile : </span>
            {selectedUser?.mobile}
          </Typography>
        </Box>
      </CustomModal>

      {/* Edit User */}
      <CustomModal
        open={showEditUser}
        onClose={() => setShowEditUser(false)}
        header="Edit User"
        height="auto"
        width="auto"
        showFullScreenButton={false}
      >
        <Box sx={{ minWidth: 400, rowGap: 1.5, display: "grid" }}>
          <CustomDropDown
            data={tabs}
            value={selectedUser.role}
            onChange={(e) => {
              setSelectedUser((prev) => ({ ...prev, role: e.target.value }));
              if (errors.role) {
                setErrors((prev) => ({ ...prev, role: "" }));
              }
            }}
            label="Account Type"
            dropdownValue="value"
            name="name"
            error={!!errors.role}
            helperText={errors.role}
          />

          <TextField
            label="Name"
            size="small"
            fullWidth
            value={selectedUser.name}
            onChange={(e) => handleInputChanges(e)}
            name="name"
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            size="small"
            fullWidth
            value={selectedUser.email}
            onChange={(e) => handleInputChanges(e)}
            name="email"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Mobile"
            size="small"
            fullWidth
            value={selectedUser.mobile}
            onChange={(e) => handleInputChanges(e)}
            name="mobile"
            error={!!errors.mobile}
            helperText={errors.mobile}
          />
          <Button onClick={handleSaveEditUser} variant="contained" fullWidth>
            Save
          </Button>
        </Box>
      </CustomModal>
    </Box>
  );
}

export default Users;
