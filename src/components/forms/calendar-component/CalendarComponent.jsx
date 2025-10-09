import React, { useState } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Box from '@mui/material/Box';


export default function CalendarComponent({value, onChange, disableDates = []}) {
  return (      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: { xs: '100%', sm: 300 } }}>
        <DateCalendar 
          value={value} 
          onChange={onChange} 
          disablePast
          shouldDisableDate={(date) => {
            const formatted = dayjs(date).format('YYYY-MM-DD');
            return disableDates.includes(formatted);
          }}
          sx={{
            '& .MuiButtonBase-root': {
              color: '#0C0C0C',
            },
          }}
        />
      </Box>
    </LocalizationProvider>

  );
}