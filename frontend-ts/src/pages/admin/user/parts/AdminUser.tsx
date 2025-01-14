import { Box, Button, IconButton, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import { CustomToolbar } from "../../../../components/CustomToolbar";
import axios from "../../../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../../../contexts/GlobalProvider";
import { CustomModal } from "../../../../components/CustomModal";
import Swal from "sweetalert2";
import { DeleteRounded, EditRounded } from "@mui/icons-material";

interface Admin {
  _id: string;
  email: string;
  name: string;
  mobile: string;
}

interface NewAdmin {
  email: string;
  name: string;
  mobile: string;
  role: string;
}

const AdminUser: React.FC = () => {
  const { isValidResponse } = useGlobalContext();
  const [admins, setAdmins] = useState<Admin[] | null>(null);
  const [addAdminModal, setAddAdminModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [newAdmin, setNewAdmin] = useState<NewAdmin>({
    email: "",
    mobile: "",
    name: "",
    role: "admin",
  });

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("/user/role/admin");

      if (isValidResponse(response)) {
        setAdmins(response.data.users);
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
        setAdmins(response.data.users);
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
            setAdmins(admins?.filter((student) => student._id !== id) || []);
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

  const columns: GridColDef[] = [
    { field: "id", headerName: "SN", width: 80 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 200 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "mobile", headerName: "Mobile", flex: 1, minWidth: 200 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <>{params.row.status === 1 ? "Active" : "Not Active"}</>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <>{params.row.createdAt.split("T")[0]}</>,
    },
    {
      field: "edit",
      headerName: "Edit / Delete",
      minWidth: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Box
            sx={{ display: "flex", gap: 2, mt: 1, justifyContent: "center" }}
          >
            <IconButton>
              <EditRounded />
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
    return admins?.map((admin, index) => ({ ...admin, id: index + 1 }));
  }, [admins]);

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
                onAddButtonClick={() => setAddAdminModal(true)}
              />
            ),
          }}
          loading={loading}
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
            minWidth: 350,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Name"
            value={newAdmin.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewAdmin((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <TextField
            fullWidth
            label="Email"
            value={newAdmin.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewAdmin((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <TextField
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
    </Box>
  );
};

export default AdminUser;
