import React, { useState, useEffect } from 'react'
import './ProjectDetails.css'
import AxiosInstance from '../../../API/AxiosInstance'

function ProjectDetails({ project }) {
  const [appointment, setAppointment] = useState(null)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)

const fetchAppointment = async () => {
  try {
    // 1️⃣ Fetch appointments
    const response = await AxiosInstance.get(`appointment/appointments/`);

    // 2️⃣ Find the appointment that matches the project
    if (project?.appointment) {
      const matchedAppointment = response.data.find(
        (item) => item.id === project.appointment
      );
      setAppointment(matchedAppointment);

      // 3️⃣ Fetch user details (based on project.user)
      if (project?.user) {
        const userResponse = await AxiosInstance.get(`auth/users/${project.user}/`);
        setUser(userResponse.data);
      } else {
        console.warn('⚠️ No user ID found in project.');
      }
    } else {
      console.warn('⚠️ No appointment ID found in project.');
    }
  } catch (err) {
    console.error('❌ Failed to fetch appointment or user:', err);
  } finally {
    setLoading(false);
  }
};



  const formatDate = (dateStr) => {
    // If no date is provided, use today's date
    const date = dateStr ? new Date(dateStr) : new Date();

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };



  useEffect(() => {
    if (project) {
      fetchAppointment()
    }
  }, [project])

  // ✅ Render a loader or nothing until data is ready
  if (loading) {
    return (
      <div className="ProjectDetails loading">
        <p>Loading project details...</p>
      </div>
    )
  }

  // ✅ If still no data (maybe not found)
  if (!appointment) {
    return (
      <div className="ProjectDetails">
        <p>No appointment details found.</p>
      </div>
    )
  }

  return (
    <div className='ProjectDetails'>
      {/* <p className="date-today">{formatDate()}</p> */}
      <div className="image-container">
        <img 
          src={appointment.image} 
          className='appointment-image'
          alt="Appointment reference image." 
        />
      </div>

      <div className="project-info-container">
        
        {/* ✅ Name, Attire Type, Date */}
        <div className='name-date info-container'>
          <div className="info">
            <p className="label">Name</p>
            <p className="info-text">{appointment.first_name} {appointment.last_name}</p>
          </div>

          <div className="info">
            <p className="label">Attire Type</p>
            <p className="info-text">{project.attire_type}</p>
          </div>

          <div className="info">
            <p className="label">Date Created</p>
            <p className="info-text">{formatDate(project.created_at)}</p>
          </div>
        </div>

        <div className="bottom-part-details">
          {/* ✅ Status and Target Date */}
          <div className='status-targeted-date-container info-container'>
            <div className="info">
              <p className="label">Status</p>
              <p className="info-text">{project.process_status}</p>
            </div>
            <div className="info">
              <p className="label">Target Date</p>
              <p className="info-text">{formatDate(project.targeted_date)}</p>
            </div>
          </div>

          {/* ✅ Payment Status and Amount */}
          <div className='details-payment-container info-container'>
            <div className="info">
              <p className="label">Payment Status</p>
              <p className="info-text">{project.payment_status}</p>
            </div>
            <div className="info">
              <p className="label">Amount Paid</p>
              <p className="info-text">₱ {project.amount_paid}</p>
            </div>
          </div>

          {/* ✅ Contact Info */}
          <div className='contact-container info-container'>
            <div className="info">
              <p className="label">Facebook</p>
              <p className="info-text">
                <a href={user.facebook_link} target='_blank' rel="noreferrer">
                  {user.facebook_link ? 'View Profile' : 'No link'}
                </a>
              </p>
            </div>
            <div className="info">
              <p className="label">Contact Number</p>
              <p className="info-text">{user.phone_number}</p>
            </div>
          </div>
        </div>
      </div>
    </div>


  )
}

export default ProjectDetails
