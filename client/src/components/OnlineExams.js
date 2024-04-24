import React, { useState, useEffect } from 'react'
import { Paper, Button, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useAuth } from '../Auth'

const API_URL = process.env.API_URL

export default function OnlineExams({ handleExamStart }) {
  const { batchId } = useAuth()
  const [studentBatch, setStudentBatch] = useState([])
  const [currDate, setCurrDate] = useState('')
  const [currTime, setCurrTime] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/batch/${batchId}`)
      .then((response) => response.json())
      .then((data) => setStudentBatch(data.batch))
      .catch((error) => console.error('Error fetching batch:', error))

    const intervalId = setInterval(() => {
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      const hours = String(currentDate.getHours()).padStart(2, '0')
      const minutes = String(currentDate.getMinutes()).padStart(2, '0')

      setCurrDate(`${year}-${month}-${day}`)
      setCurrTime(`${hours}:${minutes}`)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [batchId])

  const ExamsPaper = styled(Paper)(({ theme }) => ({
    width: 300,
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'left',
  }))

  return (
    <Stack spacing={1} direction="row">
      {studentBatch &&
        studentBatch.slots &&
        studentBatch.slots.map((slot) => {
          const { examDate, examStartTime, examEndTime, examTemplateId } = slot
          const examTemplate = studentBatch.examTemplates.find(
            (template) => template._id === examTemplateId,
          )

          if (!examTemplate) return null

          const isExamActive =
            new Date(examDate + ' ' + examStartTime) <= new Date(currDate + ' ' + currTime) &&
            new Date(currDate + ' ' + currTime) <= new Date(examDate + ' ' + examEndTime)

          const isUpcoming =
            new Date(examDate + ' ' + examStartTime) > new Date(currDate + ' ' + currTime)

          const isMissed =
            new Date(currDate + ' ' + currTime) > new Date(examDate + ' ' + examEndTime)

          return (
            <ExamsPaper key={slot._id} elevation={5}>
              <h5>Exam Name : {examTemplate.examName}</h5>
              <hr />
              <div>Scheduled On : {examDate}</div>
              <div>Exam Marks : </div>
              <div>Exam Pattern : {examTemplate.examPattern}</div>
              <div>Exam Start time : {examStartTime} </div>
              <div>Exam End time : {examEndTime} </div>
              <hr />
              {isExamActive && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleExamStart(examTemplate._id)}
                >
                  Start Exam
                </Button>
              )}
              {isUpcoming && (
                <Button disabled variant="contained" color="success">
                  Upcoming
                </Button>
              )}
              {isMissed && (
                <Button disabled variant="contained" color="success">
                  Missed
                </Button>
              )}
            </ExamsPaper>
          )
        })}
    </Stack>
  )
}
