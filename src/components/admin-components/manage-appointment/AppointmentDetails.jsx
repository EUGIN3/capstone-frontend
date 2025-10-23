import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../API/AxiosInstance';
import { Button, Typography, Box, Paper } from '@mui/material';

export default function AppointmentDetails() {
  const { id } = useParams(); // get ID from URL
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    AxiosInstance.get(`appointment/appointments/${id}/`)
      .then((response) => setAppointment(response.data))
      .catch((error) => console.error('Error fetching appointment:', error));
  }, [id]);

  if (!appointment) {
    return <Typography>Loading appointment details...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="outlined"
        onClick={() => navigate('/admin/manage-appointments')}
        sx={{ 
            mb: 2,
            backgroundColor:'red',
        }}
      >
        ← Back to Appointments
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Appointment Details
        </Typography>
        <Typography><b>Client Name:</b> {appointment.client_name}</Typography>
        <Typography><b>Date:</b> {appointment.date}</Typography>
        <Typography><b>Status:</b> {appointment.status}</Typography>
        <Typography><b>Notes:</b> {appointment.notes || 'No notes provided.'}</Typography>
      </Paper>
    </Box>
  );
}
