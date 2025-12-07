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
import Confirmation from '../../forms/confirmation-modal/Confirmation'

import AxiosInstance from '../../API/AxiosInstance'

// Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

import useNotificationCreator from "../../notification/UseNotificationCreator";

import Dialog from '@mui/material/Dialog';
import GalleryModal from './Modals/GalleryModals';


function SetAppointment() {
  const [step3Mode, setStep3Mode] = useState('upload'); 
  const [openGallery, setOpenGallery] = useState(false);
  const [selectedAttire, setSelectedAttire] = useState([])
  const [saving, setSaving] = useState(false);
  const [loadingStep3, setLoadingStep3] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { sendDefaultNotification } = useNotificationCreator();
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

  const handleStep3ButtonClick = async (mode) => {
    setLoadingStep3(true);
    
    // Simulate loading for UI smoothness
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (mode === 'upload') {
      setStep3Mode('upload');
      setSelectedAttire([]);
    } else if (mode === 'gallery') {
      setStep3Mode('gallery');
      setOpenGallery(true);
      setSelectedImage(null);
    } else if (mode === 'generate') {
      setStep3Mode('generate');
      setSelectedAttire([]);
      setSelectedImage(null);
    }
    
    setLoadingStep3(false);
  };

  const getConfirmationConfig = () => {
    const hasReference = selectedImage || selectedAttire?.id || step3Mode === 'generate';
    
    if (!hasReference) {
      return {
        needed: true,
        severity: 'warning',
        message: `You haven't added any reference (image, gallery attire, or design). Do you want to proceed without a reference?`
      };
    }
    
    return {
      needed: true,
      severity: 'info',
      message: `Confirm appointment for ${selectedDate.format('MMM DD, YYYY')} at ${selectedTime}?`
    };
  };

  const submission = (data) => {
    const config = getConfirmationConfig();
    if (config.needed) {
      setShowConfirm(config);
    } else {
      doSubmit();
    }
  };

  const doSubmit = async () => {
    setSaving(true);

    const formData = new FormData();
    formData.append('date', selectedDate.format('YYYY-MM-DD'));
    formData.append('time', selectedTime);
    formData.append('description', description);

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    if (selectedAttire?.id) {
      formData.append('attire_from_gallery', selectedAttire.id);
    }

    try {
      await AxiosInstance.post('appointment/set_appointments/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      reset();
      setSelectedTime('');
      fetchAllUnavailableDates();
      setDescription('');
      setSelectedImage(null);
      setSelectedAttire([]);
      setResetUploadBox(prev => !prev);
      sendDefaultNotification("appointment_created");
    } catch (error) {
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
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = (confirmed) => {
    setShowConfirm(null);
    if (confirmed) {
      doSubmit();
    }
  };

  return (
    <div className='set-appointment appContainer'>
      <form onSubmit={handleSubmit(submission)}>
        
        {/* Loading Overlay - covers entire browser */}
        {(saving || loadingStep3) && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

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

          {/* Image/Reference Options */}
          <div className={`set-appointment-image-con info-con`}>
            <div className="number-note-con">
              <div className="step-number">3</div>
              <p className="note">
                Choose a reference option
              </p>
            </div>

            {/* OPTIONS */}
            <div className="step3-options">
              <button
                type="button"
                className={`step3-btn ${step3Mode === 'upload' ? 'active' : ''}`}
                onClick={() => handleStep3ButtonClick('upload')}
                disabled={loadingStep3}
              >
                Upload an Image
              </button>

              <button
                type="button"
                className={`step3-btn ${step3Mode === 'gallery' ? 'active' : ''}`}
                onClick={() => handleStep3ButtonClick('gallery')}
                disabled={loadingStep3}
              >
                Use Attire from Gallery
              </button>

              <button
                type="button"
                className={`step3-btn ${step3Mode === 'generate' ? 'active' : ''}`}
                onClick={() => handleStep3ButtonClick('generate')}
                disabled={loadingStep3}
              >
                Generate a Design
              </button>
            </div>

            {step3Mode === 'upload' && (
              <div className="SetAppointmentUplaodBox">
                <UploadBox 
                  onImageSelect={(file) => setSelectedImage(file)}
                  resetTrigger={resetUploadBox}
                />
              </div>
            )}
            {step3Mode === 'gallery' && (
              <div className="step3-placeholder">
                {
                  selectedAttire
                  ? <img 
                      src={selectedAttire.image1} 
                      alt="" 
                      className='setAppointmentSelectedAttire'/>

                  : <p>Use Attire from Gallery</p>
                }
              </div>
            )}
            {step3Mode === 'generate' && (
              <p className="step3-placeholder">Design generator coming next…</p>
            )}
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
              label='Set Appointment' 
              variant='filled-black' 
              type='submit'
            />
          </div>

        </div>
        <ToastContainer />
      </form>

      {/* Confirmation Modal */}
      {showConfirm && (
        <Confirmation
          message={showConfirm.message}
          severity={showConfirm.severity}
          onConfirm={handleConfirm}
          isOpen={!!showConfirm}
        />
      )}

      <Dialog
        open={openGallery}
        onClose={() => setOpenGallery(false)}
        fullWidth 
        maxWidth={false}
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
        <GalleryModal
          onClose={() => setOpenGallery(false)}
          onSelect={(attire) => {
            setSelectedAttire(attire)
            setOpenGallery(false);
          }}
        />
      </Dialog>
    </div>
  )
}

export default SetAppointment