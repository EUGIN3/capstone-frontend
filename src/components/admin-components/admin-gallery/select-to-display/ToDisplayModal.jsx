import React, { useEffect, useState } from 'react';
import './ToDisplayModal.css';
import noImage from '../../../../assets/no-image.jpg';
import { Tooltip, TextField } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AxiosInstance from '../../../API/AxiosInstance';
import ButtonElement from '../../../forms/button/ButtonElement';
import Confirmation from '../../../forms/confirmation-modal/Confirmation';
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function ToDisplayModal({ onClose }) {
  const [attires, setAttires] = useState([]);
  const [filteredAttires, setFilteredAttires] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);

  const fetchAttires = async () => {
    try {
      const response = await AxiosInstance.get('/gallery/admin/attire/');
      setAttires(response.data);
      setFilteredAttires(response.data);
    } catch (error) {
      console.error(error);
      
      toast.error(
        <div style={{ padding: '8px' }}>
          Failed to load attires. Please refresh and try again.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
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

  // ✅ Returns config object for confirmation
  const getConfirmationConfig = () => {
    const displayCount = attires.filter(a => a.to_show).length;
    const notDisplayCount = attires.length - displayCount;

    return {
      severity: 'warning',
      message: `Update display settings? This will set ${displayCount} attire${displayCount !== 1 ? 's' : ''} to display and ${notDisplayCount} to not display.`
    };
  };

  // ✅ Main update handler
  const handleUpdate = () => {
    if (saving) return;

    const config = getConfirmationConfig();
    setShowConfirm(config);
  };

  // ✅ Actual save logic
  const doUpdate = async () => {
    setSaving(true);

    try {
      const updatePromises = attires.map((attire) =>
        AxiosInstance.patch(`/gallery/admin/attire/${attire.id}/`, { to_show: attire.to_show })
      );
      await Promise.all(updatePromises);

      // Show success toast
      const displayCount = attires.filter(a => a.to_show).length;
      toast.success(
        <div style={{ padding: '8px' }}>
          Display settings updated successfully! {displayCount} attire{displayCount !== 1 ? 's' : ''} set to display.
        </div>,
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );

      // Close modal after success toast
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Failed to update display settings:', error);
      setSaving(false);

      // Rollback local changes
      fetchAttires();

      let errorMessage = 'Failed to update display settings. Please try again.';

      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 
                      error.response?.data?.error ||
                      'Invalid data. Please check and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to update display settings.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Some attires were not found. Please refresh and try again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      }

      toast.error(
        <div style={{ padding: '8px' }}>
          {errorMessage}
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
    }
  };

  // ✅ Handles confirmation response
  const handleConfirm = (confirmed) => {
    setShowConfirm(null);

    if (confirmed) {
      doUpdate();
    }
  };

  return (
    <>
      <div className="outerToDisplayModal" style={{ position: 'relative' }}>
        
        {saving && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        <Tooltip title="Close" arrow>
          <button className="close-display-modal" onClick={onClose} disabled={saving}>
            <CloseRoundedIcon
              sx={{
                color: '#f5f5f5',
                fontSize: 28,
                padding: '2px',
                backgroundColor: '#0c0c0c',
                borderRadius: '50%',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.5 : 1,
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
              disabled={saving}
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
                      onClick={() => !saving && handleToggle(attire.id)}
                      style={{
                        cursor: saving ? 'not-allowed' : 'pointer',
                        color: attire.to_show ? 'green' : 'red',
                        fontWeight: 'bold',
                        opacity: saving ? 0.5 : 1,
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
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {showConfirm && (
          <Confirmation
            message={showConfirm.message}
            severity={showConfirm.severity}
            onConfirm={handleConfirm}
            isOpen={true}
          />
        )}
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
        style={{ zIndex: 99999 }}
      />
    </>
  );
}

export default ToDisplayModal;