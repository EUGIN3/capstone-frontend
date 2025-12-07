import React, { useState } from 'react';
import './IndividualProject.css';
import noImage from '../../../assets/no-image.jpg'
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import KeyboardArrowUpTwoToneIcon from '@mui/icons-material/KeyboardArrowUpTwoTone';
import InsertPhotoTwoToneIcon from '@mui/icons-material/InsertPhotoTwoTone';
import { Tooltip } from '@mui/material';

function IndividualProject({ project, appointment }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [showUpdates, setShowUpdates] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [fullscreenImageApp, setFullscreenImageApp] = useState(null);

  const toggleOpen = (index) => setOpenIndex(openIndex === index ? null : index);

  const handleImageClick = (imagePath) => setFullscreenImage(imagePath || noImage);
  const handleCloseFullscreen = () => setFullscreenImage(null);

  const handleImageClickApp = (imagePath) => setFullscreenImageApp(imagePath || noImage);
  const handleCloseFullscreenApp = () => setFullscreenImageApp(null);

  const processStatusLabels = {
    designing: 'Designing',
    materializing: 'Materializing',
    ready: 'Ready',
    done: 'Done',
  };

  const paymentStatusLabels = {
    no_payment: 'No Payment',
    partial_payment: 'Partial Payment',
    fully_paid: 'Fully Paid',
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  const formatCurrency = (value) =>
    `₱ ${new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;

  const formatDateNotime = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const formatFittingTime = (timeData) => {
    if (!timeData) return 'N/A';
    try {
      const times = typeof timeData === 'string' ? JSON.parse(timeData) : timeData;
      return Array.isArray(times) ? times.join(', ') : timeData;
    } catch {
      return timeData;
    }
  };

  const getAppointmentImage = (appointmentId) => {
    const matched = appointment?.find(app => app.id === Number(appointmentId));
    if (!matched || !matched.image) return noImage; // if no appointment or image is null/empty

    // Prepend backend URL if the image is relative
    return matched.image.startsWith('http')
      ? matched.image
      : `${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'}${matched.image}`;
  };

  return (
    <div className="IndividualProject">
      {project && project.length > 0 ? (
        project.map((item, index) => {
          const appointmentImage = getAppointmentImage(item.appointment);

          return (
            <div className={`indi-container-main ${item.process_status === 'ready' && 'done'}`} key={index}>
              {/* Fullscreen appointment */}
              {fullscreenImageApp && (
                <div className="image-fullscreen-overlay" onClick={handleCloseFullscreenApp}>
                  <img src={fullscreenImageApp} alt="Fullscreen appointment" className="image-fullscreen" />
                </div>
              )}

              <div className="indi-colapse-container">
                <div className="indi-left-section">
                  <div className="indi-details-sections">
                    <div className="indi-last-update">
                      <p className="indi-time-date">{formatDate(item.updated_at)}</p>
                    </div>

                    <div className="attire-type-container">
                      <p className="indi-type">{item.attire_type}</p>
                    </div>
                  </div>
                </div>

                <div className="view-details-container">
                  <p className="indi-view" onClick={(e) => { e.stopPropagation(); toggleOpen(index); }}>
                    View {openIndex === index ? <KeyboardArrowUpTwoToneIcon sx={{ fontSize: 20 }} /> : <KeyboardArrowDownTwoToneIcon sx={{ fontSize: 20 }} />}
                  </p>
                </div>
              </div>

              {/* DETAILS DROPDOWN */}
              <div className={`indi-details-wrapper ${openIndex === index ? 'open' : 'closed'}`}>
                <div className="indi-details">
                  <div className="indi-hr-container"><hr /></div>

                  <div className="indi-informtaion">
                    <p className="label">Information:</p>
                    <div className="indi-information-top">
                      <div className="indi-sttire-type"><span>Attire:</span><p>{item.attire_type}</p></div>
                      <div className="indi-status"><span>Status:</span><p>{processStatusLabels[item.process_status]}</p></div>
                      <div className="indi-target"><span>Target Date:</span><p>{formatDateNotime(item.targeted_date)}</p></div>
                      <div className="indi-started"><span>Started:</span><p>{formatDate(item.created_at)}</p></div>
                    </div>

                    <div className="indi-information-middle">
                      <div className="indi-total"><span>Payment Status:</span><p>{paymentStatusLabels[item.payment_status]}</p></div>
                      <div className="indi-price"><span>Price:</span><p>{formatCurrency(item.total_amount)}</p></div>
                      <div className="indi-paid"><span>Paid:</span><p>{formatCurrency(item.amount_paid)}</p></div>
                      <div className="indi-balance"><span>Balance:</span><p>{formatCurrency(item.balance)}</p></div>
                    </div>

                    <div className="indi-information-bottom">
                      <div className="indi-total"><span>Fitting Date:</span><p className={`indi-info-text ${item.fitting_successful ? 'done-fitting' : ''}`}>{formatDateNotime(item.fitting_date)}</p></div>
                      <div className="indi-price"><span>Fitting Time:</span><p className={`indi-info-text ${item.fitting_successful ? 'done-fitting' : ''}`}>{formatFittingTime(item.fitting_time)}</p></div>
                    </div>
                  </div>

                  <div className="indi-hr-container"><hr /></div>

                  {/* UPDATES */}
                  <div className="indi-details-container">
                    <p className="label">
                      Updates:
                      {showUpdates ? (
                        <span className="indi-show-update" onClick={() => setShowUpdates(false)}>Hide <KeyboardArrowUpTwoToneIcon sx={{ fontSize: 20 }} /></span>
                      ) : (
                        <span className="indi-show-update" onClick={() => setShowUpdates(true)}>Show <KeyboardArrowDownTwoToneIcon sx={{ fontSize: 20 }} /></span>
                      )}
                    </p>

                    {showUpdates && (
                      <div className="indi-update-wrapper">
                        {item.updates && item.updates.length > 0 ? (
                          [...item.updates].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                          .map((update, uIndex) => (
                            <div className="indi-update-container" key={uIndex}>
                              {fullscreenImage && (
                                <div className="image-fullscreen-overlay" onClick={handleCloseFullscreen}>
                                  <img src={fullscreenImage} alt="Fullscreen update" className="image-fullscreen" />
                                </div>
                              )}
                              <div className="indi-update-top">
                                <p className="inid-date-time">{formatDate(update.timestamp)}</p>
                                <div className="indi-paid-update">
                                  <p className="indi-paid-label">Amount Paid:</p>
                                  <p className="indi-paid-amount">{formatCurrency(update.added_payment)}</p>
                                </div>
                                <div className="indi-status-update">
                                  <p className="indi-status-label">Status:</p>
                                  <p className="indi-status-note">{processStatusLabels[update.process_status] || update.process_status}</p>
                                </div>
                              </div>

                              <div className="indi-note">
                                <Tooltip title="View" arrow>
                                  <InsertPhotoTwoToneIcon
                                    sx={{ opacity: 0.5, transition: 'opacity 0.3s', cursor: 'pointer', '&:hover': { opacity: 1 } }}
                                    onClick={() => {
                                      // Prepend backend URL if the image is relative
                                      const imageUrl = update.image.startsWith('http')
                                        ? update.image
                                        : `${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'}${update.image}`;
                                      setFullscreenImage(imageUrl);
                                    }}
                                  />
                                </Tooltip>
                                <span>|</span>
                                <p className="indi-update-note">{update.message}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="indi-no-update">No updates yet.</p>
                        )}
                      </div>
                    )}
                  </div>
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
