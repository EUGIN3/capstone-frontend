import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog';

import '../../styles/AdminComponents.css'
import './ManageSchedule.css'

import SetAvailability from './SetAvailability';
import BigCalendar from '../../BigCalendar/BigCalendar'

import AxiosInstance from '../../AxiosInstance';

import AlertComponent from '../../Alert';

const ManageSchedule = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const [ unavailabilityData, setUnavailabilityData ] = useState()

  const getAvailability = (date) => {
    AxiosInstance.get(`unavailability/`)
      .then((response) => {
        const data = response.data.find(item => item.date === date);
        setUnavailabilityData(data);
      })
  };
  
  const [selectedDate, setSelectedDate] = useState('')

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr)
    getAvailability(arg.dateStr)
    handleClickOpen()
  };

  const [open, setOpen] = useState(false);
    
  const handleClickOpen = () => {
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };

  const slots = unavailabilityData ? {
    slot_one: unavailabilityData.slot_one,
    slot_two: unavailabilityData.slot_two,
    slot_three: unavailabilityData.slot_three,
    slot_four: unavailabilityData.slot_four,
    slot_five: unavailabilityData.slot_five,
  } : null;


  
  return (
    <div className='adminAppContainer manageSchedule'>
      { showAlert && <AlertComponent message={alertMessage} type={alertType} show={showAlert} isNoNavbar={''}/> }

      <Dialog open={open} onClose={handleClose}>
        <SetAvailability
          unavailableSlots={slots}
          selectedDate={selectedDate}
          onAlert={(message, type) => {
            setAlertMessage(message);
            setAlertType(type);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
          }}
          onClose={handleClose}
        />
      </Dialog>

      <div className="manageSchedule-calendar">
        <BigCalendar 
          onCLickDate={handleDateClick}  
        />
      </div>
    </div>
  )
}

export default ManageSchedule