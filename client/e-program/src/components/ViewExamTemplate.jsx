import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

const API_URL = "http://127.0.0.1:5000/api";

export default function ViewExamTemplate(props) {
  const [examTemplate, setExamTemplate] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ShowAddExamToBatch, setShowAddExamToBatch] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/exams/templates/${props.currTemplate._id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setExamTemplate(data.examTemplate))
      .catch((error) => setError(error.message));
    setLoading(false);
  }, []);

  const handleShowAddExamToBatch = () => {
    setShowAddExamToBatch(!ShowAddExamToBatch);
  };

  if (examTemplate && examTemplate.questionTypes) {
    const questionTypeKeys = Object.keys(examTemplate.questionTypes);
    const templatedetail = examTemplate.questionTypes;
  }

  const style = {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 3,
    borderRadius: 4,
  };

  const handleExamTemplateChange = (e, index) => {
    const { name, value } = e.target;
    const updatedExamTemplate = [...examTemplate];
    updatedExamTemplate[index] = {
      ...updatedExamTemplate[index],
      [name]: value,
    };
    setExamTemplate(updatedExamTemplate);
  };

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <TextField
            fullWidth
            id="outlined-basic-1" // Unique id
            variant="outlined"
            label="Test Name"
            name="examName"
            InputLabelProps={{ shrink: true }}
            value={examTemplate.examName || ""}
            onChange={(e) => handleExamTemplateChange(e, 0)} // Pass index 0 for first item
          />
        </div>
        <div className="col-md-6">
          <TextField
            fullWidth
            id="outlined-basic-2" // Unique id
            variant="outlined"
            label="Exam Pattern"
            name="examPattern" // Unique name
            InputLabelProps={{ shrink: true }}
            value={examTemplate.examPattern || ""}
            onChange={(e) => handleExamTemplateChange(e, 0)} // Pass index 0 for first item
          />
        </div>
      </div>
      <hr />
      <div className="row d-flex text-end mb-2 ">
        <div className="col-md-12 ">
          <Fab
            size="small"
            color="primary"
            aria-label="add"
            onClick={handleShowAddExamToBatch}
          >
            <AddIcon />
          </Fab>
        </div>
      </div>
      <Modal
        open={ShowAddExamToBatch}
        onClose={handleShowAddExamToBatch}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Exam to Batch
          </Typography>
          <hr />
          <TextField
            label="Full Name"
            fullWidth
            id="name"
            name="name"
            style={{ marginBottom: "20px" }}
          />
          <TextField
            label="Full Name"
            fullWidth
            id="name"
            name="name"
            style={{ marginBottom: "20px" }}
          />
          <Button variant="contained" color="success">
            Save
          </Button>
        </Box>
      </Modal>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="bg bg-dark ">
            <TableRow>
              <TableCell align="center" className="text-white">
                Batch
              </TableCell>
              <TableCell align="center" className="text-white">
                Date
              </TableCell>
              <TableCell align="center" className="text-white">
                Start Time
              </TableCell>
              <TableCell align="center" className="text-white">
                End Time
              </TableCell>
              <TableCell align="center" className="text-white">
                Remove
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examTemplate.examAddedFor && (
              <>
                <TableRow>
                  <TableCell align="center">Single Correct</TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.singleCorrect.totalQuestions}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.singleCorrect.positiveMarks}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.singleCorrect.partialMarks}
                  </TableCell>
                  <TableCell align="center">
                    <DeleteIcon />
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <hr />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="bg bg-success ">
            <TableRow>
              <TableCell align="center" className="text-white">
                Question Type
              </TableCell>
              <TableCell align="center" className="text-white">
                # of Questions
              </TableCell>
              <TableCell align="center" className="text-white">
                Positive Marks
              </TableCell>
              <TableCell align="center" className="text-white">
                Partial
              </TableCell>
              <TableCell align="center" className="text-white">
                Negative Marks
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examTemplate.questionTypes && (
              <>
                <TableRow>
                  <TableCell align="center">Single Correct</TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.singleCorrect.totalQuestions}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.singleCorrect.positiveMarks}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.singleCorrect.partialMarks}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.singleCorrect.negativeMarks}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Multi Correct</TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.multiCorrect.totalQuestions}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.multiCorrect.positiveMarks}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.multiCorrect.partialMarks}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.multiCorrect.negativeMarks}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Ineteger Type</TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.integerType.totalQuestions}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.integerType.positiveMarks}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.integerType.partialMarks}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.integerType.negativeMarks}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <hr />
      {/* Table for Questions */}
      <h3>Questions</h3>
      <div className="div d-flex gap-3 row">
        {examTemplate.questions &&
          examTemplate.questions.map((question, index) => (
            <div className="questions" key={question._id}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <div className="row d-flex gap-2">
                    <div className="col-md-3">
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        Question Number : {index + 1}
                      </Typography>
                    </div>
                    <div className="col-md-3">
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        Question ID : {question.questionId}
                      </Typography>
                    </div>
                    <div className="col-md-3">
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        Subject : {question.subject}
                      </Typography>
                    </div>
                    <div className="col-md-3">
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        Topic : {question.topic}
                      </Typography>
                    </div>
                    <div className="col-md-3">
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        Sub Topic: {question.subtopic}
                      </Typography>
                    </div>
                    <div className="col-md-3">
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        Difficulty Level : {question.difficultyLevel}
                      </Typography>
                    </div>
                    <div className="col-md-12">
                      <TextField
                        fullWidth
                        id="outlined-basic-1" // Unique id
                        variant="outlined"
                        name="examName"
                        InputLabelProps={{ shrink: true }}
                        value={question.questionText}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardActions></CardActions>
              </Card>
              <hr />
            </div>
          ))}
      </div>
    </>
  );
}
