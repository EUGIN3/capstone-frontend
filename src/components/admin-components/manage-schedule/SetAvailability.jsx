import './ManageSchedule.css';
import React, { useState, useEffect } from 'react';
import ButtonElement from '../../forms/button/ButtonElement';
import AxiosInstance from '../../API/AxiosInstance';
import dayjs from 'dayjs';

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
        setSlots([
          { slot: false, reason: "Designer not available" },
          { slot: false, reason: "Designer not available" },
          { slot: false, reason: "Designer not available" },
          { slot: false, reason: "Designer not available" },
          { slot: false, reason: "Designer not available" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnavailability();
  }, [selectedDate]);

  // ------------------------- CALCULATE WHOLE DAY BASED ON SLOT STATUS -------------------------
  useEffect(() => {
    const availableCount = slots.filter(
      s => s.reason !== "Scheduled Appointment" && s.reason !== "Scheduled Fitting" && !s.slot
    ).length;

    const unavailableCount = slots.filter(
      s => s.reason !== "Scheduled Appointment" && s.reason !== "Scheduled Fitting" && s.slot
    ).length;

    // Majority decides the wholeDay status
    if (availableCount > unavailableCount) setWholeDay(false); // more available → whole day available
    else if (unavailableCount > availableCount) setWholeDay(true); // more unavailable → whole day unavailable
    else setWholeDay(false); // tie → available
  }, [slots]);

  // ------------------------- TOGGLE SLOT -------------------------
  const toggleSlot = (index) => {
    const newSlots = [...slots];
    const current = newSlots[index];

    // Only toggle free slots
    if (current.reason !== "Scheduled Appointment" && current.reason !== "Scheduled Fitting") {
      current.slot = !current.slot;
      current.reason = current.slot ? "Designer not available" : "Available";
      setSlots(newSlots);
    }
  };

  // ------------------------- WHOLE DAY TOGGLE -------------------------
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

  // ------------------------- SAVE SCHEDULE -------------------------
  const handleSave = async () => {
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
      alert("Saved successfully");
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className='setAppointmentAvailability'>
      <p className='setAppointmentAvailability-header'>
        {dayjs(selectedDate).format('MMMM DD, YYYY')}
      </p>

      <hr />

      <div className="wholeDaySwitch">
        <span
          className="reason-text available"
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
            {/* Slot time */}
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

            {/* Separator */}
            <div className="slot-separator">:</div>

            {/* Reason text */}
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
        variant='filled-blue'
        type='button'
        onClick={handleSave}
      />
    </div>
  );
};

export default SetUnavailability;
