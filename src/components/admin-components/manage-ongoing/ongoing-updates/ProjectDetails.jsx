import React, { useState, useEffect } from 'react';
import './ProjectDetails.css';
import AxiosInstance from '../../../API/AxiosInstance';
import noImage from '../../../../assets/no-image.jpg';

function ProjectDetails({ project }) {
  const [appointment, setAppointment] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧩 Define readable label maps
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

  const fetchAppointment = async () => {
    try {
      const response = await AxiosInstance.get(`appointment/appointments/`);

      if (project?.appointment) {
        const matchedAppointment = response.data.find(
          (item) => item.id === project.appointment
        );
        setAppointment(matchedAppointment);

        if (project?.user) {
          const userResponse = await AxiosInstance.get(`auth/users/${project.user}/`);
          setUser(userResponse.data);
        } else {
          console.warn('⚠️ No user ID found in project.');
        }
      } else {
        console.warn('⚠️ No appointment ID found in project.');
      }
    } catch (err) {
      console.error('❌ Failed to fetch appointment or user:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = dateStr ? new Date(dateStr) : new Date();
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
      fetchAppointment();
    }
  }, [project]);

  if (loading) {
    return (
      <div className="ProjectDetails loading">
        <p>Loading project details...</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="ProjectDetails">
        <p>No appointment details found.</p>
      </div>
    );
  }

  return (
    <div className="ProjectDetails">
      <div className="image-container">
        <img
          src={appointment.image ? appointment.image : noImage}
          className="appointment-image"
          alt="Appointment reference image."
        />
      </div>

      <div className="project-info-container">
        <div className="designing-information">
          <div className="info">
            <p className="label">Name:</p>
            <p className="info-text">
              {appointment.first_name} {appointment.last_name}
            </p>
          </div>

          <div className="info">
            <p className="label">Attire Type:</p>
            <p className="info-text">{project.attire_type}</p>
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
              <a href={user.facebook_link} target="_blank" rel="noopener noreferrer">
                profile
              </a>
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
            <p className="label">Last Updated:</p>
            <p className="info-text">{formatDate(project.updated_at)}</p>
          </div>

          <div className="info">
            <p className="label">Contact Number:</p>
            <p className="info-text">{user.phone_number}</p>
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
      </div>
    </div>
  );
}

export default ProjectDetails;
