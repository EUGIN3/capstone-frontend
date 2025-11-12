import './ProjectModal.css';
import React, { useState, useEffect } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import NormalTextField from '../../../forms/text-fields/NormalTextField';
import ButtonElement from '../../../forms/button/ButtonElement';
import DropdownComponentTime from '../../../forms/time-dropdown/DropDownForTime';
import NormalDatePickerComponent from '../../../forms/date-picker/NormalDatePicker';
import { useForm } from 'react-hook-form';
import AxiosInstance from '../../../API/AxiosInstance';
import CircularProgress from '@mui/material/CircularProgress';

import useNotificationCreator from '../../../notification/UseNotificationCreator';

import MultiSelectTimeSlots from '../../../forms/multiple-time/MultipleTime'

import { Tooltip } from '@mui/material';

function ProjectModal({ onClose, appointment }) {
  // ✅ Set default form values here
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

  // Dropdown options
  const processStatusItems = [
    { value: 'designing', label: 'Designing' },
    { value: 'materializing', label: 'Materializing' },
    { value: 'ready', label: 'Ready' },
    { value: 'done', label: 'Done' },
  ];

  const slotMap = {
    '7:00 - 8:30 AM': 'slot_one',
    '8:30 - 10:00 AM': 'slot_two',
    '10:00 - 11:30 AM': 'slot_three',
    '1:00 - 2:30 PM': 'slot_four',
    '2:30 - 4:00 PM': 'slot_five',
  };

  const findSlotKey = (timeStr) => {
    if (!timeStr) return null;
    const normalized = timeStr.toString().trim().replace(/\s+/g, ' ');
    for (const [label, key] of Object.entries(slotMap)) {
      if (label.replace(/\s+/g, ' ') === normalized) return key;
    }
    return null;
  };

  // Handle image change
  const handleImageChange = (e) => {
    setReferenceImage(e.target.files[0]);
  };

  const handleUpdateStatus = async (appointment_id) => {
    await AxiosInstance.patch(`appointment/appointments/${appointment_id}/`, {
      appointment_status: 'archived',
    });
  };

  

  const handleSave = async (data) => {
    if (!targetDate) {
      alert('Please select a target date.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('attire_type', data.attire_type || '');
      formData.append('targeted_date', targetDate.toISOString().split('T')[0]);
      formData.append('fitting_date', fittingDate.toISOString().split('T')[0]);
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

      await handleUpdateStatus(appointment.id);

      alert('✅ Project created successfully!');

      reset(); // resets with defaults again
      sendDefaultNotification('project_created', appointment.user)
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('❌ Failed to create project. Please try again.');
    }

    // Mark selected fitting time slots as unavailable
    if (fittingDate && selectedTimes.length > 0) {
      try {
        const dateStr = fittingDate.toISOString().split('T')[0];

        // Fetch existing unavailability for that date
        const availabilityRes = await AxiosInstance.get(
          `availability/display_unavailability/?date=${dateStr}`
        );
        const existing = availabilityRes.data && availabilityRes.data[0] ? availabilityRes.data[0] : {};

        const updatedUnavailability = { ...existing, date: dateStr };

        // Mark each selected time slot as unavailable
        selectedTimes.forEach(time => {
          const key = findSlotKey(time);
          if (key) updatedUnavailability[key] = true;
        });

        await AxiosInstance.post('availability/set_unavailability/', updatedUnavailability);
      } catch (err) {
        console.error('Error marking fitting slots unavailable:', err);
      }
    }
  };

  return (
    <div className="projectOuterModal">
      <div className="createProjectModal">
        {/* Close Button */}
        <Tooltip title='Close' arrow>
          <button className="close-modal" onClick={onClose}>
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

        <div className="project-modal-body">
          <div className="project-title">Create Project</div>
          <div className="project-user">
            <span>Name: </span>{appointment.first_name} {appointment.last_name}
          </div>

          {/* Attire Type */}
          <div className="attire-type-container project-container">
            <NormalTextField
              label="Attire Type"
              name="attire_type"
              control={control}
              placeHolder="Enter attire type"
            />
          </div>

          {/* Targeted Date + Process Status */}
          <div className="date-status-container">
            <div className="targeted-date-container project-container">
              <NormalDatePickerComponent
                value={targetDate}
                onChange={(newDate) => setTargetDate(newDate)}
                label={'Target Date'}
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
              onChange={(nDate) => setFittingDate(nDate)}
              label={'Fitting Date'}
            />
          </div>

          <div className="total-container project-container">
            <MultiSelectTimeSlots
              value={selectedTimes}
              onChange={(newTimes) => setSelectedTimes(newTimes)}
            />
          </div>

          {/* Payment Section */}
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
              placeHolder="Enter amount"
            />
          </div>

          {/* Optional Description */}
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

          {/* Save Button */}
          <div className="save-container">
            <ButtonElement
              label="Save"
              variant="filled-black"
              type="button"
              onClick={handleSubmit(handleSave)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
