import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs';

import '../../styles/Appointment.css'

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import Dialog from '@mui/material/Dialog';

import ButtonElement from '../../forms/ButtonElement';
import NormalTextField from '../../forms/NormalTextField';

import AxiosInstance from '../../AxiosInstance';

import DatePickerComponent from '../../forms/DatePicker';
import TimePickerComponent from '../../forms/TimePicker';
import FixTime from '../../forms/FixTime';

function Appointment(props) {
  const { date, time, status, id, onDelete, onUpdate } = props  
  const [open, setOpen] = useState(false);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    AxiosInstance.delete(`user_appointments/${id}/`, {})
    .then((response) => {
      if (onDelete) onDelete(id);
    })
  }

  const { handleSubmit, control } = useForm()

  const [selectedImage, setSelectedImage] = useState(null);

  const submission = (data) => {
    const formData = new FormData();
    formData.append('date', selectedDate.format('YYYY-MM-DD'));
    formData.append('time', selectedTime);
    formData.append('facebook_link', data.updatedFacebookLink);
    formData.append('description', data.updatedAppointmentDescription);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    AxiosInstance.patch(`user_appointments/${id}/`, formData)
      .then((response) => {
        handleClose();
        if (onUpdate) onUpdate(response.data); 
    })
  };

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState('');

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

                  <FixTime onSelect={handleTimeSelect} />
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
                  onClick={handleClose}
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
            <div className="delete-icon" onClick={handleDelete}>
              <DeleteTwoToneIcon />
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