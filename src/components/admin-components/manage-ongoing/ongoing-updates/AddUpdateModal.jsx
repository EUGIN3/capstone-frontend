import React, { useState, useEffect } from 'react';
import './AddUpdateModal.css';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SmallImageUpload from '../../../forms/upload-file/SmallImageUpload';
import NormalTextField from '../../../forms/text-fields/NormalTextField';
import DropdownComponentTime from '../../../forms/time-dropdown/DropDownForTime';
import ButtonElement from '../../../forms/button/ButtonElement';
import { useForm } from 'react-hook-form';
import AxiosInstance from '../../../API/AxiosInstance';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useNotificationCreator from '../../../notification/UseNotificationCreator';
import { Tooltip } from '@mui/material';
import Confirmation from '../../../forms/confirmation-modal/Confirmation';

// ✅ Canonical order — DO NOT reorder
const STATUS_ORDER = [
  'concept',
  'sketching',
  'designing',
  'material_selection',
  'pattern_making',
  'cutting',
  'sewing',
  'materializing',
  'fitting',
  'alterations',
  'final_fitting',
  'ready',
  'picked_up',
  'done',
];

// ✅ Static label mapping
const PROCESS_STATUS_ITEMS = [
  { value: 'concept', label: 'Concept' },
  { value: 'sketching', label: 'Sketching' },
  { value: 'designing', label: 'Designing' },
  { value: 'material_selection', label: 'Material Selection' },
  { value: 'pattern_making', label: 'Pattern Making' },
  { value: 'cutting', label: 'Cutting' },
  { value: 'sewing', label: 'Sewing' },
  { value: 'materializing', label: 'Materializing' },
  { value: 'fitting', label: 'Fitting' },
  { value: 'alterations', label: 'Alterations' },
  { value: 'final_fitting', label: 'Final Fitting' },
  { value: 'ready', label: 'Ready' },
  { value: 'picked_up', label: 'Picked up' },
  { value: 'done', label: 'Done' },
];

