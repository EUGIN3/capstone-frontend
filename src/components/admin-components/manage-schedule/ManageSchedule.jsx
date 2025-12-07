import '../AdminComponents.css'
import './ManageSchedule.css'

import React, { useEffect, useState } from 'react'
// Components
import Dialog from '@mui/material/Dialog';
import SetUnavailability from './SetAvailability';
import BigCalendar from '../../forms/big-calendar/BigCalendar'
import AxiosInstance from '../../API/AxiosInstance';
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
  
  return (
    <div className='adminAppContainer manageSchedule'>

      <Dialog open={open} onClose={handleClose}>
        <SetUnavailability
          selectedDate={selectedDate}

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