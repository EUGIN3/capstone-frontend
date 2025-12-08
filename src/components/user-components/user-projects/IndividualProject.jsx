import React, { useState } from 'react';
import './IndividualProject.css';
import noImage from '../../../assets/no-image.jpg'
import InsertPhotoTwoToneIcon from '@mui/icons-material/InsertPhotoTwoTone';
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function IndividualProject({ project, appointment }) {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [fullscreenImageApp, setFullscreenImageApp] = useState(null);
  const navigate = useNavigate();

  const handleCloseFullscreen = () => setFullscreenImage(null);

  const handleCloseFullscreenApp = () => setFullscreenImageApp(null);

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  const getAppointmentImage = (appointmentId) => {
    const matched = appointment?.find(app => app.id === Number(appointmentId));
    if (!matched || !matched.image) return noImage;

    return matched.image.startsWith('http')
      ? matched.image
      : `${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'}${matched.image}`;
  };

  const handleView = (item) => {
    navigate(`/user/on-going-project/${item.id}`);
  };

  return (
    <div className="IndividualProject">
      {project && project.length > 0 ? (
        project.map((item, index) => {
          const appointmentImage = getAppointmentImage(item.appointment);

          return (
            <div 
              className={`indi-container-main ${item.process_status === 'ready' || item.process_status === 'picked_up' && 'done'}`} 
              key={index}
              onClick={() => handleView(item)}
              style={{ cursor: 'pointer' }}
            >
              {/* Fullscreen appointment */}
              {fullscreenImageApp && (
                <div className="image-fullscreen-overlay" onClick={handleCloseFullscreenApp}>
                  <img src={fullscreenImageApp} alt="Fullscreen appointment" className="image-fullscreen" />
                </div>
              )}

              {/* Fullscreen update image */}
              {fullscreenImage && (
                <div className="image-fullscreen-overlay" onClick={handleCloseFullscreen}>
                  <img src={fullscreenImage} alt="Fullscreen update" className="image-fullscreen" />
                </div>
              )}

              {/* ✅ ALWAYS EXPANDED - NO COLLAPSE */}
              <div className="indi-details">
                <div className="attire-type-container">
                  <p className="indi-type" style={{textTransform:'capitalize'}}>{item.attire_type}</p>
                </div>

                <div className="indi-last-update">
                  <p className="indi-time-date">{formatDate(item.updated_at)}</p>
                  <span>Last Update</span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="indi-noproject">No projects available.</p>
      )}
    </div>
  );
}

export default IndividualProject;