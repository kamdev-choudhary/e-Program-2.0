import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'

import ConfirmationDialog from '../../components/ConfirmationDialog'

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Grid,
  Typography,
  Skeleton,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const API_URL = process.env.API_URL

export default function Batch() {
  const [academic, setAcademic] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [newAcademics, setNewAcademic] = useState([])
  const [batches, setBatches] = useState([])
  const [batch, setBatch] = useState({})
  const [showAddBatchModal, setShowAddBatchModal] = useState(false)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0])
        setIsLoading(false)
      })
  }, [refresh])

  const handleSaveBatch = () => {
    fetch(`${API_URL}/batch/addnew`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batch),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setShowAddBatchModal(false)
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const handleBatchInputChange = (e) => {
    setBatch({ ...batch, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    fetch(`${API_URL}/batch`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => setBatches(data.batches))
      .catch((error) => console.error('Error:', error))
  }, [])

  if (isLoading) {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={12}>
            <Box>
              <Skeleton sx={{ borderRadius: 2 }} variant="rectangular" height={400} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Box>
              <Skeleton sx={{ borderRadius: 2 }} variant="rectangular" height={400} />
            </Box>
          </Grid>
        </Grid>
      </>
    )
  }

  return (
    <>
      <Box
        sx={{
          marginBottom: 1,
          padding: 2,
          borderRadius: 2,
          border: '1px solid rgba(0,0,0,0.3)',
        }}
      >
        <Box sx={{ marginLeft: 2, marginRight: 1, marginTop: 1 }}>
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            Batches
          </Typography>
        </Box>
        <hr />

        <Grid container spacing={2}>
          <Grid item xs={12} md={8} lg={8}>
            <FormControl fullWidth size="small">
              <OutlinedInput
                id="outlined-adornment-amount"
                sx={{ borderRadius: 10 }}
                startAdornment={
                  <InputAdornment position="start">
                    Search <SearchIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Button variant="contained" sx={{ borderRadius: 10 }}>
              Add New Batch
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 2 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className="bg bg-success ">
                <TableRow>
                  <TableCell align="center" className="text-white">
                    SN
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Batch Name
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Batch Class
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Preparing For
                  </TableCell>

                  <TableCell align="center" className="text-white">
                    Scholar Count
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batches.map((batch, index) => (
                  <TableRow
                    key={batch._id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{batch.batchName}</TableCell>
                    <TableCell align="center">{batch.batchClass}</TableCell>
                    <TableCell align="center">{batch.batchStream}</TableCell>
                    <TableCell align="center">{batch.scholars.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Modal show={showAddBatchModal} onHide={() => setShowAddBatchModal(false)}>
        <Modal.Header>Add Batch</Modal.Header>
        <Modal.Body>
          <TextField
            label="Batch Name"
            fullWidth
            id="batchName"
            name="batchName"
            value={batch.batchName}
            onChange={handleBatchInputChange}
            style={{ marginBottom: '10px' }}
          />
          <FormControl fullWidth sx={{ marginBottom: 1 }}>
            <InputLabel id="demo-simple-select-label">Class</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="batchClass"
              name="batchClass"
              label="Class"
              value={batch.batchClass || ''}
              onChange={handleBatchInputChange}
            >
              {academic &&
                academic.classes &&
                academic.classes.map((classes, index) => (
                  <MenuItem key={index} value={classes}>
                    {classes}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 1 }}>
            <InputLabel id="demo-simple-select-label">Target or Stream</InputLabel>
            <Select
              id="batchStream"
              name="batchStream"
              label="Target or Stream"
              value={batch.batchStream || ''}
              onChange={handleBatchInputChange}
            >
              {academic &&
                academic.target &&
                academic.target.map((tget, index) => (
                  <MenuItem key={index} value={tget}>
                    {tget}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Button variant="contained" color="success" onClick={handleSaveBatch}>
            Save
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowAddBatchModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
