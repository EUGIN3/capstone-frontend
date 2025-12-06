import React, { useEffect, useState } from 'react';
import './ViewModelItem.css';
import { Tooltip } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import noImage from '../../../../assets/no-image.jpg';
import ButtonElement from '../../../forms/button/ButtonElement';

function ViewModalItem({ onClose, attire, onOpenEdit }) {
  const [images, setImages] = useState([null, null, null, null, null]);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    if (attire) {
      setImages([
        attire.image1 || noImage,
        attire.image2 || noImage,
        attire.image3 || noImage,
        attire.image4 || noImage,
        attire.image5 || noImage,
      ]);
    }
  }, [attire]);

  const openFullscreen = (img) => setFullscreenImage(img);
  const closeFullscreen = () => setFullscreenImage(null);

  const handleOpenEdit = () => {
    onClose();         // ❗ close view modal
    onOpenEdit(attire); // ❗ trigger EDIT modal from parent
  };

  return (
    <div className="ViewModalItem">
      <div className="gallery-view-image-container">

        {/* MAIN IMAGE */}
        <div className="gallery-view-main-container">
          <img
            src={images[0]}
            alt="Main"
            className="view-image"
            onClick={() => openFullscreen(images[0])}
          />
        </div>

        {/* SUB IMAGES */}
        <div className="gallery-view-sub-container">
          {images.slice(1).map((img, idx) => (
            <div key={idx} className="gallery-view-sub-image">
              <img
                src={img}
                alt={`Sub ${idx}`}
                className="view-image"
                onClick={() => openFullscreen(img)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* TEXT */}
      <div className="view-item-text">
        <div className="text-item-name">
          {attire?.attire_name || 'Sample Gown'}
        </div>

        <div className="text-item-description">
          {attire?.attire_description}
        </div>

        <div className="view-item-edit-button">
          <ButtonElement
            label='Edit'
            variant={'filled-white'}
            type='button'
            onClick={handleOpenEdit}
          />
        </div>
      </div>

      {/* FULLSCREEN PREVIEW */}
      {fullscreenImage && (
        <div className="view-fullscreen-overlay" onClick={closeFullscreen}>
          <img src={fullscreenImage} alt="Fullscreen" className="view-fullscreen-image" />
        </div>
      )}
    </div>
  );
}

export default ViewModalItem;
