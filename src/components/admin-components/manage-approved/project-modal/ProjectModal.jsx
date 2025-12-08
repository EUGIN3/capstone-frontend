import './ProjectModal.css';
import React, { useState, useEffect } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import NormalTextField from '../../../forms/text-fields/NormalTextField';
import ButtonElement from '../../../forms/button/ButtonElement';
import DropdownComponentTime from '../../../forms/time-dropdown/DropDownForTime';
import NormalDatePickerComponent from '../../../forms/date-picker/NormalDatePicker';
import { useForm } from 'react-hook-form';
import AxiosInstance from '../../../API/AxiosInstance';

import useNotificationCreator from '../../../notification/UseNotificationCreator';
import MultiSelectTimeSlots from '../../../forms/multiple-time/MultipleTime';
import Confirmation from '../../../forms/confirmation-modal/Confirmation';
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

import { Tooltip } from '@mui/material';

function ProjectModal({ onClose, appointment, onUpdate }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      process_status: 'designing',
    },
  });

  const [targetDate, setTargetDate] = useState(null);
  const [fittingDate, setFittingDate] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const { sendDefaultNotification } = useNotificationCreator();
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Dropdown items
  const processStatusItems = [
    { value: 'designing', label: 'Designing' },
    { value: 'materializing', label: 'Materializing' },
    { value: 'ready', label: 'Ready' },
    { value: 'done', label: 'Done' },
  ];

  // Time slot → model field mapping
  const slotMap = {
    '7:00 - 8:30 AM': 'slot_one',
    '8:30 - 10:00 AM': 'slot_two',
    '10:00 - 11:30 AM': 'slot_three',
    '1:00 - 2:30 PM': 'slot_four',
    '2:30 - 4:00 PM': 'slot_five',
  };

  const allTimeSlots = Object.keys(slotMap);

  // ✅ Fetch availability data on mount
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await AxiosInstance.get('availability/display_unavailability/');
        setAvailabilityData(response.data || []);
      } catch (error) {
        console.error('❌ Error fetching availability:', error);
      }
    };
    fetchAvailability();
  }, []);

  // ✅ Check if a date should be disabled (NO available slots)
  const shouldDisableDate = (date) => {
    if (!date) return false;
    
    const dateStr = date.format('YYYY-MM-DD');
    const dayAvailability = availabilityData.find(item => item.date === dateStr);
    if (!dayAvailability) {
      return false;
    }

    const allSlotsUnavailable = 
      dayAvailability.slot_one === true &&
      dayAvailability.slot_two === true &&
      dayAvailability.slot_three === true &&
      dayAvailability.slot_four === true &&
      dayAvailability.slot_five === true;

    return allSlotsUnavailable;
  };

  // ✅ Update available slots when fitting date changes
  useEffect(() => {
    if (!fittingDate) {
      setAvailableSlots([]);
      setSelectedTimes([]);
      return;
    }

    const dateStr = fittingDate.format('YYYY-MM-DD');
    const dayAvailability = availabilityData.find(item => item.date === dateStr);

    if (!dayAvailability) {
      setAvailableSlots(allTimeSlots);
      return;
    }

    const available = allTimeSlots.filter(timeSlot => {
      const slotKey = slotMap[timeSlot];
      const isAvailable = dayAvailability[slotKey] === false;
      
      return isAvailable;
    });

    setAvailableSlots(available);
    
    setSelectedTimes(prev => prev.filter(time => available.includes(time)));
  }, [fittingDate, availabilityData]);

  const findSlotKey = (timeStr) => {
    if (!timeStr) return null;
    const normalized = timeStr.toString().trim().replace(/\s+/g, ' ');
    for (const [label, key] of Object.entries(slotMap)) {
      if (label.replace(/\s+/g, ' ') === normalized) return key;
    }
    return null;
  };

  const handleImageChange = (e) => {
    setReferenceImage(e.target.files[0]);
  };

  // ✅ Returns config object if confirmation needed
  const getConfirmationConfig = (data) => {
    if (!targetDate) {
      return null;
    }

    const fittingTimeInfo = selectedTimes.length > 0 
      ? ` with ${selectedTimes.length} fitting slot${selectedTimes.length > 1 ? 's' : ''}`
      : '';

    return {
      severity: 'warning',
      message: `Create project for ${appointment.first_name} ${appointment.last_name}? This will convert the appointment to a project, free up the original time slot${fittingTimeInfo}, and notify the client.`
    };
  };

  // ✅ Main save handler
  const handleSave = (data) => {
    if (saving) return;

    // Check all required fields
    if (!data.attire_type || data.attire_type.trim() === '') {
      toast.error(
        <div style={{ padding: '8px' }}>
          Please enter attire type.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return;
    }

    if (!targetDate) {
      toast.error(
        <div style={{ padding: '8px' }}>
          Please select a target date.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return;
    }

    if (!data.total_amount || data.total_amount.trim() === '') {
      toast.error(
        <div style={{ padding: '8px' }}>
          Please enter attire total cost.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return;
    }

    if (!data.amount_paid || data.amount_paid.trim() === '') {
      toast.error(
        <div style={{ padding: '8px' }}>
          Please enter amount paid.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return;
    }

    if (!fittingDate) {
      toast.error(
        <div style={{ padding: '8px' }}>
          Please select a fitting date.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return;
    }

    if (!selectedTimes || selectedTimes.length === 0) {
      toast.error(
        <div style={{ padding: '8px' }}>
          Please select at least one fitting time slot.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
      return;
    }

    const config = getConfirmationConfig(data);
    
    if (config) {
      setShowConfirm({ ...config, formData: data });
    }
  };

  // ✅ Actual save logic
  const doSave = async (data) => {
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('attire_type', data.attire_type || '');
      
      formData.append(
        'targeted_date',
        targetDate.format('YYYY-MM-DD')
      );
      formData.append(
        'fitting_date',
        fittingDate ? fittingDate.format('YYYY-MM-DD') : ''
      );
      
      formData.append('fitting_time', JSON.stringify(selectedTimes));
      formData.append('process_status', data.process_status || 'designing');
      formData.append('total_amount', data.total_amount || '');
      formData.append('payment_status', data.payment_status || 'no_payment');
      formData.append('amount_paid', data.amount_paid || '');
      formData.append('description', data.description || '');
      formData.append('user', appointment.user);
      formData.append('appointment', appointment.id);

      if (referenceImage) {
        formData.append('reference_image', referenceImage);
      }

      await AxiosInstance.post('design/designs/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await AxiosInstance.patch(`appointment/appointments/${appointment.id}/`, {
        appointment_status: 'project',
      });

      sendDefaultNotification('project_created', appointment.user);

      // HANDLE FITTING TIME UNAVAILABILITY
      if (fittingDate && selectedTimes.length > 0) {
        try {
          const dateStr = fittingDate.format('YYYY-MM-DD');

          const availabilityRes = await AxiosInstance.get(
            `availability/display_unavailability/?date=${dateStr}`
          );

          const existing = availabilityRes.data?.[0] || { date: dateStr };

          const updatedUnavailability = { ...existing };

          selectedTimes.forEach((time) => {
            const key = slotMap[time];
            if (key) {
              updatedUnavailability[key] = true;
              updatedUnavailability[`reason_${key.split('_')[1]}`] =
                'Scheduled Fitting';
            }
          });

          await AxiosInstance.post(
            'availability/set_unavailability/',
            updatedUnavailability
          );
        } catch (err) {
          console.error('Error marking fitting slots unavailable:', err);
        }
      }

      // FREE UP ORIGINAL APPOINTMENT SLOT
      try {
        const appointmentDate = appointment.date;
        const availabilityRes = await AxiosInstance.get(
          `availability/display_unavailability/?date=${appointmentDate}`
        );

        const existing = availabilityRes.data?.[0];
        if (existing) {
          const matchedSlotKey = slotMap[appointment.time];

          if (matchedSlotKey && existing[matchedSlotKey] === true) {
            const updatedUnavailability = {
              ...existing,
              [matchedSlotKey]: false,
              [`reason_${matchedSlotKey.split('_')[1]}`]: 'Available',
            };

            await AxiosInstance.post(
              'availability/set_unavailability/',
              updatedUnavailability
            );
          }
        }
      } catch (err) {
        console.error('Error freeing appointment slots:', err);
      }

      // ✅ Success notification - show AFTER loading completes
      if (onUpdate) {
        onUpdate();
      }

      // Hide loading spinner first
      setSaving(false);

      // Then show success toast
      toast.success(
        <div style={{ padding: '8px' }}>
          Project created successfully for {appointment.first_name} {appointment.last_name}!
        </div>,
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );

      // Close modal after success toast
      setTimeout(() => {
        reset();
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Failed to create project:', error);
      setSaving(false);

      let errorMessage = 'Failed to create project. Please try again.';

      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 
                      error.response?.data?.error ||
                      'Invalid project data. Please check and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to create this project.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Appointment not found. Please try again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      }

      toast.error(
        <div style={{ padding: '8px' }}>
          {errorMessage}
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
    }
  };

  // ✅ Handles confirmation response
  const handleConfirm = (confirmed) => {
    setShowConfirm(null);

    if (confirmed && showConfirm?.formData) {
      doSave(showConfirm.formData);
    }
  };

  return (
    <>
      <div className="projectOuterModal" style={{ position: 'relative' }}>
        
        {saving && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        <div className="createProjectModal">
          <Tooltip title="Close" arrow>
            <button className="close-modal" onClick={onClose} disabled={saving}>
              <CloseRoundedIcon
                sx={{
                  color: '#f5f5f5',
                  fontSize: 28,
                  padding: '2px',
                  backgroundColor: '#0c0c0c',
                  borderRadius: '50%',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.5 : 1,
                }}
              />
            </button>
          </Tooltip>

          <div className="project-modal-body">
            <div className="project-title">Create Project</div>

            <div className="project-user">
              <span>Name: </span>
              {appointment.first_name} {appointment.last_name}
            </div>

            <div className="attire-type-container project-container">
              <NormalTextField
                label="Attire Type"
                name="attire_type"
                control={control}
                placeHolder="Enter attire type"
              />
            </div>

            <div className="date-status-container">
              <div className="targeted-date-container project-container">
                <NormalDatePickerComponent
                  value={targetDate}
                  onChange={setTargetDate}
                  label="Target Date"
                />
              </div>

              <div className="progress-status-container project-container">
                <DropdownComponentTime
                  items={processStatusItems}
                  dropDownLabel="Process Status"
                  name="process_status"
                  control={control}
                />
              </div>
            </div>

            <div className="total-container project-container">
              <NormalDatePickerComponent
                value={fittingDate}
                onChange={setFittingDate}
                label="Fitting Date"
                shouldDisableDate={shouldDisableDate}
              />
            </div>

            <div className="total-container project-container">
              <MultiSelectTimeSlots
                value={selectedTimes}
                onChange={setSelectedTimes}
                availableSlots={availableSlots}
                disabled={!fittingDate}
              />
            </div>

            <div className="payment-container">
              <NormalTextField
                label="Attire Total Cost"
                name="total_amount"
                control={control}
                placeHolder="Enter Total Cost"
              />

              <NormalTextField
                label="Amount Paid"
                name="amount_paid"
                control={control}
                placeHolder="Enter Amount"
              />
            </div>

            <div className="description-container project-container">
              <NormalTextField
                label="Description"
                name="description"
                control={control}
                placeHolder="Enter project description"
                multiline
                rows={3}
              />
            </div>

            <div className="save-container">
              <ButtonElement
                label="Save"
                variant="filled-black"
                type="button"
                onClick={handleSubmit(handleSave)}
                disabled={saving}
              />
            </div>
          </div>

          {showConfirm && (
            <Confirmation
              message={showConfirm.message}
              severity={showConfirm.severity}
              onConfirm={handleConfirm}
              isOpen={true}
            />
          )}
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default ProjectModal;