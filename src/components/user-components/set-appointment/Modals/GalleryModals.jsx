import React, { useEffect, useState, useMemo } from 'react';
import './GalleryModals.css';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchIcon from '@mui/icons-material/Search';
import { Tooltip, TextField } from '@mui/material';
import AxiosInstance from '../../../API/AxiosInstance';
import noImage from '../../../../assets/no-image.jpg';

function GalleryModal({ onClose, onSelect }) {
  const [attires, setAttires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredAttires = useMemo(() => {
    return attires.filter((attire) => {
      const searchableFields = [
        attire.attire_name,
      ].filter(Boolean).join(' ').toLowerCase();

      return searchableFields.includes(searchTerm);
    });
  }, [attires, searchTerm]);

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

        {/* SEARCH BOX */}
        <div className="gallery-search-container">
          <SearchIcon />
          <TextField
            variant="outlined"
            placeholder="Search attires..."
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' },
              },
            }}
            onChange={handleSearchChange}
            value={searchTerm}
          />
        </div>

        <div className="galleryGrid">
          {/* LOADING SKELETONS */}
          {loading &&
            [...Array(6)].map((_, index) => (
              <div key={index} className="gallerySkeleton"></div>
            ))
          }

          {/* NO ATTIRE */}
          {!loading && filteredAttires.length === 0 && (
            <p className="galleryEmptyText">
              {searchTerm ? 'No attires found.' : 'No attires available.'}
            </p>
          )}

          {/* SHOW ATTIRE LIST */}
          {!loading &&
            filteredAttires.map((attire) => (
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