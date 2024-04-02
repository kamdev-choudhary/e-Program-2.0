import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { useAuth } from "../components/Auth";

const API_URL = "http://127.0.0.1:5000/api";

export default function OnlineExams() {
  const [studentBatch, setStudentBatch] = useState([]);
  const [error, setError] = useState("");

  const { batchId } = useAuth();

  useEffect(() => {
    fetch(`${API_URL}/batch/${batchId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setStudentBatch(data.batch))
      .catch((error) => setError(error.message));
  }, []);

  const currentDate = new Date(Date.now());
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  console.log(formattedDateTime);

  const ExamsPaper = styled(Paper)(({ theme }) => ({
    width: 300,
    // height: 120,
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: "left",
  }));
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: "100%",
          },
        }}
      >
        <Paper sx={{ padding: "1rem" }} elevation={10}>
          <div className="row">
            <div className="col-md-12">
              <h4>Active Exams</h4>
            </div>
            <hr />
            <Stack direction="row" spacing={2}>
              <ExamsPaper square={false}>
                <div className="row d-flex gap-2 ">
                  <div className="col-12 ">
                    <h5>Exam Name</h5>
                  </div>
                  <hr />
                  <div className="col-12">Scheduled On : </div>
                  <div className="col-12">Exam Marks : </div>
                  <div className="col-12">Exam Pattern : </div>
                  <div className="col-12">Exam Start time : </div>

                  <hr />
                  <Button variant="contained" color="success">
                    Start Exam
                  </Button>
                </div>
              </ExamsPaper>
            </Stack>
          </div>
        </Paper>
        <Paper sx={{ padding: "1rem" }} elevation={10}>
          <div className="row">
            <div className="col-md-12">
              <h4>Upcoming Exams</h4>
            </div>
            <hr />
            <Stack direction="row" spacing={2}>
              <ExamsPaper square={false}>
                <div className="row d-flex gap-2 ">
                  <div className="col-12 ">
                    <h5>Exam Name</h5>
                  </div>
                  <hr />
                  <div className="col-12">Scheduled On : </div>
                  <div className="col-12">Exam Marks : </div>
                  <div className="col-12">Exam Pattern : </div>
                  <div className="col-12">Exam Start time : </div>

                  <hr />
                  <Button disabled variant="contained" color="success">
                    Upcoming
                  </Button>
                </div>
              </ExamsPaper>
            </Stack>
          </div>
        </Paper>
        <Paper sx={{ padding: "1rem" }} elevation={10}>
          <div className="row">
            <div className="col-md-12">
              <h4>Appeared</h4>
            </div>
            <hr />
            <Stack direction="row" spacing={2}>
              <ExamsPaper square={false}>
                <div className="row d-flex gap-2 ">
                  <div className="col-12 ">
                    <h5>Exam Name</h5>
                  </div>
                  <hr />
                  <div className="col-12">Scheduled On : </div>
                  <div className="col-12">Exam Marks : </div>
                  <div className="col-12">Exam Pattern : </div>
                  <div className="col-12">Exam Start time : </div>

                  <hr />
                  <Button variant="contained">View Result</Button>
                </div>
              </ExamsPaper>
            </Stack>
          </div>
        </Paper>
        <Paper sx={{ padding: "1rem" }} elevation={10}>
          <div className="row">
            <div className="col-md-12">
              <h4>Missed</h4>
            </div>
            <hr />
            <Stack direction="row" spacing={2}>
              <ExamsPaper square={false}>
                <div className="row d-flex gap-2 ">
                  <div className="col-12 ">
                    <h5>Exam Name</h5>
                  </div>
                  <hr />
                  <div className="col-12">Scheduled On : </div>
                  <div className="col-12">Exam Marks : </div>
                  <div className="col-12">Exam Pattern : </div>
                  <div className="col-12">Exam Start time : </div>

                  <hr />
                  <Button disabled variant="contained" color="error">
                    Missed
                  </Button>
                </div>
              </ExamsPaper>
            </Stack>
          </div>
        </Paper>
      </Box>
    </>
  );
}
