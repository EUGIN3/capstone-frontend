import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';

import ButtonElement from '../../forms/ButtonElement';

import AxiosInstance from '../../AxiosInstance'

import './ManageSchedule.css';

const SetUnavailability = (props) => {
  const timeSlots = [
    '7:00 - 8:30 AM',
    '8:30 - 10:00 AM',
    '10:00 - 11:30 AM',
    '1:00 - 2:30 PM',
    '2:30 - 4:00 PM',
  ];

  const { selectedDate, unavailableSlots } = props;

  useEffect(() => {
    if (unavailableSlots) {
      setSlots({
        '7:00 - 8:30 AM': unavailableSlots.slot_one,
        '8:30 - 10:00 AM': unavailableSlots.slot_two,
        '10:00 - 11:30 AM': unavailableSlots.slot_three,
        '1:00 - 2:30 PM': unavailableSlots.slot_four,
        '2:30 - 4:00 PM': unavailableSlots.slot_five,
      });
    } else {
      setSlots({
        '7:00 - 8:30 AM': false,
        '8:30 - 10:00 AM': false,
        '10:00 - 11:30 AM': false,
        '1:00 - 2:30 PM': false,
        '2:30 - 4:00 PM': false,
      });
    }
  }, [unavailableSlots]);

  const [slots, setSlots] = useState({
    '7:00 - 8:30 AM': false,
    '8:30 - 10:00 AM': false,
    '10:00 - 11:30 AM': false,
    '1:00 - 2:30 PM': false,
    '2:30 - 4:00 PM': false,
  });

  const handleChange = (slot) => (event) => {
    setSlots((prev) => ({
      ...prev,
      [slot]: event.target.checked,
    }));
  };

  const handleSave = () => {
    const payload = {
      date: selectedDate,
      slot_one: slots['7:00 - 8:30 AM'],
      slot_two: slots['8:30 - 10:00 AM'],
      slot_three: slots['10:00 - 11:30 AM'],
      slot_four: slots['1:00 - 2:30 PM'],
      slot_five: slots['2:30 - 4:00 PM'],
    };

    AxiosInstance.post('unavailability/', payload)
      // .then((response) => {
      //   console.log('Saved successfully:', response.data);
      // })
      // .catch((error) => {
      //   console.error('Error saving unavailability:', error);
      // });
  };

  return (
    <div className='setAppointmentAvailability'>
      <div className="selectedDate">
        <p>{selectedDate}</p>
      </div>

      <hr />

      {timeSlots.map((slot) => (
        <div key={slot}>
          <Checkbox
            checked={slots[slot]}
            onChange={handleChange(slot)}
            size="small"
            sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
          />
          <span>{slot}</span>
        </div>
      ))}

      <ButtonElement
        label='SAVE UNAVAILABLE'
        variant='filled-blue'
        type={'button'}
        onClick={handleSave}
      />
    </div>
  );
};

export default SetUnavailability;
