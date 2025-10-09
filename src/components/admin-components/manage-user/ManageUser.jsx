import React from 'react'
import './styles/ManageUser.css'

import AppHeader from '../../user-components/user-header/userHeader'
import UserTable from './UserTable'

function ManageUser() {
  return (
    <div className='manage-user appContainer'>
      <AppHeader headerTitle='Manage user'/>

      <div className="content-container">
        <div className="table">
          <UserTable />
        </div>
      </div>
    </div>
  )
}

export default ManageUser