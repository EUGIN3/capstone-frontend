import React, { useState, useEffect } from 'react'

import '../../styles/ManageAppointment.css'
import AxiosInstance from '../../AxiosInstance'
import AdminAppointmentComponent from '../AdminAppointmentComponent';


function ManageAppointment() {

  const [userAppointments, setUserAppointments] = useState([]);

  const listAppointments = () => {
    AxiosInstance.get(`appointments/`, {})
    .then((response) => {
      setUserAppointments(response.data);
    }) 
  }
  useEffect(() => {
    listAppointments();
  }, []);

  const handleUpdate = (updatedAppointment) => {
    setUserAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === updatedAppointment.id ? updatedAppointment : appointment
      )
    );
  };

  return (
    <div className='manageAppointment'>
        {
          userAppointments.map((app) => (
            <AdminAppointmentComponent
              key={app.id}
              id={app.id}
              first_name={app.first_name}
              last_name={app.last_name}
              email={app.email}
              date={app.date}
              time={app.time}
              onUpdate={handleUpdate}
            />
          ))
        }
    </div>
  )
}

export default ManageAppointment