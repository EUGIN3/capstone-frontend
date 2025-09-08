import './styles/AppointmentTable.css';

import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
// Components
// Search Bar
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import AxiosInstance from '../../API/AxiosInstance';
import ButtonElement from '../../forms/button/ButtonElement';
// import StatusFilterNavbar from './StatusFilterNavbar';


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

  // Search bar
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    let filtered = [...userAppointments];
    
    // Status filter
    if (selectedTab !== 'all') {
      filtered = filtered.filter(
        (appointment) => appointment.appointment_status === selectedTab
      );
    }
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (appointment) => 
          appointment.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appointment.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredAppointments(filtered);
  }, [selectedTab, userAppointments, searchQuery]);
  

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

  // const handleTabChange = (newTabValue) => {
  //   setSelectedTab(newTabValue);
  // };

  const handleStatusChange = (event) => {
    setSelectedTab(event.target.value);
  };

  return (
    <TableContainer component={Paper}>
      {/* <StatusFilterNavbar onTabChange={handleTabChange} /> */}

    <div style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <FormControl sx={{ minWidth: 170 }}>
        <Select
          value={selectedTab}
          onChange={handleStatusChange}
          size="small"
          displayEmpty
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              border: '1px solid #000000',
              borderRadius: '4px'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: '1px solid #000000'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: '2px solid #000000'
            }
          }}
        >
          <MenuItem value="all">All Appointments</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
          <MenuItem value="denied">Denied</MenuItem>
        </Select>
      </FormControl>

      <TextField
        size="small"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          width: '250px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: '1px solid #000000',
            },
            '&:hover fieldset': {
              border: '1px solid #000000',
            },
            '&.Mui-focused fieldset': {
              border: '2px solid #000000',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#000000' }} />
            </InputAdornment>
          ),
        }}
      />
    </div>

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
