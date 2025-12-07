import React, { useEffect, useState } from 'react';
import './AddItemModal.css';
import { Tooltip } from '@mui/material';
import { useForm } from 'react-hook-form';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DropdownComponentTime from '../../../forms/time-dropdown/DropDownForTime';
import NormalTextField from '../../../forms/text-fields/NormalTextField';
import GalleryImageDropdown from '../../../forms/upload-file/GalleryImageDropdown';
import ButtonElement from '../../../forms/button/ButtonElement';
import AxiosInstance from '../../../API/AxiosInstance';
import Confirmation from '../../../forms/confirmation-modal/Confirmation';

function AddItemModal({ onClose }) {
  const { control, handleSubmit, reset } = useForm({});
  const [images, setImages] = useState([null, null, null, null, null]);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);

  const attireTypeOptions = [
    { value: 'ball gown', label: 'Ball Gown' },
    { value: 'mermaid', label: 'Mermaid' },
    { value: 'a line', label: 'A-Line' },
    { value: 'trumpet', label: 'Trumpet' },
    { value: 'empire waist', label: 'Empire Waist' },
    { value: 'tea length', label: 'Tea Length' },
    { value: 'high low', label: 'High-Low' },
    { value: 'sheath', label: 'Sheath' },
  ];

  const handleImageChange = (file, index) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  // ✅ Returns config object if confirmation needed
  const getConfirmationConfig = (data) => {
    const imageCount = images.filter(img => img !== null).length;
    const imageInfo = imageCount > 0 
      ? ` with ${imageCount} image${imageCount > 1 ? 's' : ''}`
      : '';

    return {
      severity: 'info',
      message: `Add new attire "${data.attire_name || 'Unnamed'}" (${data.attire_type || 'No type'})${imageInfo} to the gallery?`
    };
  };

  // ✅ Main save handler
  const handleAdd = (data) => {
    if (saving) return;

    if (!data.attire_name || !data.attire_type) {
      return;
    }

    const config = getConfirmationConfig(data);
    setShowConfirm({ ...config, formData: data });
  };

  // ✅ Actual save logic
  const doSave = async (data) => {
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('attire_name', data.attire_name);
      formData.append('attire_type', data.attire_type);
      formData.append('attire_description', data.description || '');

      images.forEach((img, idx) => {
        if (img) formData.append(`image${idx + 1}`, img);
      });

      await AxiosInstance.post('/gallery/admin/attire/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      reset();
      setImages([null, null, null, null, null]);
      setResetTrigger((prev) => !prev);
      onClose();
    } catch (error) {
      console.error('Failed to add attire:', error);
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
    <div className="outerAddItemModal" style={{ position: 'relative' }}>
      
      {saving && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <Tooltip title='Close' arrow>
        <button className="close-addItem-modal" onClick={onClose} disabled={saving}>
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

      <div className="AddItemModal">
        <div className="add-new-item-header">
          <p>Add New</p>
        </div>

        <div className="name-type-container">
          <div className="name-add-item-container">
            <NormalTextField control={control} name="attire_name" label="Name" />
          </div>

          <div className="type-add-item-container">
            <DropdownComponentTime
              items={attireTypeOptions}
              dropDownLabel="Attire Type"
              name="attire_type"
              control={control}
            />
          </div>
        </div>

        <div className="description-add-item-container">
          <NormalTextField control={control} name="description" label="Description" />
        </div>

        <div className="images-add-item-contianer">
          <Tooltip title='Add Main Image' arrow>
            <div className="add-item-main-image">
              <GalleryImageDropdown 
                resetTrigger={resetTrigger}
                onImageSelect={(file) => handleImageChange(file, 0)} 
              />
            </div>
          </Tooltip>

          <div className="add-item-sub-images">
            {[1, 2, 3, 4].map((idx) => (
              <Tooltip key={idx} title='Add Image' arrow>
                <div className="add-images">
                  <GalleryImageDropdown 
                    resetTrigger={resetTrigger}
                    onImageSelect={(file) => handleImageChange(file, idx)} 
                  />
                </div>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="save-add-item-container">
          <ButtonElement 
            label='Add'
            variant='filled-black'
            type='button'
            onClick={handleSubmit(handleAdd)}
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
  );
}

export default AddItemModal;