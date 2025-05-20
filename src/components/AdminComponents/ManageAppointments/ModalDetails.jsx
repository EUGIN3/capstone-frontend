import React, {useState, useEffect} from 'react'

import ButtonElement from '../../forms/ButtonElement'


import DropdownConponent from '../../forms/DropDown'
import AxiosInstance from '../../AxiosInstance'

import './styles/ModalAppointment.css'

const ModalDetails = (props) => {
  const {firstName, lastName, date, time, description, facebookLink,
    phone_number, email, image, appointment_status, address, date_set,
    id, onUpdate, onClose} = props

  const [selectedStatus, setSelectedStatus] = useState('');

  const dropdownItems = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approve' },
    { value: 'denied', label: 'Denied' }
  ];

  const handleDropdownChange = (value) => {
    setSelectedStatus(value);
  };

  const handleApproval = (action) => {
    AxiosInstance.patch(`appointments/${id}/`, {
      appointment_status: action,
    })
    .then((response) => {
      if (onClose) onClose();       // Close modal first
      if (onUpdate) onUpdate(response.data); // Then notify parent
    });
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
          {date_set}
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
        <p className="modalDetails-date">{date}</p>
        <p className="modalDetails-time">{time}</p>
      </div> 

      <hr />

      <div className="modalDetails-description">
        <p className="modalDetails-description">{description}</p>
      </div> 

      <hr />

      <div className="modalDetails-update-status">
        <div className="modalDetails-update-status-dropdown">
          <DropdownConponent 
            items={dropdownItems} onChange={handleDropdownChange} dropDownLabel={'Update Status'}
          />
        </div>
      </div>

      <hr />

      <div className="modalDetails-save-button">
        <ButtonElement
          label='Save Changes'
          variant='filled-green'
          type={'button'}
          onClick={() => handleApproval(selectedStatus)}
        />
      </div>
    </div>
  )
}

export default ModalDetails