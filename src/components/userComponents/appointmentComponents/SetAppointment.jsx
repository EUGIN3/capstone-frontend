import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';

import AppHeader from '../userHeader'
import ButtonElement from '../../forms/ButtonElement'
import NormalTextField from '../../forms/NormalTextField'

import CalendarComponent from '../../forms/calendarComponent'

import FixTime from '../../forms/FixTime';

import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import '../../styles/SetAppointment.css'

import AxiosInstance from '../../AxiosInstance'

import AlertComponent from '../../Alert';

function SetAppointment() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const [ availabilityData, setAvailabilityData ] = useState({})
  const [disabledSlots, setDisabledSlots] = useState({});

  const navigate = useNavigate()

  const navigation = (path) => {
    navigate(path)
  }

  let fileInputRef = null;

  const schema = yup.object({
    time: yup.string().required('Please select a time.'),
  });

  const [selectedTime, setSelectedTime] = useState('');

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const { handleSubmit, control, reset } = useForm({ resolver: yupResolver(schema) });

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
    .then(() => {
      setAlertMessage('Appointment booked successfully! You can now view it.');
      setAlertType('success');
      setShowAlert(true);

      reset();
      if (fileInputRef) {
        fileInputRef.value = '';
      }
      setSelectedTime('');

      fetchAllUnavailableDates();

      // Automatically move to the next available date
      let nextDate = dayjs().add(1, 'day');
      let formatted = nextDate.format('YYYY-MM-DD');

      while (fullyUnavailableDates.includes(formatted)) {
        nextDate = nextDate.add(1, 'day');
        formatted = nextDate.format('YYYY-MM-DD');
      }

      setSelectedDate(nextDate);

      setTimeout(() => {
          setShowAlert(false);
      }, 1000);
    })
    .catch((error) => {
      setAlertMessage('Failed to set the appointment.');
      setAlertType('error');
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    })
  };

  const [fullyUnavailableDates, setFullyUnavailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchAllUnavailableDates = async () => {
    try {
      const response = await AxiosInstance.get(`unavailability/`);
      
      const fullyBookedDates = response.data
        .filter(item => item.slot_one && item.slot_two && item.slot_three && item.slot_four && item.slot_five)
        .map(item => item.date);

      setFullyUnavailableDates(fullyBookedDates);

      let checkDate = dayjs();
      let formatted = checkDate.format('YYYY-MM-DD');

      while (fullyBookedDates.includes(formatted)) {
        checkDate = checkDate.add(1, 'day');
        formatted = checkDate.format('YYYY-MM-DD');
      }

      setSelectedDate(checkDate); 
      getAvailability(formatted); 
    } catch (error) {
      console.error('Failed to fetch unavailable dates:', error);
    }
  };

  useEffect(() => {
    fetchAllUnavailableDates();
  }, []);




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

          const allSlotsUnavailable = Object.values(unavailableSlots).every(val => val === true);
          if (allSlotsUnavailable) {
            setFullyUnavailableDates(prev => [...new Set([...prev, date])]);
          } else {
            setFullyUnavailableDates(prev => prev.filter(d => d !== date));
          }
        } else {
          setAvailabilityData({});
          setDisabledSlots({});
          setFullyUnavailableDates(prev => prev.filter(d => d !== date));
        }
      });
  };

  
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      getAvailability(formattedDate);
    }
  }, [selectedDate]);

  
  return (
    <div className='appContainer'>
      { showAlert && <AlertComponent message={alertMessage} type={alertType} show={showAlert} isNoNavbar={''}/> }

      <form onSubmit={handleSubmit(submission)}>    
          <div className='top-set-app'>
              <AppHeader headerTitle='set appointment'/>

              <div className='top-set-app-btn-con'>
                <ButtonElement 
                  label='View appointment' 
                  variant='filled-black' 
                  type='button' 
                  onClick={
                    () => navigation('/user/all-appointments')
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
                    value={selectedTime}
                    control={control}
                    name={'time'}
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
                      ref={(ref) => fileInputRef = ref}
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
                  disableDates={fullyUnavailableDates}
                />
              </div>
            </div>
          </div>
        </form>
    </div>
  )
}

export default SetAppointment