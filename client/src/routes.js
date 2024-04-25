import React from 'react'

// Home Page
const Home = React.lazy(() => import('./views/home/Home'))

// Admin Pages
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UserMaster = React.lazy(() => import('./views/admin/UserMaster'))
const Batch = React.lazy(() => import('./views/admin/Batch'))

// Authentication Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))

// Common Pages
const Settings = React.lazy(() => import('./views/settings/UserSetting'))

// Students Pages
const StudentDashboard = React.lazy(() => import('./views/dashboard/StudentDashboard'))
const StudentExams = React.lazy(() => import('./views/exams/StudentExams'))
const Profile = React.lazy(() => import('./views/profile/Profile'))
const Lecture = React.lazy(() => import('./views/lectures/LecturePage'))
const Doubt = React.lazy(() => import('./views/doubts/DoubtPage'))
const MaterialPage = React.lazy(() => import('./views/library/MaterialPage'))

// Exam Pages
const ExamMasterOnline = React.lazy(() => import('./views/exams/ExamMasterOnline'))
const ExamMasterOffline = React.lazy(() => import('./views/exams/ExamMasterOffline'))

// Question Bank
const QuestionBankPage = React.lazy(() => import('./views/questions/QuestionBankPage'))

const routes = [
  { path: '/', exact: true, name: 'Home', available: ['all', 'admin'], element: Home },
  { path: '/dashboard', name: 'Dashboard', available: ['admin'], element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', available: ['student'], element: StudentDashboard },
  { path: '/auth/login', name: 'Login Page', available: ['not Logged In'], element: Login },
  {
    path: '/auth/register',
    name: 'Register Page',
    available: ['not Logged In'],
    element: Register,
  },
  {
    path: '/lectures',
    name: 'Lecture Page',
    available: ['admin', 'all', 'student'],
    element: Lecture,
  },
  { path: '/doubts', name: 'Doubt Page', available: ['admin', 'all', 'student'], element: Doubt },
  { path: '/admin/users', name: 'User Page', available: ['admin'], element: UserMaster },
  { path: '/admin/batch', name: 'Batches', available: ['admin'], element: Batch },
  {
    path: '/library',
    name: 'Library',
    available: ['admin', 'all', 'student'],
    element: MaterialPage,
  },
  {
    path: '/exam-master/online',
    name: 'Exam Master Online',
    available: ['admin'],
    element: ExamMasterOnline,
  },
  {
    path: '/exam-master/offline',
    name: 'Exam Master Offline',
    available: ['admin'],
    element: ExamMasterOffline,
  },
  { path: '/exams', name: 'Exams', available: ['student'], element: StudentExams },
  {
    path: '/profile',
    name: 'Profile',
    available: ['student', 'admin', 'faculty'],
    element: Profile,
  },
  {
    path: '/settings',
    name: 'Settings',
    available: ['student', 'admin', 'faculty'],
    element: Settings,
  },
  {
    path: '/question-bank',
    name: 'Question Bank',
    available: ['admin', 'faculty'],
    element: QuestionBankPage,
  },
]

export default routes
