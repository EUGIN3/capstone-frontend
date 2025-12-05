import React, { useEffect, useState } from 'react';
import './ToDisplayModal.css';
import noImage from '../../../../assets/no-image.jpg';
import { Tooltip, TextField } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Switches from '../../../forms/switches/Switches';
import AxiosInstance from '../../../API/AxiosInstance';

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

  const handleToggle = async (id, currentValue) => {
    const updatedAttires = attires.map((attire) =>
      attire.id === id ? { ...attire, to_show: !currentValue } : attire
    );
    setAttires(updatedAttires);
    setFilteredAttires(updatedAttires);

    try {
      await AxiosInstance.patch(`/gallery/admin/attire/${id}/`, { to_show: !currentValue });
    } catch (error) {
      console.error(error);
      alert('Failed to update display setting.');
      setAttires(attires);
      setFilteredAttires(attires);
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

          {/* Search Field */}
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
                '&::placeholder': {
                  fontSize: '14px',
                },
                '& input': {
                  fontSize: '14px',
                },
                '& fieldset': {
                  borderColor: '#2d2d2db6',
                },
                '&:hover fieldset': {
                  borderColor: '#0C0C0C',
                  borderWidth: '2px',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0C0C0C',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#2d2d2db6',
                fontSize: '14px',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#0C0C0C',
                fontSize: '14px',
              },
            }}
          />

          <div className="to-display-items-container">
            {filteredAttires.length > 0 ? (
              filteredAttires.map((attire) => (
                <div key={attire.id} className="to-display-item">
                  <div className="to-display-info">
                    <div className="to-display-img-container">
                      <img
                        src={attire.image1 ? attire.image1 : noImage}
                        alt={attire.attire_name}
                      />
                    </div>
                    <div className="to-display-name">
                      <p>{attire.attire_name}</p>
                    </div>
                  </div>

                  <div className="to-display-toggle">
                    <Switches
                      title="display"
                      checked={attire.to_show}
                      onChange={() => handleToggle(attire.id, attire.to_show)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>No attires available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToDisplayModal;
