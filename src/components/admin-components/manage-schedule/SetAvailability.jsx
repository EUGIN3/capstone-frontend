import './ManageSchedule.css';

import React, { useState, useEffect } from 'react';
import ButtonElement from '../../forms/button/ButtonElement';
import AxiosInstance from '../../API/AxiosInstance';
import dayjs from 'dayjs';

const SetUnavailability = ({ selectedDate, unavailableSlots, onClose, onAlert }) => {
  const timeSlots = [
    '7:00 - 8:30 AM',
    '8:30 - 10:00 AM',
    '10:00 - 11:30 AM',
    '1:00 - 2:30 PM',
    '2:30 - 4:00 PM',
  ];

  const [slots, setSlots] = useState({});
  const [wholeDay, setWholeDay] = useState(false);
  const [approvedTimes, setApprovedTimes] = useState([]);

  const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');

  useEffect(() => {
    const initialSlots = {
      '7:00 - 8:30 AM': unavailableSlots ? !unavailableSlots.slot_one : true,
      '8:30 - 10:00 AM': unavailableSlots ? !unavailableSlots.slot_two : true,
      '10:00 - 11:30 AM': unavailableSlots ? !unavailableSlots.slot_three : true,
      '1:00 - 2:30 PM': unavailableSlots ? !unavailableSlots.slot_four : true,
      '2:30 - 4:00 PM': unavailableSlots ? !unavailableSlots.slot_five : true,
    };
    setSlots(initialSlots);

    const allUnavailable = timeSlots.every(slot => !initialSlots[slot]);
    setWholeDay(allUnavailable);
  }, [unavailableSlots]);

  useEffect(() => {
    const allUnavailable = timeSlots.every(slot => !slots[slot]);
    setWholeDay(allUnavailable);
  }, [slots]);

  // ✅ Fixed: filter by date on the frontend
  useEffect(() => {
    const fetchApprovedAppointments = async () => {
      try {
        const response = await AxiosInstance.get('appointment/user_appointments/');

        const times = response.data
          .filter(app =>
            app.appointment_status === 'approved' &&
            dayjs(app.date).format('YYYY-MM-DD') === formattedDate
          )
          .map(app => app.time);

        setApprovedTimes(times);
      } catch (error) {
        console.error('Failed to fetch approved appointments', error);
        setApprovedTimes([]);
      }
    };

    fetchApprovedAppointments();
  }, [formattedDate]);

  const toggleSlot = (slot) => {
    setSlots((prev) => ({
      ...prev,
      [slot]: !prev[slot],
    }));
  };

  const toggleWholeDay = () => {
    const newWholeDay = !wholeDay;
    const updatedSlots = timeSlots.reduce((acc, slot) => {
      acc[slot] = !newWholeDay;
      return acc;
    }, {});
    setSlots(updatedSlots);
    setWholeDay(newWholeDay);
  };

  const handleSave = () => {
    const isAllUnavailable = timeSlots.every((slot) => !slots[slot]);

    if (isAllUnavailable) {
      AxiosInstance.post('availability/set_unavailability/', {
        date: formattedDate,
        slot_one: true,
        slot_two: true,
        slot_three: true,
        slot_four: true,
        slot_five: true,
      })
        .then(() => {
          if (onClose) onClose();
          if (onAlert) onAlert("All slots set to unavailable. Schedule updated.", "success");
        })
        .catch(() => {
          if (onAlert) onAlert("Failed to update availability.", "error");
        });
      return;
    }

    const payload = {
      date: formattedDate,
      slot_one: !slots['7:00 - 8:30 AM'],
      slot_two: !slots['8:30 - 10:00 AM'],
      slot_three: !slots['10:00 - 11:30 AM'],
      slot_four: !slots['1:00 - 2:30 PM'],
      slot_five: !slots['2:30 - 4:00 PM'],
    };

    AxiosInstance.post('availability/set_unavailability/', payload)
      .then(() => {
        if (onClose) onClose();
        if (onAlert) onAlert("Schedule updated successfully!", "success");
      })
      .catch(() => {
        if (onAlert) onAlert("Failed to update schedule.", "error");
      });
  };

  return (
    <div className='setAppointmentAvailability'>
      <p className='setAppointmentAvailability-header'>
        {dayjs(selectedDate).format('MMMM DD, YYYY')} · Schedule
      </p>

      <hr />
      <ButtonElement
        label={'Unavailable Whole Day'}
        onClick={toggleWholeDay}
        variant='filled-black'
      />
      <hr />

      <div className="availability-container">
        {timeSlots.map((slot) => {
          const isDisabled = approvedTimes.includes(slot);

          return (
            <div
              key={slot}
              className={`timeSlot ${slots[slot] ? 'available' : 'unavailable'} ${isDisabled ? 'disabled-slot' : ''}`}
              onClick={() => !isDisabled && toggleSlot(slot)}
              style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.5 : 1 }}
              title={isDisabled ? 'Slot has an approved appointment' : ''}
            >
              {slot} — {slots[slot] ? 'Available' : 'Unavailable'}
            </div>
          );
        })}
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
