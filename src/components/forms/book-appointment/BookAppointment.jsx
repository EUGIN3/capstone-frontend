import './BookAppointment.css'

import { Tooltip } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import dayjs from 'dayjs';

import ButtonElement from '../../forms/button/ButtonElement'
import DatePickerComponent from '../../forms/date-picker/DatePicker';
import FixTime from '../../forms/fixtime/FixTime';
import UploadBox from '../../forms/upload-file/ImageUpload';
import MultilineTextFields from '../../forms/multilines-textfield/MultilineTextFields';

import AxiosInstance from '../../API/AxiosInstance'
import { ToastContainer, toast, Slide } from 'react-toastify';
import useNotificationCreator from "../../notification/UseNotificationCreator";

function BookAppointment({ onClose, attire }) {

  const { sendDefaultNotification } = useNotificationCreator();
  const [availabilityData, setAvailabilityData] = useState({});
  const [disabledSlots, setDisabledSlots] = useState({});
  const [fullyUnavailableDates, setFullyUnavailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, 'day'));
  const [selectedTime, setSelectedTime] = useState('');
  
  // 🔥 NO IMAGE UPLOAD — NOW USING referenceImage
  const [selectedImage] = useState(attire.image1);
  const [description, setDescription] = useState('');

  const schema = yup.object({
    time: yup.string().required('Please select a time.'),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const handleTimeSelect = (time) => setSelectedTime(time);

  // Fetch availability
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

  // Fetch fully booked dates
  const fetchAllUnavailableDates = async () => {
    try {
      const response = await AxiosInstance.get(`availability/display_unavailability/`);
      const fullyBookedDates = response.data
        .filter(item =>
          item.slot_one && item.slot_two && item.slot_three && item.slot_four && item.slot_five
        )
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
      getAvailability(selectedDate.format('YYYY-MM-DD'));
    }
  }, [selectedDate]);

  // submit
const submission = () => {
  if (!selectedDate || !selectedTime) {
    toast.error("Please complete all required fields.");
    return;
  }

  // Use FormData
  const formData = new FormData();
  formData.append('date', selectedDate.format('YYYY-MM-DD'));
  formData.append('time', selectedTime);
  formData.append('description', description);
  formData.append('attire_from_gallery', attire.id); 

  console.log(formData)

  AxiosInstance.post('appointment/set_appointments/', formData)
    .then(() => {
      toast.success("Appointment successfully created!");
      reset();
      setSelectedTime('');
      setDescription('');
      fetchAllUnavailableDates();
      sendDefaultNotification("appointment_created");
    })
    .catch((error) => {
      toast.error("Something went wrong. Please try again.");
      console.error('Submission error:', error);
    });
};



  return (
    <div className='outerBookAppointment'>
      <Tooltip title='Close' arrow>
        <button className="close-bookAppointment-modal" onClick={onClose}>
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

      <div className="BookAppointment">
        {/* STEP 1: DATE */}
        <div className={`book-date info-block ${selectedDate ? 'book-complete' : ''}`}>
          <div className="book-step-header">
            <div className="book-step-number">1</div>
            <p>Select your appointment date</p>
          </div>

          <DatePickerComponent
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            disableDates={[...fullyUnavailableDates, dayjs().format('YYYY-MM-DD')]}
          />
        </div>

        {/* STEP 2: TIME */}
        <div className={`book-time info-block ${selectedTime ? 'book-complete' : ''}`}>
          <div className="book-step-header">
            <div className="book-step-number">2</div>
            <p>Select your appointment time</p>
          </div>

          <FixTime
            onSelect={handleTimeSelect}
            disabledSlots={disabledSlots}
            value={selectedTime}
            control={control}
            name={'time'}
          />
        </div>

        {/* STEP 3: IMAGE (AUTO FROM attire.image1) */}
        <div className={`book-image info-block book-complete`}>
          <div className="book-step-header">
            <div className="book-step-number">3</div>
            <p>Reference image (auto-selected)</p>
          </div>

          <div className="book-auto-image-preview">
            <img src={attire.image1} alt="Reference" />
          </div>
        </div>

        {/* STEP 4: DESCRIPTION */}
        <div className={`book-description info-block ${description ? 'book-complete' : ''}`}>
          <div className="book-step-header">
            <div className="book-step-number">4</div>
            <p>Description</p>
          </div>

          <MultilineTextFields
            placeholder='Describe your appointment...'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="book-submit-container">
          <ButtonElement
            label='Book Appointment'
            variant='filled-black'
            type='button'
            onClick={handleSubmit(submission)}
          />
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default BookAppointment;
