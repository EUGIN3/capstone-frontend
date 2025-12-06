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
  const [ openView, setOpenView ] = useState(false)


  const fetchAttires = async () => {
    try {
      const response = await AxiosInstance.get('/gallery/attire/');
      setAttires(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch attires');
    }
  };

  useEffect(() => {
    fetchAttires();
  }, []);

  const handleOpenView = (attire) => {
    setSelectedAttire(attire)
    setOpenView(true)
  }

  const handleCloseView = () => {
    setSelectedAttire({})
    setOpenView(false)
  }

  return (
    <>
      <Box>
        <ImageList variant="masonry" cols={4} gap={6}>
          {attires.map((item) => (
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
          ))}
        </ImageList>
      </Box>


        <Dialog open={openView} onClose={handleCloseView} fullWidth maxWidth={false} PaperProps={{
          style: { width: 'auto', maxWidth: '90vw', maxHeight: '90vh', padding: '0px', backgroundColor: 'transparent', boxShadow: 'none' }
        }}>
          <UserViewImageModal onClose={handleCloseView} attire={selectedAttire} />
      </Dialog>
    </>
  );
}
