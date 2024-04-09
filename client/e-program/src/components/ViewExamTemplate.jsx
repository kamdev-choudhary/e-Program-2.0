import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function ViewExamTemplate(props) {
  const [examTemplate, setExamTemplate] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ShowAddExamToBatch, setShowAddExamToBatch] = useState(false);
  const [addToBatch, setAddToBatch] = useState([]);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/exams/templates/${props.currTemplate._id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setExamTemplate(data.examTemplate);
        setAddToBatch({ ...addToBatch, examTemplateId: data.examTemplate._id });
      })
      .catch((error) => setError(error.message));

    fetch(`${API_URL}/batch`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setBatches(data.batches);
      })
      .catch((error) => setError(error.message));
  }, []);

  const handleAddToBatchSubmit = () => {
    console.log(addToBatch);
    fetch(`${API_URL}/exams/addtobatch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addToBatch),
    });
  };

  const handleAddToBatchInput = (e) => {
    if (e.target.name === "batchName") {
      const selectedBatchName = e.target.value;
      const selectedBatch = batches.find(
        (batch) => batch.batchName === selectedBatchName
      );

      if (selectedBatch) {
        setAddToBatch({
          ...addToBatch,
          batchId: selectedBatch._id,
          [e.target.name]: selectedBatchName,
        });
      }
    } else {
      setAddToBatch({ ...addToBatch, [e.target.name]: e.target.value });
    }
  };

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
            id="examName" // Unique id
            variant="outlined"
            label="Test Name"
            name="examName"
            InputLabelProps={{ shrink: true }}
            value={examTemplate.examName || ""}
            onChange={(e) => handleExamTemplateChange(e, 0)}
          />
        </div>
        <div className="col-md-6">
          <TextField
            fullWidth
            id="examPattern" // Unique id
            variant="outlined"
            label="Exam Pattern"
            name="examPattern" // Unique name
            InputLabelProps={{ shrink: true }}
            value={examTemplate.examPattern || ""}
            onChange={(e) => handleExamTemplateChange(e, 0)}
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
            {batches.map((batch, batchIndex) =>
              batch.slots.map((examTemp, examIndex) => (
                <TableRow key={`${batchIndex}-${examIndex}`}>
                  <TableCell align="center">{batch.batchName}</TableCell>
                  <TableCell align="center">{examTemp.examDate}</TableCell>
                  <TableCell align="center">{examTemp.examStartTime}</TableCell>
                  <TableCell align="center">{examTemp.examEndTime}</TableCell>
                  <TableCell align="center">
                    <DeleteIcon />
                  </TableCell>
                </TableRow>
              ))
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
                Added Questions
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
                  <TableCell align="center" style={{ color: "red" }}>
                    {examTemplate.questionTypes.singleCorrect.addedQuestions}
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
                  <TableCell align="center" style={{ color: "red" }}>
                    {examTemplate.questionTypes.multiCorrect.addedQuestions}
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
                  <TableCell align="center" style={{ color: "red" }}>
                    {examTemplate.questionTypes.integerType.addedQuestions}
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
            <div className="questions" key={index}>
              <Card sx={{ minWidth: 275 }} elevation={5}>
                <CardContent>
                  <div className="row d-flex gap-2">
                    <div className="col-md-3">
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.primary"
                        gutterBottom
                      >
                        Question Number : {index + 1}
                      </Typography>
                    </div>
                    <div className="col-md-3">
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.primary"
                        gutterBottom
                      >
                        Question ID : {question.questionId}
                      </Typography>
                    </div>
                    <div className="col-md-3">
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.primary"
                        gutterBottom
                      >
                        Subject : {question.subject}
                      </Typography>
                    </div>
                    <div className="col-md-3">
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.primary"
                        gutterBottom
                      >
                        Topic : {question.topic}
                      </Typography>
                    </div>
                    <div className="col-md-3">
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.primary"
                        gutterBottom
                      >
                        Sub Topic: {question.subtopic}
                      </Typography>
                    </div>
                    <div className="col-md-3">
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.primary"
                        gutterBottom
                      >
                        Difficulty Level : {question.difficultyLevel}
                      </Typography>
                    </div>
                    <div className="col-md-12">
                      <TextField
                        fullWidth
                        id="outlined-basic-1"
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
      <Modal
        show={ShowAddExamToBatch}
        onHide={handleShowAddExamToBatch}
        dialogClassName="modal-m"
      >
        <Modal.Header> Add exam to template</Modal.Header>
        <Modal.Body>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="batch-label">Batch Name</InputLabel>
              <Select
                labelId="select-batch-label"
                id="select-batch"
                name="batchName"
                value={addToBatch.batchName}
                onChange={handleAddToBatchInput}
                label="Batch Name"
              >
                {batches &&
                  batches.map((batch, index) => (
                    <MenuItem key={batch._id} value={batch.batchName}>
                      {batch.batchName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
          <TextField
            margin="normal"
            fullWidth
            label="Test Date"
            type="date"
            id="testDate"
            value={addToBatch.testDate}
            onChange={handleAddToBatchInput}
            name="testDate"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Start Time"
            type="time"
            id="startTime"
            value={addToBatch.startTime}
            onChange={handleAddToBatchInput}
            name="startTime"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Start Time"
            type="time"
            id="endTime"
            value={addToBatch.endTime}
            onChange={handleAddToBatchInput}
            name="endTime"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button variant="success" onClick={handleAddToBatchSubmit}>
            Save
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleShowAddExamToBatch}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
