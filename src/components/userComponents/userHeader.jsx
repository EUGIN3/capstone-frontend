import React from 'react'
import '../styles/UserComponents.css'

function AppHeader(props) {

  const { headerTitle } = props

  return (
    <div className='headerContainer'>
      <p>{headerTitle}</p>
    </div>
  )
}

export default AppHeader