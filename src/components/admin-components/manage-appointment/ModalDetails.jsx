import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './ModalAppointment.css';

import ButtonElement from '../../forms/button/ButtonElement';
import StatusDropdown from './StatusDropdown';
import AxiosInstance from '../../API/AxiosInstance';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import noImage from '../../../assets/no-image.jpg';

import { Tooltip } from '@mui/material';
import useNotificationCreator from '../../notification/UseNotificationCreator';
import Confirmation from '../../forms/confirmation-modal/Confirmation';
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

const ModalDetails = (props) => {
  const {
    first_name, last_name, date, time, description, facebook_link,
    phone_number, email, image, appointment_status, address, created_at,
    id, onUpdate, onClose, control, user, attire
  } = props;
  const { sendDefaultNotification } = useNotificationCreator();

  const [selectedStatus, setSelectedStatus] = useState(appointment_status || '');
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  // ✅ Cache the image so it doesn't disappear when status updates
  const [cachedImage, setCachedImage] = useState(image);

  useEffect(() => {
    setSelectedStatus(appointment_status || '');
  }, [appointment_status]);

  // ✅ Update cached image when image prop changes and is not null
  useEffect(() => {
    if (image) {
      setCachedImage(image);
    }
  }, [image]);

  const handleImageClick = () => setIsImageFullscreen(true);
  const handleCloseImage = () => setIsImageFullscreen(false);

  const dropdownItems = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approve' },
    { value: 'denied', label: 'Denied' }
  ];

  const handleDropdownChange = (value) => {
    setSelectedStatus(value);
  };

  const getConfirmationConfig = (newStatus, oldStatus) => {
    if (newStatus === oldStatus) return null;

    if (newStatus === 'approved') {
      return {
        severity: 'warning',
        message: `Approve appointment for ${first_name} ${last_name} on ${dayjs(date).format('MMM DD')} at ${time}? This will block the time slot and deny other pending requests for the same slot.`
      };
    }

    if (newStatus === 'denied') {
      return {
        severity: 'alert',
        message: `Deny appointment for ${first_name} ${last_name}? They will be notified immediately.`
      };
    }

    if (newStatus === 'archived') {
      return {
        severity: 'warning',
        message: `Archive appointment for ${first_name} ${last_name}? This will hide it from the main list.`
      };
    }

    return null;
  };

  const handleSave = () => {
    if (saving) return;

    const config = getConfirmationConfig(selectedStatus, appointment_status);
    
    if (config) {
      setShowConfirm({ ...config, newStatus: selectedStatus });
    } else {
      doSave(selectedStatus);
    }
  };

  const doSave = async (newStatus) => {
    setSaving(true);

    try {
      const oldStatus = appointment_status;

      const slotMap = {
        '7:00 - 8:30 AM': 'slot_one',
        '8:30 - 10:00 AM': 'slot_two',
        '10:00 - 11:30 AM': 'slot_three',
        '1:00 - 2:30 PM': 'slot_four',
        '2:30 - 4:00 PM': 'slot_five',
      };

      const findSlotKey = (timeStr) => {
        if (!timeStr) return null;
        const normalized = timeStr.toString().trim().replace(/\s+/g, ' ');
        for (const [label, key] of Object.entries(slotMap)) {
          if (label.replace(/\s+/g, ' ') === normalized) return key;
        }
        for (const [label, key] of Object.entries(slotMap)) {
          if (normalized.includes(label.split(' ')[0])) return key;
        }
        return null;
      };

      const matchedSlotKey = findSlotKey(time);

      // 1️⃣ Update appointment status
      await AxiosInstance.patch(`appointment/appointments/${id}/`, {
        appointment_status: newStatus,
      });

      // 2️⃣ Send notifications (skip for 'archived')
      if (newStatus !== 'archived') {
        switch (newStatus) {
          case 'approved':
            await sendDefaultNotification('appointment_approved', user);
            break;
          case 'denied':
            await sendDefaultNotification('appointment_denied', user);
            break;
          case 'pending':
            await sendDefaultNotification('appointment_pending', user);
            break;
        }
      }

      // 3️⃣ If approved → deny conflicting + update availability
      if (newStatus === 'approved') {
        try {
          const allAppointmentsRes = await AxiosInstance.get('appointment/appointments/');
          const sameSlotAppointments = allAppointmentsRes.data.filter(app =>
            app.id !== id &&
            app.appointment_status === 'pending' &&
            app.date === date &&
            app.time === time
          );

          await Promise.all(
            sameSlotAppointments.map(async (app) => {
              await AxiosInstance.patch(`appointment/appointments/${app.id}/`, {
                appointment_status: 'denied',
              });
              await sendDefaultNotification('appointment_denied', app.user);
            })
          );
        } catch (err) {
          console.error('Error denying conflicting appointments:', err);
        }

        if (matchedSlotKey) {
          try {
            const availabilityRes = await AxiosInstance.get(`availability/display_unavailability/?date=${date}`);
            const existing = availabilityRes.data?.[0] || {};

            const updatedUnavailability = {
              date,
              slot_one: existing.slot_one || false,
              slot_two: existing.slot_two || false,
              slot_three: existing.slot_three || false,
              slot_four: existing.slot_four || false,
              slot_five: existing.slot_five || false,
              reason_one: existing.reason_one || "Available",
              reason_two: existing.reason_two || "Available",
              reason_three: existing.reason_three || "Available",
              reason_four: existing.reason_four || "Available",
              reason_five: existing.reason_five || "Available",
              [matchedSlotKey]: true,
              [`reason_${matchedSlotKey.split('_')[1]}`]: "Scheduled Appointment"
            };

            await AxiosInstance.post('availability/set_unavailability/', updatedUnavailability);
          } catch (err) {
            console.error('Error marking slot unavailable:', err);
          }
        }
      } 
      // 4️⃣ If reverting from approved → free slot if no other approved
      else if (oldStatus?.toLowerCase() === 'approved' && newStatus !== 'approved') {
        try {
          if (matchedSlotKey) {
            const allAppointmentsRes = await AxiosInstance.get('appointment/appointments/');
            const otherApproved = allAppointmentsRes.data.some(app =>
              app.id !== id &&
              app.appointment_status?.toLowerCase() === 'approved' &&
              app.date === date &&
              app.time === time
            );

            if (!otherApproved) {
              const availabilityRes = await AxiosInstance.get(`availability/display_unavailability/?date=${date}`);
              const existing = availabilityRes.data?.[0] || {};

              const updatedUnavailability = {
                date,
                slot_one: existing.slot_one || false,
                slot_two: existing.slot_two || false,
                slot_three: existing.slot_three || false,
                slot_four: existing.slot_four || false,
                slot_five: existing.slot_five || false,
                reason_one: existing.reason_one || "Available",
                reason_two: existing.reason_two || "Available",
                reason_three: existing.reason_three || "Available",
                reason_four: existing.reason_four || "Available",
                reason_five: existing.reason_five || "Available",
                [matchedSlotKey]: false,
                [`reason_${matchedSlotKey.split('_')[1]}`]: "Available"
              };

              await AxiosInstance.post('availability/set_unavailability/', updatedUnavailability);
            }
          }
        } catch (err) {
          console.error('Error reverting slot availability:', err);
        }
      }

      // ✅ Success notification
      const statusMessage = {
        'approved': 'Appointment approved successfully!',
        'denied': 'Appointment denied and client notified.',
        'archived': 'Appointment archived successfully.',
        'pending': 'Appointment status updated to pending.'
      };

      toast.success(
        <div style={{ padding: '8px' }}>
          {statusMessage[newStatus] || 'Appointment updated successfully!'}
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

      if (onUpdate) onUpdate();

      setTimeout(() => {
        if (onClose) onClose();
      }, 2200);

    } catch (error) {
      console.error('Error updating appointment:', error);
      setSaving(false);

      let errorMessage = 'Failed to update appointment. Please try again.';

      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 
                      error.response?.data?.error ||
                      'Invalid appointment data. Please check and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to modify this appointment.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Appointment not found. Please refresh and try again.';
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

  const handleConfirm = (confirmed) => {
    setShowConfirm(null);

    if (confirmed && showConfirm?.newStatus) {
      doSave(showConfirm.newStatus);
    }
  };

  const handleArchiveClick = () => {
    if (saving) return;
    const config = getConfirmationConfig('archived', appointment_status);
    if (config) {
      setShowConfirm({ ...config, newStatus: 'archived' });
    } else {
      doSave('archived');
    }
  };

  return (
    <>
      <div className="outerModal" style={{ position: 'relative' }}>

        {saving && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        <div className='modalDetails'>
          
          <Tooltip title='Close' arrow>
            <button className="close-modal" onClick={onClose}>
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

          <div className="title">
            Appointment Details 
          </div>

          <div className="modalDetailsTop">
            <div className="image-section">
              <div className="modalDetails-image">
                <img
                  src={
                    cachedImage
                      ? cachedImage
                      : (attire && attire.image1)
                        ? attire.image1
                        : noImage
                  }
                  alt="Appointment"
                  className="modalDetails-preview"
                  onClick={handleImageClick}
                />
              </div>
            </div>

            <div className="info-section">
              <div className="modalDetails-status">
                <div className="modalDetails-status-label">
                  <p className={appointment_status}>{appointment_status}</p>
                </div>

                <p className="modalDetails-date-set">
                  <span>created:</span>
                  {created_at ? dayjs(created_at).format('MMMM DD, YYYY') : 'No date set'}
                </p>
              </div>
              
              <div className="modalDetails-date-time">
                <p className="modalDetails-time">{time}</p>|
                <p className="modalDetails-date">{dayjs(date).format('MMMM DD, YYYY')}</p>
              </div>

              <div className="modalDetails-personal-info">
                <p className="modalDetails-name">{first_name} {last_name}</p>
                <p className="modalDetails-address">{address}</p>
                <p className="modalDetails-fblink">
                  <a href={facebook_link} target='_blank' rel="noreferrer">profile</a>
                </p>
                <p className="modalDetails-number">{phone_number}</p>
              </div>
            </div>
          </div>

          <div className="modalDetailsBottom">
            <div className="modalDetails-description">
              <p className='description-title'>Description:</p>
              <p className='description-content'>
                {
                  attire?.attire_name && (
                    <span>I want the <strong>{attire.attire_name}</strong>.</span>
                  )
                }
                {description}
              </p>
            </div>

            <div className="modalDetails-update-status">
              {appointment_status.toLowerCase() === 'denied' ? (
                <ButtonElement
                  label="Archive"
                  variant="filled-black"
                  type="button"
                  onClick={handleArchiveClick}
                  disabled={saving}
                />
              ) : (
                <StatusDropdown
                  items={dropdownItems}
                  onChange={handleDropdownChange}
                  value={selectedStatus}
                  dropDownLabel="Update Status"
                  name="status"
                  control={control}
                />
              )}
            </div>

            <div className="modalDetails-save-button">
              <ButtonElement
                label='Save'
                variant='filled-black'
                type='button'
                onClick={handleSave}
                disabled={saving}
              />
            </div>

            {isImageFullscreen && (
              <div className="image-fullscreen-overlay" onClick={handleCloseImage}>
                <img
                  src={
                    cachedImage
                      ? cachedImage
                      : (attire && attire.image1)
                        ? attire.image1
                        : noImage
                  }
                  alt="Full appointment"
                  className="image-fullscreen"
                />
              </div>
            )}

            {showConfirm && (
              <Confirmation
                message={showConfirm.message}
                severity={showConfirm.severity}
                onConfirm={handleConfirm}
                isOpen={true}
              />
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default ModalDetails;