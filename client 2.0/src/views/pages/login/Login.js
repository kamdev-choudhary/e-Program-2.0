import react, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import CssBaseline from '@mui/material/CssBaseline'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useAuth } from '../../../components/Auth'

const API_URL = process.env.API_URL

function Login({ handleTogglePage }) {
  const { storeTokenInLS } = useAuth()
  const [loginError, setLoginError] = useState('')
  const [user, setUser] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  })

  const handleInput = (e) => {
    const { name, value } = e.target
    let newErrors = { ...errors }

    switch (name) {
      case 'email':
        newErrors.email = value ? '' : 'Email is required'
        break
      case 'password':
        newErrors.password = value ? '' : 'Password is required'
        break
      default:
        break
    }

    setUser({ ...user, [name]: value })
    setErrors(newErrors)
    setLoginError('')
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

  function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="www.dakshana.org">
          Dakshana Foundation
        </Link>{' '}
        {new Date().getFullYear()}
      </Typography>
    )
  }

  const defaultTheme = createTheme()

  const handleSubmitUserLogin = async (e) => {
    e.preventDefault()
    const isValid = validateForm()
    if (isValid) {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        })

        if (response.ok) {
          const data = await response.json()
          storeTokenInLS(data.token)
          setUser({
            email: '',
            password: '',
          })
        } else {
          // Handle other response codes (e.g., 4xx, 5xx)
          const errorMessage = await response.text()
          setLoginError(errorMessage)
        }
      } catch (error) {
        // Handle network errors
        console.error('Network error:', error)
      }
    } else {
      console.log('Form validation failed')
    }
  }

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
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
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmitUserLogin} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                value={user.email}
                onChange={handleInput}
                id="email"
                name="email"
                label="Email Address"
                error={Boolean(errors.email)}
                helperText={errors.email}
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={user.password}
                onChange={handleInput}
                error={Boolean(errors.password)}
                helperText={errors.password}
                id="password"
                name="password"
                autoComplete="current-password"
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              {Boolean(loginError) && (
                <Typography color="error" component="h2">
                  {loginError}
                </Typography>
              )}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2" onClick={handleTogglePage}>
                    {' '}
                    {/* Changed href to "#" */}
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </>
  )
}

export default Login
