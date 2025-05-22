import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';

import AppHeader from '../userHeader'
import ButtonElement from '../../forms/ButtonElement'
import NormalTextField from '../../forms/NormalTextField'

import DatePickerComponent from '../../forms/DatePicker'
import CalendarComponent from '../../forms/calendarComponent'
import TimePickerComponent from '../../forms/TimePicker'

import FixTime from '../../forms/FixTime';

import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import '../../styles/SetAppointment.css'

import AxiosInstance from '../../AxiosInstance'


function SetAppointment() {
  const [ availabilityData, setAvailabilityData ] = useState({})
  const [disabledSlots, setDisabledSlots] = useState({});

  const navigate = useNavigate()

  const navigation = (path) => {
    navigate(path)
  }

  const schema = yup.object({
    address : yup.string().required('Please enter an address.'),
    facebookLink : yup.string().required('Please enter a facebook link.'),
    appointmentDescription : yup.string().required('Please enter a description.')
  });

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const formattedDate = selectedDate.format('YYYY-MM-DD');
    getAvailability(formattedDate);
  }, [selectedDate]);


  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const { handleSubmit, control } = useForm({resolver : yupResolver(schema)}) 

  const [selectedImage, setSelectedImage] = useState(null);
  const submission = (data) => {
    const formData = new FormData();
    formData.append('date', selectedDate.format('YYYY-MM-DD'));
    formData.append('time', selectedTime);
    formData.append('address', data.address);
    formData.append('facebook_link', data.facebookLink);
    formData.append('description', data.appointmentDescription);

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    AxiosInstance.post('set_appointments/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  };

  const getAvailability = (date) => {
    AxiosInstance.get(`unavailability/`)
      .then((response) => {
        const data = response.data.find(item => item.date === date);
        if (data) {
          setAvailabilityData(data);
          const unavailableSlots = {
            '7:00 - 8:30 AM': data.slot_one,
            '8:30 - 10:00 AM': data.slot_two,
            '10:00 - 11:30 AM': data.slot_three,
            '1:00 - 2:30 PM': data.slot_four,
            '2:30 - 4:00 PM': data.slot_five,
          };
          setDisabledSlots(unavailableSlots);
        } else {
          setAvailabilityData({});
          setDisabledSlots({});
        }
      });
  };
  
  return (
    <div className='appContainer'>
      <form onSubmit={handleSubmit(submission)}>
          <div className='top-set-app'>
              <AppHeader headerTitle='set appointment'/>

              <div className='top-set-app-btn-con'>
                <ButtonElement 
                  label='View appointment' 
                  variant='filled-black' 
                  type='button' 
                  onClick={
                    () => navigation('/user/appointment/all-appointments')
                  } 
                />
              </div>
          </div>

          <hr className='set-app-hr'/>

          <div className="set-input-main-container">
            <div className="setappointment-left">
              
              <div className="time-continer">
                <div className="time-top-header">Select time:</div>

                <div className='time-input-container'>

                  <FixTime 
                    onSelect={handleTimeSelect}
                    disabledSlots={disabledSlots}
                  />
                  
                </div>
              </div>  

              <div className="setappointment-right">
                <div className="setappointment-info-top-header">Enter details:</div>
                <div className="setappointment-information-container">
                  <div className="setappointment-information-input-container">
                    {/* Address */}
                    <NormalTextField 
                      label='Address'
                      name={'address'}
                      control={control}
                      classes='address'
                      placeHolder='Address'
                    />
                    {/* Facebook link */}
                    <NormalTextField 
                      label='Facebook Link'
                      name={'facebookLink'}
                      control={control}
                      classes='facebook-link'
                      placeHolder='Facebook link'
                    />
                    {/* Appointment description */}
                    <NormalTextField 
                      label='Description'
                      name={'appointmentDescription'}
                      control={control}
                      classes='appointment-description'
                      placeHolder='Appointment description'
                    />
                    {/* Image */}
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                    {/* Button */}
                    <div className="set-appointment-container">
                      <ButtonElement 
                        label='Set an appointment' 
                        variant='filled-black' 
                        type={'submit'}   
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="date-continer">
              <div className="date-top-header">Select date:</div>
              <div className="date">
                <CalendarComponent 
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                />
              </div>
            </div>
          </div>
        </form>
    </div>
  )
}

export default SetAppointment