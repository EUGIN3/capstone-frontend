import React, { useState } from 'react';
import './AdminGallery.css';

const AdminGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);

  const handleSearch = (e) => {
    alert('Searching')
  };

  const handleUpload = (e) => {
    alert('Upload Design')
  };

  const fetchDesigns = async () => {
    await alert('Getting the data')
  }

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>DESIGNS</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search designs..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      <div className="gallery-grid">
        {images.map((image) => (
          <div key={image.id} className="gallery-item">
            <div className="design-text">{image.name}</div>
          </div>
        ))}
        <div className="gallery-item upload-box">
          <label htmlFor="file-upload" className="upload-label">
            <span className="plus-icon">+</span>
            <span>Upload Design</span>
          </label>
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;