import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './ModalAppointment.css';

import ButtonElement from '../../forms/button/ButtonElement';
import StatusDropdown from './StatusDropDown';
import AxiosInstance from '../../API/AxiosInstance';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import noImage from '../../../assets/no-image.jpg'

import { Tooltip } from '@mui/material';


const ModalDetails = (props) => {
  const {
    firstName, lastName, date, time, description, facebook_link,
    phone_number, email, image, appointment_status, address, created_at,
    id, onUpdate, onClose, control, updated_at
  } = props;

  const [selectedStatus, setSelectedStatus] = useState(appointment_status || '');
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  useEffect(() => {
    setSelectedStatus(appointment_status || '');
  }, [appointment_status]);

  const handleImageClick = () => setIsImageFullscreen(true);
  const handleCloseImage = () => setIsImageFullscreen(false);

  const dropdownItems = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approve' },
    { value: 'cancelled', label: 'Cancel' },
    { value: 'denied', label: 'Denied' }
  ];

  const handleDropdownChange = (value) => {
    setSelectedStatus(value);
  };

  const handleSave = async () => {
    try {
      const newStatus = selectedStatus;
      const oldStatus = appointment_status; // original status from props

      // Map display time -> Unavailability slot key (robust to whitespace)
      const slotMap = {
        '7:00 - 8:30 AM': 'slot_one',
        '8:30 - 10:00 AM': 'slot_two',
        '10:00 - 11:30 AM': 'slot_three',
        '1:00 - 2:30 PM': 'slot_four',
        '2:30 - 4:00 PM': 'slot_five',
      };

      // helper to find the slot key using normalization
      const findSlotKey = (timeStr) => {
        if (!timeStr) return null;
        const normalized = timeStr.toString().trim().replace(/\s+/g, ' ');
        for (const [label, key] of Object.entries(slotMap)) {
          if (label.replace(/\s+/g, ' ') === normalized) return key;
        }
        // fallback: try includes (looser match)
        for (const [label, key] of Object.entries(slotMap)) {
          if (normalized.includes(label.split(' ')[0])) return key;
        }
        return null;
      };

      const matchedSlotKey = findSlotKey(time);

      // 1) Update the appointment status on the server first
      const patchRes = await AxiosInstance.patch(`appointment/appointments/${id}/`, {
        appointment_status: newStatus,
      });
      console.log('Appointment status updated:', patchRes.data);

      // 2) If new status is 'approved' -> deny other same-slot appointments and mark slot unavailable
      if (newStatus === 'approved') {
        // Deny other appointments that share same date/time
        try {
          const allAppointmentsRes = await AxiosInstance.get('appointment/appointments/');
          const sameSlotAppointments = allAppointmentsRes.data.filter(app =>
            app.date === date && app.time === time && app.id !== id
          );

          await Promise.all(
            sameSlotAppointments.map(app =>
              AxiosInstance.patch(`appointment/appointments/${app.id}/`, {
                appointment_status: 'denied',
              })
            )
          );
          console.log(`Denied ${sameSlotAppointments.length} conflicting appointment(s).`);
        } catch (err) {
          console.error('Error denying conflicting appointments:', err);
        }

        // Mark slot unavailable in Unavailability
        if (matchedSlotKey) {
          try {
            // GET existing unavailability entry for this date (expect array)
            const availabilityRes = await AxiosInstance.get(`availability/display_unavailability/?date=${date}`);
            const existing = availabilityRes.data && availabilityRes.data[0] ? availabilityRes.data[0] : null;

            const updatedUnavailability = {
              ...existing,
              date,
              [matchedSlotKey]: true,
            };

            // Use POST if your backend upserts. If there's a PATCH endpoint for that record, prefer PATCH.
            await AxiosInstance.post('availability/set_unavailability/', updatedUnavailability);
            console.log(`Marked ${matchedSlotKey} = true for ${date}`);
          } catch (err) {
            console.error('Error marking slot unavailable:', err);
          }
        } else {
          console.warn('Could not match time to slot key:', time);
        }
      } else {
        // 3) If status changed from APPROVED -> to something else: free the slot, but only if no other approved appointment occupies it
        try {
          // Only do availability change if the appointment was previously approved
          if ((oldStatus || '').toLowerCase() === 'approved' && matchedSlotKey) {
            // Check if any other appointment is already approved for this date/time
            const allAppointmentsRes = await AxiosInstance.get('appointment/appointments/');
            const otherApproved = allAppointmentsRes.data.some(app =>
              app.id !== id &&
              app.appointment_status?.toLowerCase() === 'approved' &&
              app.date === date &&
              app.time === time
            );

            if (otherApproved) {
              console.log('Slot remains unavailable because another appointment is approved for the same slot.');
            } else {
              // No other approved appointment — set unavailability slot to false (available)
              const availabilityRes = await AxiosInstance.get(`availability/display_unavailability/?date=${date}`);
              const existing = availabilityRes.data && availabilityRes.data[0] ? availabilityRes.data[0] : null;

              const updatedUnavailability = {
                ...existing,
                date,
                [matchedSlotKey]: false,
              };

              await AxiosInstance.post('availability/set_unavailability/', updatedUnavailability);
              console.log(`Marked ${matchedSlotKey} = false for ${date}`);
            }
          } else {
            // If oldStatus wasn't approved, no need to change availability
            console.log('Old status was not approved; no availability changes required.');
          }
        } catch (err) {
          console.error('Error while reverting slot availability:', err);
        }
      }

      // 4) Refresh parent and close modal
      if (onUpdate) onUpdate();
      if (onClose) onClose();

      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update status. Please try again.');
    }
  };



  return (

    <div className="outerModal">
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
                src={image ? image : noImage }
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
              <p className="modalDetails-name">{firstName} {lastName}</p>
              <p className="modalDetails-address">{address}</p>
              <p className="modalDetails-email">{email}</p>
              <p className="modalDetails-fblink">
                <a href={facebook_link} target='_blank' rel="noreferrer">{facebook_link}</a>
              </p>
              <p className="modalDetails-number">{phone_number}</p>
            </div>


          </div>
        </div>

        <div className="modalDetailsBottom">
          <div className="modalDetails-description">
            <p className='description-title'>Description:</p>

            <p>{description}</p>
          </div>

          <div className="modalDetails-update-status">
            <StatusDropdown
              items={dropdownItems}
              onChange={handleDropdownChange}
              value={selectedStatus}
              dropDownLabel="Update Status"
              name="status"
              control={control}
            />
          </div>

          <div className="modalDetails-save-button">
            <ButtonElement
              label='Save'
              variant='filled-black'
              type='button'
              onClick={handleSave}
            />
          </div>

          {isImageFullscreen && (
            <div className="image-fullscreen-overlay" onClick={handleCloseImage}>
              <img
                src={image}
                alt="Full appointment"
                className="image-fullscreen"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDetails;
