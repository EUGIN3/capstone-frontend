import React, {useState} from 'react'
import '../styles/AdminAppointmentComponent.css'

import Dialog from '@mui/material/Dialog';

import ButtonElement from '../forms/ButtonElement'
import AxiosInstance from '../AxiosInstance'
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';

import ModalDetails from './ManageAppointments/ModalDetails';

function AdminAppointmentComponent(props) {

    const {
        first_name, 
        last_name, 
        date, 
        time, 
        description,
        facebookLink,
        phone_number,
        email,
        image,
        appointment_status,
        address,
        date_set,
        id, 
        onUpdate,
        control
    } = props

    const [open, setOpen] = useState(false);
      
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdate = (updatedAppointment) => {
        if (onUpdate) onUpdate(updatedAppointment)
    };

    return (
        <div className='adminAppointment'>

            <Dialog open={open} onClose={handleClose}>
              <ModalDetails
                id={id}
                firstName={first_name}
                lastName={last_name}
                date={date}
                time={time}
                description={description}
                facebookLink={facebookLink}
                phone_number={phone_number}
                email={email}
                image={image}
                appointment_status={appointment_status}
                address={address}
                date_set={date_set}
                onUpdate={handleUpdate}
                onClose={handleClose}
                control={control}
              />
            </Dialog>
            <div className="adminAppointment-details">
                <div className="adminAppointment-name">
                    <p>{first_name}</p>
                    <p>{last_name}</p>
                </div>
                {/* <p>{email}</p> */}
                <div className="adminAppointment-date">
                    <p>{date}</p>
                </div>  
                <div className="adminAppointment-time">
                    <p>{time}</p>
                </div>  
            </div>


            <div className="adminAppointment-buttons">
                <ButtonElement
                    label='Details'
                    variant='filled-blue'
                    type={'button'}
                    onClick={handleClickOpen}
                />
            </div>
        </div>
    )
}

export default AdminAppointmentComponent