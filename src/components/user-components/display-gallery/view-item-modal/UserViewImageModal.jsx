import React, { useEffect, useState } from 'react';
import './UserViewImageModal.css';
import noImage from '../../../../assets/no-image.jpg';
import ButtonElement from '../../../forms/button/ButtonElement';
// import BookAppointment from '../../../forms/book-appointment/BookAppointment';
import Dialog from '@mui/material/Dialog';

function UserViewImageModal({ onClose, attire }) {
  const [userImages, setUserImages] = useState([null, null, null, null, null]);
  const [userFullscreenImage, setUserFullscreenImage] = useState(null);


  useEffect(() => {
    if (attire) {
      setUserImages([
        attire.image1 || noImage,
        attire.image2 || noImage,
        attire.image3 || noImage,
        attire.image4 || noImage,
        attire.image5 || noImage,
      ]);
    }
  }, [attire]);

  const openFullscreen = (img) => setUserFullscreenImage(img);
  const closeFullscreen = () => setUserFullscreenImage(null);

  return (
    <div className="UserViewModalItem">


      <div className="userview-gallery-container">

        {/* MAIN IMAGE */}
        <div className="userview-main-image-container">
          <img
            src={userImages[0]}
            alt="Main"
            className="userview-image"
            onClick={() => openFullscreen(userImages[0])}
          />
        </div>

        {/* SUB IMAGES */}
        <div className="userview-sub-image-container">
          {userImages.slice(1).map((img, idx) => (
            <div key={idx} className="userview-sub-image">
              <img
                src={img}
                alt={`Sub ${idx}`}
                className="userview-image"
                onClick={() => openFullscreen(img)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* TEXT CONTENT */}
      <div className="userview-item-text">
        <div className="userview-item-name">
          {attire?.attire_name || 'Attire Name'}
        </div>

        <div className="userview-item-description">
          {attire?.attire_description}
        </div>
      </div>

      {/* FULLSCREEN OVERLAY */}
      {userFullscreenImage && (
        <div
          className="userview-fullscreen-overlay"
          onClick={closeFullscreen}
        >
          <img
            src={userFullscreenImage}
            alt="Fullscreen"
            className="userview-fullscreen-image"
          />
        </div>
      )}
    </div>
  );
}

export default UserViewImageModal;
