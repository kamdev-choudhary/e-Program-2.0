import { useState, useEffect } from "react";
import { useAuth } from "../store/Auth";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function StudentProfile({ user }) {
  const [student, setStudent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [batches, setBatches] = useState([]);
  const [academic, setAcademic] = useState([]);

  const { userId } = useAuth();

  useEffect(() => {
    fetch(`${API_URL}/auth/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setStudent(data.user);
      })
      .catch((error) => console.log(error));

    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0]);
      })
      .catch((error) => console.log(error));
    fetch(`${API_URL}/batch`)
      .then((response) => response.json())
      .then((data) => {
        setBatches(data.batches);
      })
      .catch((error) => console.log(error));
  }, []);

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
      <>
        <p>Loading....</p>
      </>
    );
  }

  console.log(student);

  return (
    <>
      {student && (
        <>
          <Box
            sx={{
              marginBottom: 1,
              padding: 2,
              borderRadius: 3,
              border: "2px solid rgba(0,0,0,0.3)",
            }}
          >
            <Grid item xs={10} md={10} lg={10}>
              <Typography>Personal Info</Typography>
            </Grid>
            <hr />
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={6}>
                <TextField
                  fullWidth
                  label="Name"
                  defaultValue=" "
                  name="name"
                  onChange={handleUserInputChange}
                  value={student.name}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue=" "
                  name="email"
                  onChange={handleUserInputChange}
                  value={student.email}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <TextField
                  fullWidth
                  label="Mobile"
                  defaultValue=" "
                  name="mobile"
                  onChange={handleUserInputChange}
                  value={student.mobile}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <TextField
                  fullWidth
                  label="Account Type"
                  defaultValue=" "
                  value={student.accountType}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              marginBottom: 1,
              padding: 2,
              borderRadius: 3,
              border: "2px solid rgba(0,0,0,0.3)",
            }}
          >
            <Grid item xs={10} md={10} lg={10}>
              <Typography>Academic Info</Typography>
            </Grid>
            <hr />
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel
                    id="demo-simple-select-label"
                    // helperText={errors.currentClass}
                  >
                    Class
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="currentClass"
                    name="currentClass"
                    label="Class"
                    value={"" || student.currentClass}
                    onChange={handleUserInputChange}
                    // error={Boolean(errors.currentClass)}
                  >
                    {academic &&
                      academic.classes &&
                      academic.classes.map((classes, index) => (
                        <MenuItem key={index} value={classes}>
                          {classes}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel
                    id="demo-simple-select-label"
                    // helperText={errors.currentClass}
                  >
                    Batch
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="currentClass"
                    name="batchName"
                    label="Class"
                    value={"" || student.batchName}
                    onChange={handleUserInputChange}
                    // error={Boolean(errors.currentClass)}
                  >
                    {batches &&
                      batches.map((batch, index) => (
                        <MenuItem key={index} value={batch.batchName}>
                          {batch.batchName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              marginBottom: 1,
              padding: 2,
              borderRadius: 3,
              border: "2px solid rgba(0,0,0,0.3)",
            }}
          >
            <Grid item xs={10} md={10} lg={10}>
              <Typography>Address</Typography>
            </Grid>
            <hr />
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={6}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  defaultValue=" "
                  name="addressLineOne"
                  value={student.addressLineOne}
                  onChange={handleUserInputChange}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  defaultValue=" "
                  value={student.addressLineTwo}
                  name="addressLineTwo"
                  onChange={handleUserInputChange}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <TextField
                  fullWidth
                  label="City"
                  defaultValue=" "
                  name="city"
                  onChange={handleUserInputChange}
                  value={student.city}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <TextField
                  fullWidth
                  label="District"
                  defaultValue=" "
                  name="district"
                  onChange={handleUserInputChange}
                  value={student.district}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <TextField
                  fullWidth
                  label="State"
                  defaultValue=" "
                  name="state"
                  onChange={handleUserInputChange}
                  value={student.state}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <TextField
                  fullWidth
                  label="Pin Code"
                  defaultValue=" "
                  name="pinCode"
                  onChange={handleUserInputChange}
                  value={student.pinCode}
                />
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginBottom: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{ borderRadius: 10 }}
              onClick={handleUpdateStudentData}
            >
              Save
            </Button>
          </Box>
        </>
      )}
    </>
  );
}
