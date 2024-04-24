import React, { useState } from 'react'

import { Box, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab/TabContext'

import ExamStarted from '../../components/ExamStarted'
import OnlineExams from '../../components/OnlineExams'
import OfflineExams from '../../components/OfflineExams'

export default function StudentExams() {
  const [value, setValue] = useState('1')
  const [examStarted, setExamStarted] = useState(false)
  const [examTemplateId, setExamTemplateId] = useState(null)

  const handleExamStart = (templateId) => {
    setExamStarted(true)
    setExamTemplateId(templateId)
  }

  if (examStarted) {
    return <ExamStarted templateId={examTemplateId} />
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  return (
    <>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Online Exams" value="1" />
              <Tab label="Offline Exams" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <OnlineExams handleExamStart={handleExamStart} />
          </TabPanel>
          <TabPanel value="2">
            <OfflineExams />
          </TabPanel>
        </TabContext>
      </Box>
    </>
  )
}
