import {
  Box,
  Button,
  IconButton,
  SelectChangeEvent,
  Grid2 as Grid,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import {
  DataArrayRounded,
  DeleteRounded,
  UploadFileRounded,
  YouTube,
} from "@mui/icons-material";
import { CustomModal } from "../../../components/CustomModal";
import UploadExcel from "./UploadExcel";
import UploadVideo from "./UploadVideo";
import YouTubeVideoPlayer from "../../../components/YoutubePlayer";
import { CustomToolbar } from "../../../components/CustomToolbar";
import AddSingleLecture from "./AddSingleLecture";
import Swal from "sweetalert2";
import CustomDropDown from "../../../components/CustomDropDown";
import { getClasses } from "../../../api/academic";
import { getYouTubeId } from "../../../utils/commonfs";
import axios from "../../../hooks/AxiosInterceptor";

interface Lecture {
  _id: string;
  title: string;
  subject: string;
  className: string;
  chapter: string;
  topic: string;
  link: string;
  linkType: string;
  facultyName: string;
  lectureNumber: string;
}

interface ClassItem {
  _id?: string;
  name: string;
  value: string;
}

const Lectures: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[] | null>(null);
  const [faculties, setFaculties] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showExcelUpload, setShowExcelUpload] = useState<boolean>(false);
  const [showVideoUpload, setShowVideoUpload] = useState<boolean>(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [showYoutubePlayer, setShowYoutubePlayer] = useState<boolean>(false);
  const [showAddSingleLecture, setShowAddSingleLecture] =
    useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [totalLectures, setTotalLectures] = useState<number>(0); // Total count from backend
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");
  const [classes, setClasses] = useState<ClassItem[] | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("");

  const fetchClasses = async () => {
    try {
      const response = await getClasses();
      setClasses(response.data.classes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const getLectures = async (page: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await axios.get("/lectures", {
        params: {
          page: page + 1,
          limit: pageSize,
          facultyName: selectedFaculty || undefined,
          className: selectedClass || undefined,
        },
      });
      setLectures(response.data.lectures || []);
      setTotalLectures(response.data.totalCount || 0);
      setFaculties(response.data.faculties);
    } catch (error) {
      console.error("Failed to fetch lectures:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data whenever pagination changes
  useEffect(() => {
    const { page, pageSize } = paginationModel;
    getLectures(page, pageSize);
  }, [paginationModel, selectedClass, selectedFaculty]);

  const rows = useMemo(() => {
    if (!lectures) return [];
    return lectures.map((lecture, index) => ({
      id: index + 1, // Unique ID for DataGrid
      ...lecture,
    }));
  }, [lectures]);

  // Cell update
  const handleProcessRowUpdate = async (
    newRow: Lecture,
    oldRow: Lecture
  ): Promise<Lecture> => {
    const hasChanges = Object.keys(newRow).some(
      (key) => newRow[key as keyof Lecture] !== oldRow[key as keyof Lecture]
    );

    if (!hasChanges) {
      return oldRow;
    }
    setLectures((prevData) => {
      if (!prevData) return null;
      return prevData.map((item) =>
        item._id === oldRow._id ? { ...item, ...newRow } : item
      );
    });

    const { _id, ...updateField } = newRow;

    try {
      await axios.patch(`/lectures/${oldRow._id}`, {
        lectureDataToUpdate: updateField,
      });
      setLectures((prevData) => {
        if (!prevData) return null;
        return prevData.map((item) =>
          item._id === oldRow._id ? newRow : item
        );
      });
      return newRow;
    } catch (error) {
      console.error("Failed to update the row:", error);
      setLectures((prevData) => {
        if (!prevData) return null;
        return prevData.map((item) =>
          item._id === oldRow._id ? oldRow : item
        );
      });

      throw error;
    }
  };

  const handleDeleteLecture = async (id: string) => {
    if (!id) return;
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
          await axios.delete(`/lectures`);
          setLectures((prevLectures) => {
            return prevLectures
              ? prevLectures.filter((lecture) => lecture._id !== id)
              : null;
          });
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });
    } catch (error) {}
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "SN",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "title",
      headerName: "Lecture Title",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 120,
      editable: true,
    },
    {
      field: "className",
      headerName: "Class",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 50,
      editable: true,
    },
    {
      field: "subject",
      headerName: "Subject",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 80,
      editable: true,
    },
    {
      field: "chapter",
      headerName: "Chapter",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      editable: true,
    },
    {
      field: "topic",
      headerName: "Topic",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      editable: true,
    },
    {
      field: "lectureNumber",
      headerName: "Lecture #",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 50,
      editable: true,
    },
    {
      field: "facultyName",
      headerName: "Faculty Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      editable: true,
    },
    {
      field: "duraction",
      headerName: "Lecture Time",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      editable: true,
    },
    {
      field: "linkType",
      headerName: "Subject",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      editable: true,
    },
    {
      field: "link",
      headerName: "Lecture Link",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      editable: true,
    },
    {
      field: "Actions",
      headerName: "Play",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      renderCell: (params) => (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <IconButton onClick={() => handleDeleteLecture(params.row._id)}>
              <DeleteRounded />
            </IconButton>
            <IconButton
              onClick={() => {
                setSelectedLecture(params.row);
                setShowYoutubePlayer(true);
              }}
            >
              <YouTube sx={{ color: "red" }} />
            </IconButton>
          </Box>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <CustomDropDown
            data={classes || []}
            value={selectedClass}
            onChange={(e: SelectChangeEvent) =>
              setSelectedClass(e.target.value)
            }
            label="Classes"
            name="name"
            dropdownValue="value"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <CustomDropDown
            data={faculties || []}
            value={selectedFaculty || ""}
            label="Faculty"
            name="facultyName"
            dropdownValue="facultyName"
            onChange={(e: SelectChangeEvent) =>
              setSelectedFaculty(e.target.value)
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              sx={{ flexGrow: 1 }}
              startIcon={<DataArrayRounded />}
              onClick={() => setShowExcelUpload(true)}
              variant="contained"
            >
              Upload Excel
            </Button>
            <Button
              variant="contained"
              sx={{ flexGrow: 1 }}
              startIcon={<UploadFileRounded />}
              onClick={() => setShowVideoUpload(true)}
            >
              Upload Lecture
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box>
        <DataGrid
          columns={columns}
          rows={rows}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          processRowUpdate={handleProcessRowUpdate}
          disableRowSelectionOnClick
          slots={{
            toolbar: () => (
              <CustomToolbar
                showAddButton={true}
                showRefreshButton={true}
                onAddButtonClick={() => setShowAddSingleLecture(true)}
              />
            ),
          }}
          paginationModel={paginationModel} // Controlled pagination
          onPaginationModelChange={(newModel) => setPaginationModel(newModel)} // Handle page changes
          pageSizeOptions={[10, 20, 50]} // Options for page size
          rowCount={totalLectures} // Total count from backend
          paginationMode="server" // Server-side pagination
          disableColumnMenu
          rowBufferPx={5}
        />
      </Box>

      {/* Upload Excel File */}
      <CustomModal
        open={showExcelUpload}
        onClose={() => setShowExcelUpload(false)}
        header="Upload Excel"
        height="95svh"
        width="90vw"
        autoClose={false}
      >
        <UploadExcel
          setShowExcelUpload={setShowExcelUpload}
          setLectures={setLectures}
          lectures={lectures}
        />
      </CustomModal>

      {/* Upload Video */}
      <CustomModal
        open={showVideoUpload}
        onClose={() => setShowVideoUpload(false)}
        header="Upload Video"
        height="95svh"
        width="90vw"
        autoClose={false}
      >
        <UploadVideo />
      </CustomModal>
      {/* Youtube Player */}
      <CustomModal
        open={showYoutubePlayer}
        onClose={() => {
          setShowYoutubePlayer(false);
          setSelectedLecture(null);
        }}
        showHeader={false}
        height="auto"
      >
        <YouTubeVideoPlayer
          videoId={getYouTubeId(selectedLecture?.link || "") || ""}
        />
      </CustomModal>

      {/* Add Single Lecture */}
      <CustomModal
        open={showAddSingleLecture}
        onClose={() => setShowAddSingleLecture(false)}
        height="auto"
        header="Add New Lecture"
      >
        <AddSingleLecture
          lectures={lectures}
          setShowAddSingleLecture={setShowAddSingleLecture}
          setLectures={setLectures}
        />
      </CustomModal>
    </Box>
  );
};

export default Lectures;
