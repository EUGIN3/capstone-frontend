import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './ModalAppointment.css';

import ButtonElement from '../../forms/button/ButtonElement';
import StatusDropdown from './StatusDropDown';
import AxiosInstance from '../../API/AxiosInstance';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import noImage from '../../../assets/no-image.jpg'

import { Tooltip } from '@mui/material';
import useNotificationCreator from '../../notification/UseNotificationCreator';

const ModalDetails = (props) => {
  const {
    first_name, last_name, date, time, description, facebook_link,
    phone_number, email, image, appointment_status, address, created_at,
    id, onUpdate, onClose, control, user
  } = props;
  const { sendDefaultNotification } = useNotificationCreator();

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
    { value: 'denied', label: 'Denied' }
  ];

  const handleDropdownChange = (value) => {
    setSelectedStatus(value);
  };

  const handleSave = async () => {
    try {
      const newStatus = selectedStatus;
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
      const patchRes = await AxiosInstance.patch(`appointment/appointments/${id}/`, {
        appointment_status: newStatus,
      });

      // 2️⃣ Notifications
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

      // 3️⃣ If approved → deny conflicting + update availability with reason = Scheduled Appointment
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
            const existing = availabilityRes.data?.[0] || null;

            const updatedUnavailability = {
              ...existing,
              date,
              [matchedSlotKey]: true,
              [`reason_${matchedSlotKey.split('_')[1]}`]: "Scheduled Appointment"
            };

            await AxiosInstance.post('availability/set_unavailability/', updatedUnavailability);
          } catch (err) {
            console.error('Error marking slot unavailable:', err);
          }
        }
      } 
      else {
        // 4️⃣ If removing approval → free slot if no other approved appointment exists
        try {
          if ((oldStatus || '').toLowerCase() === 'approved' && matchedSlotKey) {
            const allAppointmentsRes = await AxiosInstance.get('appointment/appointments/');
            const otherApproved = allAppointmentsRes.data.some(app =>
              app.id !== id &&
              app.appointment_status?.toLowerCase() === 'approved' &&
              app.date === date &&
              app.time === time
            );

            if (!otherApproved) {
              const availabilityRes = await AxiosInstance.get(`availability/display_unavailability/?date=${date}`);
              const existing = availabilityRes.data?.[0] || null;

              const updatedUnavailability = {
                ...existing,
                date,
                [matchedSlotKey]: false,
                [`reason_${matchedSlotKey.split('_')[1]}`]: "available"
              };

              await AxiosInstance.post('availability/set_unavailability/', updatedUnavailability);
            }
          }
        } catch (err) {
          console.error('Error reverting slot availability:', err);
        }
      }

      // Refresh
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
              <p className="modalDetails-name">{first_name} {last_name}</p>
              <p className="modalDetails-address">{address}</p>
              <p className="modalDetails-fblink">
                <a href={facebook_link} target='_blank' rel="noreferrer">profile</a>
              </p>
              <p className="modalDetails-email">{email}</p>
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
