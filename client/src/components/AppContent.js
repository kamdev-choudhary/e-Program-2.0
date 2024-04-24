import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { useAuth } from '../Auth'

// routes config
import routes from '../routes'

const AppContent = () => {
  const { isLoggedIn, isAdmin, accountType } = useAuth()
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {isLoggedIn &&
            routes
              .filter(
                (route) =>
                  (Array.isArray(route.available) && route.available.includes(accountType)) ||
                  (Array.isArray(route.available) && route.available.includes('all')),
              )
              .map((route, idx) => {
                return (
                  route.element && (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      element={<route.element />}
                    />
                  )
                )
              })}
          {!isLoggedIn &&
            routes
              .filter(
                (route) =>
                  (Array.isArray(route.available) && route.available.includes('not Logged In')) ||
                  (Array.isArray(route.available) && route.available.includes('all')),
              )
              .map((route, idx) => {
                return (
                  route.element && (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      element={<route.element />}
                    />
                  )
                )
              })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
