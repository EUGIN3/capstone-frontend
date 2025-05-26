  import React, { useState, useEffect } from 'react';
  import Checkbox from '@mui/material/Checkbox';

  import ButtonElement from '../../forms/ButtonElement';

  import AxiosInstance from '../../AxiosInstance';

  import './ManageSchedule.css';

  import dayjs from 'dayjs';

  const SetUnavailability = (props) => {
    const timeSlots = [
      '7:00 - 8:30 AM',
      '8:30 - 10:00 AM',
      '10:00 - 11:30 AM',
      '1:00 - 2:30 PM',
      '2:30 - 4:00 PM',
    ];

    const { selectedDate, unavailableSlots, onAlert, onClose } = props;

    const [slots, setSlots] = useState({});
    const [wholeDay, setWholeDay] = useState(false);

    useEffect(() => {
      const initialSlots = {
        '7:00 - 8:30 AM': unavailableSlots?.slot_one || false,
        '8:30 - 10:00 AM': unavailableSlots?.slot_two || false,
        '10:00 - 11:30 AM': unavailableSlots?.slot_three || false,
        '1:00 - 2:30 PM': unavailableSlots?.slot_four || false,
        '2:30 - 4:00 PM': unavailableSlots?.slot_five || false,
      };
      setSlots(initialSlots);
    }, [unavailableSlots]);

    
    useEffect(() => {
      const allChecked = timeSlots.every((slot) => slots[slot]);
      setWholeDay(allChecked);
    }, [slots]);

    const handleChange = (slot) => (event) => {
      setSlots((prev) => ({
        ...prev,
        [slot]: event.target.checked,
      }));
    };

    const handleWholeDayChange = (event) => {
      const checked = event.target.checked;
      const updatedSlots = timeSlots.reduce((acc, slot) => {
        acc[slot] = checked;
        return acc;
      }, {});
      setSlots(updatedSlots);
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
        .then(() => {
          if (onAlert) onAlert("Schedule updated successfully!", "success");
          if (onClose) onClose();
        })
        .catch(() => {
          if (onAlert) onAlert("Failed to update schedule.", "error");
        });
    };

    return (
      <div className='setAppointmentAvailability'>
        <p className='setAppointmentAvailability-header'>{dayjs(selectedDate).format('MMMM DD, YYYY')} · Schedule</p>

        <hr />

        <div>
          <Checkbox
            checked={wholeDay}
            onChange={handleWholeDayChange}
            size="small"
            sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
          />
          <span><strong>Whole Day</strong></span>
        </div>

        {timeSlots.map((slot) => (
          <div key={slot}>
            <Checkbox
              checked={slots[slot] || false}
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
          type='button'
          onClick={handleSave}
        />
      </div>
    );
  };

  export default SetUnavailability;
