import './ManageSchedule.css';
import React, { useState, useEffect } from 'react';
import ButtonElement from '../../forms/button/ButtonElement';
import AxiosInstance from '../../API/AxiosInstance';
import dayjs from 'dayjs';
import Confirmation from '../../forms/confirmation-modal/Confirmation'

const SetUnavailability = ({ selectedDate, onClose }) => {
  const [slots, setSlots] = useState([
    { slot: false, reason: "Designer not available" },
    { slot: false, reason: "Designer not available" },
    { slot: false, reason: "Designer not available" },
    { slot: false, reason: "Designer not available" },
    { slot: false, reason: "Designer not available" },
  ]);

  const [wholeDay, setWholeDay] = useState(false);
  const [loading, setLoading] = useState(true); // for initial fetch
  const [saving, setSaving] = useState(false);  // ✅ for save action
  const [showConfirm, setShowConfirm] = useState(false);

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
      console.error("Error fetching schedule:", error);
      resetSlots();
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
    const unavailableSlots = slots.filter(
      s => s.slot && s.reason === "Designer not available"
    ).length;

    if (unavailableSlots === 0) {
      return { needed: false };
    } else if (unavailableSlots === 5) {
      return {
        needed: true,
        severity: 'alert',
        message: `You're marking the entire day (${dayjs(selectedDate).format('MMM DD')}) as unavailable. Are you sure?`
      };
    } else {
      return {
        needed: true,
        severity: 'warning',
        message: `You're marking ${unavailableSlots} time slot(s) as unavailable. Proceed?`
      };
    }
  };

  // ✅ New: Save with loading spinner (copied from BigCalendar)
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
      
      // ✅ Refresh the whole page after success
      window.location.reload(); // ⚠️ This will reload the entire page
      
      // Note: onClose() is no longer needed because page reloads
      // So you can remove or keep it — it won’t execute after reload.
      
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = (confirmed) => {
    setShowConfirm(null);
    if (confirmed) {
      doSave();
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className='setAppointmentAvailability' style={{ position: 'relative' }}>
      
      {/* ✅ Loading Overlay — copied exactly from BigCalendar */}
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
      />

      {showConfirm && (
        <Confirmation
          message={showConfirm.message}
          severity={showConfirm.severity}
          onConfirm={handleConfirm}
          isOpen={!!showConfirm}
        />
      )}
    </div>
  );
};

export default SetUnavailability;