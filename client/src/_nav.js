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
    admin: true,
  },
  {
    component: CNavGroup,
    name: 'Admin',
    admin: true,
    to: '/admin',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'users',
        admin: true,
        to: '/admin/users',
      },

      {
        component: CNavItem,
        admin: true,
        name: 'batch',
        to: '/admin/batch',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Exam Master',
    admin: true,
    to: '/exam',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        admin: true,
        name: 'Online',
        to: '/exam-master/online',
      },
      {
        component: CNavItem,
        admin: true,
        name: 'Offline',
        to: '/exam-master/offline',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Question Bank',
    to: '/question-bank',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Lectures',
    to: '/lectures',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Library',
    to: '/library',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Doubt',
    to: '/doubts',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    admin: true,
    name: 'Notifications',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        admin: true,
        name: 'Alerts',
        to: '/notifications/alerts',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Authentication',
  },
  {
    component: CNavItem,
    name: 'Login',
    to: '/auth/login',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Register',
    to: '/auth/register',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
]

export default _nav