function AddUpdateModal({ onClose, projectId, onSuccess }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      process_status: 'designing',
      message: '',
      payment: '',
    },
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [resetUploadBox, setResetUploadBox] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const { sendDefaultNotification } = useNotificationCreator();

  // Loading wrapper function
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const withLoading = async (cb) => {
    try {
      setSaving(true);
      await delay(400); // visible delay
      await cb();
    } finally {
      setSaving(false);
    }
  };

  // 🚀 Fetch current project status on mount
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;
      
      try {
        const response = await AxiosInstance.get(`design/designs/${projectId}/`);
        const status = response.data.process_status || 'concept';
        setCurrentStatus(status);
        reset({
          process_status: status,
          message: '',
          payment: '',
        });
      } catch (error) {
        console.error('❌ Failed to fetch project status:', error);
        toast.error(
          <div style={{ padding: '8px' }}>Could not load current status.</div>,
          {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            theme: 'colored',
            transition: Slide,
            closeButton: false,
          }
        );
      }
    };

    fetchProjectData();
  }, [projectId, reset]);

  // ✅ 🔒 Enforce: status can only stay the same or move forward — never backward
  const getFilteredStatusItems = () => {
    if (!currentStatus) return PROCESS_STATUS_ITEMS;

    const currentIndex = STATUS_ORDER.indexOf(currentStatus);

    return PROCESS_STATUS_ITEMS.map((item) => {
      const itemIndex = STATUS_ORDER.indexOf(item.value);
      return {
        ...item,
        disabled: itemIndex < currentIndex, // ← disables *all* earlier statuses
      };
    });
  };

  const handleImageSelect = (file) => {
    setSelectedImage(file);
  };

  // ✅ Get confirmation message based on update type
  const getConfirmationConfig = (data) => {
    const hasStatusChange = data.process_status && data.process_status !== currentStatus;
    const hasPayment = data.payment && parseFloat(data.payment) > 0;
    const hasImage = selectedImage !== null;
    const hasMessage = data.message && data.message.trim() !== '';

    // Build confirmation message
    let message = 'Add this update to the project?';
    const details = [];

    if (hasStatusChange) {
      const statusLabel = PROCESS_STATUS_ITEMS.find(item => item.value === data.process_status)?.label;
      details.push(`Status will change to "${statusLabel}"`);
    }

    if (hasPayment) {
      details.push(`Payment of ₱${parseFloat(data.payment).toFixed(2)} will be recorded`);
    }

    if (hasImage) {
      details.push('Image will be attached');
    }

    if (hasMessage) {
      details.push('Message will be posted');
    }

    if (details.length > 0) {
      message += ' ' + details.join(', ') + '. The client will be notified.';
    }

    return {
      severity: hasStatusChange ? 'warning' : 'normal',
      message: message
    };
  };

  // ✅ Main handler - shows confirmation
  const handleUpdate = (data) => {
    if (saving) return;

    // ✅ Validate: Note is required
    if (!data.message || data.message.trim() === '') {
      toast.error(
        <div style={{ padding: '8px' }}>
          Please enter a note for this update.
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
    setShowConfirm({ ...config, formData: data });
  };

  // ✅ Actual update logic
  const doUpdate = async (data) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('message', data.message || '');
      if (data.process_status) {
        formData.append('process_status', data.process_status);
      }
      if (data.payment) {
        const amount = parseFloat(data.payment);
        if (!isNaN(amount) && amount > 0) {
          formData.append('amount_paid', amount.toString());
        }
      }
      if (selectedImage) {
        formData.append('image_file', selectedImage);
      }

      await AxiosInstance.post(
        `design/designs/${projectId}/add_update/`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );



      // Refresh project to get updated status for future updates
      const response = await AxiosInstance.get(`design/designs/${projectId}/`);
      await sendDefaultNotification('update_posted', response.data.user);

      // Reset state
      reset({
        process_status: response.data.process_status || 'designing',
        message: '',
        payment: '',
      });
      
      toast.success(
        <div style={{ padding: '8px' }}>Update added successfully!</div>,
        {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          theme: 'colored',
          transition: Slide,
          closeButton: false,
        }
      );

      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error('❌ Failed to add update:', error.response?.data || error);
      setSaving(false);

      let errorMessage = 'Failed to add update. Please try again.';

      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 
                      error.response?.data?.message?.[0] ||
                      error.response?.data?.process_status?.[0] ||
                      'Invalid update data. Please check and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to add updates to this project.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Project not found. Please refresh and try again.';
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
          position: 'top-center',
          autoClose: 4000,
          hideProgressBar: false,
          theme: 'colored',
          transition: Slide,
          closeButton: false,
        }
      );
    }
  };

  // ✅ Handles confirmation response - FIXED HERE ⭐
  const handleConfirm = (confirmed) => {
    if (confirmed && showConfirm?.formData) {
      setShowConfirm(null); // Close confirmation immediately
      doUpdate(showConfirm.formData); // Then proceed with update
    } else {
      setShowConfirm(null);
    }
  };

  return (
    <>
      <div className="outerAddUpdateModal" style={{ position: 'relative' }}>
        {saving && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        <Tooltip title="Close" arrow>
          <button className="close-update-modal" onClick={onClose} disabled={saving}>
            <CloseRoundedIcon
              sx={{
                color: '#f5f5f5',
                fontSize: 28,
                padding: '2px',
                backgroundColor: '#0c0c0c',
                borderRadius: '50%',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.5 : 1,
                transition: 'all 0.3s ease',
              }}
            />
          </button>
        </Tooltip>

        <div className="AddUpdateModal">
          <div className="add-new-update-header">
            <p>Add New Update</p>
          </div>

          <div className="image-container">
            <p>* Image for update:</p>
            <SmallImageUpload
              onImageSelect={handleImageSelect}
              resetTrigger={resetUploadBox}
            />
          </div>

          <div className="message-container">
            <NormalTextField control={control} name="message" label="Note" />
          </div>

          <div className="payment-status-container">
            <div className="status-container">
              <DropdownComponentTime
                items={getFilteredStatusItems()}
                dropDownLabel="Status"
                name="process_status"
                control={control}
              />
            </div>

            <div className="payment-container">
              <NormalTextField
                control={control}
                name="payment"
                label="Payment Amount"
                type="number"
                inputProps={{ min: 0, step: '0.01', placeholder: 'e.g., 150.50' }}
              />
            </div>
          </div>

          <div className="save-container">
            <ButtonElement
              label={saving ? 'Updating...' : 'Add Update'}
              variant="filled-black"
              onClick={handleSubmit(handleUpdate)}
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


        
        <ToastContainer />
      </div>
    </>
  );
}

export default AddUpdateModal;