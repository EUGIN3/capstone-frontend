import React from 'react'

import AppHeader from '../userHeader'
import ButtonElement from '../../forms/ButtonElement'
import NormalTextField from '../../forms/NormalTextField'

import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import '../../styles/SetAppointment.css'

function SetAppointment() {
  const navigate = useNavigate()

  const navigation = (path) => {
    navigate(path)
  }

  // Just for now
  const { handleSubmit, control } = useForm()

  return (
    <div className='appContainer'>
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
            <div className="info-top-header">Enter details:</div>
            <div className="information-container">
              <div className="information-input-container">
                {/* Firstname */}
                <NormalTextField 
                  label='First name'
                  name={'firstname'}
                  control={control}
                  classes='firstname'
                  placeHolder='First name'
                />
                {/* Lastname */}
                <NormalTextField 
                  label='Last name'
                  name={'lastname'}
                  control={control}
                  classes='lastname'
                  placeHolder='Last name'
                />
                {/* Address */}
                <NormalTextField 
                  label='Address'
                  name={'address'}
                  control={control}
                  classes='address'
                  placeHolder='Address'
                />
                {/* Contact number */}
                <NormalTextField 
                  label='Contact number'
                  name={'contactNumber'}
                  control={control}
                  classes='contact-number'
                  placeHolder='09*********'
                />
                {/* Email address */}
                <NormalTextField 
                  label='Email'
                  name={'email'}
                  control={control}
                  classes='email'
                  placeHolder='email@gmail.com'
                />
                {/* Facebook link */}
                <NormalTextField 
                  label='Facebook Link'
                  name={'facebookLink'}
                  control={control}
                  classes='facebook-link'
                  placeHolder='Facebook Link'
                />
                {/* Appointment description */}
                <NormalTextField 
                  label='Facebook Link'
                  name={'facebookLink'}
                  control={control}
                  classes='facebook-link'
                  placeHolder='Facebook Link'
                />
                {/* Image */}
                <NormalTextField 
                  label='Facebook Link'
                  name={'facebookLink'}
                  control={control}
                  classes='facebook-link'
                  placeHolder='Facebook Link'
                />
                {/* Button */}
                <div className="set-appointment-container">
                  <ButtonElement 
                    label='Set an appointment' 
                    variant='filled-black' 
                    type='' 
                    onClick={
                      () => navigation('/app/appointment/all-appointments')
                    } 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default SetAppointment