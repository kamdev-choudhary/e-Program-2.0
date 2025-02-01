import React, { useEffect, useState } from "react";
import { Box, Button, Container, SelectChangeEvent } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddAdvancedCutoff from "./part/AddAdvancedCutoff";
import { CustomModal } from "../../../components/CustomModal";
import CustomDropDown from "../../../components/CustomDropDown";
import axios from "../../../hooks/AxiosInterceptor";
import { DownloadRounded } from "@mui/icons-material";
import { downloadJsonToExcel } from "../../../utils/commonfs";

interface CategoryProp {
  subject: number;
  total: number;
}

interface DataProps {
  _id: string;
  general: CategoryProp;
  ews: CategoryProp;
  obc: CategoryProp;
  st: CategoryProp;
  sc: CategoryProp;
  generalPwD: CategoryProp;
  ewsPwD: CategoryProp;
  obcPwD: CategoryProp;
  stPwD: CategoryProp;
  preparatory: CategoryProp;
}

const JEEAdvancedCutoff: React.FC = () => {
  const [showAddCutoff, setShowAddCutoff] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [data, setData] = useState<DataProps | null>(null);

  const getJeeAdvancedCutoff = async () => {
    try {
      const res = await axios.get("/analysis/cutoff/jeeadvanced", {
        params: {
          year: selectedYear,
        },
      });
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!selectedYear) return;
    getJeeAdvancedCutoff();
  }, [selectedYear]);

  // Preparing the rows data for DataGrid
  const rows = data
    ? [
        {
          id: 1,
          category: "General",
          subjectCutoff: data.general.subject,
          totalCutoff: data.general.total,
        },
        {
          id: 2,
          category: "EWS",
          subjectCutoff: data.ews.subject,
          totalCutoff: data.ews.total,
        },
        {
          id: 3,
          category: "OBC",
          subjectCutoff: data.obc.subject,
          totalCutoff: data.obc.total,
        },
        {
          id: 4,
          category: "ST",
          subjectCutoff: data.st.subject,
          totalCutoff: data.st.total,
        },
        {
          id: 5,
          category: "SC",
          subjectCutoff: data.sc.subject,
          totalCutoff: data.sc.total,
        },
        {
          id: 6,
          category: "General PwD",
          subjectCutoff: data.generalPwD.subject,
          totalCutoff: data.generalPwD.total,
        },
        {
          id: 7,
          category: "EWS PwD",
          subjectCutoff: data.ewsPwD.subject,
          totalCutoff: data.ewsPwD.total,
        },
        {
          id: 8,
          category: "OBC PwD",
          subjectCutoff: data.obcPwD.subject,
          totalCutoff: data.obcPwD.total,
        },
        {
          id: 9,
          category: "ST PwD",
          subjectCutoff: data.stPwD.subject,
          totalCutoff: data.stPwD.total,
        },
        {
          id: 10,
          category: "Preparotary",
          subjectCutoff: data.preparatory.subject,
          totalCutoff: data.preparatory.total,
        },
      ]
    : [];

  // Define the columns for DataGrid
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "SN",
      width: 90,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "category",
      headerName: "Category",
      width: 180,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "subjectCutoff",
      headerName: "Subject Cutoff",
      width: 180,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalCutoff",
      headerName: "Total Cutoff",
      width: 180,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", minWidth: 350 }}>
          <CustomDropDown
            label="Select Year"
            data={[{ name: "2024", value: "2024" }]} // Ensure value is a string here
            name="name"
            dropdownValue="value"
            value={selectedYear}
            onChange={(e: SelectChangeEvent) => setSelectedYear(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<DownloadRounded />}
            disabled={!selectedYear}
            onClick={() =>
              downloadJsonToExcel({
                jsonData: rows || [],
                fileName: `JEE Advanced Cutoff ${selectedYear}.xlsx`,
              })
            }
          >
            Download
          </Button>
          <Button onClick={() => setShowAddCutoff(true)} variant="contained">
            Add New Cutoff
          </Button>
        </Box>
      </Box>

      <Container maxWidth="md">
        <DataGrid rows={rows} columns={columns} />
      </Container>

      {/* Add Cutoff Modal */}
      <CustomModal
        open={showAddCutoff}
        onClose={() => setShowAddCutoff(false)}
        width="auto"
      >
        <AddAdvancedCutoff />
      </CustomModal>
    </Box>
  );
};

export default JEEAdvancedCutoff;
