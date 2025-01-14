import { Box, Switch } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import { CustomToolbar } from "../../../../components/CustomToolbar";
import axios from "../../../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../../../contexts/GlobalProvider";
import { CustomModal } from "../../../../components/CustomModal";

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
  const [admins, SetAdmins] = useState<Admin[] | null>(null);
  const [addAdminModal, setAddAdminModal] = useState<boolean>(false);
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
        SetAdmins(response.data.users);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

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
  ];

  const rows = useMemo(() => {
    return admins?.map((admin, index) => ({ ...admin, id: index + 1 }));
  }, [admins]);

  return (
    <Box sx={{ p: 2 }}>
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
        />
      </Box>
      <CustomModal
        open={addAdminModal}
        onClose={() => setAddAdminModal(false)}
        height="auto"
        width="auto"
      >
        <Box sx={{ minWidth: 350 }}></Box>
      </CustomModal>
    </Box>
  );
};

export default AdminUser;
