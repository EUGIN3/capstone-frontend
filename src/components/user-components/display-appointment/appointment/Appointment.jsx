import './Appointment.css'

import React, {useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import Dialog from '@mui/material/Dialog';
import ButtonElement from '../../../forms/button/ButtonElement';
import NormalTextField from '../../../forms/text-fields/NormalTextField';
import AxiosInstance from '../../../API/AxiosInstance';
import DatePickerComponent from '../../../forms/date-picker/DatePicker';
import FixTime from '../../../forms/fixtime/FixTime';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import UploadBox from '../../../forms/upload-file/ImageUpload';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { Tooltip } from '@mui/material';

function Appointment(props) {
  const { date, time, status, id, onUpdate, facebookLink, adress, description, image} = props  
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState('');

  const [ availabilityData, setAvailabilityData ] = useState({})
  const [ disabledSlots, setDisabledSlots ] = useState({});
  const [resetUploadBox, setResetUploadBox] = useState(false);

  const getFullImageUrl = (image) => {
    if (!image) return '/placeholder.png';
    return image.startsWith('http') ? image : `http://127.0.0.1:8000${image}`;
  };

  const handleClickOpen = () => {
    
    console.log(image)
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      const formattedDate = dayjs(date);
      setSelectedDate(formattedDate);
      setSelectedTime(time);

      reset({
        time: time || '',
        updatedAppointmentDescription: description && description !== 'undefined' ? description : '',
      });
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);

    reset();
    setSelectedTime('');
    setSelectedDate(dayjs(date))
  };

  const getAvailability = (date) => {
    AxiosInstance.get(`availability/display_unavailability/`)
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

  useEffect(() => {
    const formattedDate = selectedDate.format('YYYY-MM-DD');
    getAvailability(formattedDate);
  }, [selectedDate]);

  const handleCancel = () => {
    AxiosInstance.patch(`appointment/user_appointments/${id}/`, {
      appointment_status : "cancelled"
    })
    .then((response) => {
      if (onUpdate) onUpdate(response.data);
    })
    .catch((error) => {
      console.error('Failed to cancel appointment:', error);
    });
  };

  const { handleSubmit, control, reset } = useForm();


  const submission = (data) => {
    const formData = new FormData();
    formData.append('date', selectedDate.format('YYYY-MM-DD'));
    formData.append('time', selectedTime);
    formData.append('description', data.updatedAppointmentDescription);

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    AxiosInstance.patch(`appointment/user_appointments/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then((response) => {
      handleClose();
      if (onUpdate) onUpdate(response.data); 

      reset();
      setSelectedTime('');
      setSelectedDate(dayjs(date))

      setSelectedImage(null);
      setResetUploadBox(prev => !prev);
    })
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  return (
    <div className={`appointment-box ${status}`}>
        <Dialog 
          open={open} onClose={handleClose}
          PaperProps={{
            style: {
              width: 'auto',
              maxWidth: '90vw',
              maxHeight: '90vh',
              padding: '0px',
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
          }}
        >
          <form onSubmit={handleSubmit(submission)} className='update-appointment-form'>
            <div className="outerUpdateAppointment">
              <Tooltip title='Close' arrow>
                <button className="close-modal" onClick={handleClose}>
                  <CloseRoundedIcon
                    sx={{
                      color: '#f5f5f5',
                      fontSize: 28,
                      padding: '2px',
                      backgroundColor: '#0c0c0c',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </button>
              </Tooltip>

              <div className='update-dialog-container'>
                <div className='update-dialog-title-container'>
                  <p>Update Appointment</p>
                </div>

                <div className='update-dialog-input-container'>
                  <div className="update-appointment-image">
                    <div className="current-image">
                      <img 
                        src={getFullImageUrl(image)} 
                        alt="Appointment" />
                    </div>

                    <UploadBox 
                      onImageSelect={(file) => setSelectedImage(file)}
                      resetTrigger={resetUploadBox}
                    />
                  </div>


                  <div className="update-dialog-time-date-container">
                    {/* New Date */}
                    <DatePickerComponent
                      name='date'
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                    />

                    <FixTime 
                      onSelect={handleTimeSelect}
                      disabledSlots={disabledSlots}
                      value={selectedTime}
                      control={control}
                      name={'time'}
                    />
                  </div>

                  <NormalTextField 
                    label='Description'
                    name={'updatedAppointmentDescription'}
                    control={control}
                    classes='appointment-description'
                    placeHolder='Appointment description'
                  />
                </div>

                <div className="update-dialog-button-container">
                  <ButtonElement
                    label='Save'
                    variant='filled-black'
                    type={'submit'}
                  />
                </div>  
              </div>
            </div>
          </form>
        </Dialog> 

        <div className="information-container">
            <div className="appointment-date">
              <p>{date}</p>
            </div>
            <div className="appointment-time">
              <p>{time}</p>
            </div>
        </div>

        {status === 'pending' && (
          <div className="appointment-button-container">
            <div className="edit-icon" onClick={handleClickOpen}>
              <EditTwoToneIcon />
            </div>
            <div className="cancel-icon" onClick={handleCancel}>
              <CancelTwoToneIcon />
            </div>
          </div>
        )}

        {
          status === 'cancelled' && <p className='status-text'>Cancelled</p> 
          ||
          status === 'denied' && <p className='status-text'>Denied</p>
          ||
          status === 'approved' && <p className='status-text'>Approved</p>
          ||
          status === 'pending' && <p className='status-text'>Pending</p>
        }
    </div>
  )
}

export default Appointment