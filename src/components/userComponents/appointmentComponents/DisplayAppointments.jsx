import React, { useState, useEffect } from 'react'

import AppHeader from '../userHeader'
import ButtonElement from '../../forms/ButtonElement'
import Appointment from '../Appointments/Appointment'
import StatusFilter from '../../forms/DropdownComponent'

import { useNavigate } from 'react-router-dom'

import '../../styles/DisplayAppointment.css'
import '../../styles/UserComponents.css'

function DisplayAppointments() {
  const [filterStatus, setFilterStatus] = useState('')

  const navigate = useNavigate()
  const navigation = (path) => {
    navigate(path)
  }

  const listAppointments = () => {
    
  }

  useEffect(() => {
    console.log(filterStatus)
  }, [filterStatus])

  return (
    <div className='appContainer'>
      <div className='top-all-app'>
        <AppHeader headerTitle='all appointment' />

        <div className='top-all-app-btn-con'>
          <ButtonElement label='Set appointment' variant='filled-black' type='' onClick={() => navigation('/user/appointment/set-appointment')} />
        </div>
      </div>

      <hr className='all-app-hr' />

      <div className='status-drop-container'>
        <StatusFilter onFilterChange={setFilterStatus} />
      </div>

      <Appointment date={'January 01, 2025'} time={'8:00 AM'} status={'approved'} />
    </div>
  )
}

export default DisplayAppointments
