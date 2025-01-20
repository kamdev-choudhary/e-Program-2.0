import { Box, SelectChangeEvent, Grid2 as Grid } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import UploadJEEMainData from "./part/UploadJeeORCR";
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
  openingRank: number;
  closingRank: number;
}

const JEEORCR: React.FC = () => {
  const { isValidResponse } = useGlobalContext();
  const [showUploadData, setShowUploadData] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [data, setData] = useState<DataProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedStream, setSelecttedStream] = useState<string>("");
  const [selectedQuota, setSelectedQuota] = useState<string>("");
  const [selectedSeatType, setSelectedSeatType] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [institutes, setInstitutes] = useState<
    { name: string; value: string }[]
  >([]);
  const [selectedInstitute, setSelectedInstitute] = useState<string>("");
  const [programs, setPrograms] = useState<{ name: string; value: string }[]>(
    []
  );
  const [selectedProgram, setSelectedProgram] = useState<string>("");

  const getAnalysisData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/analysis/jee${selectedStream}/${selectedYear}`
      );
      if (isValidResponse(response)) {
        const fetchedData = response.data.data;
        setData(fetchedData);
        // Extract unique institute names
        const instituteNames = [
          ...new Set(fetchedData.map((item: any) => item.institute)),
        ];

        const programNames = [
          ...new Set(fetchedData.map((item: any) => item.programName)),
        ];
        // Map the unique names into objects with 'name' and 'value' properties
        const instituteObjects: { name: string; value: string }[] =
          instituteNames.map((name: any) => ({
            name,
            value: name, // You can use a different value if needed (e.g., an ID)
          }));

        const programObjects: { name: string; value: string }[] =
          programNames.map((name: any) => ({
            name,
            value: name,
          }));

        // Store the institutes in the state
        setInstitutes(instituteObjects);
        setPrograms(programObjects);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const rows = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .filter((d) => {
        const quotaMatch = selectedQuota ? d.quota === selectedQuota : true;
        const seatTypeMatch = selectedSeatType
          ? d.seatType === selectedSeatType
          : true;
        const genderMatch = selectedGender ? d.gender === selectedGender : true;
        const instituteMatch = selectedInstitute
          ? d.institute === selectedInstitute
          : true;
        const programMatch = selectedProgram
          ? d.programName === selectedProgram
          : true;
        return (
          quotaMatch &&
          seatTypeMatch &&
          genderMatch &&
          instituteMatch &&
          programMatch
        );
      })
      .map((d, index) => ({
        ...d,
        id: index + 1,
        openingRank: parseInt(d.openingRank, 10) || 0,
        closingRank: parseInt(d.closingRank, 10) || 0,
      }));
  }, [
    data,
    selectedQuota,
    selectedSeatType,
    selectedGender,
    selectedInstitute,
    selectedProgram,
  ]);

  useEffect(() => {
    if (!selectedYear || !selectedStream) return;
    getAnalysisData();
  }, [selectedYear, selectedStream]);

  const columns: GridColDef[] = [
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
      <Box sx={{ mb: 1 }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
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
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <CustomDropDown
              data={years}
              value={selectedYear}
              onChange={(e: SelectChangeEvent) =>
                setSelectedYear(e.target.value)
              }
              name="name"
              dropdownValue="value"
              label="Year"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <CustomDropDown
              data={[
                { name: "Gender Neutral", value: "Gender-Neutral" },
                {
                  name: "Female Only",
                  value: "Female-only (including Supernumerary)",
                },
              ]}
              value={selectedGender}
              onChange={(e: SelectChangeEvent) =>
                setSelectedGender(e.target.value)
              }
              label="Gender"
              name="name"
              dropdownValue="value"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <CustomDropDown
              data={[
                { name: "Home State", value: "HS" },
                { name: "Other State", value: "OS" },
                { name: "Goa", value: "GO" },
                { name: "Jammu & Kashmir", value: "JK" },
              ]}
              value={selectedQuota}
              onChange={(e: SelectChangeEvent) =>
                setSelectedQuota(e.target.value)
              }
              label="Quota"
              name="name"
              dropdownValue="value"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <CustomDropDown
              data={[
                { name: "GENERAL", value: "OPEN" },
                { name: "GENERAL PwD", value: "OPEN (PwD)" },
                { name: "OBC-NCL", value: "OBC-NCL" },
                { name: "OBC-NCL PwD", value: "OBC-NCL (PwD)" },
                { name: "ST", value: "ST" },
                { name: "ST PwD", value: "ST (PwD)" },
                { name: "SC PwD", value: "SC (PwD)" },
              ]}
              value={selectedSeatType}
              onChange={(e: SelectChangeEvent) =>
                setSelectedSeatType(e.target.value)
              }
              label="Seat Type"
              name="name"
              dropdownValue="value"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <CustomDropDown
              data={
                institutes.length > 0
                  ? institutes
                  : [{ name: "No Institutes Available", value: "" }]
              }
              value={selectedInstitute}
              onChange={(e: SelectChangeEvent) =>
                setSelectedInstitute(e.target.value)
              }
              label="Institute"
              name="name"
              dropdownValue="value"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <CustomDropDown
              data={programs || []}
              value={selectedProgram}
              onChange={(e: SelectChangeEvent) =>
                setSelectedProgram(e.target.value)
              }
              label="Program"
              name="name"
              dropdownValue="value"
            />
          </Grid>
        </Grid>
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
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[20, 50, 100, 200]}
        disableRowSelectionOnClick
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
