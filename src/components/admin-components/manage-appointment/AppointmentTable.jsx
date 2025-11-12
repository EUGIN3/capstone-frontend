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
import Dialog from '@mui/material/Dialog';
import ModalDetails from './ModalDetails';
import AppHeader from '../../user-components/user-header/userHeader';
import StatusDropdown from './StatusDropDown';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import noImage from '../../../assets/no-image.jpg';

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { Tooltip } from '@mui/material';

export default function AppointmentTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Denied', value: 'denied' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const columns = [
    { id: 'image', label: 'Image', minWidth: 60, align: 'left' },
    { id: 'firstName', label: 'First Name', minWidth: 150, align: 'center'},
    { id: 'lastName', label: 'Last Name', minWidth: 150, align: 'center' },
    { id: 'date', label: 'Date', minWidth: 100, align: 'center' },
    { id: 'time', label: 'Time', minWidth: 100, align: 'center' },
    { id: 'appointment_status', label: 'Status', minWidth: 120, align: 'center' },
    { id: 'actions', label: 'Actions', minWidth: 100, align: 'center' },
  ];

  const fetchAppointments = async () => {
    try {
      const response = await AxiosInstance.get('appointment/appointments/');
      const sortedAppointments = response.data.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
      setRows(sortedAppointments);
      setTotalAppointments(sortedAppointments.length);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpen = (appointment) => {
    setSelectedAppointment(appointment);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedAppointment(null);
    setOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleFilterChange = (newStatus) => {
    setFilterStatus(newStatus);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleArchived = async (id) => {
    try {
      await AxiosInstance.patch(`appointment/appointments/${id}/`, {
        appointment_status: "archived"
      });

      // ✅ Automatically refresh the table after archiving
      fetchAppointments();
    } catch (error) {
      console.error("❌ Failed to archive appointment:", error);
    }
  };


  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#2287E7';
      case 'cancelled':
        return '#F04438';
      case 'denied':
        return '#F79009';
      case 'approved':
        return '#11B364';
      default:
        return '#000000';
    }
  };

  // -------------------------------
  // Filtering logic
  // -------------------------------
  const filteredRows = rows.filter((appointment) => {
    const status = appointment.appointment_status?.toLowerCase();

    if (status === 'approved' || status === 'archived') return false;

    const matchesSearch = Object.values(appointment)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm);

    const matchesStatus =
      filterStatus === 'all' ||
      appointment.appointment_status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Update total appointments count based on filter
  useEffect(() => {
    setTotalAppointments(filteredRows.length);
  }, [filteredRows]);

  return (
    <>
      <div className="manage-appointment-header">
          <AppHeader headerTitle="Manage appointment" />


          <div className="main-dropdown">
            <StatusDropdown
              items={statusOptions}
              value={filterStatus}
              onChange={handleFilterChange}
            />
          </div>
  
      </div>

      <div className="table-header">
        <div className="search-user-container">
          <SearchIcon />
          <TextField
            variant="outlined"
            placeholder="Search appointment..."
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
          <Table stickyHeader aria-label="appointments table">
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
                <TableRow  sx={{height:'100px'}}>
                  <TableCell colSpan={columns.length} align="center">
                    No Data Available
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((appointment) => (
                    <TableRow
                      hover
                      key={appointment.id}
                      className="appointment-row"
                    >
                      <TableCell align="left">
                          <img
                            src={appointment.image ? appointment.image : noImage}
                            alt="appointment"
                            className="appointment-image"
                          />
                      </TableCell>
                      <TableCell align="center">
                        {appointment.first_name || '—'}
                      </TableCell>
                      <TableCell align="center">
                        {appointment.last_name || '—'}
                      </TableCell>
                      <TableCell align="center">
                        {appointment.date || '—'}
                      </TableCell>
                      <TableCell align="center">
                        {appointment.time || '—'}
                      </TableCell>
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
                      <TableCell align="center" sx={{
                        display: 'flex',
                        justifyContent:'center',
                        alignItems:'center',
                        gap:'5px',
                      }}>

                        <Tooltip title='view' arrow>
                          <button
                            style={{
                              background: 'transparent',
                              border: 'none',
                              display: 'flex',
                              alignItems:'center',
                              justifyContent: 'center',
                            }}
                            className="view-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpen(appointment);
                            }}
                          >
                            <VisibilityTwoToneIcon 
                              sx={{
                                color: '#383838ff', 
                                fontSize: 26,     
                                cursor: 'pointer',     
                                '&:hover': {
                                  color: '#0c0c0c',    
                                },
                                margin: '0',
                                padding: '0'
                              }}                      
                            />
                          </button>
                        </Tooltip>
                        
                        {
                          appointment.appointment_status === 'cancelled' && (
                          <Tooltip title='delete' arrow>
                            <button
                              style={{
                                background: 'transparent',
                                border: 'none',
                                display: 'flex',
                                alignItems:'center',
                                justifyContent: 'center',
                              }}
                              className="view-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArchived(appointment.id);
                              }}
                            >
                              <DeleteTwoToneIcon 
                                sx={{
                                  color: '#383838ff', 
                                  fontSize: 26,     
                                  cursor: 'pointer',     
                                  '&:hover': {
                                    color: '#0c0c0c',    
                                  },
                                  margin: '0',
                                  padding: '0'
                                }}                      
                              />
                            </button>
                          </Tooltip>
                        )}
                        
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
        

        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth={false}
          PaperProps={{
            style: {
              width: 'auto',
              maxWidth: '90vw',
              maxHeight: '90vh',
              padding: '0px',
              backgroundColor: 'transparent',
              boxShadow: 'none', 
            },
          }}
        >
          {selectedAppointment && (
            <ModalDetails
              {...selectedAppointment}
              onUpdate={fetchAppointments}
              onClose={handleClose}
            />
          )}
        </Dialog>
      </Paper>
    </>
  );
}
