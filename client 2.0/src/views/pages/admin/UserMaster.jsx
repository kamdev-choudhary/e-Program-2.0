import { useEffect, useState } from "react";
import React from "react";
import { Modal } from "react-bootstrap";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import StudentProfile from "../components/StudentProfile";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function UserMaster() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("admin");
  const [showStudentDashboard, setShowStudentDashboard] = useState(false);
  const [currUser, setCurrUser] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/admin/users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setUsers(data.users))
      .catch((error) => setError(error.message));
  }, []);

  const handleAccounTypeChange = (event) => {
    setAccountTypeFilter(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      Object.values(user).some(
        (field) =>
          (typeof field === "string" || typeof field === "number") &&
          field.toString().toLowerCase().includes(searchInput.toLowerCase())
      ) && user.accountType.toLowerCase() === accountTypeFilter.toLowerCase()
  );

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7} lg={7}>
          <Box>
            <FormControl fullWidth size="small">
              <OutlinedInput
                sx={{ borderRadius: 10 }}
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">
                    Search <SearchIcon />
                  </InputAdornment>
                }
                value={searchInput}
                onChange={handleSearchInputChange}
              />
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={6} md={3} lg={3}>
          <Box>
            <FormControl fullWidth size="small">
              <InputLabel id="account-type-label">Account Type</InputLabel>
              <Select
                labelId="account-type-label"
                id="account-type"
                label="Account Type"
                value={accountTypeFilter}
                onChange={handleAccounTypeChange}
              >
                <MenuItem value="student" selected>
                  Student
                </MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={6} md={2} lg={2}>
          <Button
            fullWidth
            variant="contained"
            color="info"
            sx={{ borderRadius: 10 }}
          >
            Add User
          </Button>
        </Grid>
      </Grid>

      <hr />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="bg bg-success ">
            <TableRow>
              <TableCell align="center" className="text-white">
                SN
              </TableCell>
              <TableCell align="center" className="text-white">
                Name
              </TableCell>
              <TableCell align="center" className="text-white">
                Email
              </TableCell>
              <TableCell align="center" className="text-white">
                Mobile
              </TableCell>
              <TableCell align="center" className="text-white">
                Account Type
              </TableCell>
              <TableCell align="center" className="text-white">
                Details
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow
                key={user._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{user.name}</TableCell>
                <TableCell align="center">{user.email}</TableCell>
                <TableCell align="center">{user.mobile}</TableCell>
                <TableCell align="center">{user.accountType}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => {
                      setShowStudentDashboard(true);
                      setCurrUser(user);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        show={showStudentDashboard}
        onHide={() => setShowStudentDashboard(false)}
        dialogClassName="modal-xl"
      >
        <Modal.Header>Student DashBoard</Modal.Header>
        <Modal.Body>
          <StudentProfile user={currUser} />
        </Modal.Body>
      </Modal>
    </>
  );
}
