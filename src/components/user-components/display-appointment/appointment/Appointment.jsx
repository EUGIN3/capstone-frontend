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


function Appointment(props) {
  let fileInputRef = null;

  const { date, time, status, id, onUpdate, facebookLink, adress, description, image} = props  
  const [open, setOpen] = useState(false);


  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState('');

  const [ availabilityData, setAvailabilityData ] = useState({})
  const [ disabledSlots, setDisabledSlots ] = useState({});
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      const formattedDate = dayjs(date);
      setSelectedDate(formattedDate);
      setSelectedTime(time);

      reset({
        time: time || '',
        updatedFacebookLink: facebookLink && facebookLink !== 'undefined' ? facebookLink : '',
        updatedAddress: adress && adress !== 'undefined' ? adress : '',
        updatedAppointmentDescription: description && description !== 'undefined' ? description : '',
      });
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);

    reset();
    if (fileInputRef) {
      fileInputRef.value = '';
    }
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

  const schema = yup.object({
    time: yup.string().required('Please select a time.'),
  });

  const { handleSubmit, control, reset } = useForm({ resolver: yupResolver(schema) });


  const submission = (data) => {
    const formData = new FormData();
    formData.append('date', selectedDate.format('YYYY-MM-DD'));
    formData.append('time', selectedTime);
    formData.append('facebook_link', data.updatedFacebookLink);
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
      if (fileInputRef) {
        fileInputRef.value = '';
      }
      setSelectedTime('');
      setSelectedDate(dayjs(date))
    })
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  return (
    <div className={`appointment-box ${status}`}>
        <Dialog open={open} onClose={handleClose}>
          <form onSubmit={handleSubmit(submission)}>
            <div className='update-dialog-container'>
              <div className='update-dialog-title-container'>
                <p>Update Appointment</p>
              </div>

              <div className='update-dialog-input-container'>
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
                {/* New Facebook link */}
                <NormalTextField 
                  label='Facebook Link'
                  name={'updatedFacebookLink'}
                  control={control}
                  classes='facebook-link'
                  placeHolder='Facebook link'
                />
                {/* New Facebook link */}
                <NormalTextField 
                  label='Address'
                  name={'updatedAddress'}
                  control={control}
                  classes='address'
                  placeHolder='Address'
                />
                {/* New Appointment description */}
                <NormalTextField 
                  label='Description'
                  name={'updatedAppointmentDescription'}
                  control={control}
                  classes='appointment-description'
                  placeHolder='Appointment description'
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  ref={(ref) => fileInputRef = ref}
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                />
              </div>

              <div className="update-dialog-button-container">
                <ButtonElement
                  label='Close'
                  variant='filled-red'
                  type={'button'}
                  onClick={handleClose}
                />

                <ButtonElement
                  label='Save'
                  variant='filled-green'
                  type={'submit'}
                />
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