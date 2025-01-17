import { Box, SelectChangeEvent } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import UploadJEEMainData from "./part/UploadJEEMainData";
import { CustomModal } from "../../../components/CustomModal";
import CustomDropDown from "../../../components/CustomDropDown";
import { useGlobalContext } from "../../../contexts/GlobalProvider";
import axios from "../../../hooks/AxiosInterceptor";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CustomToolbar } from "../../../components/CustomToolbar";

const years = [
  { name: "2024", value: "2024" },
  { name: "2023", value: "2023" },
];

interface DataProps {
  year: string;
  institute: string;
  programName: string;
  quota: string;
  seatType: string;
  gender: string;
  openingRank: string;
  closingRank: string;
}

const JEEORCR: React.FC = () => {
  const { isValidResponse } = useGlobalContext();
  const [showUploadData, setShowUploadData] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [data, setData] = useState<DataProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedStream, setSelecttedStream] = useState<string>("");

  const getAnalysisData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/analysis/jee${selectedStream}/${selectedYear}`
      );
      if (isValidResponse(response)) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const rows = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((d, index) => ({
      ...d,
      id: index + 1,
      openingRank: parseInt(d.openingRank, 10) || 0, // Parse to integer or default to 0
      closingRank: parseInt(d.closingRank, 10) || 0, // Parse to integer or default to 0
    }));
  }, [data, selectedStream]);

  useEffect(() => {
    if (!selectedYear || !selectedStream) return;
    getAnalysisData();
  }, [selectedYear, selectedStream]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "SN",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "year",
      headerName: "Year",
      maxWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 70,
    },
    {
      field: "jee",
      headerName: "JEE",
      minWidth: 80,
      maxWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    { field: "institute", headerName: "Institute", minWidth: 200, flex: 1 },
    {
      field: "programName",
      headerName: "Program Name",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "quota",
      headerName: "Quota",
      maxWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "seatType",
      headerName: "Seat Type",
      width: 120,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "openingRank",
      headerName: "Opening Rank",
      maxWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "closingRank",
      headerName: "Closing Rank",
      maxWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, flex: 1, my: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <CustomDropDown
            value={selectedStream}
            onChange={(e: SelectChangeEvent) =>
              setSelecttedStream(e.target.value)
            }
            data={[
              { name: "JEE Main", value: "main" },
              { name: "JEE Advanced", value: "advanced" },
            ]}
            label="Stream"
            dropdownValue="value"
            name="name"
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <CustomDropDown
            data={years}
            value={selectedYear}
            onChange={(e: SelectChangeEvent) => setSelectedYear(e.target.value)}
            name="name"
            dropdownValue="value"
            label="Year"
          />
        </Box>
      </Box>

      {/* Data Grid */}
      <DataGrid
        columns={columns}
        rows={rows}
        slots={{
          toolbar: () => (
            <CustomToolbar
              showAddButton={true}
              onAddButtonClick={() => setShowUploadData(true)}
            />
          ),
        }}
        loading={loading}
      />

      {/* Upload Data */}
      <CustomModal
        open={showUploadData}
        onClose={() => setShowUploadData(false)}
      >
        <UploadJEEMainData setShowUploadData={setShowUploadData} />
      </CustomModal>
    </Box>
  );
};

export default JEEORCR;
