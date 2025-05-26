import React, { useState, useEffect } from 'react'

import AppHeader from '../userHeader'
import ButtonElement from '../../forms/ButtonElement'
import Appointment from '../Appointments/Appointment'
import StatusFilter from '../../forms/StatusFilter'

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
      const reversedList = response.data.slice().reverse();
      setUserAppointments(reversedList);
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
          time={app.time}
          facebookLink={app.facebook_link}
          adress={app.address}
          description={app.description}
          image={app.image}
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
            onClick={() => navigation('/user/set-appointment')} />
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
