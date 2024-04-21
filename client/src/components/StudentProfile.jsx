import { useState, useEffect } from "react";
import { useAuth } from "../components/Auth";
import {
  Box,
  Paper,
  TextField,
  styled,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const AccordionContainer = styled(Accordion)({
  elevation: 6,
});

const AccordionDetailsContainer = styled(AccordionDetails)({
  display: "flex",
  flexDirection: "column",
});

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default function StudentProfile({ user }) {
  const [student, setStudent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [batches, setBatches] = useState([]);
  const [academic, setAcademic] = useState([]);

  const { userId } = useAuth();

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const [userData, batchData, academicData] = await Promise.all([
          fetchData(`${API_URL}/auth/user/${userId}`),
          fetchData(`${API_URL}/batch`),
          fetchData(`${API_URL}/academic`),
        ]);
        setStudent(user || userData.user);
        setBatches(batchData.batches);
        setAcademic(academicData.academic[0]);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, [userId, user]);

  console.log(batches);

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "batchName") {
      const selectedBatch = batches.find((batch) => batch.batchName === value);
      if (selectedBatch) {
        setStudent((prevStudent) => ({
          ...prevStudent,
          batchId: selectedBatch._id,
          [name]: value,
        }));
      }
    } else {
      setStudent((prevStudent) => ({ ...prevStudent, [name]: value }));
    }
  };

  const handleUpdateStudentData = () => {
    fetch(`${API_URL}/auth/user/${student._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  if (isLoading) {
    return (
      <Backdrop
        open={true}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
      <p>Student Dashboard Page</p>
    </>
  );

  return (
    <>
      {student && (
        <>
          <Accordion elevation={6} defaultExpanded>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>User Identity</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    id="student-name"
                    label="Name"
                    name="name"
                    size="small"
                    value={student.name}
                    onChange={handleUserInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    id="outlined-required"
                    label="Email"
                    size="small"
                    name="email"
                    value={student.email}
                    onChange={handleUserInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    id="student-mobile"
                    label="Mobile Number"
                    name="mobile"
                    size="small"
                    value={student.mobile}
                    onChange={handleUserInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="batch-label">Class</InputLabel>
                    <Select
                      labelId="select-class-level"
                      id="currentClass"
                      name="currentClass"
                      value={student.currentClass}
                      onChange={handleUserInputChange}
                      label="Class"
                    >
                      <em>
                        <MenuItem value="">none</MenuItem>
                      </em>
                      {academic &&
                        academic.classes.map((classes, index) => (
                          <MenuItem key={index} value={classes}>
                            {classes}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="batch-label">Batch Name</InputLabel>
                    <Select
                      labelId="select-batch-label"
                      id="select-batch"
                      name="batchName"
                      value={student.batchName}
                      onChange={handleUserInputChange}
                      label="Batch Name"
                    >
                      <em>
                        <MenuItem value="">none</MenuItem>
                      </em>
                      {batches &&
                        batches.map((batch, index) => (
                          <MenuItem key={batch._id} value={batch.batchName}>
                            {batch.batchName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}></Grid>
                <Grid item xs={12} lg={6}></Grid>
                <Grid item xs={12} lg={6}></Grid>
                <Grid item xs={12} lg={6}></Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={6}>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>Address</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    id="student-addressLineOne"
                    label="Address Line 1"
                    name="addressLineOne"
                    size="small"
                    value={student.addressLineOne}
                    onChange={handleUserInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    id="student-addressLinetwo"
                    label="Address Line 2"
                    name="addressLineTwo"
                    size="small"
                    value={student.addressLineTwo}
                    onChange={handleUserInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    id="student-city"
                    label="City"
                    name="city"
                    size="small"
                    value={student.city}
                    onChange={handleUserInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    id="student-district"
                    label="District"
                    name="district"
                    size="small"
                    value={student.district}
                    onChange={handleUserInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    id="student-state"
                    label="State"
                    name="state"
                    size="small"
                    value={student.state}
                    onChange={handleUserInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    id="student-pinCode"
                    label="Pin Code"
                    name="pinCode"
                    size="small"
                    value={student.pinCode}
                    onChange={handleUserInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </>
  );
}
