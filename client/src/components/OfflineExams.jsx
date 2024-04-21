import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function OfflineExams() {
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="bg bg-success ">
            <TableRow>
              <TableCell align="center" className="text-white">
                #
              </TableCell>
              <TableCell align="center" className="text-white">
                Exam Name
              </TableCell>
              <TableCell align="center" className="text-white">
                Target
              </TableCell>
              <TableCell align="center" className="text-white">
                Pattern
              </TableCell>
              <TableCell align="center" className="text-white">
                Date
              </TableCell>
              <TableCell align="center" className="text-white">
                View Paper
              </TableCell>
              <TableCell align="center" className="text-white">
                Submit Key
              </TableCell>
              <TableCell align="center" className="text-white">
                Result
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody></TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
