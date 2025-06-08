import './styles/ModalAppointment.css';

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
// Components
import ButtonElement from '../../forms/button/ButtonElement';
import StatusDropdown from './StatusDropDown';
import AxiosInstance from '../../API/AxiosInstance';

const ModalDetails = (props) => {
  const {
    firstName, lastName, date, time, description, facebookLink,
    phone_number, email, image, appointment_status, address, date_set,
    id, onUpdate, onClose, control
  } = props;

  const [selectedStatus, setSelectedStatus] = useState(appointment_status || '');
  const [originalStatus, setOriginalStatus] = useState(appointment_status || '');

  useEffect(() => {
    setSelectedStatus(appointment_status || '');
    setOriginalStatus(appointment_status || '');
  }, [appointment_status]);

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
      // Update current appointment
      await onUpdate(id, selectedStatus);

      const isNowApproved = selectedStatus === 'approved';

      // Fetch all appointments with same date and time (excluding current one)
      const allAppointmentsRes = await AxiosInstance.get('appointment/appointments/');
      const sameSlotAppointments = allAppointmentsRes.data.filter(app =>
        app.date === date && app.time === time && app.id !== id
      );

      // If approving, deny all other same-slot appointments
      if (isNowApproved) {
        await Promise.all(sameSlotAppointments.map(app =>
          AxiosInstance.patch(`appointment/appointments/${app.id}/`, {
            appointment_status: 'denied'
          })
        ));

        // Map time to slot key
        const slotMap = {
          '7:00 - 8:30 AM': 'slot_one',
          '8:30 - 10:00 AM': 'slot_two',
          '10:00 - 11:30 AM': 'slot_three',
          '1:00 - 2:30 PM': 'slot_four',
          '2:30 - 4:00 PM': 'slot_five',
        };

        const matchedSlotKey = slotMap[time];
        if (matchedSlotKey) {
          // Check if the unavailability entry already exists
          const availabilityRes = await AxiosInstance.get(`availability/display_unavailability/?date=${date}`);
          let slotData = availabilityRes.data[0] || {};

          // Mark that slot as unavailable
          const updatedUnavailability = {
            ...slotData,
            date,
            [matchedSlotKey]: true
          };

          // Submit the unavailability update
          await AxiosInstance.post('availability/set_unavailability/', updatedUnavailability);
        } else {
          console.warn('Time slot not matched for availability update.');
        }
      }

      // Update local status tracker
      setOriginalStatus(selectedStatus);
    } catch (error) {
      console.error('Error updating appointment or denying others:', error);
    }
  };


  return (
    <div className='modalDetails'>
      <div className="modalDetails-header">
        <p>APPOINTMENT DETAILS</p>
      </div>

      <hr />

      <div className="modalDetails-status">
        <div className="modalDetails-status-label">
          <p className={appointment_status}>{appointment_status}</p>
        </div>

        <p className="modalDetails-date-set">
          {dayjs(date_set).format('MMMM DD, YYYY')}
        </p>
      </div>

      <hr />

      <div className="modalDetails-personal-info">
        <p className="modalDetails-name">{firstName} {lastName}</p>
        <p className="modalDetails-address">{address}</p>
        <p className="modalDetails-email">{email}</p>
        <p className="modalDetails-fblink">{facebookLink}</p>
        <p className="modalDetails-number">{phone_number}</p>
      </div>

      <hr />

      <div className="modalDetails-date-time">
        <p className="modalDetails-date">{dayjs(date).format('MMMM DD, YYYY')}</p>
        <p className="modalDetails-time">{time}</p>
      </div>

      <hr />

      <div className="modalDetails-description">
        <p className="modalDetails-description">{description}</p>
      </div>

      <hr />

      <div className="modalDetails-update-status">
        <div className="modalDetails-update-status-dropdown">
          <StatusDropdown
            items={dropdownItems}
            onChange={handleDropdownChange}
            value={selectedStatus}
            dropDownLabel="Update Status"
            name="status"
            control={control}
          />
        </div>
      </div>

      <hr />

      <div className="modalDetails-save-button">
        <ButtonElement
          label='Save Changes'
          variant='filled-green'
          type='button'
          onClick={handleSave}
        />
      </div>
    </div>
  );
};

export default ModalDetails;
