import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="http://www.dakshana.org" target="_blank" rel="noopener noreferrer">
          Dakshana Foundation
        </a>
        <span className="ms-1">&copy; 2024</span>
      </div>
      <div className="ms-auto"></div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
