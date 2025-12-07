import React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function NormalDatePickerComponent({ value, onChange, label, shouldDisableDate }) {
  
  // ✅ Wrap shouldDisableDate to ensure it receives dayjs objects
  const handleShouldDisableDate = (date) => {
    if (!shouldDisableDate) return false;
    
    // Ensure date is a dayjs object
    const dayjsDate = dayjs.isDayjs(date) ? date : dayjs(date);
    return shouldDisableDate(dayjsDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value}
        onChange={onChange}
        label={label}
        disablePast
        shouldDisableDate={handleShouldDisableDate} 
        slotProps={{
          textField: {
            fullWidth: true,
            InputProps: {
              sx: {
                fontSize: '14px',
              },
            },
            sx: {
              width: '100%',
              '& .MuiSvgIcon-root': {
                color: '#6c6c6c',
              },
              '&:hover .MuiSvgIcon-root': {
                color: '#0C0C0C',
              },
              '&.Mui-focused .MuiSvgIcon-root': {
                color: '#0C0C0C',
              },
              '&:hover fieldset': {
                borderColor: '#0C0C0C',
                borderWidth: '2px',
              },
              '& fieldset': {
                borderColor: '#2d2d2db6',
              },
              '&.Mui-focused .MuiFormLabel-root': {
                color: '#0C0C0C',
              },
              '&.Mui-focused': {
                borderColor: '#0C0C0C',
              },
            },
          },
          popper: {
            sx: {
              '& .MuiPaper-root': {
                width: '100%',
                minWidth: '100%',
                borderRadius: '12px',
              },
              '& .MuiPickersCalendarHeader-switchViewButton': {
                color: '#0C0C0C',
              },
              '& .MuiPickersArrowSwitcher-leftArrowIcon': {
                color: '#0C0C0C',
              },
              '& .MuiPickersArrowSwitcher-rightArrowIcon': {
                color: '#0C0C0C',
              },
              // ✅ Style for disabled dates
              '& .MuiPickersDay-root.Mui-disabled': {
                color: '#999',
                textDecoration: 'line-through',
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}