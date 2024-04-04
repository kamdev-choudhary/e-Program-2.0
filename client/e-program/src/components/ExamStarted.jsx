import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const API_URL = "http://127.0.0.1:5000/api";

export default function ExamStarted({ templateId }) {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [examTemplate, setExamTemplate] = useState();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  console.log(examTemplate);

  useEffect(() => {
    fetch(`${API_URL}/exams/templates/${templateId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setExamTemplate(data.examTemplate);
      })
      .catch((error) => setError(error.message));
  }, [templateId]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <Grid container spacing={1} style={{ height: 650 }}>
        <Grid
          item
          xs={12}
          sm={9}
          order={{ xs: 2, sm: 1 }}
          style={{ height: "100%", position: "relative" }}
        >
          <Paper sx={{ padding: 4 }} style={{ height: 650 }} elevation={4}>
            {examTemplate &&
              examTemplate.questions &&
              currentQuestionIndex < examTemplate.questions.length && (
                <>
                  <Typography>
                    {"Question : "}
                    {examTemplate.questions[currentQuestionIndex].questionText}
                  </Typography>
                  <hr />
                  <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">
                      Options
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={value}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value={
                          examTemplate.questions[currentQuestionIndex].option1
                        }
                        control={<Radio />}
                        label={
                          examTemplate.questions[currentQuestionIndex].option1
                        }
                      />
                      <FormControlLabel
                        value={
                          examTemplate.questions[currentQuestionIndex].option2
                        }
                        control={<Radio />}
                        label={
                          examTemplate.questions[currentQuestionIndex].option2
                        }
                      />
                      <FormControlLabel
                        value={
                          examTemplate.questions[currentQuestionIndex].option3
                        }
                        control={<Radio />}
                        label={
                          examTemplate.questions[currentQuestionIndex].option3
                        }
                      />
                      <FormControlLabel
                        value={
                          examTemplate.questions[currentQuestionIndex].option4
                        }
                        control={<Radio />}
                        label={
                          examTemplate.questions[currentQuestionIndex].option4
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </>
              )}
            <Stack
              spacing={2}
              padding={1}
              direction="row"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                marginRight: 2,
                marginBottom: 1,
              }}
            >
              <Button
                variant="contained"
                style={{ backgroundColor: "#000", color: "white" }}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: "#800080", color: "white" }}
              >
                Mark for review
              </Button>
              <Button
                variant="contained"
                onClick={handlePreviousQuestion}
                disabled={
                  !examTemplate ||
                  !examTemplate.questions ||
                  currentQuestionIndex === 0
                }
              >
                Previous
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleNextQuestion}
                disabled={
                  !examTemplate ||
                  !examTemplate.questions ||
                  currentQuestionIndex === examTemplate.questions.length - 1
                }
              >
                Next
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          sm={3}
          order={{ xs: 1, sm: 2 }}
          style={{ width: "100%" }}
        >
          <Accordion defaultExpanded={isLargeScreen} elevation={4}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography>Expanded default</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                {examTemplate &&
                  examTemplate.questions &&
                  examTemplate.questions.map((question, index) => (
                    <Grid item key={index}>
                      <Avatar
                        alt="Remy Sharp"
                        src="/broken-image.jpg"
                        sx={{
                          bgcolor:
                            currentQuestionIndex === index
                              ? "#28844f"
                              : undefined,
                          height: 35,
                          width: 35,
                        }}
                        onClick={() => setCurrentQuestionIndex(index)}
                      >
                        {index + 1}
                      </Avatar>
                    </Grid>
                  ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </>
  );
}
