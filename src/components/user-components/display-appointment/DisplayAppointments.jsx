import React, { useState, useEffect } from 'react'

import AppHeader from '../user-header/userHeader'
import ButtonElement from '../../forms/button/ButtonElement'
import Appointment from './appointment/Appointment'
import FittingAppointment from './appointment/FittingAppointment'
import StatusFilter from '../../forms/status-filter/StatusFilter'

import AxiosInstance from '../../API/AxiosInstance'
import { useNavigate } from 'react-router-dom'

import './DisplayAppointment.css'
import '../user-header/UserComponents.css'

import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

function DisplayAppointments() {
  const [filterStatus, setFilterStatus] = useState('');
  const [userAppointments, setUserAppointments] = useState([]);
  const [designs, setDesigns] = useState([]);

  const navigate = useNavigate();
  const navigation = (path) => navigate(path);

  
  const fetchUserDesigns = async () => {
    try {
      const response = await AxiosInstance.get('/design/user_designs/');
      setDesigns(response.data);
      console.log('✅ Designs fetched:', response.data);
    } catch (error) {
      console.error('❌ Failed to fetch designs:', error);
    }
  };

  const listAppointments = async () => {
    try {
      const response = await AxiosInstance.get('appointment/user_appointments/');
      const reversedList = response.data.slice().reverse(); 
      setUserAppointments(reversedList);
    } catch (error) {
      console.error('❌ Failed to fetch appointments:', error);
    }
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
      .filter((app) => {
        if (statusLabel === "") return app.appointment_status !== "archived";

        return app.appointment_status === statusLabel;
      })
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
          appointment_type={app.appointment_type}
          onUpdate={handleUpdate}
        />
      ));
  };

  const renderFittingAppointment = () => {
    if (filterStatus !== 'fitting' && filterStatus !== '') return null;
    
    const fittingAppointments = designs.filter(
      (app) => app.fitting_date && app.fitting_time
    );

    return fittingAppointments.map((fit) => (
      <FittingAppointment
        key={fit.id}
        fitting_date={fit.fitting_date}
        fitting_time={fit.fitting_time}
      />
    ));
  };

  // ✅ Fetch data on mount
  useEffect(() => {
    listAppointments();
    fetchUserDesigns();
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
            onClick={() => navigation('/user/set-appointment')} 
          />
        </div>
      </div>

      <hr className='all-app-hr' />

      <div className='status-drop-container'>
        <StatusFilter onFilterChange={setFilterStatus} />
      </div>

      <div className="show-appointment-list">
        {renderAppointmentsByStatus(filterStatus)}
        {renderFittingAppointment()}
      </div>

      <ToastContainer />
    </div>
  );
}

export default DisplayAppointments;
