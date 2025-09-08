import React, { useState } from 'react';
import './AdminGallery.css';

const AdminGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([
    { id: 1, name: 'Design 1' },
    { id: 2, name: 'Design 2' },
    { id: 3, name: 'Design 3' },
    { id: 4, name: 'Design 4' }
  ]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search logic here
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle file upload logic here
      const imageUrl = URL.createObjectURL(file);
      setImages([...images, { id: Date.now(), url: imageUrl }]);
    }
  };

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