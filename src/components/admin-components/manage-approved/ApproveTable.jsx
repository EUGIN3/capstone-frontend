import * as React from 'react';
import './ManageAppointment.css';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import AxiosInstance from '../../API/AxiosInstance';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import AppHeader from '../../user-components/user-header/userHeader';

export default function ApprovedAppointmentTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Define order of time slots
  const timeOrder = {
    '7:00 - 8:30 AM': 1,
    '8:30 - 10:00 AM': 2,
    '10:00 - 11:30 AM': 3,
    '1:00 - 2:30 PM': 4,
    '2:30 - 4:00 PM': 5,
  };

  // Table Columns
  const columns = [
    { id: 'image', label: 'Image', minWidth: 60, align: 'left' },
    { id: 'firstName', label: 'First Name', minWidth: 150, align: 'center' },
    { id: 'lastName', label: 'Last Name', minWidth: 150, align: 'center' },
    { id: 'date', label: 'Date', minWidth: 100, align: 'center' },
    { id: 'time', label: 'Time', minWidth: 100, align: 'center' },
    { id: 'appointment_status', label: 'Status', minWidth: 120, align: 'center' },
    { id: 'actions', label: 'Actions', minWidth: 100, align: 'center' },
  ];

  // Fetch and sort approved appointments
  const fetchAppointments = async () => {
    try {
      const response = await AxiosInstance.get('appointment/appointments/');
      const approvedAppointments = response.data
        .filter((app) => app.appointment_status?.toLowerCase() === 'approved')
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB; // earlier date first
          }

          const timeA = timeOrder[a.time] || 999;
          const timeB = timeOrder[b.time] || 999;
          return timeA - timeB; // earlier slot first
        });

      setRows(approvedAppointments);
      setTotalAppointments(approvedAppointments.length);
    } catch (error) {
      console.error('❌ Failed to fetch appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handlers
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getStatusColor = (status) => {
    if (status?.toLowerCase() === 'approved') return '#11B364';
    return '#000000';
  };

  // Filter by search only
  const filteredRows = rows.filter((appointment) =>
    Object.values(appointment)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm)
  );

  useEffect(() => {
    setTotalAppointments(filteredRows.length);
  }, [filteredRows]);

  // Handle view button click
  const handleViewClick = (appointment) => {
    console.log('Viewing appointment:', appointment);
    // You can open modal or navigate here
  };

  // Render
  return (
    <>
      <div className="manage-appointment-header">
        <AppHeader headerTitle="Approved Appointments" />
      </div>

      <div className="table-header">
        <div className="search-user-container">
          <SearchIcon />
          <TextField
            variant="outlined"
            placeholder="Search approved appointment..."
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' },
              },
            }}
            onChange={handleSearchChange}
            value={searchTerm}
          />
        </div>

        <div className="total-user">
          <span>Appointments:</span>
          <div className="totalUser">{totalAppointments}</div>
        </div>
      </div>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer
          sx={{
            maxHeight: '63vh',
            overflowY: 'scroll',
            scrollbarGutter: 'stable',
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#bdbdbd',
              borderRadius: '10px',
            },
          }}
        >
          <Table stickyHeader aria-label="approved appointments table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No Approved Appointments
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((appointment) => (
                    <TableRow hover key={appointment.id}>
                      <TableCell align="left">
                        {appointment.image ? (
                          <img
                            src={appointment.image}
                            alt="appointment"
                            className="appointment-image"
                          />
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell align="center">{appointment.first_name || '—'}</TableCell>
                      <TableCell align="center">{appointment.last_name || '—'}</TableCell>
                      <TableCell align="center">{appointment.date || '—'}</TableCell>
                      <TableCell align="center">{appointment.time || '—'}</TableCell>
                      <TableCell align="center">
                        <span
                          style={{
                            color: getStatusColor(appointment.appointment_status),
                            textTransform: 'lowercase',
                          }}
                        >
                          {appointment.appointment_status || '—'}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <button
                          style={{
                            background: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                          }}
                          className="view-btn"
                          onClick={() => handleViewClick(appointment)}
                        >
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
