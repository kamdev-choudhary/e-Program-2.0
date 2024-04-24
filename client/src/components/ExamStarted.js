import { useEffect, useState } from 'react'
import {
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  ExpandMoreIcon,
  useMediaQuery,
  Stack,
  Button,
  Avatar,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Box,
} from '@mui/material'
import { useTheme, styled } from '@mui/material/styles'

const API_URL = process.env.API_URL

export default function ExamStarted({ templateId }) {
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))
  const [examTemplate, setExamTemplate] = useState()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [error, setError] = useState('')
  const [value, setValue] = useState('')

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
  }

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
  }

  console.log(examTemplate)

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    flexGrow: 1,
  }))

  useEffect(() => {
    fetch(`${API_URL}/exams/templates/${templateId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        setExamTemplate(data.examTemplate)
      })
      .catch((error) => setError(error.message))
  }, [templateId])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <>
      <Grid container spacing={1} style={{ height: 650 }}>
        <Grid
          item
          xs={12}
          sm={9}
          order={{ xs: 2, sm: 1 }}
          style={{ height: '100%', position: 'relative' }}
        >
          <Paper sx={{ padding: 4 }} style={{ height: 650 }} elevation={4}>
            {examTemplate &&
              examTemplate.questions &&
              currentQuestionIndex < examTemplate.questions.length && (
                <>
                  <Typography>Question : </Typography>
                  <Typography
                    dangerouslySetInnerHTML={{
                      __html: examTemplate.questions[currentQuestionIndex].questionText,
                    }}
                  />

                  <hr />
                  <Box sx={{ width: '100%' }}>
                    <Stack
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      spacing={0}
                    >
                      <Checkbox />
                      <Typography>(A)</Typography>
                      <Item>(A)</Item>
                      <Item>
                        Long content Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis,
                        vel assumenda maiores sed repellendus perspiciatis cumque unde dolor
                        blanditiis minima amet dolores porro ex possimus at, veritatis incidunt qui
                        impedit!
                      </Item>
                    </Stack>
                  </Box>
                  <hr />

                  <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">Options</FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={value}
                      onChange={handleChange}
                    >
                      <FormControlLabel control={<Radio />} />
                      <Typography
                        dangerouslySetInnerHTML={{
                          __html: examTemplate.questions[currentQuestionIndex].option1.text,
                        }}
                      />
                      <FormControlLabel
                        value={examTemplate.questions[currentQuestionIndex].option2.text}
                        control={<Radio />}
                        label={examTemplate.questions[currentQuestionIndex].option2.text}
                      />
                      <FormControlLabel
                        value={examTemplate.questions[currentQuestionIndex].option3.text}
                        control={<Radio />}
                        label={examTemplate.questions[currentQuestionIndex].option3.text}
                      />
                      <FormControlLabel
                        value={examTemplate.questions[currentQuestionIndex].option4.text}
                        control={<Radio />}
                        label={examTemplate.questions[currentQuestionIndex].option4.text}
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
                position: 'absolute',
                bottom: 0,
                right: 0,
                marginRight: 2,
                marginBottom: 1,
              }}
            >
              <Button
                variant="contained"
                style={{
                  backgroundColor: '#000',
                  color: 'white',
                  borderRadius: 100,
                }}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: '#800080',
                  color: 'white',
                  borderRadius: 100,
                }}
              >
                Mark for review
              </Button>
              <Button
                variant="contained"
                sx={{ borderRadius: 100 }}
                onClick={handlePreviousQuestion}
                disabled={!examTemplate || !examTemplate.questions || currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                color="success"
                sx={{ borderRadius: 100 }}
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

        <Grid item xs={12} sm={3} order={{ xs: 1, sm: 2 }} style={{ width: '100%' }}>
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
                          bgcolor: currentQuestionIndex === index ? '#28844f' : undefined,
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
  )
}
