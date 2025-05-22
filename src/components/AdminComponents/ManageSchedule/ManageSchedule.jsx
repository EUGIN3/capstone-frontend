import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog';

import '../../styles/AdminComponents.css'
import './ManageSchedule.css'

import Construction from '../../Construction'
import SetAvailability from './SetAvailability';
import BigCalendar from '../../BigCalendar/BigCalendar'

import AxiosInstance from '../../AxiosInstance';

const ManageSchedule = () => {

  const [ unavailabilityData, setUnavailabilityData ] = useState()

  const getAvailability = (date) => {
    AxiosInstance.get(`unavailability/`)
      .then((response) => {
        const data = response.data.find(item => item.date === date);
        setUnavailabilityData(data);
      })
  };
  // useEffect(() => {
  //   console.log(unavailabilityData) 
  // }, [unavailabilityData])
  
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
      <Dialog open={open} onClose={handleClose}>
        <SetAvailability
          unavailableSlots={slots}
          selectedDate={selectedDate}
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