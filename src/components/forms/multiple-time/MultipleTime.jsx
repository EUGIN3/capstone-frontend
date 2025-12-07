import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Chip
} from '@mui/material';

export default function MultiSelectTimeSlots({ value = [], onChange, availableSlots = [], disabled = false }) {
  const allTimeSlots = [
    { value: '7:00 - 8:30 AM', label: '7:00 - 8:30 AM' },
    { value: '8:30 - 10:00 AM', label: '8:30 - 10:00 AM' },
    { value: '10:00 - 11:30 AM', label: '10:00 - 11:30 AM' },
    { value: '1:00 - 2:30 PM', label: '1:00 - 2:30 PM' },
    { value: '2:30 - 4:00 PM', label: '2:30 - 4:00 PM' },
  ];

  // ✅ Filter slots based on availableSlots prop
  const timeSlots = availableSlots.length > 0
    ? allTimeSlots.filter(slot => availableSlots.includes(slot.value))
    : allTimeSlots;

  const handleChange = (event) => {
    const { value: newValue } = event.target;
    // Call parent's onChange if provided
    onChange?.(typeof newValue === 'string' ? newValue.split(',') : newValue);
  };

  return (
    <FormControl
      disabled={disabled} // ✅ Disable entire control when disabled prop is true
      sx={{
        width: '100%',
        '& label.Mui-focused': {
          color: '#0C0C0C',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: '#2d2d2db6' },
          '&:hover fieldset': { borderColor: '#0C0C0C', borderWidth: '2px' },
          '&.Mui-focused fieldset': { borderColor: '#0C0C0C' },
        },
      }}
    >
      <InputLabel id="time-slot-label">Select Time Slots</InputLabel>
      <Select
        labelId="time-slot-label"
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label="Select Time Slots" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {selected.map((v) => (
              <Chip
                key={v}
                label={v}
                sx={{
                  fontSize: '0.8rem',
                  height: 24,
                  color: '#0C0C0C',
                  backgroundColor: '#eaeaea',
                }}
              />
            ))}
          </Box>
        )}
        MenuProps={{
          PaperProps: { style: { maxHeight: 300 } },
        }}
        sx={{
          width: '100%',
          height: '100%',
          '& .MuiSvgIcon-root': { color: '#6c6c6c', transition: 'color 0.3s ease' },
          '&:hover .MuiSvgIcon-root': { color: '#0C0C0C' },
          '& .MuiSelect-multiple': { fontSize: '0.8rem' },
        }}
      >
        {timeSlots.length > 0 ? (
          timeSlots.map((slot) => (
            <MenuItem
              key={slot.value}
              value={slot.value}
              sx={{
                backgroundColor: value.includes(slot.value) ? '#e0e0e0' : 'transparent',
                color: value.includes(slot.value) ? '#0C0C0C70' : '#0C0C0C',
                '&:hover': {
                  backgroundColor: value.includes(slot.value) ? '#d5d5d5' : '#f1f1f1',
                },
                transition: 'background-color 0.2s ease',
                borderRadius: 1,
              }}
            >
              {slot.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled sx={{ color: '#999', fontStyle: 'italic' }}>
            No available time slots for this date
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
}