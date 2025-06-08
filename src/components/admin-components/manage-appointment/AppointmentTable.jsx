import './styles/AppointmentTable.css';

import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
// Components
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import AxiosInstance from '../../API/AxiosInstance';
import ButtonElement from '../../forms/button/ButtonElement';
import StatusFilterNavbar from './StatusFilterNavbar';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function CustomizedTables({ refreshFlag, onViewDetails }) {
  const [userAppointments, setUserAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedTab, setSelectedTab] = useState('all');

  const listAppointments = () => {
    AxiosInstance.get(`appointment/appointments/`)
      .then((response) => {
        const reversedList = response.data.slice().reverse();
        setUserAppointments(reversedList);
      })
      .catch((error) => console.error('Error fetching appointments:', error));
  };

  useEffect(() => {
    listAppointments();
  }, [refreshFlag]);
  
  useEffect(() => {
    if (selectedTab === 'all') {
      setFilteredAppointments(userAppointments);
    } else {
      const filtered = userAppointments.filter(
        (appointment) => appointment.appointment_status === selectedTab
      );
      setFilteredAppointments(filtered);
    }
  }, [selectedTab, userAppointments]);

  const handleTabChange = (newTabValue) => {
    setSelectedTab(newTabValue);
  };

  return (
    <TableContainer component={Paper}>
      <StatusFilterNavbar onTabChange={handleTabChange} />
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align='center'>First Name</StyledTableCell>
            <StyledTableCell align='center'>Last Name</StyledTableCell>
            <StyledTableCell align='center'>Date</StyledTableCell>
            <StyledTableCell align='center'>Time</StyledTableCell>
            <StyledTableCell align='center'>Status</StyledTableCell>
            <StyledTableCell align='center'>Date Set</StyledTableCell>
            <StyledTableCell align='center'>View Details</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <StyledTableRow key={appointment.id} onClick={() => onViewDetails(appointment)}>
                <StyledTableCell align='center'>{appointment.first_name || 'N/A'}</StyledTableCell>
                <StyledTableCell align='center'>{appointment.last_name || 'N/A'}</StyledTableCell>
                <StyledTableCell align='center'>{dayjs(appointment.date).format('MMMM DD, YYYY')}</StyledTableCell>
                <StyledTableCell align='center'>{appointment.time}</StyledTableCell>
                <StyledTableCell align='center'>
                  <div
                    style={{
                      backgroundColor:
                        appointment.appointment_status === 'approved' ? '#11B364' :
                        appointment.appointment_status === 'pending' ? '#1362ff' :
                        appointment.appointment_status === 'cancelled' ? '#F04438' :
                        appointment.appointment_status === 'denied' ? '#F79009' :
                        'black',
                      fontWeight: 500,
                      padding: '5px',
                      margin: 'auto',
                      color: '#f5f5f5',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {appointment.appointment_status}
                  </div>
                </StyledTableCell>
                <StyledTableCell align='center'>{dayjs(appointment.date_set).format('MMMM DD, YYYY')}</StyledTableCell>
                <StyledTableCell align='center' className='appointmentTableColumn'>
                  <ButtonElement
                    label='Details'
                    variant='outlined-blue'
                    type='button'
                    onClick={() => onViewDetails(appointment)}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell align="center" colSpan={7}>
                No appointments found.
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
