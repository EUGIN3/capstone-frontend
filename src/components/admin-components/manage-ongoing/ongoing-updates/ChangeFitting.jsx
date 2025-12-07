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
import Confirmation from '../../../forms/confirmation-modal/Confirmation';


function ChangeFitting({ onClose, project, onSuccess }) {

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      process_status: 'designing',
    },
  });

  // Time slot → model field mapping
  const slotMap = {
    '7:00 - 8:30 AM': 'slot_one',
    '8:30 - 10:00 AM': 'slot_two',
    '10:00 - 11:30 AM': 'slot_three',
    '1:00 - 2:30 PM': 'slot_four',
    '2:30 - 4:00 PM': 'slot_five',
  };

  const allTimeSlots = Object.keys(slotMap);

  const [fittingDate, setFittingDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // ✅ Fetch availability data on mount
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await AxiosInstance.get('availability/display_unavailability/');
        setAvailabilityData(response.data || []);
      } catch (error) {
        console.error('❌ Error fetching availability:', error);
      }
    };
    fetchAvailability();
  }, []);

  // ✅ Check if a date should be disabled (NO available slots)
  const shouldDisableDate = (date) => {
    if (!date) return false;
    
    const dateStr = date.format('YYYY-MM-DD'); // Use dayjs format
    const dayAvailability = availabilityData.find(item => item.date === dateStr);
    
    if (!dayAvailability) {
      return false; // No data = all slots available = date is enabled
    }

    // Check if ALL 5 slots are unavailable (all true)
    const allSlotsUnavailable = 
      dayAvailability.slot_one === true &&
      dayAvailability.slot_two === true &&
      dayAvailability.slot_three === true &&
      dayAvailability.slot_four === true &&
      dayAvailability.slot_five === true;

    // Disable date if ALL slots are unavailable
    return allSlotsUnavailable;
  };

  // ✅ Update available slots when fitting date changes
  useEffect(() => {
    if (!fittingDate) {
      setAvailableSlots([]);
      setSelectedTimes([]);
      return;
    }

    const dateStr = fittingDate.format('YYYY-MM-DD');
    const dayAvailability = availabilityData.find(item => item.date === dateStr);

    if (!dayAvailability) {
      // No restrictions for this date - all slots available
      setAvailableSlots(allTimeSlots);
      return;
    }

    // Filter available slots (where slot_x === false)
    const available = allTimeSlots.filter(timeSlot => {
      const slotKey = slotMap[timeSlot];
      const isAvailable = dayAvailability[slotKey] === false;
      return isAvailable;
    });

    setAvailableSlots(available);
    
    // Clear selected times that are no longer available
    setSelectedTimes(prev => prev.filter(time => available.includes(time)));
  }, [fittingDate, availabilityData]);

  const handleDoneFitting = () => {
    if (saving) return;

    setShowConfirm({
      severity: 'success',
      message: 'Mark this fitting as successful? This will update the project status and cannot be easily undone.',
      action: 'done'
    });
  };

  const doMarkDone = async () => {
    setSaving(true);
    try {
      // -----------------------------
      // 1️⃣ MARK PROJECT AS FITTING SUCCESSFUL
      // -----------------------------
      await AxiosInstance.patch(`design/designs/${project.id}/`, {
        fitting_successful: true
      });

      // -----------------------------
      // 2️⃣ FREE UP THE FITTING SLOTS
      // -----------------------------
      const fittingDateStr = project.fitting_date;
      const fittingTimes = JSON.parse(project.fitting_time || '[]');

      if (fittingDateStr && fittingTimes.length > 0) {
        try {
          const availabilityRes = await AxiosInstance.get(
            `availability/display_unavailability/?date=${fittingDateStr}`
          );
          const existing = availabilityRes.data && availabilityRes.data[0] ? availabilityRes.data[0] : {};
          const updatedUnavailability = { ...existing, date: fittingDateStr };

          // Mark each fitting time slot as available (false)
          fittingTimes.forEach(time => {
            const key = findSlotKey(time);
            if (key) {
              updatedUnavailability[key] = false;
              updatedUnavailability[`reason_${key.split('_')[1]}`] = 'Available';
            }
          });

          await AxiosInstance.post('availability/set_unavailability/', updatedUnavailability);
        } catch (err) {
          console.error('Error freeing fitting slots:', err);
        }
      }

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("❌ Error marking fitting as done:", error);
    } finally {
      setSaving(false);
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

      // Ensure it's an array and join with commas
      if (Array.isArray(times)) {
        return times.join(', ');
      }
      return timeData;
    } catch {
      // If parsing fails, return the raw value
      return timeData;
    }
  };

  const handleSave = () => {
    if (saving) return;

    if (!fittingDate || selectedTimes.length === 0) {
      return;
    }

    const newDateStr = fittingDate.format('YYYY-MM-DD');
    const timeInfo = selectedTimes.length > 0 
      ? ` with ${selectedTimes.length} time slot${selectedTimes.length > 1 ? 's' : ''}`
      : '';

    setShowConfirm({
      severity: 'warning',
      message: `Update fitting schedule to ${formatDate(newDateStr)}${timeInfo}? This will free up the old time slots and reserve the new ones.`,
      action: 'save'
    });
  };

  const doSave = async () => {
    setSaving(true);
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
            if (key) {
              updatedOldUnavailability[key] = false;
              updatedOldUnavailability[`reason_${key.split('_')[1]}`] = 'Available';
            }
          });

          await AxiosInstance.post('availability/set_unavailability/', updatedOldUnavailability);
        } catch (err) {
          console.error('Error making old fitting slots available:', err);
        }
      }

      // -----------------------------
      // 2️⃣ MARK NEW SLOTS AS UNAVAILABLE
      // -----------------------------
      const newDateStr = fittingDate.format('YYYY-MM-DD');
      const newAvailabilityRes = await AxiosInstance.get(
        `availability/display_unavailability/?date=${newDateStr}`
      );
      const existing = newAvailabilityRes.data && newAvailabilityRes.data[0] ? newAvailabilityRes.data[0] : {};
      const updatedUnavailability = { ...existing, date: newDateStr };

      selectedTimes.forEach(time => {
        const key = findSlotKey(time);
        if (key) {
          updatedUnavailability[key] = true;
          updatedUnavailability[`reason_${key.split('_')[1]}`] = 'Scheduled Fitting';
        }
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

      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      console.error('Error updating fitting schedule:', err);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Handles confirmation response
  const handleConfirm = (confirmed) => {
    const action = showConfirm?.action;
    setShowConfirm(null);

    if (confirmed) {
      if (action === 'done') {
        doMarkDone();
      } else if (action === 'save') {
        doSave();
      }
    }
  };

  return (
    <div className="outerChangeFittingModal" style={{ position: 'relative' }}>
      {saving && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <Tooltip title='Close' arrow>
         <button className="close-update-modal" onClick={onClose} disabled={saving}>
          <CloseRoundedIcon
            sx={{
              color: '#f5f5f5',
              fontSize: 28,
              padding: '2px',
              backgroundColor: '#0c0c0c',
              borderRadius: '50%',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.5 : 1,
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
                onClick={handleDoneFitting}
                disabled={saving}
              >
                <CheckCircleTwoToneIcon
                  sx={{
                    color: saving ? '#11b36550' : '#11b3658a',
                    fontSize: 30,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    '&:hover': { color: saving ? '#11b36550' : '#11b365ff' },
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
            shouldDisableDate={shouldDisableDate}
          />

          <MultiSelectTimeSlots
            value={selectedTimes}
            onChange={(newTimes) => setSelectedTimes(newTimes)}
            availableSlots={availableSlots}
            disabled={!fittingDate}
          />
        </div>

        <div className="new-fitting-save-btn">
            <ButtonElement
              label="Save"
              variant="filled-black"
              type="button"
              onClick={handleSubmit(handleSave)}
              disabled={saving}
            />
        </div>
      </div>

      {showConfirm && (
        <Confirmation
          message={showConfirm.message}
          severity={showConfirm.severity}
          onConfirm={handleConfirm}
          isOpen={true}
        />
      )}
    </div>
  )
}

export default ChangeFitting