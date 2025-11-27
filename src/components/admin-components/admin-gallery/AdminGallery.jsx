import React, { useState, useEffect } from 'react';
import './AdminGallery.css';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import noImage from '../../../assets/no-image.jpg'
import Dialog from '@mui/material/Dialog';

import AddItemModal from './add-item/AddItemModal';
import ToDisplayModal from './select-to-display/ToDisplayModal';
import ButtonElement from '../../forms/button/ButtonElement';
import AxiosInstance from '../../API/AxiosInstance';
import ViewEditModal from './viewing-item/ViewEditModal'

const AdminGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [isView, setIsView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  const handleOpenAdd = () => {
    setIsAdd(true)
  }

  const handleCloseAdd = () => {
    setIsAdd(false)
  }

  const handleOpenViewing = () => {
    setIsView(true)
  }

  const handleCloseViewing = () => {
    setIsView(false)
  }

  const handleOpenSelecting = () => {
    setIsSelecting(true)
  }

  const handleCloseSelecting = () => {
    setIsSelecting(false)
    fetchAttires();
  }

  const handleSearch = (e) => {
    alert('Searching');
  };

  const handleUpload = (e) => {
    alert('Upload Design');
  };

  const fetchDesigns = async () => {
    alert('Getting the data');
  };

  // For searching
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  
  const [attires, setAttires] = useState([])
  const fetchAttires = async () => {
    try {
      const response = await AxiosInstance.get('/gallery/admin/attire/?show_archived=true');
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
    <div id="gallery">
      <div className="gallery-header">
        <h2 className="gallery-header-title">GALLERY</h2>

        <div className="left-side-search">
          <div className="select-what-see">
            <ButtonElement
              label='Select attire'
              variant='filled-black'
              type='button'
              onClick={handleOpenSelecting}
            />
          </div>
          <div className="search-user-container">
            <SearchIcon />
            <TextField
              variant="outlined"
              placeholder="Search"
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
        </div>

      </div>

     <div className="gallery-items-container">
        {attires.length > 0 && (
          // sort attires: first the ones with to_show = true
          [...attires]
            .sort((a, b) => (b.to_show === true) - (a.to_show === true))
            .map((attire) => (
              <div
                key={attire.id}
                className={`gallery-item ${attire.to_show === false && 'notShowing'}`}
              >
                <img
                  src={attire.image1 ? attire.image1 : noImage}
                  alt={attire.attire_name}
                />

                {/* Button overlay */}
                <button className="overlay-button" onClick={handleOpenViewing}>
                  Edit
                </button>
              </div>
            ))
        )}

        <div className="gallery-item gallery-add-item" onClick={handleOpenAdd}>
          <span>+</span>
        </div>
      </div>

      
      {/* Add */}
      <Dialog
        open={isAdd}
        onClose={handleCloseAdd}
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
        }}>
        <AddItemModal
          onClose={handleCloseAdd}
        />
      </Dialog>
      {/* Selecting */}
      <Dialog
        open={isSelecting}
        onClose={handleCloseSelecting}
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
        }}>
        <ToDisplayModal
          onClose={handleCloseSelecting}
        />
      </Dialog>
      {/* Viewing */}
      <Dialog
        open={isView}
        onClose={handleCloseViewing}
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
        }}>
        <ViewEditModal
          onClose={handleCloseViewing}
        />
      </Dialog>

    </div>
  );
};

export default AdminGallery;
