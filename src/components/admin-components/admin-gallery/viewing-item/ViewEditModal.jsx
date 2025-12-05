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

  const descriptionValue = watch('description') || '';

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

  useEffect(() => {
    if (attire) {
      setValue('attire_name', attire.attire_name);
      setValue('attire_type', attire.attire_type);
      setValue('description', attire.attire_description || '');

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

  const handleImageChange = (file, index) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('attire_name', data.attire_name);
      formData.append('attire_type', data.attire_type);
      formData.append('attire_description', data.description);

      images.forEach((img, idx) => {
        if (img instanceof File) {
          formData.append(`image${idx + 1}`, img);
        }
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

        <div className="name-type-container">
          <div className="name-edit-item-container">
            <NormalTextField control={control} name="attire_name" label="Name" />
          </div>

          <div className="type-edit-item-container">
            <NormalTextField control={control} name="attire_type" label="Attire Type" />
            {/* Replace with dropdown if needed */}
          </div>
        </div>

        <div className="images-edit-item-container">
          {/* MAIN IMAGE */}
          <Tooltip title='Main Image' arrow>
            <div className="edit-item-main-image">
              <GalleryImageDropdown
                resetTrigger={resetTrigger}
                existingImage={images[0]}
                onImageSelect={(file) => handleImageChange(file, 0)}
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
                    existingImage={images[idx]}
                    onImageSelect={(file) => handleImageChange(file, idx)}
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
