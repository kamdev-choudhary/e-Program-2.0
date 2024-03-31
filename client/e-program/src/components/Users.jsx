import { useEffect, useState } from "react";
import React from "react";

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

const API_URL = "http://127.0.0.1:5000/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

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

  return (
    <>
      <div className="row">
        <div className="col-md-6 text-center">
          <FormControl fullWidth>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={
                <InputAdornment position="start">
                  Search <SearchIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <div className="col-md-6 mb-2">
          <Box sx={{ minWidth: 110, minHeight: 50 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Account Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="User Type"
                value="student"
              >
                <MenuItem value="student" selected>
                  Student
                </MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>
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
            {users.map((user, index) => (
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
                  <Button variant="outlined" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
