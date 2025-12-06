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
import ViewModalItem from './viewing-item/ViewModalItem';

const AdminGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [attires, setAttires] = useState([]);
  const [filteredAttires, setFilteredAttires] = useState([]);
  const [selectedAttire, setSelectedAttire] = useState(null);

  const [isAdd, setIsAdd] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const fetchAttires = async () => {
    try {
      const response = await AxiosInstance.get('/gallery/admin/attire/?show_archived=true');
      setAttires(response.data);
      setFilteredAttires(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch attires');
    }
  };

  useEffect(() => { fetchAttires(); }, []);

  // Filter attires whenever searchTerm or attires change
  useEffect(() => {
    const filtered = attires.filter(attire =>
      attire.attire_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAttires(filtered);
  }, [searchTerm, attires]);

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
          
          <div className="select-what-see">
            <ButtonElement label='Select attire' variant='filled-black' type='button' onClick={handleOpenSelecting} />
          </div>
        </div>
      </div>

      <div className="gallery-items-container">
        {filteredAttires.length > 0 ? (
          [...filteredAttires]
            .sort((a, b) => (b.to_show === true) - (a.to_show === true))
            .map((attire) => (
              <div
                key={attire.id}
                className={`gallery-item ${attire.to_show === false ? 'notShowing' : ''}`}
              >
                <img className='gallery-main-image' src={attire.image1 || noImage} alt={attire.attire_name} />
                
                <div className="gallery-buttons-con">
                  <p className='user-gallery-attire-name'>{attire.attire_name}</p>
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
                
              </div>
            ))
        ) : (
          <p>No attires found.</p>
        )}

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
      <Dialog open={isView} onClose={handleCloseView} fullWidth maxWidth={false} PaperProps={{
        style: { width: 'auto', maxWidth: '90vw', maxHeight: '90vh', padding: '0px', backgroundColor: 'transparent', boxShadow: 'none' }
      }}>
        <ViewModalItem 
          onClose={handleCloseView} 
          attire={selectedAttire}
          onOpenEdit={handleOpenEdit}
        />
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEdit} onClose={handleCloseEdit} fullWidth maxWidth={false} PaperProps={{
        style: { width: 'auto', maxWidth: '90vw', maxHeight: '90vh', padding: '0px', backgroundColor: 'transparent', boxShadow: 'none' }
      }}>
        <ViewEditModal onClose={handleCloseEdit} attire={selectedAttire} />
      </Dialog>
    </div>
  );
};

export default AdminGallery;
