import React from 'react'

// Admin Pages
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UserMaster = React.lazy(() => import('./views/admin/UserMaster'))
const Batch = React.lazy(() => import('./views/admin/Batch'))

// Authentication Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))

// Students Pages
const Lecture = React.lazy(() => import('./views/lectures/LecturePage'))
const Doubt = React.lazy(() => import('./views/doubts/DoubtPage'))
const MaterialPage = React.lazy(() => import('./views/library/MaterialPage'))

// Exam Pages

const ExamMasterOnline = React.lazy(() => import('./views/exams/ExamMasterOnline'))
const ExamMasterOffline = React.lazy(() => import('./views/exams/ExamMasterOffline'))

// Question Bank

const QuestionBankPage = React.lazy(() => import('./views/questions/QuestionBankPage'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/auth/login', name: 'Login Page', element: Login },
  { path: '/lectures', name: 'Lecture Page', element: Lecture },
  { path: '/doubts', name: 'Doubt Page', element: Doubt },
  { path: '/admin/users', name: 'User Page', element: UserMaster },
  { path: '/admin/batch', name: 'Batches', element: Batch },
  { path: '/library', name: 'Library', element: MaterialPage },
  { path: '/exam-master/online', name: 'Exam Master Online', element: ExamMasterOnline },
  { path: '/exam-master/offline', name: 'Exam Master Offline', element: ExamMasterOffline },
  { path: '/question-bank', name: 'Question Bank', element: QuestionBankPage },
]

export default routes
