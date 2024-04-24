import { useState, useEffect } from 'react'
import React from 'react'

import ViewExamTemplate from '../../components/ViewExamTemplate'
import CreateExamTemplate from '../../components/CreateExamTemplate'

import SearchIcon from '@mui/icons-material/Search'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'

import { Modal } from 'react-bootstrap'

import {
  Box,
  Skeleton,
  OutlinedInput,
  InputAdornment,
  FormControl,
  Grid,
  Button,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
} from '@mui/material'

const API_URL = process.env.API_URL

export default function ExamMaster() {
  const [showAddExamTemplate, setShowAddExamTemplate] = useState(false)
  const [examTemplates, setExamTemplates] = useState([])
  const [error, setError] = useState('')
  const [tabValue, setTabValue] = useState('online')
  const [isLoading, setIsLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)
  const [currTemplate, setCurrTemplate] = useState([])
  const [showExamTemplateModal, setShowExamTemplateModal] = useState(false)
  const [batch, setBatch] = useState([])
  const [batches, setBatches] = useState([])
  const [academic, setAcademic] = useState([])
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/batch`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => setBatches(data.batches))
      .catch((error) => setError(error.message))
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0])
      })
  }, [])

  const handleShowExamTemplateModal = () => {
    setShowExamTemplateModal(!showExamTemplateModal)
  }

  const handleShowExamTemplate = (examTemplate) => {
    handleShowExamTemplateModal()
    if (examTemplate) {
      setCurrTemplate(examTemplate)
    }
  }

  const handleShowAddTemplate = () => {
    setShowAddExamTemplate(!showAddExamTemplate)
  }

  useEffect(() => {
    fetch(`${API_URL}/exams`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        setExamTemplates(data.examTemplates)
        setIsLoading(false)
      })
      .catch((error) => setError(error.message))
  }, [])

  if (isLoading) {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={9}>
            <Skeleton sx={{ borderRadius: 10 }} variant="rectangular" height={40} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <Skeleton sx={{ borderRadius: 10 }} variant="rectangular" height={40} />
          </Grid>
        </Grid>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2,
            }}
          ></Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead className="bg bg-success ">
                <TableRow>
                  <TableCell align="center" className="text-white">
                    Exam ID
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Template Name
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Created At
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Pattern
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Details
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(10)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    {/* Add more skeleton cells as needed */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </>
    )
  }

  return (
    <>
      <Grid container spacing={1}>
        <Grid item sx={6} md={6} lg={8}>
          <FormControl fullWidth size="small">
            <OutlinedInput
              sx={{ borderRadius: 10 }}
              onChange={(e) => setSearchInput(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  Search <SearchIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item sx={6} md={6} lg={4}>
          <Button variant="contained" sx={{ borderRadius: 10 }} onClick={handleShowAddTemplate}>
            Create New Template
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ marginTop: 1 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className="bg bg-success ">
              <TableRow>
                <TableCell align="center" className="text-white">
                  Exam ID
                </TableCell>
                <TableCell align="center" className="text-white">
                  Template Name
                </TableCell>
                <TableCell align="center" className="text-white">
                  Created At
                </TableCell>
                <TableCell align="center" className="text-white">
                  Pattern
                </TableCell>
                <TableCell align="center" className="text-white">
                  Details
                </TableCell>
                <TableCell align="center" className="text-white">
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examTemplates.map((examtemplate, index) => (
                <TableRow
                  key={examtemplate._id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell align="center">{examtemplate.examId}</TableCell>
                  <TableCell align="center">{examtemplate.examName}</TableCell>
                  <TableCell align="center">{examtemplate.createdAt}</TableCell>
                  <TableCell align="center">{examtemplate.examPattern}</TableCell>
                  <TableCell align="center">
                    <Button size="sm" onClick={() => handleShowExamTemplate(examtemplate)}>
                      View
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton>
                      <DeleteRoundedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Modal show={showAddExamTemplate} onHide={handleShowAddTemplate} dialogClassName="modal-xl">
        <Modal.Header>Create Exam Template</Modal.Header>
        <Modal.Body>
          <CreateExamTemplate handleShowAddTemplate={handleShowAddTemplate} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="contained"
            color="error"
            sx={{ borderRadius: 10 }}
            onClick={handleShowAddTemplate}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal For Show Exam Template */}
      <Modal
        show={showExamTemplateModal}
        onHide={handleShowExamTemplateModal}
        dialogClassName="modal-xl"
      >
        <Modal.Header>View Exam Template</Modal.Header>
        <Modal.Body>
          <ViewExamTemplate currTemplate={currTemplate} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleShowExamTemplateModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
