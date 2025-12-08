import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ProjectDetails.css';
import AxiosInstance from '../../../API/AxiosInstance';
import noImage from '../../../../assets/no-image.jpg';

function ProjectDetails({ project: projectProp }) {
  const location = useLocation();
  const { project: passedProject, prefetched } = location.state || {};
  const project = projectProp || passedProject;

  const [appointment, setAppointment] = useState(prefetched?.appointment || null);
  const [user, setUser] = useState(prefetched?.user || null);
  const [loading, setLoading] = useState(!prefetched);
  const [hasAppointment, setHasAppointment] = useState(false);

  // Loading wrapper function
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const withLoading = async (cb) => {
    try {
      setLoading(true);
      await delay(400); // visible delay
      await cb();
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Define readable label maps
  const processStatusLabels = {
    concept: 'Concept',
    sketching: 'Sketching',
    designing: 'Designing',
    material_selection: 'Material Selection',
    pattern_making: 'Pattern Making',
    cutting: 'Cutting',
    sewing: 'Sewing',
    materializing: 'Materializing',
    fitting: 'Fitting',
    alterations: 'Alterations',
    final_fitting: 'Final Fitting',
    ready: 'Ready',
    picked_up: 'Picked Up',
    done: 'Done',
  };

  const paymentStatusLabels = {
    no_payment: 'No Payment',
    partial_payment: 'Partial Payment',
    fully_paid: 'Fully Paid',
  };

  // 🕒 Format fitting times like "7:00 - 8:30 AM, 8:30 - 10:00 AM"
  const formatFittingTime = (timeData) => {
    if (!timeData) return 'N/A';

    try {
      // Convert JSON string to array if needed
      const times = typeof timeData === 'string' ? JSON.parse(timeData) : timeData;

      // Ensure it's an array and join with commas
      if (Array.isArray(times)) {
        return times.join(', ');
      }
      return timeData;
    } catch {
      // If parsing fails, return the raw value
      return timeData;
    }
  };

  const fetchProjectData = async () => {
    // Only fetch if not already prefetched
    if (prefetched && prefetched.user) {
      setLoading(false);
      return;
    }

    await withLoading(async () => {
      try {
        // Always fetch user data
        if (project?.user) {
          const userResponse = await AxiosInstance.get(`auth/users/${project.user}/`);
          setUser(userResponse.data);
        }

        // Only fetch appointment if project has appointment linked
        if (project?.appointment) {
          setHasAppointment(true);
          const appointmentResponse = await AxiosInstance.get(
            `appointment/appointments/${project.appointment}/`
          );
          setAppointment(appointmentResponse.data);
        } else {
          setHasAppointment(false);
          setAppointment(null);
        }
      } catch (err) {
        console.error('❌ Failed to fetch project data:', err);
      }
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // ✅ Currency formatter (₱ 10,000.00)
  const formatCurrency = (value) => {
    if (isNaN(value)) return '₱ 0.00';
    return `₱ ${new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}`;
  };

  useEffect(() => {
    if (project) {
      fetchProjectData();
    }
  }, [project]);

  // Show loading spinner
  if (loading) {
    return (
      <div className="ProjectDetails">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Show error if no user data
  if (!user) {
    return (
      <div className="ProjectDetails">
        <p>No user details found for this project.</p>
      </div>
    );
  }

  // Get the display image - from appointment if available, otherwise use placeholder
  const displayImage = hasAppointment && appointment?.image ? appointment.image : noImage;

  // Get the display name - from appointment if available, otherwise from user
  const displayFirstName = hasAppointment && appointment?.first_name 
    ? appointment.first_name 
    : user?.first_name || 'N/A';
  const displayLastName = hasAppointment && appointment?.last_name 
    ? appointment.last_name 
    : user?.last_name || '';

  return (
    <div className="ProjectDetails">
      <div className="image-container">
        <img
          src={displayImage}
          className="appointment-image"
          alt="Project reference image."
        />
      </div>

      <div className="project-info-container">
        <div className="designing-information">
          <div className="info">
            <p className="label">Name:</p>
            <p className="info-text">
              {displayFirstName} {displayLastName}
            </p>
          </div>

          <div className="info">
            <p className="label">Attire Type:</p>
            <p className="info-text">{project.attire_type || 'N/A'}</p>
          </div>

          <div className="info">
            <p className="label">Status:</p>
            <p className="info-text">
              {processStatusLabels[project.process_status] || project.process_status}
            </p>
          </div>

          <div className="info">
            <p className="label">Facebook:</p>
            <p className="info-text">
              {user.facebook_link ? (
                <a href={user.facebook_link} target="_blank" rel="noopener noreferrer">
                  profile
                </a>
              ) : (
                'N/A'
              )}
            </p>
          </div>
        </div>

        <div className="dates">
          <div className="info">
            <p className="label">Target Date:</p>
            <p className="info-text">{formatDate(project.targeted_date)}</p>
          </div>

          <div className="info">
            <p className="label">Date Created:</p>
            <p className="info-text">{formatDate(project.created_at)}</p>
          </div>

          <div className="info">
            <p className="label">Last Update:</p>
            <p className="info-text">{formatDate(project.updated_at)}</p>
          </div>

          <div className="info">
            <p className="label">Contact Number:</p>
            <p className="info-text">{user.phone_number || 'N/A'}</p>
          </div>
        </div>

        <div className="payment-details">
          <div className="info">
            <p className="label">Payment Status:</p>
            <p className="info-text">
              {paymentStatusLabels[project.payment_status] || project.payment_status}
            </p>
          </div>

          <div className="info">
            <p className="label">Total Amount:</p>
            <p className="info-text total-amount">{formatCurrency(project.total_amount)}</p>
          </div>

          <div className="info">
            <p className="label">Amount Paid:</p>
            <p className="info-text paid-text">{formatCurrency(project.amount_paid)}</p>
          </div>

          <div className="info">
            <p className="label">Remaining Balance:</p>
            <p className="info-text balance-text">{formatCurrency(project.balance)}</p>
          </div>
        </div>

        <div className="payment-details fitting-details">
          <div className="info">
            <p className="label">Fitting Date:</p>
            <p className={`info-text ${project.fitting_successful ? 'done-fitting' : ''}`}>
              {formatDate(project.fitting_date)}
            </p>
          </div>

          <div className="info">
            <p className="label">Fitting Time:</p>
            <p className={`info-text ${project.fitting_successful ? 'done-fitting' : ''}`}>
              {formatFittingTime(project.fitting_time)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;