import '../AdminComponents.css'
import './ManageSchedule.css'

import React, { useEffect, useState } from 'react'
// Components
import Dialog from '@mui/material/Dialog';
import SetUnavailability from './SetAvailability';
import BigCalendar from '../../forms/big-calendar/BigCalendar'
import AxiosInstance from '../../API/AxiosInstance';
// import AlertComponent from '../../Alert';
// Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"


const ManageSchedule = () => {
  const [ unavailabilityData, setUnavailabilityData ] = useState()

  const getAvailability = (date) => {
    AxiosInstance.get(`availability/display_unavailability/`)
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

  const showToast = (message, type = "success") => {
    toast[type](
      <div style={{ padding: '8px' }}>{message}</div>,
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
  };

  
  return (
    <div className='adminAppContainer manageSchedule'>

      <Dialog open={open} onClose={handleClose}>
        <SetUnavailability
          unavailableSlots={slots}
          selectedDate={selectedDate}

          onClose={handleClose}
          onAlert={showToast}
        />
      </Dialog>

      <div className="manageSchedule-calendar">
        <BigCalendar 
          onCLickDate={handleDateClick}
        />
      </div>

      <ToastContainer />
    </div>
  )
}

export default ManageSchedule