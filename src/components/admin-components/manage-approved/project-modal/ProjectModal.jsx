import './ProjectModal.css';
import React, { useState } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import NormalTextField from '../../../forms/text-fields/NormalTextField';
import ButtonElement from '../../../forms/button/ButtonElement';
import DropdownComponentTime from '../../../forms/time-dropdown/DropDownForTime';
import NormalDatePickerComponent from '../../../forms/date-picker/NormalDatePicker';
import { useForm } from 'react-hook-form';
import AxiosInstance from '../../../API/AxiosInstance';
import CircularProgress from '@mui/material/CircularProgress';

import { Tooltip } from '@mui/material';

function ProjectModal({ onClose, appointment }) {
  // ✅ Set default form values here
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      process_status: 'designing',
      payment_status: 'no_payment',
    },
  });

  const [targetDate, setTargetDate] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);

  // Dropdown options
  const processStatusItems = [
    { value: 'designing', label: 'Designing' },
    { value: 'materializing', label: 'Materializing' },
    { value: 'ready', label: 'Ready' },
    { value: 'done', label: 'Done' },
  ];

  const paymentStatusItems = [
    { value: 'no_payment', label: 'No Payment' },
    { value: 'partial_payment', label: 'Partial Payment' },
    { value: 'fully_paid', label: 'Fully Paid' },
  ];

  // Handle image change
  const handleImageChange = (e) => {
    setReferenceImage(e.target.files[0]);
  };

  const handleUpdateStatus = async (appointment_id) => {
    await AxiosInstance.patch(`appointment/appointments/${appointment_id}/`, {
      appointment_status: 'done',
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
      formData.append('process_status', data.process_status || 'designing'); // ✅ default fallback
      formData.append('total_amount', data.total_amount || '');
      formData.append('payment_status', data.payment_status || 'no_payment'); // ✅ default fallback
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
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('❌ Failed to create project. Please try again.');
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
              />
            </div>

            <div className="progress-status-container project-container">
              {/* ✅ Default process_status = designing */}
              <DropdownComponentTime
                items={processStatusItems}
                dropDownLabel="Process Status"
                name="process_status"
                control={control}
              />
            </div>
          </div>

          <div className="total-container project-container">
            <NormalTextField
              label="Attire Total Cost"
              name="total_amount"
              control={control}
              placeHolder="Enter Total Cost"
            />
          </div>

          {/* Payment Section */}
          <div className="payment-container">
            <div className="payment-status-container project-container">
              {/* ✅ Default payment_status = no_payment */}
              <DropdownComponentTime
                items={paymentStatusItems}
                dropDownLabel="Payment Status"
                name="payment_status"
                control={control}
              />
            </div>

            <div className="amount-paid-container project-container">
              <NormalTextField
                label="Amount Paid"
                name="amount_paid"
                control={control}
                placeHolder="Enter amount"
              />
            </div>
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
