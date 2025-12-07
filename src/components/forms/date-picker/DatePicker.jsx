  import React from 'react';
  import dayjs from 'dayjs';
  import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  import { DatePicker } from '@mui/x-date-pickers/DatePicker';

  export default function DatePickerComponent({ value, onChange, disableDates = [] }) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value}
          onChange={onChange}
          disablePast
          shouldDisableDate={(date) =>
            disableDates.includes(dayjs(date).format('YYYY-MM-DD'))
          }
          slotProps={{
            textField: {
              fullWidth: true,
              InputProps: {
                sx: {
                  height: '100%', // ✅ stretch to parent height
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                },
              },
              sx: {
                width: '100%',
                height: '100%', // ✅ make input adopt container height
                '& .MuiInputBase-root': {
                  height: '100%',
                },
                '& .MuiSvgIcon-root': {
                  color: '#6c6c6c',
                  transition: 'color 0.3s ease',
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
              },
            },
            popper: {
              sx: {
                '& .MuiPaper-root': {
                  width: '100%',
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
              },
            },
          }}
        />
      </LocalizationProvider>
    );
  }
