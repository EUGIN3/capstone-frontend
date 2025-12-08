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
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function AddItemModal({ onClose }) {
  const { control, handleSubmit, reset } = useForm({});
  const [images, setImages] = useState([null, null, null, null, null]);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);

  const attireTypeOptions = [
    // Women's Formal Attire - Gowns & Dresses
    { value: 'ball gown', label: 'Ball Gown' },
    { value: 'mermaid', label: 'Mermaid' },
    { value: 'a line', label: 'A-Line' },
    { value: 'trumpet', label: 'Trumpet' },
    { value: 'sheath', label: 'Sheath' },
    { value: 'empire waist', label: 'Empire Waist' },
    { value: 'tea length', label: 'Tea Length' },
    { value: 'high low', label: 'High-Low' },
    { value: 'column', label: 'Column' },
    { value: 'fit and flare', label: 'Fit and Flare' },
    { value: 'princess', label: 'Princess' },
    { value: 'slip dress', label: 'Slip Dress' },
    { value: 'off shoulder', label: 'Off-Shoulder' },
    { value: 'halter', label: 'Halter' },
    { value: 'strapless', label: 'Strapless' },
    { value: 'one shoulder', label: 'One-Shoulder' },
    { value: 'cap sleeve', label: 'Cap Sleeve' },
    { value: 'long sleeve', label: 'Long Sleeve' },
    { value: 'illusion', label: 'Illusion' },
    { value: 'two piece', label: 'Two-Piece' },
    { value: 'jumpsuit', label: 'Jumpsuit' },
    { value: 'pantsuit', label: 'Pantsuit' },
    
    // Men's Formal Attire
    { value: 'tuxedo', label: 'Tuxedo' },
    { value: 'three piece suit', label: 'Three-Piece Suit' },
    { value: 'two piece suit', label: 'Two-Piece Suit' },
    { value: 'dinner jacket', label: 'Dinner Jacket' },
    { value: 'morning coat', label: 'Morning Coat' },
    { value: 'tailcoat', label: 'Tailcoat' },
    { value: 'white tie', label: 'White Tie' },
    { value: 'black tie', label: 'Black Tie' },
    { value: 'blazer', label: 'Blazer' },
    { value: 'waistcoat', label: 'Waistcoat/Vest' },
    { value: 'nehru jacket', label: 'Nehru Jacket' },
    { value: 'barong tagalog', label: 'Barong Tagalog' },
    { value: 'sherwani', label: 'Sherwani' },
    
    // Unisex/Gender-Neutral Formal Attire
    { value: 'formal suit', label: 'Formal Suit' },
    { value: 'cocktail attire', label: 'Cocktail Attire' },
    { value: 'evening wear', label: 'Evening Wear' },
    { value: 'formal jumpsuit', label: 'Formal Jumpsuit' },
    { value: 'cape gown', label: 'Cape Gown' },
    { value: 'kimono formal', label: 'Formal Kimono' },
    { value: 'kaftan', label: 'Kaftan' },
    { value: 'other', label: 'Other' },
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

  // ✅ Main save handler with comprehensive validation
  const handleAdd = (data) => {
    if (saving) return;

    // Validation: Attire Name is required
    if (!data.attire_name || data.attire_name.trim() === '') {
      toast.error(
        <div style={{ padding: '8px' }}>
          Please enter attire name.
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

    // Validation: Attire Type is required
    if (!data.attire_type) {
      toast.error(
        <div style={{ padding: '8px' }}>
          Please select attire type.
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

    // Validation: Description is required
    if (!data.description || data.description.trim() === '') {
      toast.error(
        <div style={{ padding: '8px' }}>
          Please enter attire description.
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

    // Validation: Main image (first image) is required
    if (!images[0]) {
      toast.error(
        <div style={{ padding: '8px' }}>
          Please add a main image for the attire.
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

      // Reset form
      reset();
      setImages([null, null, null, null, null]);
      setResetTrigger((prev) => !prev);

      // Show success toast
      toast.success(
        <div style={{ padding: '8px' }}>
          Attire "{data.attire_name}" added successfully!
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
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Failed to add attire:', error);
      setSaving(false);

      let errorMessage = 'Failed to add attire. Please try again.';

      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 
                      error.response?.data?.error ||
                      'Invalid attire data. Please check and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to add items to the gallery.';
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

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
        style={{ zIndex: 99999 }}
      />
    </>
  );
}

export default AddItemModal;