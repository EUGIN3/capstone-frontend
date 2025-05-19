import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs';

import AppHeader from '../userHeader'
import ButtonElement from '../../forms/ButtonElement'
import Appointment from '../Appointments/Appointment'
import StatusFilter from '../../forms/DropdownComponent'

import AxiosInstance from '../../AxiosInstance'

import { useNavigate } from 'react-router-dom'

import '../../styles/DisplayAppointment.css'
import '../../styles/UserComponents.css'

function DisplayAppointments() {
  const [filterStatus, setFilterStatus] = useState('')
  const [userAppointments, setUserAppointments] = useState([]);

  const navigate = useNavigate()
  const navigation = (path) => {
    navigate(path)
  }

  const listAppointments = () => {
    AxiosInstance.get(`user_appointments/`, {})
    .then((response) => {
      setUserAppointments(response.data);
    }) 
  }
  
  const handleDelete = (deletedId) => {
    setUserAppointments((prev) => prev.filter((app) => app.id !== deletedId));
  };

  const handleUpdate = (updatedAppointment) => {
    setUserAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === updatedAppointment.id ? updatedAppointment : appointment
      )
    );
  };
  
  const renderAppointmentsByStatus = (statusLabel) => {
    return userAppointments
      .filter((app) => statusLabel === "" 
        ? true
        : app.appointment_status === statusLabel
      )
      .map((app) => (
        <Appointment
          key={app.id}
          id={app.id}
          date={app.date}
          time={dayjs(`1000-01-01T${app.time}`).format('hh:mm A')}
          status={app.appointment_status}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ));
  };

  useEffect(() => {
    listAppointments();
  }, []);

  return (
    <div className='appContainer'>
      <div className='top-all-app'>
        <AppHeader headerTitle='all appointment' />

        <div className='top-all-app-btn-con'>
          <ButtonElement 
            label='Set appointment' 
            variant='filled-black' 
            type='button' 
            onClick={() => navigation('/user/appointment/set-appointment')} />
        </div>
      </div>

      <hr className='all-app-hr' />

      <div className='status-drop-container'>
        <StatusFilter onFilterChange={setFilterStatus} />
      </div>

      <div className="show-appointment-list">
        { 
          renderAppointmentsByStatus(filterStatus)
        }
      </div>
    </div>
  )
}

export default DisplayAppointments
