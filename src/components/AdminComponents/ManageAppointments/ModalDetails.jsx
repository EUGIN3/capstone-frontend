import React, {useState, useEffect} from 'react'

import ButtonElement from '../../forms/ButtonElement'


import StatusDropdown from './StatusDropDown'
import AxiosInstance from '../../AxiosInstance'

import './styles/ModalAppointment.css'

import dayjs from 'dayjs';

const ModalDetails = (props) => {
  const {firstName, lastName, date, time, description, facebookLink,
    phone_number, email, image, appointment_status, address, date_set,
    id, onUpdate, onClose, control} = props

  const [selectedStatus, setSelectedStatus] = useState(appointment_status || '');

  useEffect(() => {
    setSelectedStatus(appointment_status || '');
  }, [appointment_status]);

  const dropdownItems = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approve' },
    { value: 'denied', label: 'Denied' }
  ];

  const handleDropdownChange = (value) => {
    setSelectedStatus(value);
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
          type={'button'}
          onClick={() => onUpdate(id, selectedStatus)}
        />
      </div>
    </div>
  )
}

export default ModalDetails