import React, { useEffect, useState } from 'react';
import './ToDisplayModal.css';
import noImage from '../../../../assets/no-image.jpg';
import { Tooltip, TextField } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AxiosInstance from '../../../API/AxiosInstance';
import ButtonElement from '../../../forms/button/ButtonElement';

function ToDisplayModal({ onClose }) {
  const [attires, setAttires] = useState([]);
  const [filteredAttires, setFilteredAttires] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAttires = async () => {
    try {
      const response = await AxiosInstance.get('/gallery/admin/attire/');
      setAttires(response.data);
      setFilteredAttires(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch attires');
    }
  };

  useEffect(() => {
    fetchAttires();
  }, []);

  // Filter attires in real-time
  useEffect(() => {
    const filtered = attires.filter((attire) =>
      attire.attire_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAttires(filtered);
  }, [searchTerm, attires]);

  // Toggle display text
  const handleToggle = (id) => {
    const updatedAttires = attires.map((attire) =>
      attire.id === id ? { ...attire, to_show: !attire.to_show } : attire
    );
    setAttires(updatedAttires);
    setFilteredAttires(updatedAttires);
  };

  // Batch save when Update button is clicked
  const handleUpdate = async () => {
    try {
      const updatePromises = attires.map((attire) =>
        AxiosInstance.patch(`/gallery/admin/attire/${attire.id}/`, { to_show: attire.to_show })
      );
      await Promise.all(updatePromises);
      alert('Display settings updated successfully.');
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to update display settings.');
      fetchAttires(); // rollback local changes
    }
  };

  return (
    <div className="outerToDisplayModal">
      <Tooltip title="Close" arrow>
        <button className="close-display-modal" onClick={onClose}>
          <CloseRoundedIcon
            sx={{
              color: '#f5f5f5',
              fontSize: 28,
              padding: '2px',
              backgroundColor: '#0c0c0c',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        </button>
      </Tooltip>

      <div className="ToDisplayModal">
        <div className="top-to-display">
          <div className="add-new-item-header">
            <p>Display Options</p>
          </div>

          <TextField
            variant="outlined"
            placeholder="Search Attire Name"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                '&::placeholder': { fontSize: '14px' },
                '& input': { fontSize: '14px' },
                '& fieldset': { borderColor: '#2d2d2db6' },
                '&:hover fieldset': { borderColor: '#0C0C0C', borderWidth: '2px' },
                '&.Mui-focused fieldset': { borderColor: '#0C0C0C' },
              },
              '& .MuiInputLabel-root': { color: '#2d2d2db6', fontSize: '14px' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#0C0C0C', fontSize: '14px' },
            }}
          />

          <div className="to-display-items-container">
            {filteredAttires.length > 0 ? (
              filteredAttires.map((attire) => (
                <div key={attire.id} className="to-display-item">
                  <div className="to-display-info">
                    <div className="to-display-img-container">
                      <img src={attire.image1 || noImage} alt={attire.attire_name} />
                    </div>
                    <div className="to-display-name">
                      <p>{attire.attire_name}</p>
                    </div>
                  </div>

                  <div
                    className={`to-display-text ${attire.to_show ? 'display' : 'not-display'}`}
                    onClick={() => handleToggle(attire.id)}
                    style={{
                      cursor: 'pointer',
                      color: attire.to_show ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {attire.to_show ? 'Display' : 'Not Display'}
                  </div>
                </div>
              ))
            ) : (
              <p>No attires available.</p>
            )}
          </div>

          <div className="save-edit-item-container">
            <ButtonElement
              label="Update"
              variant="filled-black"
              type="button"
              onClick={handleUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToDisplayModal;
