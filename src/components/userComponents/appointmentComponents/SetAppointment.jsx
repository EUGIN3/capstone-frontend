import React, { useState } from 'react'

import AppHeader from '../userHeader'
import ButtonElement from '../../forms/ButtonElement'
import NormalTextField from '../../forms/NormalTextField'

import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import '../../styles/SetAppointment.css'

import AxiosInstance from '../../AxiosInstance'


function SetAppointment() {
  const navigate = useNavigate()

  const navigation = (path) => {
    navigate(path)
  }

  const { handleSubmit, control } = useForm()

  const [selectedImage, setSelectedImage] = useState(null);
  const submission = (data) => {
    const formData = new FormData();
    formData.append('date', "2003-10-07");
    formData.append('time', "12:00:00");
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
    .then(response => {
      null
    })
    .catch(err => {
      null
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
                  type='' 
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
                  <NormalTextField 
                    label='Time'
                    name={'time'}
                    control={control}
                    classes='time'
                    placeHolder='1:00 PM'
                  />
                </div>
              </div>

              <div className="date-continer">
                <div className="date-top-header">Select date:</div>
                <div className="date">date</div>
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
        </form>
    </div>
  )
}

export default SetAppointment