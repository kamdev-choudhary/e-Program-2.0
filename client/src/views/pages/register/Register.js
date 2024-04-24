import { useState, useEffect } from 'react'
import { useAuth } from '../../../Auth'
import { NavLink } from 'react-router-dom'

import {
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  CssBaseline,
  Link,
  Box,
  Container,
} from '@mui/material'
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const API_URL = process.env.API_URL

export default function RegisterPage({ handleTogglePage, handleshowUserPage }) {
  const { storeTokenInLS } = useAuth()
  const [academic, setAcademic] = useState({})
  const [user, setUser] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    currentClass: '',
  })

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    currentClass: '',
  })

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0])
      })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    switch (name) {
      case 'name':
        setErrors({ ...errors, name: value ? '' : 'Name is required' })
        break
      case 'email':
        setErrors({ ...errors, email: value ? '' : 'Email is required' })
        break
      case 'mobile':
        setErrors({ ...errors, mobile: value ? '' : 'Mobile is required' })
        break
      case 'password':
        setErrors({ ...errors, password: value ? '' : 'Password is required' })
        break
      case 'currentClass':
        setErrors({
          ...errors,
          currentClass: value ? '' : 'Class is required',
        })
        break
      default:
        break
    }

    setUser({ ...user, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const isValid = validateForm()
    if (isValid) {
      fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then((data) => {
          console.log('Success:', data)
          storeTokenInLS(data.token)
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    } else {
      console.log('Form submission failed. Please check all fields.')
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {}

    for (const key in user) {
      if (!user[key]) {
        isValid = false
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`
      } else {
        newErrors[key] = ''
      }
    }

    setErrors(newErrors)
    return isValid
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              value={user.name}
              fullWidth
              id="name"
              name="name"
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              label="Email"
              value={user.email}
              fullWidth
              id="email"
              name="email"
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              label="Mobile"
              type="text"
              value={user.mobile}
              fullWidth
              id="mobile"
              name="mobile"
              onChange={handleChange}
              error={Boolean(errors.mobile)}
              helperText={errors.mobile}
              inputProps={{ maxLength: 10 }}
              style={{ marginBottom: '20px' }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={user.password}
              id="password"
              name="password"
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              style={{ marginBottom: '20px' }}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="currentClass"
                name="currentClass"
                label="Class"
                value={user.currentClass}
                onChange={handleChange}
                error={Boolean(errors.currentClass)}
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Register
            </Button>
            <Grid container>
              <Grid item xs={12} lg={12} md={12}>
                <NavLink to="/auth/login">
                  <Button fullwidth>Already have a account ? Login</Button>
                </NavLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  )
}
