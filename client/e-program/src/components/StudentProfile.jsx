import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Edit from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { useAuth } from "../components/Auth";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function StudentProfile({ user }) {
  const [student, setStudent] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const [batches, setBatches] = useState([]);

  console.log(user);

  console.log(student);

  useEffect(() => {
    if (user) {
      setStudent({ ...user });
    }
  }, []);

  const { userId } = useAuth();

  // useEffect(() => {
  //   fetch(`${API_URL}/auth/user/${userId}`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setStudent(data.user);
  //     })
  //     .catch((error) => setError(error.message));
  //   fetch(`${API_URL}/batch`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setBatches(data.batches);
  //     })
  //     .catch((error) => setError(error.message));
  // }, {});

  const handleUserInputChange = (e) => {
    if (e.target.name === "batchName") {
      const selectedBatchName = e.target.value;
      const selectedBatch = batches.find(
        (batch) => batch.batchName === selectedBatchName
      );

      if (selectedBatch) {
        setStudent({
          ...student,
          batchId: selectedBatch._id,
          [e.target.name]: selectedBatchName,
        });
      }
    } else {
      setStudent({ ...student, [e.target.name]: e.target.value });
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
        setRefresh(!refresh);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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
                  <TextField
                    fullWidth
                    id="student-class"
                    label="Class"
                    name="classes"
                    size="small"
                    value={student.classes}
                    onChange={handleUserInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
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
