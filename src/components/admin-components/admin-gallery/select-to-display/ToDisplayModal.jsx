import React, { useEffect, useState } from 'react';
import './ToDisplayModal.css';
import noImage from '../../../../assets/no-image.jpg';
import { Tooltip } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Switches from '../../../forms/switches/Switches';
import AxiosInstance from '../../../API/AxiosInstance';

function ToDisplayModal({ onClose }) {
  const [attires, setAttires] = useState([]);

  const fetchAttires = async () => {
    try {
      const response = await AxiosInstance.get('/gallery/admin/attire/');
      setAttires(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch attires');
    }
  };

  useEffect(() => {
    fetchAttires();
  }, []);

  const handleToggle = async (id, currentValue) => {
    // Optimistic update: update local state first
    const updatedAttires = attires.map((attire) =>
      attire.id === id ? { ...attire, to_show: !currentValue } : attire
    );
    setAttires(updatedAttires);

    // Send PATCH request to backend immediately
    try {
      await AxiosInstance.patch(`/gallery/admin/attire/${id}/`, {
        to_show: !currentValue,
      });
    } catch (error) {
      console.error(error);
      alert('Failed to update display setting.');

      // Revert change if PATCH fails
      setAttires(attires);
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

          <div className="to-display-items-container">
            {attires.length > 0 ? (
              attires.map((attire) => (
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

