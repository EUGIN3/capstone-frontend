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

import { Tooltip } from '@mui/material';

function ProjectModal({ onClose, appointment, onUpdate }) {
  const { control, handleSubmit, reset } = useForm({
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
    
    const dateStr = date.format('YYYY-MM-DD'); // Use dayjs format instead of toISOString
    const dayAvailability = availabilityData.find(item => item.date === dateStr);
    if (!dayAvailability) {
      return false; // No data = all slots available = date is enabled
    }

    // Check if ALL 5 slots are unavailable (all true)
    const allSlotsUnavailable = 
      dayAvailability.slot_one === true &&
      dayAvailability.slot_two === true &&
      dayAvailability.slot_three === true &&
      dayAvailability.slot_four === true &&
      dayAvailability.slot_five === true;

    // Disable date if ALL slots are unavailable
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
      // No restrictions for this date - all slots available
      setAvailableSlots(allTimeSlots);
      return;
    }

    // Filter available slots (where slot_x === false)
    const available = allTimeSlots.filter(timeSlot => {
      const slotKey = slotMap[timeSlot];
      const isAvailable = dayAvailability[slotKey] === false;
      
      
      return isAvailable;
    });

    setAvailableSlots(available);
    
    // Clear selected times that are no longer available
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

    if (!targetDate) {
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
      
      // ✅ Use dayjs format to avoid timezone issues
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
          const dateStr = fittingDate.format('YYYY-MM-DD'); // ✅ Use dayjs format

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
      
      if (onUpdate) {
        onUpdate();
      }
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setSaving(false);
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

          {/* ✅ Fitting Date with disabled dates */}
          <div className="total-container project-container">
            <NormalDatePickerComponent
              value={fittingDate}
              onChange={setFittingDate}
              label="Fitting Date"
              shouldDisableDate={shouldDisableDate}
            />
          </div>

          {/* ✅ Fitting Time Slots - only show available slots */}
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
  );
}

export default ProjectModal;