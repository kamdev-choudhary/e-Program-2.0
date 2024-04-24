import { createContext, useContext, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  let isAdmin = false
  let accountType = ''
  let userId = ''
  let batchId = ''

  const storeTokenInLS = (serverToken) => {
    localStorage.setItem('token', serverToken)
    setToken(serverToken)
  }

  const isLoggedIn = !!token
  if (token) {
    const decoded = jwtDecode(token)
    isAdmin = decoded.isAdmin
    accountType = decoded.accountType
    userId = decoded.userId
    name = decoded.name
    batchId = decoded.batchId
  }

  const logoutUser = () => {
    localStorage.removeItem('token')
    setToken('')
    isAdmin = false
    accountType = ''
    batchId = ''
    name = ''
    userId = ''
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAdmin,
        accountType,
        userId,
        batchId,
        name,
        storeTokenInLS,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
