import React, { useState, useEffect } from 'react';

import ButtonElement from '../../forms/ButtonElement';
import StatusDropdown from './StatusDropDown';
import AxiosInstance from '../../AxiosInstance';

import './styles/ModalAppointment.css';
import dayjs from 'dayjs';

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
      await onUpdate(id, selectedStatus);

      const slotMap = {
        '7:00 - 8:30 AM': 'slot_one',
        '8:30 - 10:00 AM': 'slot_two',
        '10:00 - 11:30 AM': 'slot_three',
        '1:00 - 2:30 PM': 'slot_four',
        '2:30 - 4:00 PM': 'slot_five'
      };

      const matchedSlotKey = slotMap[time];
      if (!matchedSlotKey) {
        console.warn('Time slot not matched.');
        return;
      }

      const response = await AxiosInstance.get(`unavailability/?date=${date}`);
      let slotData = response.data[0] || {}; // Use first matching or empty object

      const updatedUnavailability = { ...slotData, date };
      const wasApproved = originalStatus === 'approved';
      const isNowApproved = selectedStatus === 'approved';

      if (isNowApproved) {
        // Case: mark slot as taken
        updatedUnavailability[matchedSlotKey] = true;
      } else if (wasApproved && !isNowApproved) {
        // Case: previously approved, now changed → check for remaining approved
        const approvedRes = await AxiosInstance.get('appointments/');
        const remainingApproved = approvedRes.data.filter(app =>
          app.date === date &&
          app.time === time &&
          app.appointment_status === 'approved'
        );

        if (remainingApproved.length <= 1) {
          updatedUnavailability[matchedSlotKey] = false;
        }
      }

      await AxiosInstance.post('unavailability/', updatedUnavailability);

      // Update original status for future edits
      setOriginalStatus(selectedStatus);
    } catch (error) {
      console.error('Error updating appointment or unavailability:', error);
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
