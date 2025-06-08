import React, { useState, useEffect } from 'react'

import AppHeader from '../user-header/userHeader'
import ButtonElement from '../../forms/button/ButtonElement'
import Appointment from './appointment/Appointment'
import StatusFilter from '../../forms/status-filter/StatusFilter'

import AxiosInstance from '../../API/AxiosInstance'

import { useNavigate } from 'react-router-dom'

import './DisplayAppointment.css'
import '../user-header/UserComponents.css'

// Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

function DisplayAppointments() {
  const [filterStatus, setFilterStatus] = useState('')
  const [userAppointments, setUserAppointments] = useState([]);

  const navigate = useNavigate()
  const navigation = (path) => {
    navigate(path)
  }

  const listAppointments = () => {
    AxiosInstance.get(`appointment/user_appointments/`, {})
    .then((response) => {
      const reversedList = response.data.slice().reverse();
      setUserAppointments(reversedList);
    }) 
  }

  const handleUpdate = (updatedAppointment) => {
    setUserAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === updatedAppointment.id ? updatedAppointment : appointment
      )
    );


    toast.success(
        <div style={{ padding: '8px' }}>
          The appointment is successfully updated!
        </div>, 
        {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Slide,
            closeButton: false,
        }
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
      
      <ToastContainer />
    </div>
  )
}

export default DisplayAppointments
