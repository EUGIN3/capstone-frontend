import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectDetails.css';
import AxiosInstance from '../../../API/AxiosInstance';
import noImage from '../../../../assets/no-image.jpg';

import curlyArrowLogRes from '../../../../assets/curly-arrow.png';
import AppHeader from '../../../user-components/user-header/userHeader';

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [hasAppointment, setHasAppointment] = useState(false);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const withLoading = async (cb) => {
    try {
      setLoading(true);
      await delay(400);
      await cb();
    } finally {
      setLoading(false);
    }
  };

  const paymentStatusLabels = {
    no_payment: 'No Payment',
    partial_payment: 'Partial Payment',
    fully_paid: 'Fully Paid',
  };

  // ✅ Status progression order
  const statusOrder = [
    'concept',
    'sketching',
    'designing',
    'material_selection',
    'pattern_making',
    'cutting',
    'sewing',
    'materializing',
    'fitting',
    'alterations',
    'final_fitting',
    'ready',
    'picked_up'
  ];

  // ✅ Function to format status by removing underscores and capitalizing
  const formatStatus = (status) => {
    if (!status) return 'N/A';
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // ✅ Get current status index
  const getCurrentStatusIndex = () => {
    if (!project?.process_status) return -1;
    return statusOrder.indexOf(project.process_status);
  };

  const handleImageClick = (imageSrc) => {
    setFullscreenImage(imageSrc);
    setIsImageFullscreen(true);
  };

  const handleCloseImage = () => {
    setIsImageFullscreen(false);
    setFullscreenImage(null);
  };

  const formatFittingTime = (timeData) => {
    if (!timeData) return 'N/A';
    try {
      const times = typeof timeData === 'string' ? JSON.parse(timeData) : timeData;
      if (Array.isArray(times)) return times.join(', ');
      return timeData;
    } catch {
      return timeData;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const formatCurrency = (value) => {
    if (isNaN(value) || value == null) return '₱ 0.00';
    return `₱ ${new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}`;
  };

  const fetchProjectAndRelatedData = async () => {
    await withLoading(async () => {
      try {
        const projectResponse = await AxiosInstance.get(`design/user_designs/${projectId}/`);
        const projectData = projectResponse.data;
        setProject(projectData);

        // Always fetch user data
        if (projectData?.user) {
          const userResponse = await AxiosInstance.get(`auth/users/${projectData.user}/`);
          setUser(userResponse.data);
        }

        // Only fetch appointment if project has one linked
        if (projectData?.appointment) {
          setHasAppointment(true);
          const appointmentResponse = await AxiosInstance.get(
            `appointment/appointments/${projectData.appointment}/`
          );
          setAppointment(appointmentResponse.data);
        } else {
          setHasAppointment(false);
          setAppointment(null);
        }
      } catch (err) {
        console.error('❌ Failed to fetch project details:', err);
        setError('Failed to load project details.');
      }
    });
  };

  useEffect(() => {
    if (projectId) fetchProjectAndRelatedData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="project-details-container">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-details-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!project || !user) {
    return (
      <div className="project-details-container">
        <p className="no-project-message">No project found.</p>
      </div>
    );
  }

  const currentIndex = getCurrentStatusIndex();

  // Get display data with fallback to user data
  const displayImage = hasAppointment && appointment?.image ? appointment.image : noImage;
  const displayFirstName = hasAppointment && appointment?.first_name 
    ? appointment.first_name 
    : user?.first_name || 'N/A';
  const displayLastName = hasAppointment && appointment?.last_name 
    ? appointment.last_name 
    : user?.last_name || '';

  return (
    <div className="mainPage">

      {/* ✅ Header with Back Button */}
      <div className="updates-header">
        <div className="updates-header-left" onClick={() => navigate(-1)}>
          <div className="arrow-container">
            <img
              src={curlyArrowLogRes}
              alt="Back"
              className="arrow-back"
            />
          </div>
          <AppHeader headerTitle="Projects" />
        </div>
      </div>

      {/* ✅ Status Progress Tracker */}
      <div className="status-progress-container">
        <div className="progress-line-wrapper">
          <div className="progress-line-background"></div>
          <div 
            className="progress-line-fill" 
            style={{ 
              width: currentIndex >= 0 ? `${(currentIndex / (statusOrder.length - 1)) * 100}%` : '0%'
            }}
          ></div>
          
          {statusOrder.map((status, index) => (
            <div
              key={status}
              className={`progress-dot ${index <= currentIndex ? 'completed' : ''} ${index === currentIndex ? 'current' : ''}`}
              style={{ left: `${(index / (statusOrder.length - 1)) * 100}%` }}
            >
              <div className="progress-tooltip">{formatStatus(status)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="ProjectDetails">

        {/* Project Image */}
        <div className="image-container">
          <img
            src={displayImage}
            className="appointment-image"
            alt="Project"
            onClick={() => handleImageClick(displayImage)}
          />
        </div>

        {/* Project Info */}
        <div className="project-info-container">
          <div className="designing-information">
            <div className="info">
              <p className="label">Name:</p>
              <p className="info-text">{displayFirstName} {displayLastName}</p>
            </div>
            <div className="info">
              <p className="label">Attire Type:</p>
              <p className="info-text">{project?.attire_type || 'N/A'}</p>
            </div>
            <div className="info">
              <p className="label">Status:</p>
              <p className="info-text">{formatStatus(project?.process_status)}</p>
            </div>
            <div className="info">
              <p className="label">Target Date:</p>
              <p className="info-text">{formatDate(project?.targeted_date)}</p>
            </div>
          </div>

          <div className="dates">
            <div className="info">
              <p className="label">Date Created:</p>
              <p className="info-text">{formatDate(project?.created_at)}</p>
            </div>
            <div className="info">
              <p className="label">Last Update:</p>
              <p className="info-text">{formatDate(project?.updated_at)}</p>
            </div>
            <div className="info">
              <p className="label">Payment Status:</p>
              <p className="info-text">{paymentStatusLabels[project?.payment_status] || 'N/A'}</p>
            </div>
            <div className="info">
              <p className="label">Total Amount:</p>
              <p className="info-text total-amount">{formatCurrency(project?.total_amount)}</p>
            </div>
          </div>

          <div className="payment-details">
            <div className="info">
              <p className="label">Amount Paid:</p>
              <p className="info-text paid-text">{formatCurrency(project?.amount_paid)}</p>
            </div>
            <div className="info">
              <p className="label">Remaining Balance:</p>
              <p className="info-text balance-text">{formatCurrency(project?.balance)}</p>
            </div>
            <div className="info">
              <p className="label">Fitting Date:</p>
              <p className={`info-text ${project?.fitting_successful ? 'done-fitting' : ''}`}>
                {formatDate(project?.fitting_date)}
              </p>
            </div>
            <div className="info">
              <p className="label">Fitting Time:</p>
              <p className={`info-text ${project?.fitting_successful ? 'done-fitting' : ''}`}>
                {formatFittingTime(project?.fitting_time)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Updates */}
      <div className="listOfUpdates">
        <div className="ProjectUpdates">
          {project?.updates?.length ? (
            [...project.updates].reverse().map((update, index) => (
              <div className="update-container" key={index}>
                <div className="update-image">
                  <img
                    src={update.image ? `http://127.0.0.1:8000${update.image}` : noImage}
                    alt="Update"
                    className="update-img"
                    onClick={() => handleImageClick(update.image ? `http://127.0.0.1:8000${update.image}` : noImage)}
                  />
                </div>

                <div className="update-details-container">
                  <div className="update-date"><p>{formatDateTime(update.timestamp)}</p></div>
                  <div className="update-note"><p className="update-text">{update.message}</p></div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-updates">No project updates yet.</p>
          )}
        </div>
      </div>

      {/* Fullscreen Image Overlay */}
      {isImageFullscreen && ReactDOM.createPortal(
        <div className="image-fullscreen-overlay" onClick={handleCloseImage}>
          <img src={fullscreenImage} className="image-fullscreen" alt="Fullscreen" />
        </div>,
        document.body
      )}

    </div>
  );
}

export default ProjectDetails;