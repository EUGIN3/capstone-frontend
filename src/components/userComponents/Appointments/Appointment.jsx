import React from 'react'

import '../../styles/Appointment.css'

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

function Appointment(props) {
  const { date, time, status } = props  

  return (
    <div className={`appointment-box ${status}`}>
        <div className="information-container">
            <div className="appointment-date">
              <p>{date}</p>
            </div>
            <div className="appointment-time">
              <p>{time}</p>
            </div>
        </div>

        <div className="appointment-button-container">
            <div className="edit-icon">
              <EditTwoToneIcon />
            </div>
            <div className="delete-icon">
              <DeleteTwoToneIcon />
            </div>
        </div>

        {
          status === 'cancelled' && <p className='status-text'>Cancelled</p> 
          ||
          status === 'denied' && <p className='status-text'>Denied</p>
          ||
          status === 'approved' && <p className='status-text'>Approved</p>
          ||
          status === 'pending' && <p className='status-text'>Pending</p>
        }
    </div>
  )
}

export default Appointment