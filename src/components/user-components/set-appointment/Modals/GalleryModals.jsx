import React, { useEffect, useState } from 'react';
import './GalleryModals.css';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Tooltip } from '@mui/material';
import AxiosInstance from '../../../API/AxiosInstance';
import noImage from '../../../../assets/no-image.jpg';

function GalleryModal({ onClose, onSelect }) {
  const [attires, setAttires] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get('/gallery/attire/');
      setAttires(response.data);
    } catch (err) {
      console.error("Failed to load gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  return (
    <div className="setAppointGalleryWrapper" id="setAppointGalleryOuterModal">
      <div className="galleryContainer">

        {/* Close Button */}
        <Tooltip title="Close" arrow>
          <button className="galleryCloseButton" onClick={onClose}>
            <CloseRoundedIcon
              sx={{
                color: '#fff',
                fontSize: 28,
                padding: '2px',
                backgroundColor: '#0c0c0c',
                borderRadius: '50%',
              }}
            />
          </button>
        </Tooltip>

        <div className="galleryHeaderTitle">Select Attire</div>

        <div className="galleryGrid">
          {/* LOADING SKELETONS */}
          {loading &&
            [...Array(6)].map((_, index) => (
              <div key={index} className="gallerySkeleton"></div>
            ))
          }

          {/* NO ATTIRE */}
          {!loading && attires.length === 0 && (
            <p className="galleryEmptyText">No attires available.</p>
          )}

          {/* SHOW ATTIRE LIST */}
          {!loading &&
            attires.map((attire) => (
              <div
                key={attire.id}
                className="galleryItem"
                onClick={() => onSelect(attire)}
              >
                <img
                  src={attire.image1 || noImage}
                  alt="attire"
                  className="galleryImage"
                />

                <div className="galleryInfo">
                  <p>{attire.name}</p>
                </div>
              </div>
            ))
          }
        </div>

      </div>
    </div>
  );
}

export default GalleryModal;
