import React from 'react'
import '../styles/AdminAppointmentComponent.css'

import ButtonElement from '../forms/ButtonElement'
import AxiosInstance from '../AxiosInstance'

function AdminAppointmentComponent(props) {
    const {first_name, last_name, email, date, time, id, onUpdate} = props


    const handleApproval = (action) => {
        AxiosInstance.patch(`appointments/${id}/`,{
            appointment_status: action,
        })
        .then((response) => {
            if (onUpdate) onUpdate(response.data); 
        })
    }

    return (
        <div className='adminAppointment'>  
            <p>{first_name}</p>
            <p>{last_name}</p>
            <p>{email}</p>
            <p>{date}</p>
            <p>{time}</p>

            <ButtonElement
                label='Approve'
                variant='filled-green'
                type={'button'}
                onClick={() => handleApproval('approve')}
            />

            <ButtonElement
                label='Denied'
                variant='filled-red'
                type={'button'}
                onClick={() => handleApproval('denied')}
            />

            <ButtonElement
                label='Pending'
                variant='filled-black'
                type={'button'}
                onClick={() => handleApproval('pending')}
            />
        </div>
    )
}

export default AdminAppointmentComponent