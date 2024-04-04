import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { useAuth } from "../components/Auth";

const API_URL = "http://127.0.0.1:5000/api";

export default function OnlineExams({ handleExamStart }) {
  const [studentBatch, setStudentBatch] = useState([]);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [currDate, setCurrDate] = useState("");
  const [currTime, setCurrTime] = useState("");
  const [startExam, setStartExam] = useState("");

  const { batchId } = useAuth();

  const handleExamStartButtonClick = (examTemplateId) => {
    handleExamStart(examTemplateId);
  };

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

    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const hours = String(currentDate.getHours()).padStart(2, "0");
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");
      // const seconds = String(currentDate.getSeconds()).padStart(2, "0");

      setCurrDate(`${year}-${month}-${day}`);
      setCurrTime(`${hours}:${minutes}`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [batchId]);

  if (studentBatch.length === 0) {
    return <div>Loading...</div>;
  }

  const ExamsPaper = styled(Paper)(({ theme }) => ({
    width: 300,
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
              {studentBatch.slots.map((slot, index) => {
                if (
                  new Date(slot.examDate + " " + slot.examStartTime) <=
                    new Date(currDate + " " + currTime) &&
                  new Date(currDate + " " + currTime) <=
                    new Date(slot.examDate + " " + slot.examEndTime)
                ) {
                  const examTemplate = studentBatch.examTemplates.find(
                    (examTemplate) => examTemplate._id === slot.examTemplateId
                  );
                  if (examTemplate) {
                    return (
                      <ExamsPaper square={false} key={index} elevation={5}>
                        <div className="row d-flex gap-2 ">
                          <div className="col-12 ">
                            <h5>Exam Name : {examTemplate.examName}</h5>
                          </div>
                          <hr />
                          <div className="col-12">
                            Scheduled On : {slot.examDate}
                          </div>
                          <div className="col-12">Exam Marks : </div>
                          <div className="col-12">
                            Exam Pattern : {examTemplate.examPattern}
                          </div>
                          <div className="col-12">
                            Exam Start time : {slot.examStartTime}{" "}
                          </div>
                          <div className="col-12">
                            Exam End time : {slot.examEndTime}{" "}
                          </div>

                          <hr />
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() =>
                              handleExamStartButtonClick(examTemplate._id)
                            }
                          >
                            Start Exam
                          </Button>
                        </div>
                      </ExamsPaper>
                    );
                  }
                }
                return null;
              })}
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
              {studentBatch.slots.map((slot, index) => {
                if (
                  new Date(slot.examDate + " " + slot.examStartTime) >
                  new Date(currDate + " " + currTime)
                ) {
                  const examTemplate = studentBatch.examTemplates.find(
                    (examTemplate) => examTemplate._id === slot.examTemplateId
                  );
                  if (examTemplate) {
                    return (
                      <ExamsPaper square={false} key={index} elevation={5}>
                        <div className="row d-flex gap-2 ">
                          <div className="col-12 ">
                            <h5>Exam Name : {examTemplate.examName}</h5>
                          </div>
                          <hr />
                          <div className="col-12">
                            Scheduled On : {slot.examDate}
                          </div>
                          <div className="col-12">Exam Marks : </div>
                          <div className="col-12">
                            Exam Pattern : {examTemplate.examPattern}
                          </div>
                          <div className="col-12">
                            Exam Start time : {slot.examStartTime}{" "}
                          </div>
                          <div className="col-12">
                            Exam End time : {slot.examEndTime}{" "}
                          </div>

                          <hr />
                          <Button disabled variant="contained" color="success">
                            Upcoming
                          </Button>
                        </div>
                      </ExamsPaper>
                    );
                  }
                }
                return null;
              })}
            </Stack>
          </div>
        </Paper>
        <Paper sx={{ padding: "1rem" }} elevation={10}>
          <div className="row">
            <div className="col-md-12">
              <h4>Appeared</h4>
            </div>
            <hr />
            {/* <Stack direction="row" spacing={2}>
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
            </Stack> */}
          </div>
        </Paper>
        <Paper sx={{ padding: "1rem" }} elevation={10}>
          <div className="row">
            <div className="col-md-12">
              <h4>Missed</h4>
            </div>
            <hr />
            <Stack direction="row" spacing={2}>
              {studentBatch.slots.map((slot, index) => {
                if (
                  new Date(currDate + " " + currTime) >
                  new Date(slot.examDate + " " + slot.examEndTime)
                ) {
                  const examTemplate = studentBatch.examTemplates.find(
                    (examTemplate) => examTemplate._id === slot.examTemplateId
                  );
                  if (examTemplate) {
                    return (
                      <ExamsPaper square={false} key={index} elevation={5}>
                        <div className="row d-flex gap-2 ">
                          <div className="col-12 ">
                            <h5>Exam Name : {examTemplate.examName}</h5>
                          </div>
                          <hr />
                          <div className="col-12">
                            Scheduled On : {slot.examDate}
                          </div>
                          <div className="col-12">Exam Marks : </div>
                          <div className="col-12">
                            Exam Pattern : {examTemplate.examPattern}
                          </div>
                          <div className="col-12">
                            Exam Start time : {slot.examStartTime}{" "}
                          </div>
                          <div className="col-12">
                            Exam End time : {slot.examEndTime}{" "}
                          </div>

                          <hr />
                          <Button disabled variant="contained" color="success">
                            Missed
                          </Button>
                        </div>
                      </ExamsPaper>
                    );
                  }
                }
                return null;
              })}
            </Stack>
          </div>
        </Paper>
      </Box>
    </>
  );
}
