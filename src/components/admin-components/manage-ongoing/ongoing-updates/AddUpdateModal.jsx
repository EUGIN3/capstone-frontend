import React, { useState } from 'react';
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

import { Tooltip } from '@mui/material';

function AddUpdateModal({ onClose, projectId, onSuccess }) {
  const { control, handleSubmit, reset } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [resetUploadBox, setResetUploadBox] = useState(false);
  const [loading, setLoading] = useState(false);

  const processStatusItems = [
    { value: 'designing', label: 'Designing' },
    { value: 'materializing', label: 'Materializing' },
    { value: 'ready', label: 'Ready' },
    { value: 'done', label: 'Done' },
  ];

  // ✅ Handle image selection from SmallImageUpload
  const handleImageSelect = (file) => {
    setSelectedImage(file);
  };

  // ✅ Submit handler
  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('message', data.message || '');
      if (data.process_status) formData.append('process_status', data.process_status);
      if (data.payment) formData.append('amount_paid', data.payment);
      if (selectedImage) formData.append('image_file', selectedImage);

      const response = await AxiosInstance.post(
        `design/designs/${projectId}/add_update/`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      toast.success(
        <div style={{ padding: '8px' }}>Update added successfully!</div>,
        {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          theme: 'colored',
          transition: Slide,
          closeButton: false,
        }
      );

      reset();
      setSelectedImage(null);
      setResetUploadBox((prev) => !prev); // ✅ Reset upload box
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('❌ Failed to add update:', error.response?.data || error);
      toast.error(
        <div style={{ padding: '8px' }}>Failed to add update. Please try again.</div>,
        {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          theme: 'colored',
          transition: Slide,
          closeButton: false,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="outerAddUpdateModal">
      <Tooltip title='Close' arrow>
         <button className="close-update-modal" onClick={onClose}>
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
     

      <div className="AddUpdateModal">
        <div className="image-container">
          <p>* image for update:</p>
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
              items={processStatusItems}
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
            />
          </div>
        </div>

        <div className="save-container">
          <ButtonElement
            label={loading ? 'Updating...' : 'Update'}
            variant="filled-black"
            onClick={handleSubmit(handleUpdate)}
            disabled={loading}
          />
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default AddUpdateModal;
