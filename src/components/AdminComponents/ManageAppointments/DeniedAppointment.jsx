  import React, {useState, useEffect} from 'react'
  import AdminAppointmentComponent from '../AdminAppointmentComponent'

  import AxiosInstance from '../../AxiosInstance';

  import './styles/AllAppointment.css'

  export const DeniedAppointment = () => {

    const [userAppointments, setUserAppointments] = useState([]);

    const listAppointments = () => {
      AxiosInstance.get(`appointments/`, {})
      .then((response) => {
        const reversedAppointments = response.data.reverse();
        setUserAppointments(reversedAppointments);
      }) 
    }
    useEffect(() => {
      listAppointments();
    }, []);

    const handleUpdate = (updatedAppointment) => {
      setUserAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === updatedAppointment.id ? updatedAppointment : appointment
        )
      );
    };

    const formatDate = (isoDateString) => {
      const date = new Date(isoDateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      });
    };

    const formatTime = (timeString) => {
      const date = new Date(`1970-01-01T${timeString}Z`); 
      
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };


    return (
      <div className='denied-appointment'>
        {
          userAppointments
            .filter(app => app.appointment_status == "denied")
            .map((app) => (
              <AdminAppointmentComponent
                key={app.id}
                id={app.id}
                first_name={app.first_name}
                last_name={app.last_name}
                description={app.description}
                facebookLink={app.facebook_link}
                phone_number={app.phone_number}
                appointment_status={app.appointment_status}
                address={app.address}
                date_set={formatDate(app.date_set)}
                email={app.email}
                date={formatDate(app.date)}
                time={app.time}
                onUpdate={handleUpdate}
              />
            ))
        }
      </div>
    )
  }
