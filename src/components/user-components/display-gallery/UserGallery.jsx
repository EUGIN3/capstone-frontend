import React, { useState, useEffect } from 'react';
import './UserGallery.css';
import noImage from '../../../assets/no-image.jpg';
import AxiosInstance from '../../API/AxiosInstance';
import ImageListComponents from './ImageListComponents';

const UserGallery = () => {
  return (
    <div id="userGallery">
      <div className="gallery-header">
        <h2 className="gallery-header-title">GALLERY</h2>
      </div>

      <div className="gallery-items-container">
        <ImageListComponents/>
      </div>
    </div>
  );
};

export default UserGallery;
