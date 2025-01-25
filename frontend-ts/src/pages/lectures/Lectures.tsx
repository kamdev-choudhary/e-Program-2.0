import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  IconButton,
  SelectChangeEvent,
  Grid2 as Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import axios from "../../hooks/AxiosInterceptor";
import { CancelRounded, YouTube } from "@mui/icons-material";
import YouTubeVideoPlayer from "../../components/YoutubePlayer";
import { useGlobalContext } from "../../contexts/GlobalProvider";
import { getAllSubjects, getClasses } from "../../api/academic";
import CustomDropDown from "../../components/CustomDropDown";
import { getYouTubeId } from "../../utils/commonfs";

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

const Lectures: React.FC = () => {
  const { isValidResponse } = useGlobalContext();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [totalLectures, setTotalLectures] = useState<number>(0); // Total count from backend
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [showYoutubePlayer, setShowYoutubePlayer] = useState<boolean>(false);
  const [classes, setClasses] = useState(null);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [chapters, setChapters] = useState<
    | { chapter: string; value: string; subject: string; className: string }[]
    | null
  >(null);
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [subjects, setSubjects] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const getInitialData = async () => {
    try {
      const classResponse = await getClasses();
      if (isValidResponse(classResponse)) {
        setClasses(classResponse.data.classes);
      }
      const SubjectsResponse = await getAllSubjects();
      if (isValidResponse(SubjectsResponse)) {
        setSubjects(SubjectsResponse.data.subjects);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getInitialData();
  }, []);

  // Fetch lectures from backend
  const fetchLectures = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/lectures`, {
        params: {
          page: page + 1, // Backend might use 1-based indexing
          limit: pageSize,
          className: selectedClass,
          subject: selectedSubject || undefined,
          chapter: selectedChapter || undefined,
        },
      });

      if (isValidResponse(response)) {
        setLectures(response.data.lectures);
        setTotalLectures(response.data.totalCount || 0); // Ensure backend sends total count
        setChapters(response.data.chapters);
      }
    } catch (error) {
      console.error("Error fetching lectures:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChapters = useMemo(() => {
    if (!chapters) return [];
    return chapters?.filter((chapter) => {
      const subjectMatch =
        !selectedSubject || chapter.subject === selectedSubject;
      const classMatch = !selectedClass || chapter.className === selectedClass;

      return subjectMatch && classMatch;
    });
  }, [selectedSubject, chapters]);

  // Fetch data whenever pagination changes
  useEffect(() => {
    const { page, pageSize } = paginationModel;
    if (!selectedClass) return;
    fetchLectures(page, pageSize);
  }, [paginationModel, selectedClass, selectedSubject, selectedChapter]);

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
      minWidth: 120,
      editable: false,
      sortable: false,
    },
    {
      field: "className",
      headerName: "Class",
      flex: 1,
      minWidth: 50,
      editable: false,
      maxWidth: 80,
      align: "center",
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "subject",
      headerName: "Subject",
      flex: 1,
      minWidth: 80,
      editable: false,
      sortable: false,
    },
    {
      field: "chapter",
      headerName: "Chapter",
      flex: 1,
      minWidth: 250,
      editable: false,
      sortable: false,
    },
    {
      field: "topic",
      headerName: "Topic",
      flex: 1,
      minWidth: 200,
      editable: false,
      sortable: false,
    },
    {
      field: "lectureNumber",
      headerName: "Lecture #",
      flex: 1,
      minWidth: 50,
      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "facultyName",
      headerName: "Faculty Name",
      flex: 1,
      minWidth: 200,
      editable: false,
      sortable: false,
    },
    {
      field: "Actions",
      headerName: "Play",
      flex: 1,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <IconButton
            onClick={() => {
              setSelectedLecture(params.row);
              setShowYoutubePlayer(true);
            }}
            size="small"
            sx={{
              border: "1px solid rgba(255,255,255,0.6)",
              bgcolor: "#fff",
              ":hover": {
                bgcolor: "#f2f2f2",
              },
            }}
          >
            <YouTube sx={{ color: "red" }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        mb: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              data={classes || []}
              value={selectedClass}
              label="Class"
              name="name"
              dropdownValue="value"
              onChange={(e: SelectChangeEvent) => {
                setSelectedClass(e.target.value);
                setSelectedSubject("");
                setSelectedChapter("");
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              data={subjects || []}
              value={selectedSubject}
              label="Subject"
              name="name"
              dropdownValue="name"
              onChange={(e: SelectChangeEvent) => {
                setSelectedSubject(e.target.value);
                setSelectedChapter("");
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              data={filteredChapters || []}
              value={selectedChapter}
              label="Chapter"
              name="chapter"
              dropdownValue="chapter"
              onChange={(e: SelectChangeEvent) =>
                setSelectedChapter(e.target.value)
              }
            />
          </Grid>
        </Grid>
      </Box>
      <Grid
        direction={isSmallScreen ? "column-reverse" : "row"}
        container
        spacing={2}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <DataGrid
            columns={columns}
            rows={
              lectures
                ? lectures.map((lecture, index) => ({
                    id:
                      index +
                      1 +
                      paginationModel.page * paginationModel.pageSize, // Calculate row index
                    ...lecture,
                  }))
                : []
            }
            loading={loading}
            paginationModel={paginationModel} // Controlled pagination
            onPaginationModelChange={(newModel) => setPaginationModel(newModel)} // Handle page changes
            pageSizeOptions={[10, 20, 50]} // Options for page size
            rowCount={totalLectures} // Total count from backend
            paginationMode="server" // Server-side pagination
            disableRowSelectionOnClick
            disableColumnMenu
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                  title: false,
                  className: false,
                  subject: false,
                  topic: false,
                  facultyName: false,
                },
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {showYoutubePlayer && (
            <Box sx={{ position: "relative" }}>
              <YouTubeVideoPlayer
                data={selectedLecture}
                videoId={getYouTubeId(selectedLecture?.link || "") || ""}
              />
              <IconButton
                color="error"
                onClick={() => {
                  setSelectedLecture(null);
                  setShowYoutubePlayer(false);
                }}
                sx={{ position: "absolute", right: 10, top: 10 }}
              >
                <CancelRounded sx={{ color: "red" }} />
              </IconButton>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Lectures;
