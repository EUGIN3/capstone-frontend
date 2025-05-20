import React, { useState, useEffect } from 'react'

import './styles/ManageAppointment.css'
import AxiosInstance from '../../AxiosInstance'
import AdminAppointmentComponent from '../AdminAppointmentComponent';

import StatusFilterNavbar from './StatusFilterNavbar';


function ManageAppointment() {
  return (
    <div className='manageAppointment'>
      <p className='manageAppointment-header'>
        All Appointment
      </p>
      <StatusFilterNavbar />
    </div>
  )
}

export default ManageAppointment