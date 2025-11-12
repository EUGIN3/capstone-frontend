import React from 'react'
import './Appointment.css'

function FittingAppointment({fitting_date, fitting_time}) {


  const formatDateNotime = (dateStr) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatFittingTime = (timeData) => {
    if (!timeData) return 'N/A';

    try {
      // Convert JSON string to array if needed
      const times = typeof timeData === 'string' ? JSON.parse(timeData) : timeData;

      // Ensure it’s an array and join with commas
      if (Array.isArray(times)) {
        return times.join(', ');
      }
      return timeData;
    } catch {
      // If parsing fails, return the raw value
      return timeData;
    }
  };

  return (
    <div className={`appointment-box fitting`}>
      <div className="information-container">
        <div className="appointment-date">
          <p>{formatDateNotime(fitting_date)}</p>
        </div>
        <div className="appointment-time">
          <p>{formatFittingTime(fitting_time)}</p>
        </div>
      </div>
      <p className='status-text'>Fitting</p>
    </div>
  )
}

export default FittingAppointment