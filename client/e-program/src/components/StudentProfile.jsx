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

import { useAuth } from "../components/Auth";

const API_URL = "http://10.0.12.85:5000/api";

export default function StudentProfile({ user }) {
  const [student, setStudent] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    if (user) {
      setStudent({ ...user });
    }
  }, [user, refresh]);

  const { userId } = useAuth();

  useEffect(() => {
    fetch(`${API_URL}/auth/user/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setStudent(data.user);
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
  }, {});

  console.log(student);

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

  const ExamsPaper = styled(Paper)(({ theme }) => ({
    width: 300,
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: "left",
  }));

  return (
    <>
      {student && (
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
          <Paper sx={{ padding: "1rem" }} elevation={1}>
            <div className="row">
              <div className="col-md-12">
                <h4>Student's Profile</h4>
              </div>
              <hr />
            </div>
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
              <Paper sx={{ padding: "1rem" }} elevation={5}>
                <div className="row">
                  <div className="col-md-12 d-flex space-between">
                    <h5>Identity</h5>
                    <Edit className="ms-auto" />
                  </div>
                  <hr />
                  <div className="row ">
                    <div className="col-md-6 mb-3">
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
                    </div>
                    <div className="col-md-6 mb-3">
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
                    </div>
                    <div className="col-md-6 mb-3">
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
                    </div>
                    <div className="col-md-6 mb-3">
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
                    </div>
                    <div className="col-md-6 mb-3">
                      <Box sx={{ minWidth: 120 }} size="small">
                        <FormControl fullWidth>
                          <InputLabel id="batch-label">Batch Name</InputLabel>
                          <Select
                            labelId="select-batch-label"
                            id="select-batch"
                            name="batchName"
                            value={student.batchName}
                            onChange={handleUserInputChange}
                            label="Batch Name"
                          >
                            {batches &&
                              batches.map((batch, index) => (
                                <MenuItem
                                  key={batch._id}
                                  value={batch.batchName}
                                >
                                  {batch.batchName}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </div>
                  </div>
                </div>
              </Paper>
            </Box>
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
              <Paper sx={{ padding: "1rem" }} elevation={5}>
                <div className="row">
                  <div className="col-md-12 d-flex space-between">
                    <h5>Address</h5>
                    <Edit className="ms-auto" />
                  </div>
                  <hr />
                  <div className="row ">
                    <div className="col-md-6 mb-3">
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
                    </div>
                    <div className="col-md-6 mb-3">
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
                    </div>
                    <div className="col-md-6 mb-3">
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
                    </div>
                    <div className="col-md-6 mb-3">
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
                    </div>
                    <div className="col-md-6 mb-3">
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
                    </div>
                    <div className="col-md-6 mb-3">
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
                    </div>
                  </div>
                </div>
              </Paper>
            </Box>
            {!student.isProfileUpdated === false && (
              <div className="row text-end gap-2 d-flex">
                <div className="col m-2">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleUpdateStudentData}
                  >
                    Update
                  </Button>
                </div>
              </div>
            )}
          </Paper>
        </Box>
      )}
    </>
  );
}
