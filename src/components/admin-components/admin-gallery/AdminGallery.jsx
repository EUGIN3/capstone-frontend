import React, { useState, useEffect } from 'react';
import './AdminGallery.css';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import noImage from '../../../assets/no-image.jpg';
import Dialog from '@mui/material/Dialog';

import AddItemModal from './add-item/AddItemModal';
import ToDisplayModal from './select-to-display/ToDisplayModal';
import ButtonElement from '../../forms/button/ButtonElement';
import AxiosInstance from '../../API/AxiosInstance';
import ViewEditModal from './viewing-item/ViewEditModal';

const AdminGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [attires, setAttires] = useState([]);
  const [selectedAttire, setSelectedAttire] = useState(null);

  const [isAdd, setIsAdd] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleSearchChange = (event) => setSearchTerm(event.target.value.toLowerCase());

  const fetchAttires = async () => {
    try {
      const response = await AxiosInstance.get('/gallery/admin/attire/?show_archived=true');
      setAttires(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch attires');
    }
  };

  useEffect(() => { fetchAttires(); }, []);

  const handleOpenAdd = () => setIsAdd(true);
  const handleCloseAdd = () => setIsAdd(false);

  const handleOpenSelecting = () => setIsSelecting(true);
  const handleCloseSelecting = () => { setIsSelecting(false); fetchAttires(); };

  const handleOpenView = (attire) => { setSelectedAttire(attire); setIsView(true); };
  const handleCloseView = () => { setIsView(false); setSelectedAttire(null); fetchAttires(); };

  const handleOpenEdit = (attire) => { setSelectedAttire(attire); setIsEdit(true); };
  const handleCloseEdit = () => { setIsEdit(false); setSelectedAttire(null); fetchAttires(); };

  return (
    <div id="gallery">
      <div className="gallery-header">
        <h2 className="gallery-header-title">GALLERY</h2>

        <div className="left-side-search">
          <div className="select-what-see">
            <ButtonElement label='Select attire' variant='filled-black' type='button' onClick={handleOpenSelecting} />
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
        {attires.length > 0 &&
          [...attires]
            .sort((a, b) => (b.to_show === true) - (a.to_show === true))
            .map((attire) => (
              <div
                key={attire.id}
                className={`gallery-item ${attire.to_show === false && 'notShowing'}`}
              >
                <img src={attire.image1 || noImage} alt={attire.attire_name} />
                
                {/* View Button */}
                <button
                  className="overlay-button view-btn"
                  onClick={() => handleOpenView(attire)}
                >
                  View
                </button>

                {/* Edit Button */}
                <button
                  className="overlay-button edit-btn"
                  onClick={() => handleOpenEdit(attire)}
                >
                  Edit
                </button>

              </div>
            ))}

        <div className="gallery-item gallery-add-item" onClick={handleOpenAdd}>
          <span>+</span>
        </div>
      </div>

      {/* Add Modal */}
      <Dialog open={isAdd} onClose={handleCloseAdd} fullWidth maxWidth={false} PaperProps={{
        style: { width: 'auto', maxWidth: '90vw', maxHeight: '90vh', padding: '0px', backgroundColor: 'transparent', boxShadow: 'none' }
      }}>
        <AddItemModal onClose={handleCloseAdd} />
      </Dialog>

      {/* Selecting Modal */}
      <Dialog open={isSelecting} onClose={handleCloseSelecting} fullWidth maxWidth={false} PaperProps={{
        style: { width: 'auto', maxWidth: '90vw', maxHeight: '90vh', padding: '0px', backgroundColor: 'transparent', boxShadow: 'none' }
      }}>
        <ToDisplayModal onClose={handleCloseSelecting} />
      </Dialog>

      {/* View Modal */}
      {/* <Dialog open={isView} onClose={handleCloseView} fullWidth maxWidth={false} PaperProps={{
        style: { width: 'auto', maxWidth: '90vw', maxHeight: '90vh', padding: '0px', backgroundColor: 'transparent', boxShadow: 'none' }
      }}>
        <ViewEditModal onClose={handleCloseView} attire={selectedAttire} />
      </Dialog> */}

      {/* Edit Modal (reuse ViewEditModal for editing) */}
      <Dialog open={isEdit} onClose={handleCloseEdit} fullWidth maxWidth={false} PaperProps={{
        style: { width: 'auto', maxWidth: '90vw', maxHeight: '90vh', padding: '0px', backgroundColor: 'transparent', boxShadow: 'none' }
      }}>
        <ViewEditModal onClose={handleCloseEdit} attire={selectedAttire} />
      </Dialog>
    </div>
  );
};

export default AdminGallery;
