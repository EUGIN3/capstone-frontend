import './styles/ManageAppointment.css'

import React, { useState, useEffect } from 'react'
import { Dialog } from '@mui/material';
// Components
import AxiosInstance from '../../API/AxiosInstance';
import CustomizedTables from './AppointmentTable';
import ModalDetails from './ModalDetails';
// Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"


function ManageAppointment() {


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
    AxiosInstance.patch(`appointment/appointments/${id}/`, {
      appointment_status: action,
    })
    .then((response) => {
      handleClose();
      setRefreshFlag(prev => !prev); 

      toast.success(
          <div style={{ padding: '8px' }}>
              Appointment successfully updated.
          </div>, 
          {
              position: "top-center",
              autoClose: 1000,
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
    })
    .catch((error) => {
      toast.error(
        <div style={{ padding: '8px' }}>
            Failed to updated appointment.
        </div>, 
        {
            position: "top-center",
            autoClose: 1000,
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
    });
  };


  return (
    <div className='manageAppointment'>
      <p className='manageAppointment-header'>
        Manage Appointment
      </p>

      { selectedAppointment && 
        <Dialog open={open} onClose={handleClose}>
          <ModalDetails
            id={selectedAppointment?.id ?? ''}
            firstName={selectedAppointment?.first_name === 'undefined' ? '' : selectedAppointment?.first_name ?? ''}
            lastName={selectedAppointment?.last_name === 'undefined' ? '' : selectedAppointment?.last_name ?? ''}
            date={selectedAppointment?.date === 'undefined' ? '' : selectedAppointment?.date ?? ''}
            time={selectedAppointment?.time === 'undefined' ? '' : selectedAppointment?.time ?? ''}
            description={selectedAppointment?.description === 'undefined' ? '' : selectedAppointment?.description ?? ''}
            facebookLink={selectedAppointment?.facebookLink === 'undefined' ? '' : selectedAppointment?.facebookLink ?? ''}
            phone_number={selectedAppointment?.phone_number === 'undefined' ? '' : selectedAppointment?.phone_number ?? ''}
            email={selectedAppointment?.email === 'undefined' ? '' : selectedAppointment?.email ?? ''}
            image={selectedAppointment?.image === 'undefined' ? '' : selectedAppointment?.image ?? ''}
            appointment_status={selectedAppointment?.appointment_status === 'undefined' ? '' : selectedAppointment?.appointment_status ?? ''}
            address={selectedAppointment?.address === 'undefined' ? '' : selectedAppointment?.address ?? ''}
            date_set={selectedAppointment?.date_set === 'undefined' ? '' : selectedAppointment?.date_set ?? ''}
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

      <ToastContainer />
    </div>
  )
}

export default ManageAppointment