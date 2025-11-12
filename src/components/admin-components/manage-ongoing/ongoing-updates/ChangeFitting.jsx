import React, { useState, useEffect } from 'react'
import { Tooltip } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { set, useForm } from 'react-hook-form';
import './ChangeFitting.css'
import AxiosInstance from '../../../API/AxiosInstance';
import NormalDatePickerComponent from '../../../forms/date-picker/NormalDatePicker';
import DropdownComponentTime from '../../../forms/time-dropdown/DropDownForTime';
import MultiSelectTimeSlots from '../../../forms/multiple-time/MultipleTime'
import ButtonElement from '../../../forms/button/ButtonElement';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';


function ChangeFitting({ onClose, project, onSuccess }) {

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      process_status: 'designing',
    },
  });

  const slotMap = {
    '7:00 - 8:30 AM': 'slot_one',
    '8:30 - 10:00 AM': 'slot_two',
    '10:00 - 11:30 AM': 'slot_three',
    '1:00 - 2:30 PM': 'slot_four',
    '2:30 - 4:00 PM': 'slot_five',
  };

  const [fittingDate, setFittingDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);

  const handleDoneFitting = async () => {
    try {
      await AxiosInstance.patch(`design/designs/${project.id}/`, {
        fitting_successful: true
      })
      onClose()
      onSuccess()
    } catch (error) {
      console.error("❌ Error fetching fitting data:", error);
    }
  };

  const findSlotKey = (timeStr) => {
    if (!timeStr) return null;
    const normalized = timeStr.toString().trim().replace(/\s+/g, ' ');
    for (const [label, key] of Object.entries(slotMap)) {
      if (label.replace(/\s+/g, ' ') === normalized) return key;
    }
    return null;
  };

  const formatDate = (dateStr) => {
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

  const handleSave = async () => {
    if (!fittingDate || selectedTimes.length === 0) {
      alert('Please select a new fitting date and time.');
      return;
    }

    try {
      // -----------------------------
      // 1️⃣ MAKE OLD SLOTS AVAILABLE AGAIN
      // -----------------------------
      const oldDateStr = project.fitting_date;
      const oldTimes = JSON.parse(project.fitting_time || '[]');

      if (oldDateStr && oldTimes.length > 0) {
        try {
          const oldAvailabilityRes = await AxiosInstance.get(
            `availability/display_unavailability/?date=${oldDateStr}`
          );
          const oldExisting = oldAvailabilityRes.data && oldAvailabilityRes.data[0] ? oldAvailabilityRes.data[0] : {};
          const updatedOldUnavailability = { ...oldExisting, date: oldDateStr };

          // Mark each old time slot as available (false)
          oldTimes.forEach(time => {
            const key = findSlotKey(time);
            if (key) updatedOldUnavailability[key] = false;
          });

          await AxiosInstance.post('availability/set_unavailability/', updatedOldUnavailability);
        } catch (err) {
          console.error('Error making old fitting slots available:', err);
        }
      }

      // -----------------------------
      // 2️⃣ MARK NEW SLOTS AS UNAVAILABLE
      // -----------------------------
      const newDateStr = fittingDate.toISOString().split('T')[0];
      const newAvailabilityRes = await AxiosInstance.get(
        `availability/display_unavailability/?date=${newDateStr}`
      );
      const existing = newAvailabilityRes.data && newAvailabilityRes.data[0] ? newAvailabilityRes.data[0] : {};
      const updatedUnavailability = { ...existing, date: newDateStr };

      selectedTimes.forEach(time => {
        const key = findSlotKey(time);
        if (key) updatedUnavailability[key] = true;
      });

      await AxiosInstance.post('availability/set_unavailability/', updatedUnavailability);

      // -----------------------------
      // 3️⃣ UPDATE PROJECT FITTING DETAILS
      // -----------------------------
      await AxiosInstance.patch(`design/designs/${project.id}/`, {
        fitting_date: newDateStr,
        fitting_time: JSON.stringify(selectedTimes),
        fitting_successful: false
      });

      alert('✅ Fitting schedule updated successfully!');
      onSuccess && onSuccess(); // callback if needed
      onClose();
    } catch (err) {
      console.error('Error updating fitting schedule:', err);
      alert('❌ Failed to update fitting schedule.');
    }
  };

  return (
    <div className="outerChangeFittingModal">
      <Tooltip title='Close' arrow>
         <button className="close-update-modal" onClick={onClose}>
          <CloseRoundedIcon
            sx={{
              color: '#f5f5f5',
              fontSize: 28,
              padding: '2px',
              backgroundColor: '#0c0c0c',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        </button>
      </Tooltip>

      <div className='ChangeFitting'>
        <div className="update-fitting-header">
          <p>Update Fitting Schedule</p>
        </div>

        <div className="old-fitting-details">
          <div className="old-fitting-details-text">     
            <div className="old-fitting-date">
              <span>Date:</span> {formatDate(project.fitting_date)}
            </div> 
            <div className="old-fitting-time">
              <span>Time:</span> {formatFittingTime(project.fitting_time)}
            </div>
          </div>
          
          <div className="done-button">
            <Tooltip title='Fitting Successful' arrow>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className="done-btn"
                onClick={() => {handleDoneFitting()}}
              >
                <CheckCircleTwoToneIcon
                  sx={{
                    color: '#11b3658a',
                    fontSize: 30,
                    cursor: 'pointer',
                    '&:hover': { color: '#11b365ff' },
                  }}
                />
              </button>
            </Tooltip>
          </div>
        </div>
    
        <hr/>
            
        <div className="new-fitting-detials">
          <NormalDatePickerComponent
            value={fittingDate}
            onChange={(nDate) => setFittingDate(nDate)}
            label={'New Date'}
          />

          <MultiSelectTimeSlots
            value={selectedTimes}
            onChange={(newTimes) => setSelectedTimes(newTimes)}
          />
        </div>

        <div className="new-fitting-save-btn">
            <ButtonElement
              label="Save"
              variant="filled-black"
              type="button"
              onClick={handleSubmit(handleSave)}
            />
        </div>
    
      </div>
            
    </div>
  )
}

export default ChangeFitting