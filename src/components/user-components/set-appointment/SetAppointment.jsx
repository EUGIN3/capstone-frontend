import './SetAppointment.css'

import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';

// Components
import AppHeader from '../user-header/userHeader'
import ButtonElement from '../../forms/button/ButtonElement'
import NormalTextField from '../../forms/text-fields/NormalTextField'
import DatePickerComponent from '../../forms/date-picker/DatePicker';
import FixTime from '../../forms/fixtime/FixTime';
import UploadBox from '../../forms/upload-file/ImageUpload';
import MultilineTextFields from '../../forms/multilines-textfield/MultilineTextFields';

import AxiosInstance from '../../API/AxiosInstance'

// Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

function SetAppointment() {
  const navigate = useNavigate()
  const navigation = (path) => {
    navigate(path)
  }


  // Time slots 
  return (
    <div className='set-appointment appContainer'>
      <div className='top-all-app'>
        <AppHeader headerTitle='Set appointment' />

        <div className='top-all-app-btn-con'>
          <ButtonElement 
            label='Appointment' 
            variant='filled-black' 
            type='button' 
            onClick={() => navigation('/user/all-appointments')} />
        </div>
      </div>

      <div className="content-container">
        {/* Date */}
        <div className="set-appointment-date-con info-con">
          <div className="number-note-con">
            <div className="step-number">1</div>
            <p className="note">Select your desire date of your appointment</p>
          </div>
          <DatePickerComponent />
        </div>

        {/* Time */}
        <div className="set-appointment-date-con info-con">
          <div className="number-note-con">
            <div className="step-number">2</div>
            <p className="note">Select your desire time of your appointment</p>
          </div>
          <FixTime />
        </div>

        {/* Image */}
        <div className="set-appointment-image-con info-con">
          <div className="number-note-con">
            <div className="step-number">3</div>
            <p className="note">Upload an image as reference or generate a design</p>
          </div>
          <UploadBox />
        </div>

        {/* Description */}
        <div className="set-appointment-description-con info-con">
          <div className="number-note-con">
            <div className="step-number">4</div>
            <p className="note">Describe your appointment</p>
          </div>
          <MultilineTextFields 
            label='Description' 
            className='description' 
            placeholder='Describe your appointment here...'/>
        </div>

        <div className="set-appointment-submit-btn-con">
          <ButtonElement 
            label='Appointment' 
            variant='filled-black' 
            type='button'
          />
        </div>

      </div>
      <ToastContainer />
    </div>
  )
}

export default SetAppointment