import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import AxiosInstance from '../../API/AxiosInstance';
import React, { useEffect, useState } from 'react';
import './UserGallery.css';
import Dialog from '@mui/material/Dialog';

import UserViewImageModal from './view-item-modal/UserViewImageModal';

export default function ImageListComponents() {
  const [attires, setAttires] = useState([]);
  const [selectedAttire, setSelectedAttire] = useState({});
  const [openView, setOpenView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttires = async () => {
    try {
      // ⏱️ Artificial loading delay (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const response = await AxiosInstance.get('/gallery/attire/');
      setAttires(response.data);
      setError(null);
    } catch (error) {
      console.error('❌ Failed to fetch attires:', error);
      setError('Failed to load gallery. Please try again.');
      setAttires([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttires();
  }, []);

  const handleOpenView = (attire) => {
    setSelectedAttire(attire);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setSelectedAttire({});
    setOpenView(false);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchAttires();
  };

  // Loading skeleton component
  const GallerySkeleton = () => (
    <ImageListItem className="image-item skeleton-item">
      <div className="skeleton-image"></div>
    </ImageListItem>
  );

  return (
    <>
      <Box sx={{ position: 'relative', minHeight: '400px' }}>
        
        {/* Loading Overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={handleRetry}>
              Retry
            </button>
          </div>
        )}

        {/* Gallery Content */}
        {!error && (
          <ImageList variant="masonry" cols={4} gap={6}>
            {loading ? (
              // Show skeleton loaders while loading
              Array.from({ length: 8 }).map((_, index) => (
                <GallerySkeleton key={index} />
              ))
            ) : attires.length > 0 ? (
              // Show actual images when loaded
              attires.map((item) => (
                <ImageListItem key={item.id} className="image-item">
                  {/* 🔥 HOVER CONTENT */}
                  <div className="user-gallery-view-button-container">
                    <p className="user-gallery-attire-name">{item.attire_name}</p>

                    <button
                      className="view-button"
                      onClick={() => handleOpenView(item)}
                    >
                      View
                    </button>
                  </div>

                  {/* IMAGE */}
                  <img
                    src={item.image1}
                    alt={item.attire_name}
                    loading="lazy"
                  />
                </ImageListItem>
              ))
            ) : (
              // Show empty state
              <Box
                sx={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#666',
                }}
              >
                <p style={{ fontSize: '18px', fontWeight: 500 }}>
                  No attires available in the gallery
                </p>
              </Box>
            )}
          </ImageList>
        )}
      </Box>

      <Dialog
        open={openView}
        onClose={handleCloseView}
        fullWidth
        maxWidth={false}
        PaperProps={{
          style: {
            width: 'auto',
            maxWidth: '90vw',
            maxHeight: '90vh',
            padding: '0px',
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <UserViewImageModal onClose={handleCloseView} attire={selectedAttire} />
      </Dialog>
    </>
  );
}