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

  const [availabilityData, setAvailabilityData] = useState({});
  const [disabledSlots, setDisabledSlots] = useState({});
  const [fullyUnavailableDates, setFullyUnavailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, 'day'));
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [resetUploadBox, setResetUploadBox] = useState(false)

  const navigate = useNavigate()
  const navigation = (path) => {
    navigate(path)
  }

  const schema = yup.object({
    time: yup.string().required('Please select a time.'),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
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
      })
      .catch(err => console.error('Failed to fetch availability:', err));
  };

  const fetchAllUnavailableDates = async () => {
    try {
      const response = await AxiosInstance.get(`availability/display_unavailability/`);
      const fullyBookedDates = response.data
        .filter(item => item.slot_one && item.slot_two && item.slot_three && item.slot_four && item.slot_five)
        .map(item => item.date);

      setFullyUnavailableDates(fullyBookedDates);

      let checkDate = dayjs().add(1, 'day');
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

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      getAvailability(formattedDate);
    }
  }, [selectedDate]);

  const submission = (data) => {
    if (!selectedDate || !selectedTime) {
      toast.error(
        <div style={{ padding: '8px' }}>
            Please complete all required fields before submitting.
        </div>,
        {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Slide,
            closeButton: false,
        }
      );
      return;
    } 

    if (dayjs(selectedDate).isBefore(dayjs(), 'day')) {
      toast.error(
        <div style={{ padding: '8px' }}>
            You cannot set an appointment in the past.
        </div>,
        {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Slide,
            closeButton: false,
        }
      );
      return;
    } 

    const formData = new FormData();
    formData.append('date', selectedDate.format('YYYY-MM-DD'));
    formData.append('time', selectedTime);
    formData.append('description', description);

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    AxiosInstance.post('appointment/set_appointments/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(() => {
    toast.success(
        <div style={{ padding: '8px' }}>
            Appointment successfully created!
        </div>, 
        {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Slide,
            closeButton: false,
        }
    );
      reset();
      setSelectedTime('');
      fetchAllUnavailableDates();
      setDescription('');
      setSelectedImage(null);
      setResetUploadBox(prev => !prev);
    })
    .catch((error) => {
      toast.error(
        <div style={{ padding: '8px' }}>
            Something went wrong while setting your appointment. Please try again.
        </div>,
        {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Slide,
            closeButton: false,
        }
      );
      console.error('Submission error:', error);
    });
  };


  // Time slots 
  return (
    <div className='set-appointment appContainer'>
      <form onSubmit={handleSubmit(submission)}>
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
          <div className={`set-appointment-date-con info-con ${selectedDate ? 'completed-step' : ''}`}>
            <div className="number-note-con">
              <div className={`step-number ${selectedDate ? 'completed-step' : ''}`}>1</div>
              <p className={`note ${selectedDate ? 'completed-step' : ''}`}>
                Select your desired date of your appointment
              </p>
            </div>
          <DatePickerComponent
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            disableDates={[...fullyUnavailableDates, dayjs().format('YYYY-MM-DD')]}
          />
          </div>

          {/* Time */}
          <div className={`set-appointment-date-con info-con ${selectedTime ? 'completed-step' : ''}`}>
            <div className="number-note-con">
              <div className={`step-number ${selectedTime ? 'completed-step' : ''}`}>2</div>
              <p className={`note ${selectedTime ? 'completed-step' : ''}`}>
                Select your desired time of your appointment
              </p>
            </div>

            <FixTime 
              onSelect={handleTimeSelect}
              disabledSlots={disabledSlots}
              value={selectedTime}
              control={control}
              name={'time'}
            />
          </div>

          {/* Image */}
          <div className={`set-appointment-image-con info-con ${selectedImage ? 'completed-step' : ''}`}>
            <div className="number-note-con">
              <div className={`step-number ${selectedImage ? 'completed-step' : ''}`}>3</div>
              <p className={`note ${selectedImage ? 'completed-step' : ''}`}>
                Upload an image as reference or generate a design
              </p>
            </div>
            <UploadBox 
              onImageSelect={(file) => setSelectedImage(file)} 
              resetTrigger={resetUploadBox}
            />
          </div>

          {/* Description */}
          <div className={`set-appointment-description-con info-con ${description ? 'completed-step' : ''}`}>
            <div className="number-note-con">
              <div className={`step-number ${description ? 'completed-step' : ''}`}>4</div>
              <p className={`note ${description ? 'completed-step' : ''}`}>
                Describe your appointment
              </p>
            </div>
            <MultilineTextFields 
              placeholder='Describe your appointment here...'
              className='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>


          <div className="set-appointment-submit-btn-con">
            <ButtonElement 
              label='Appointment' 
              variant='filled-black' 
              type='submit'
            />
          </div>

        </div>
        <ToastContainer />
      </form>
    </div>
  )
}

export default SetAppointment