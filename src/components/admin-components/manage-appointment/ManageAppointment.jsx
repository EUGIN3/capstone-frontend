import React from 'react'
import './ManageAppointment.css'

import AppHeader from '../../user-components/user-header/userHeader'
import AppointmentTable from './AppointmentTable'


function ManageAppointment() {
  return (
    <div className='manage-appointment appContainer'>
      <AppHeader headerTitle='Manage appointment'/>

      <div className="content-container">
        <div className="table">
          <AppointmentTable/>
        </div>
      </div>
    </div>
  )
}

export default ManageAppointment