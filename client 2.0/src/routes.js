import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Academic

const Doubt = React.lazy(() => import('./views/pages/doubts/Doubt'))
const MaterialPage = React.lazy(() => import('./views/pages/materials/MaterialPage'))
const Lectures = React.lazy(() => import('./views/pages/lectures/LecturePage'))
const Questions = React.lazy(() => import('./views/pages/questions/QuestionBankPage'))

// Auth Page

const Login = React.lazy(() => import('./views/pages/login/Login'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/doubts', name: 'Doubt', element: Doubt },
  { path: '/library', name: 'Library', element: MaterialPage },
  { path: '/lectures', name: 'Lectures', element: Lectures },
  { path: '/question-bank', name: 'Lectures', element: Questions },
  { path: '/examtemplate/offline', name: 'Offline Exam', element: Login },
  { path: '/examtemplate/online', name: 'Online Exam', element: Login },
  { path: '/auth/login', name: 'Login', element: Login },
  { path: '/user/profile', name: 'Login', element: Login },
]

export default routes
