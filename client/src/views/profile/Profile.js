import { useState, useEffect } from 'react'
import { useAuth } from '../../Auth'
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  IconButton,
  Select,
  InputLabel,
  MenuItem,
} from '@mui/material'

import { Edit as EditIcon } from '@mui/icons-material'

const API_URL = process.env.API_URL

export default function Profile({ user }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [batches, setBatches] = useState([])
  const [academic, setAcademic] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [student, setStudent] = useState({
    name: '',
    email: '',
    currentClass: '',
    mobile: '',
    accountType: '',
    batchName: '',
    batchId: '',
    addressLineOne: '',
    addressLineTwo: '',
    city: '',
    state: '',
    district: '',
    pinCode: '',
  })

  const { userId, accountType } = useAuth()

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0])
      })
      .catch((error) => {
        setError('Error fetching academic data')
      })

    fetch(`${API_URL}/batch`)
      .then((response) => response.json())
      .then((data) => {
        setBatches(data.batches)
      })
      .catch((error) => {
        setError('Error fetching batch data')
      })

    fetch(`${API_URL}/auth/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setStudent(data.user)
      })
      .catch((error) => {
        setError('Error fetching user data')
      })
    setIsLoading(false)
  }, [])

  const handleUserInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'batchName') {
      const selectedBatch = batches.find((batch) => batch.batchName === value)
      if (selectedBatch) {
        setStudent((prevStudent) => ({
          ...prevStudent,
          batchId: selectedBatch._id,
          [name]: value,
        }))
      }
    } else {
      setStudent((prevStudent) => ({ ...prevStudent, [name]: value }))
    }
  }

  const handleUpdateStudentData = () => {
    fetch(`${API_URL}/auth/user/${student._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  if (isLoading) {
    return <p>Loading....</p>
  }

  return (
    <>
      {student && (
        <>
          <Grid container justifyContent="right">
            <Grid item xs={1} md={1} lg={1}>
              {editMode ? (
                <Button color="error" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              ) : (
                <Button onClick={() => setEditMode(true)}>
                  <EditIcon />
                </Button>
              )}
            </Grid>
          </Grid>
          <Box
            sx={{
              marginBottom: 1,
              marginTop: 1,
              padding: 2,
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.3)',
            }}
          >
            <Grid item xs={10} md={10} lg={10}>
              <Typography>Personal Info</Typography>
            </Grid>
            <hr />
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  onChange={handleUserInputChange}
                  value={student.name}
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  onChange={handleUserInputChange}
                  value={student.email}
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <TextField
                  fullWidth
                  label="Mobile"
                  name="mobile"
                  onChange={handleUserInputChange}
                  value={student.mobile}
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <TextField
                  fullWidth
                  label="Account Type"
                  value={student.accountType}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          {student && accountType === 'student' && (
            <>
              <Box
                sx={{
                  marginBottom: 1,
                  padding: 2,
                  borderRadius: 3,
                  border: '2px solid rgba(0,0,0,0.3)',
                }}
              >
                <Grid item xs={10} md={10} lg={10}>
                  <Typography>Academic Info</Typography>
                </Grid>
                <hr />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} lg={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Current Class</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="currentClass"
                        name="currentClass"
                        label="Current Class"
                        value={student.currentClass || ''}
                        onChange={handleUserInputChange}
                        inputProps={{ readOnly: !editMode }}
                      >
                        <MenuItem value="">Select Batch</MenuItem>
                        {academic &&
                          academic.classes &&
                          academic.classes.map((classes, index) => (
                            <MenuItem key={index} value={classes}>
                              {classes}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <FormControl fullWidth readOnly>
                      <InputLabel id="demo-simple-select-label">Batch</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="batchName"
                        name="batchName"
                        label="Batch"
                        value={student.batchName || ''}
                        onChange={handleUserInputChange}
                        inputProps={{ readOnly: !editMode }}
                      >
                        <MenuItem value="">Select Batch</MenuItem>
                        {batches &&
                          batches.map((batch, index) => (
                            <MenuItem key={index} value={batch.batchName}>
                              {batch.batchName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
              <Box
                sx={{
                  marginBottom: 1,
                  padding: 2,
                  borderRadius: 3,
                  border: '2px solid rgba(0,0,0,0.3)',
                }}
              >
                <Grid item xs={10} md={10} lg={10}>
                  <Typography>Address</Typography>
                </Grid>
                <hr />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} lg={6}>
                    <TextField
                      fullWidth
                      label="Address Line 1"
                      name="addressLineOne"
                      value={student.addressLineOne}
                      onChange={handleUserInputChange}
                      InputProps={{
                        readOnly: !editMode,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <TextField
                      fullWidth
                      label="Address Line 2"
                      value={student.addressLineTwo}
                      name="addressLineTwo"
                      onChange={handleUserInputChange}
                      InputProps={{
                        readOnly: !editMode,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      onChange={handleUserInputChange}
                      value={student.city}
                      InputProps={{
                        readOnly: !editMode,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <TextField
                      fullWidth
                      label="District"
                      name="district"
                      onChange={handleUserInputChange}
                      value={student.district}
                      InputProps={{
                        readOnly: !editMode,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <TextField
                      fullWidth
                      label="State"
                      name="state"
                      onChange={handleUserInputChange}
                      value={student.state}
                      InputProps={{
                        readOnly: !editMode,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={6}>
                    <TextField
                      fullWidth
                      label="Pin Code"
                      name="pinCode"
                      onChange={handleUserInputChange}
                      value={student.pinCode}
                      InputProps={{
                        readOnly: !editMode,
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
          {editMode && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                marginBottom: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{ borderRadius: 10 }}
                onClick={handleUpdateStudentData}
              >
                Save
              </Button>
            </Box>
          )}
        </>
      )}
    </>
  )
}
