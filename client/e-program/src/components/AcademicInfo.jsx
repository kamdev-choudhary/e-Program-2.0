import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:5000/api";

export default function AcademicInfo() {
  const [academic, setAcademic] = useState({});
  const [classData, setClassData] = useState([]);
  const [updateAcademic, setUpdateAcademic] = useState({});
  const [errors, setErrors] = useState({
    classes: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0]);
      });
  }, []);

  console.log(academic);

  // const handleAddAcademicDetails = () => {
  //   if (!academic.classes) {
  //     setErrors({ ...errors, classes: "Class Name is required" });
  //     return;
  //   }
  //   fetch(`${API_URL}/academic/update`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(academic),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Success:", data);
  //       setClassData([...classData, academic.classes]); // Add newly added class to the list
  //       setAcademic({ ...academic, classes: "" }); // Clear input field after successful addition
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: 300,
          },
        }}
      >
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead className="bg bg-success ">
              <TableRow>
                <TableCell align="center" className="text-white">
                  Classes
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {academic &&
                academic.classes &&
                academic.classes.map((className, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{className}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
