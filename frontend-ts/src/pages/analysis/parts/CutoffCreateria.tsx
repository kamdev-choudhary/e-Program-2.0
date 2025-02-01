import React, { useEffect } from "react";
import { Box, Container, SelectChangeEvent } from "@mui/material";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import CustomDropDown from "../../../components/CustomDropDown";
import axios from "../../../hooks/AxiosInterceptor";

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
  scPwD: CategoryProp;
  preparatory: CategoryProp;
}

interface RowData {
  id: number;
  category: string;
  subjectCutoff: number;
  totalCutoff: number;
}

interface CutoffCreateriaProps {
  selectedYear: string;
  cutoff: DataProps | null;
  setCutoff: (value: DataProps) => void;
  setSelectedYear: (value: string) => void;
}

const CutoffCreateria: React.FC<CutoffCreateriaProps> = ({
  selectedYear,
  cutoff,
  setCutoff,
  setSelectedYear,
}) => {
  const getJeeAdvancedCutoff = async () => {
    try {
      const res = await axios.get("/analysis/cutoff/jeeadvanced", {
        params: {
          year: selectedYear,
        },
      });
      setCutoff(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!selectedYear) return;
    getJeeAdvancedCutoff();
  }, [selectedYear]);

  // Prepare DataGrid rows
  const rows: RowData[] = cutoff
    ? [
        {
          id: 1,
          category: "General",
          subjectCutoff: cutoff.general.subject,
          totalCutoff: cutoff.general.total,
        },
        {
          id: 2,
          category: "EWS",
          subjectCutoff: cutoff.ews.subject,
          totalCutoff: cutoff.ews.total,
        },
        {
          id: 3,
          category: "OBC",
          subjectCutoff: cutoff.obc.subject,
          totalCutoff: cutoff.obc.total,
        },
        {
          id: 4,
          category: "ST",
          subjectCutoff: cutoff.st.subject,
          totalCutoff: cutoff.st.total,
        },
        {
          id: 5,
          category: "SC",
          subjectCutoff: cutoff.sc.subject,
          totalCutoff: cutoff.sc.total,
        },
        {
          id: 6,
          category: "General PwD",
          subjectCutoff: cutoff.generalPwD.subject,
          totalCutoff: cutoff.generalPwD.total,
        },
        {
          id: 7,
          category: "EWS PwD",
          subjectCutoff: cutoff.ewsPwD.subject,
          totalCutoff: cutoff.ewsPwD.total,
        },
        {
          id: 8,
          category: "OBC PwD",
          subjectCutoff: cutoff.obcPwD.subject,
          totalCutoff: cutoff.obcPwD.total,
        },
        {
          id: 9,
          category: "ST PwD",
          subjectCutoff: cutoff.stPwD.subject,
          totalCutoff: cutoff.stPwD.total,
        },
        {
          id: 10,
          category: "Preparotary",
          subjectCutoff: cutoff.preparatory.subject,
          totalCutoff: cutoff.preparatory.total,
        },
      ]
    : [];

  // Define DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "SN",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "category",
      headerName: "Category",
      width: 180,
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "subjectCutoff",
      headerName: "Subject Cutoff",
      width: 180,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },
    {
      field: "totalCutoff",
      headerName: "Total Cutoff",
      width: 180,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },
  ];

  // Handle row updates
  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    if (!cutoff) return newRow;

    const categoryMapping: Record<string, keyof DataProps> = {
      General: "general",
      EWS: "ews",
      OBC: "obc",
      ST: "st",
      SC: "sc",
      "General PwD": "generalPwD",
      "EWS PwD": "ewsPwD",
      "OBC PwD": "obcPwD",
      "ST PwD": "stPwD",
      Preparotary: "preparatory",
    };

    const categoryKey = categoryMapping[oldRow.category];
    if (!categoryKey) return newRow;

    const updatedCutoff: DataProps = {
      ...cutoff,
      [categoryKey]: {
        subject: Number(newRow.subjectCutoff),
        total: Number(newRow.totalCutoff),
      },
    };

    setCutoff(updatedCutoff);
    return newRow;
  };

  console.log(cutoff);

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
            data={[{ name: "2024", value: "2024" }]}
            name="name"
            dropdownValue="value"
            value={selectedYear}
            onChange={(e: SelectChangeEvent) => setSelectedYear(e.target.value)}
            showClearButton={false}
          />
        </Box>
      </Box>

      <Container maxWidth="md">
        <DataGrid
          processRowUpdate={processRowUpdate}
          rows={rows}
          columns={columns}
        />
      </Container>
    </Box>
  );
};

export default CutoffCreateria;
