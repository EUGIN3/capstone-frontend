import React, { useEffect, useState } from 'react';
import './ViewEditModal.css';
import { Tooltip } from '@mui/material';
import { useForm } from 'react-hook-form';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MultilineTextFields from '../../../forms/multilines-textfield/MultilineTextFields';
import NormalTextField from '../../../forms/text-fields/NormalTextField';
import GalleryImageDropdown from '../../../forms/upload-file/GalleryImageDropdown';
import ButtonElement from '../../../forms/button/ButtonElement';
import AxiosInstance from '../../../API/AxiosInstance';

function ViewEditModal({ onClose, attire }) {
  const { control, handleSubmit, reset, setValue, watch } = useForm({});
  const [images, setImages] = useState([null, null, null, null, null]);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [toShow, setToShow] = useState(false);

  const descriptionValue = watch('description') || '';

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

  const onSubmit = async (data) => {
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

      alert('Attire updated successfully!');
      setResetTrigger((prev) => !prev);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to update attire.');
    }
  };

  return (
    <div className="outerEditItemModal">
      <Tooltip title='Close' arrow>
        <button className="close-editItem-modal" onClick={onClose}>
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

      <div className="EditItemModal">
        <div className="edit-item-header">
          <p>Edit Attire</p>
        </div>

        {/* DISPLAY TOGGLE */}
        <div className="to-display-toggle-container">
          <p>Display on Gallery:</p>
          <div
            className={`to-display-text ${toShow ? 'display' : 'not-display'}`}
            onClick={() => setToShow(!toShow)}
          >
            {toShow ? 'Display' : 'Not Display'}
          </div>
        </div>

        <div className="name-type-container">
          <div className="name-edit-item-container">
            <NormalTextField control={control} name="attire_name" label="Name" />
          </div>

          <div className="type-edit-item-container">
            <NormalTextField control={control} name="attire_type" label="Attire Type" />
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
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </div>
  );
}

export default ViewEditModal;
