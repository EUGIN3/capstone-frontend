import React from 'react'
import './ManageAppointment.css'

import ApprovedAppointmentTable from './ApproveTable'


function ManageApproveAppointment() {
  return (
    <div className='manage-appointment appContainer'>
      <div className="content-container">
        <div className="table">
          <ApprovedAppointmentTable />
        </div>
      </div>
    </div>
  )
}

export default ManageApproveAppointment