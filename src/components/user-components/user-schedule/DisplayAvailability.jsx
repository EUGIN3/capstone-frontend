import './UserManageSchedule.css';
import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../API/AxiosInstance';
import dayjs from 'dayjs';
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

const SetUnavailability = ({ selectedDate, onClose }) => {
  const [slots, setSlots] = useState([
    { slot: false, reason: "Designer not available" },
    { slot: false, reason: "Designer not available" },
    { slot: false, reason: "Designer not available" },
    { slot: false, reason: "Designer not available" },
    { slot: false, reason: "Designer not available" },
  ]);

  const [loading, setLoading] = useState(true);

  const timeSlots = [
    '7:00 - 8:30 AM',
    '8:30 - 10:00 AM',
    '10:00 - 11:30 AM',
    '1:00 - 2:30 PM',
    '2:30 - 4:00 PM',
  ];

  // ------------------------- FETCH UNAVAILABILITY -------------------------
  const fetchUnavailability = async () => {
    try {
      const response = await AxiosInstance.get(
        `/availability/display_unavailability/`,
        { params: { date: selectedDate } }
      );

      if (response.data.length > 0) {
        const data = response.data[0];
        setSlots([
          { slot: data.slot_one, reason: data.reason_one },
          { slot: data.slot_two, reason: data.reason_two },
          { slot: data.slot_three, reason: data.reason_three },
          { slot: data.slot_four, reason: data.reason_four },
          { slot: data.slot_five, reason: data.reason_five },
        ]);
      } else {
        resetSlots();
      }
    } catch (error) {
      resetSlots();

      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error ||
                          'Failed to load schedule. Please try again.';

      toast.error(
        <div style={{ padding: '8px' }}>
          {errorMessage}
        </div>,
        {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const resetSlots = () => {
    setSlots([
      { slot: false, reason: "Designer not available" },
      { slot: false, reason: "Designer not available" },
      { slot: false, reason: "Designer not available" },
      { slot: false, reason: "Designer not available" },
      { slot: false, reason: "Designer not available" },
    ]);
  };

  useEffect(() => {
    fetchUnavailability();
  }, [selectedDate]);

  // Calculate if whole day is unavailable (for display only)
  const isWholeDayUnavailable = slots.filter(
    s => s.reason !== "Scheduled Appointment" && s.reason !== "Scheduled Fitting" && s.slot
  ).length === slots.filter(
    s => s.reason !== "Scheduled Appointment" && s.reason !== "Scheduled Fitting"
  ).length;

  if (loading) {
    return (
      <div className='setAppointmentAvailability' style={{ position: 'relative' }}>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='setAppointmentAvailability'>
        <p className='setAppointmentAvailability-header'>
          {dayjs(selectedDate).format('MMMM DD, YYYY')}
        </p>

        <hr />

        <hr />

        <div className="availability-container">
          {slots.map((item, index) => (
            <div key={index} className="slot-row">
              <div
                className={`slot-time ${
                  !item.slot
                    ? "available"
                    : item.reason === "Designer not available"
                      ? "unavailable"
                      : "fixed-reason"
                }`}
              >
                {timeSlots[index]}
              </div>

              <div className="slot-separator">:</div>

              <span
                className={`reason-text ${
                  !item.slot
                    ? "available"
                    : item.reason === "Designer not available"
                      ? "unavailable"
                      : "fixed-reason"
                }`}
              >
                {item.slot ? item.reason : "Available"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default SetUnavailability;