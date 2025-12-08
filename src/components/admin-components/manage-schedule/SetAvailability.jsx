import './ManageSchedule.css';
import React, { useState, useEffect } from 'react';
import ButtonElement from '../../forms/button/ButtonElement';
import AxiosInstance from '../../API/AxiosInstance';
import dayjs from 'dayjs';
import Confirmation from '../../forms/confirmation-modal/Confirmation'
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Tooltip } from '@mui/material';

const SetUnavailability = ({ selectedDate, onClose }) => {
  const [slots, setSlots] = useState([
    { slot: false, reason: "Designer not available" },
    { slot: false, reason: "Designer not available" },
    { slot: false, reason: "Designer not available" },
    { slot: false, reason: "Designer not available" },
    { slot: false, reason: "Designer not available" },
  ]);

  const [wholeDay, setWholeDay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);

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

  useEffect(() => {
    const unavailableCount = slots.filter(
      s => s.reason !== "Scheduled Appointment" && s.reason !== "Scheduled Fitting" && s.slot
    ).length;
    const totalCount = slots.filter(
      s => s.reason !== "Scheduled Appointment" && s.reason !== "Scheduled Fitting"
    ).length;
    setWholeDay(unavailableCount === totalCount && totalCount > 0);
  }, [slots]);

  const toggleSlot = (index) => {
    const newSlots = [...slots];
    const current = newSlots[index];
    if (current.reason !== "Scheduled Appointment" && current.reason !== "Scheduled Fitting") {
      current.slot = !current.slot;
      current.reason = current.slot ? "Designer not available" : "Available";
      setSlots(newSlots);
    }
  };

  const toggleWholeDay = () => {
    const newVal = !wholeDay;
    setSlots(
      slots.map((s) => {
        if (s.reason !== "Scheduled Appointment" && s.reason !== "Scheduled Fitting") {
          return {
            ...s,
            slot: newVal,
            reason: newVal ? "Designer not available" : "Available",
          };
        }
        return s;
      })
    );
    setWholeDay(newVal);
  };

  const getConfirmationConfig = () => {
    const designerUnavailableSlots = slots.filter(
      s => s.slot && s.reason === "Designer not available"
    ).length;
    
    const totalManageableSlots = slots.filter(
      s => s.reason !== "Scheduled Appointment" && s.reason !== "Scheduled Fitting"
    ).length;
    
    const availableSlots = totalManageableSlots - designerUnavailableSlots;

    if (designerUnavailableSlots > 0) {
      if (designerUnavailableSlots === 5) {
        return {
          needed: true,
          severity: 'alert',
          message: `You're marking the entire day (${dayjs(selectedDate).format('MMM DD')}) as unavailable. Are you sure?`
        };
      } else {
        return {
          needed: true,
          severity: 'warning',
          message: `You're marking ${designerUnavailableSlots} time slot(s) as unavailable. Proceed?`
        };
      }
    } else if (availableSlots > 0) {
      return {
        needed: true,
        severity: 'normal',
        message: `All time slots are available. Save changes?`
      };
    }

    return { needed: false };
  };

  const handleSave = () => {
    const config = getConfirmationConfig();
    if (config.needed) {
      setShowConfirm(config);
    } else {
      doSave();
    }
  };

  const doSave = async () => {
    setSaving(true);

    const payload = {
      date: selectedDate,
      slot_one: slots[0].slot,
      reason_one: slots[0].slot ? slots[0].reason : "Available",
      slot_two: slots[1].slot,
      reason_two: slots[1].slot ? slots[1].reason : "Available",
      slot_three: slots[2].slot,
      reason_three: slots[2].slot ? slots[2].reason : "Available",
      slot_four: slots[3].slot,
      reason_four: slots[3].slot ? slots[3].reason : "Available",
      slot_five: slots[4].slot,
      reason_five: slots[4].slot ? slots[4].reason : "Available",
    };

    try {
      await AxiosInstance.post(`/availability/set_unavailability/`, payload);
      
      toast.success(
        <div style={{ padding: '8px' }}>
          Schedule saved successfully!
        </div>,
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );

      setTimeout(() => {
        window.location.reload();
      }, 2200);
      
    } catch (error) {
      setSaving(false);
      let errorMessage = 'Failed to save schedule. Please try again.';

      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 
                      error.response?.data?.error ||
                      'Invalid schedule data. Please check your changes and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to modify this schedule.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Schedule not found. Please try again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      }

      toast.error(
        <div style={{ padding: '8px' }}>
          {errorMessage}
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
    }
  };

  const handleConfirm = (confirmed) => {
    setShowConfirm(null);
    if (confirmed) {
      doSave();
    }
  };

  if (loading) {
    return (
      <div className='setAppointmentAvailability-outer' style={{ position: 'relative' }}>
        <div className='setAppointmentAvailability'>
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='setAppointmentAvailability-outer'>
          <Tooltip title="Close" arrow>
            <button className="close-modal-set" onClick={onClose} disabled={saving}>
              <CloseRoundedIcon
                sx={{
                  color: '#f5f5f5',
                  fontSize: 28,
                  padding: '2px',
                  backgroundColor: '#0c0c0c',
                  borderRadius: '50%',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.5 : 1,
                }}
              />
            </button>
          </Tooltip>

        <div className='setAppointmentAvailability'>

          
          {/* Loading Overlay */}
          {saving && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}

          <p className='setAppointmentAvailability-header'>
            {dayjs(selectedDate).format('MMMM DD, YYYY')}
          </p>

          <hr />

          <div className="wholeDaySwitch">
            <span
              className={`reason-text ${wholeDay ? 'unavailable' : 'available'}`}
              style={{ cursor: "pointer" }}
              onClick={toggleWholeDay}
            >
              {wholeDay ? "Unavailable" : "Available"}
            </span>
          </div>

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
                  onClick={() => toggleSlot(index)}
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
                  onClick={() => toggleSlot(index)}
                >
                  {item.slot ? item.reason : "Available"}
                </span>
              </div>
            ))}
          </div>

          <ButtonElement
            label='SAVE SCHEDULE'
            variant='filled-black'
            type='button'
            onClick={handleSave}
            disabled={saving}
          />

          {showConfirm && (
            <Confirmation
              message={showConfirm.message}
              severity={showConfirm.severity}
              onConfirm={handleConfirm}
              isOpen={true}
            />
          )}
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default SetUnavailability;