import React, { useEffect, useState } from 'react';
import './ViewEditModal.css';
import { Tooltip } from '@mui/material';
import { useForm } from 'react-hook-form';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MultilineTextFields from '../../../forms/multilines-textfield/MultilineTextFields';
import NormalTextField from '../../../forms/text-fields/NormalTextField';
import DropdownComponentTime from '../../../forms/time-dropdown/DropDownForTime';
import GalleryImageDropdown from '../../../forms/upload-file/GalleryImageDropdown';
import ButtonElement from '../../../forms/button/ButtonElement';
import AxiosInstance from '../../../API/AxiosInstance';
import Confirmation from '../../../forms/confirmation-modal/Confirmation';
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function ViewEditModal({ onClose, attire }) {
  const { control, handleSubmit, reset, setValue, watch } = useForm({});
  const [images, setImages] = useState([null, null, null, null, null]);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [toShow, setToShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);

  const descriptionValue = watch('description') || '';

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

  useEffect(() => {
    if (attire) {
      setValue('attire_name', attire.attire_name);
      setValue('attire_type', attire.attire_type);
      setValue('description', attire.attire_description || '');
      setToShow(attire.to_show);

      const preloadedImages = [
        attire.image1 || null,
        attire.image2 || null,
        attire.image3 || null,
        attire.image4 || null,
        attire.image5 || null,
      ];
      setImages(preloadedImages);
    }
  }, [attire, setValue]);

  // Handle image selection
  const handleImageChange = (file, index) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  // Handle image removal
  const handleImageRemove = (index) => {
    const updated = [...images];
    updated[index] = "REMOVE"; // Mark this image as removed
    setImages(updated);
  };

  // ✅ Returns config object if confirmation needed
  const getConfirmationConfig = (data) => {
    const imageCount = images.filter(img => img !== null && img !== "REMOVE").length;
    const removedCount = images.filter(img => img === "REMOVE").length;
    
    let imageInfo = '';
    if (imageCount > 0 || removedCount > 0) {
      const parts = [];
      if (imageCount > 0) parts.push(`${imageCount} image${imageCount > 1 ? 's' : ''}`);
      if (removedCount > 0) parts.push(`${removedCount} removed`);
      imageInfo = ` with ${parts.join(', ')}`;
    }

    return {
      severity: 'info',
      message: `Update attire "${data.attire_name || 'Unnamed'}" (${data.attire_type || 'No type'})${imageInfo}?`
    };
  };

  // ✅ Main update handler with comprehensive validation
  const handleUpdate = (data) => {
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
    if (!images[0] || images[0] === "REMOVE") {
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
  const doUpdate = async (data) => {
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('attire_name', data.attire_name);
      formData.append('attire_type', data.attire_type);
      formData.append('attire_description', data.description);
      formData.append('to_show', toShow);

      images.forEach((img, idx) => {
        const field = `image${idx + 1}`;

        if (img instanceof File) {
          // When user uploads a new image
          formData.append(field, img);
        } else if (img === "REMOVE") {
          // When user removes an image → send null
          formData.append(field, "");
        }
        // If img is a string, it's the old image → do nothing
      });

      await AxiosInstance.patch(`/gallery/admin/attire/${attire.id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Reset form
      setResetTrigger((prev) => !prev);

      // Show success toast
      toast.success(
        <div style={{ padding: '8px' }}>
          Attire "{data.attire_name}" updated successfully!
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
      console.error('Failed to update attire:', error);
      setSaving(false);

      let errorMessage = 'Failed to update attire. Please try again.';

      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 
                      error.response?.data?.error ||
                      'Invalid attire data. Please check and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to update this attire.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Attire not found. It may have been deleted.';
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
      doUpdate(showConfirm.formData);
    }
  };

  return (
    <>
      <div className="outerEditItemModal" style={{ position: 'relative' }}>
        
        {saving && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        <Tooltip title='Close' arrow>
          <button className="close-editItem-modal" onClick={onClose} disabled={saving}>
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

        <div className="EditItemModal">
          <div className="edit-item-header">
            <p>Edit Attire</p>
          </div>

          {/* DISPLAY TOGGLE */}
          <div className="to-display-toggle-container">
            <p>Display on Gallery:</p>
            <div
              className={`to-display-text ${toShow ? 'display' : 'not-display'}`}
              onClick={() => !saving && setToShow(!toShow)}
              style={{ 
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.5 : 1 
              }}
            >
              {toShow ? 'Display' : 'Not Display'}
            </div>
          </div>

          <div className="name-type-container">
            <div className="name-edit-item-container">
              <NormalTextField control={control} name="attire_name" label="Name" />
            </div>

            <div className="type-edit-item-container">
              <DropdownComponentTime
                items={attireTypeOptions}
                dropDownLabel="Attire Type"
                name="attire_type"
                control={control}
              />
            </div>
          </div>

          <div className="images-edit-item-container">
            {/* MAIN IMAGE */}
            <Tooltip title='Main Image' arrow>
              <div className="edit-item-main-image">
                <GalleryImageDropdown
                  resetTrigger={resetTrigger}
                  existingImage={images[0] !== "REMOVE" ? images[0] : null}
                  onImageSelect={(file) => handleImageChange(file, 0)}
                  onRemoveImage={() => handleImageRemove(0)}
                />
              </div>
            </Tooltip>

            {/* SUB IMAGES */}
            <div className="edit-item-sub-images">
              {[1, 2, 3, 4].map((idx) => (
                <Tooltip key={idx} title='Image' arrow>
                  <div className="edit-images">
                    <GalleryImageDropdown
                      resetTrigger={resetTrigger}
                      existingImage={images[idx] !== "REMOVE" ? images[idx] : null}
                      onImageSelect={(file) => handleImageChange(file, idx)}
                      onRemoveImage={() => handleImageRemove(idx)}
                    />
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="description-edit-item-container">
            <MultilineTextFields
              value={descriptionValue}
              onChange={(e) => setValue('description', e.target.value)}
              placeholder="Description"
              className="custom-description-input"
            />
          </div>

          <div className="save-edit-item-container">
            <ButtonElement
              label='Update'
              variant='filled-black'
              type='button'
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

export default ViewEditModal;