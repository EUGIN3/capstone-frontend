import React, { useState, useEffect } from 'react'

import './styles/ManageAppointment.css'
import AxiosInstance from '../../AxiosInstance'

import CustomizedTables from './AppointmentTable';

import { Dialog } from '@mui/material';
import ModalDetails from './ModalDetails';
import AlertComponent from '../../Alert';

function ManageAppointment() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const [open, setOpen] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState()
  const [refreshFlag, setRefreshFlag] = useState(false);

    
  const handleClickOpen = () => {
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };

  const handleApproval = (id, action) => {
    AxiosInstance.patch(`appointments/${id}/`, {
      appointment_status: action,
    })
    .then((response) => {
      handleClose();
      setRefreshFlag(prev => !prev); 

      setAlertMessage('Appointment updated successfully.');
      setAlertType('success');
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    })
    .catch((error) => {
      setAlertMessage('Failed to update appointment.');
      setAlertType('error');
      setShowAlert(true);
      handleClose();

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    });
  };


  return (
    <div className='manageAppointment'>
      { showAlert && <AlertComponent message={alertMessage} type={alertType} show={showAlert} isNoNavbar={''}/> }


      <p className='manageAppointment-header'>
        Manage Appointment
      </p>

      { selectedAppointment && 
        <Dialog open={open} onClose={handleClose}>
          <ModalDetails
            id={selectedAppointment.id}
            firstName={selectedAppointment.first_name}
            lastName={selectedAppointment.last_name}
            date={selectedAppointment.date}
            time={selectedAppointment.time}
            description={selectedAppointment.description}
            facebookLink={selectedAppointment.facebookLink}
            phone_number={selectedAppointment.phone_number}
            email={selectedAppointment.email}
            image={selectedAppointment.image}
            appointment_status={selectedAppointment.appointment_status}
            address={selectedAppointment.address}
            date_set={selectedAppointment.date_set}
            onUpdate={handleApproval}
            onClose={handleClose}
          />
        </Dialog>
      }
      
      <CustomizedTables
        refreshFlag={refreshFlag}
        onViewDetails={(appointment) => {
          setSelectedAppointment(appointment);
          handleClickOpen();
        }}
      />


    </div>
  )
}

export default ManageAppointment