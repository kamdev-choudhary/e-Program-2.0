import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

interface QuestionsProps {
  id_question: string;
  english_question_text: string;
  subject: string;
}

const Test = () => {
  const [data, setData] = useState<QuestionsProps[] | []>([]);
  const [patternId, setPatternId] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://admin.scholarship.dakshana.org/service/index.php/Question_paper/getAllQuestions",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify({
            caller_email: "dnayak@dakshana.org",
            id_question_paper_set: patternId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setData(data.questions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log(data);

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (d) => !selectedSubject || d.subject === selectedSubject
    );
  }, [data, selectedSubject]);

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <TextField
          value={patternId}
          onChange={(e) => setPatternId(e.target.value)}
        />
        <Button onClick={fetchData}>Fetch</Button>
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            displayEmpty
            label="Subject"
          >
            <MenuItem value="">All Subjects</MenuItem>
            <MenuItem value="Physics">Physics</MenuItem>
            <MenuItem value="Maths">Math</MenuItem>
            <MenuItem value="Chemistry">Chemistry</MenuItem>
            {/* Add more subjects as needed */}
          </Select>
        </FormControl>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>Q.ID</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Question</TableCell>
          </TableHead>
          <TableBody>
            {filteredData &&
              filteredData.map((d, index) => (
                <TableRow key={index}>
                  <TableCell>{d.id_question}</TableCell>
                  <TableCell>{d.subject}</TableCell>
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: d.english_question_text,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Test;
