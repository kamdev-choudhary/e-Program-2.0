import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilNotes,
  cilPuzzle,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Admin',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    available: ['admin', 'student'],
  },
  {
    component: CNavGroup,
    name: 'Admin',
    available: ['admin'],
    to: '/admin',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'users',
        available: ['admin'],
        to: '/admin/users',
      },

      {
        component: CNavItem,
        available: ['admin'],
        name: 'batch',
        to: '/admin/batch',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Exam Master',
    available: ['admin'],
    to: '/exam',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        available: ['admin'],
        name: 'Online',
        to: '/exam-master/online',
      },
      {
        component: CNavItem,
        available: ['admin'],
        name: 'Offline',
        to: '/exam-master/offline',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Question Bank',
    available: ['admin'],
    to: '/question-bank',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Lectures',
    available: ['admin', 'all', 'student'],
    to: '/lectures',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    available: ['admin', 'all', 'student'],
    name: 'Library',
    to: '/library',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    available: ['admin', 'all', 'student'],
    name: 'Doubt',
    to: '/doubts',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    available: ['admin', 'student'],
    name: 'Notifications',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        available: ['admin'],
        name: 'Alerts',
        to: '/notifications/alerts',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Authentication',
    available: ['not Logged In'],
  },
  {
    component: CNavItem,
    name: 'Login',
    available: ['not Logged In'],
    to: '/auth/login',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Register',
    available: ['not Logged In'],
    to: '/auth/register',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
]

export default _nav
