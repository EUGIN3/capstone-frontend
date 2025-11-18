import React, { useState, useEffect } from 'react';
import './UserGallery.css';
import noImage from '../../../assets/no-image.jpg';
import AxiosInstance from '../../API/AxiosInstance'

const UserGallery = () => {
  const [attires, setAttires] = useState([]);

  const fetchAttires = async () => {
    try {
      const response = await AxiosInstance.get('/gallery/attire/'); // user view endpoint
      setAttires(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch attires');
    }
  };

  useEffect(() => {
    fetchAttires();
  }, []);

  return (
    <div id="userGallery">
      <div className="gallery-header">
        <h2 className="gallery-header-title">GALLERY</h2>
      </div>

      <div className="gallery-items-container">
        {attires.length > 0 ? (
          attires.map((attire) => (
            <div
              key={attire.id}
              className="gallery-item"
            >
              <img
                src={attire.image1 ? attire.image1 : noImage}
                alt={attire.attire_name}
              />
            </div>
          ))
        ) : (
          <p>No attires available.</p>
        )}
      </div>
    </div>
  );
};

export default UserGallery;
