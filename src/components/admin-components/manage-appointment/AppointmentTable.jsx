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
import StatusDropdown from './StatusDropdown';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import noImage from '../../../assets/no-image.jpg';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { Tooltip } from '@mui/material';
import ButtonElement from '../../forms/button/ButtonElement';

import DatePickerComponent from '../../forms/date-picker/DatePicker';
import dayjs from 'dayjs';
import Confirmation from '../../forms/confirmation-modal/Confirmation';
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export default function AppointmentTable() {
  const [loading, setLoading] = useState(false);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [attire, setAttire] = useState([])
  const [selectedDate, setSelectedDate] = useState(null);
  const [userCancels, setUserCancels] = useState({});

  const [confirmData, setConfirmData] = useState(null);
  const [archivingId, setArchivingId] = useState(null);

  const withLoading = async (callback) => {
    try {
      setLoading(true);
      await delay(500); // 🔧 visible loading
      await callback();
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Denied', value: 'denied' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const columns = [
    { id: 'firstName', label: 'First Name', minWidth: 100, align: 'left'},
    { id: 'date', label: 'Date', minWidth: 100, align: 'left' },
    { id: 'time', label: 'Time', minWidth: 100, align: 'left' },
    { id: 'appointment_status', label: 'Status', minWidth: 100, align: 'left' },
    { id: 'cancels', label: 'Cancels', minWidth: 100, align: 'center' },
    { id: 'actions', label: 'Actions', minWidth: 100, align: 'center' },
  ];

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      await delay(500);

      const response = await AxiosInstance.get('appointment/appointments/');
      const sortedAppointments = response.data.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );

      setRows(sortedAppointments);
      setTotalAppointments(sortedAppointments.length);

      // ✅ Load user cancels here
      loadUserCancels(sortedAppointments);

    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchUser = async (userId) => {
    try {
      const response = await AxiosInstance.get(`/auth/users/${userId}/`);
      return response.data.cancels || 0;
    } catch (error) {
      console.error('Failed to fetch user cancels:', error);
      return 0;
    }
  };

  const loadUserCancels = async (appointments) => {
    const cancelsMap = {};

    await Promise.all(
      appointments.map(async (appointment) => {
        if (appointment.user) {
          const count = await fetchUser(appointment.user);
          cancelsMap[appointment.user] = count;
        }
      })
    );

    setUserCancels(cancelsMap);
  };


  useEffect(() => {
    fetchAppointments();
  }, []);

  const getAttireImage = async (appointment) => {
    if (!appointment.attire_from_gallery) return;

    try {
      const response = await AxiosInstance.get(
        `/gallery/admin/attire/${appointment.attire_from_gallery}/`
      );
      setAttire(response.data);
    } catch (error) {
      console.error("Failed to fetch attire:", error);
      setAttire(null);
    }
  }

  const handleOpen = (appointment) => {
    setSelectedAppointment(appointment);
    getAttireImage(appointment)
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedAppointment(null);
    setAttire([])
    setOpen(false);
  };

  const handleSearchChange = async (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setPage(0);
  };

  const handleFilterChange = async (newStatus) => {
    await withLoading(async () => {
      setFilterStatus(newStatus);
      setPage(0);
    });
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const handleArchivedClick = (appointment) => {
    setConfirmData({
      id: appointment.id,
      message: `Archive appointment for ${appointment.first_name}?`,
      severity: 'warning'
    });
  };

  const confirmArchive = async (confirmed) => {
    if (!confirmed || !confirmData) {
      setConfirmData(null);
      return;
    }

    try {
      setArchivingId(confirmData.id);

      await AxiosInstance.patch(`appointment/appointments/${confirmData.id}/`, {
        appointment_status: "archived"
      });

      toast.success(
        <div style={{ padding: '8px' }}>
          Appointment archived successfully!
        </div>,
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );

      fetchAppointments();

    } catch (error) {
      console.error('Failed to archive appointment:', error);

      let errorMessage = 'Failed to archive appointment. Please try again.';

      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 
                      error.response?.data?.error ||
                      'Invalid appointment data. Please check and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to archive this appointment.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Appointment not found. Please refresh and try again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      }

      toast.error(
        <div style={{ padding: '8px' }}>
          {errorMessage}
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
    } finally {
      setArchivingId(null);
      setConfirmData(null);
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

  const handleDateChange = async (newValue) => {
    await withLoading(async () => {
      setSelectedDate(newValue);
      setPage(0);
    });
  };

  const handleShowAll = async () => {
    await withLoading(async () => {
      setSelectedDate(null);
      setSearchTerm('');
      setFilterStatus('all');
      setPage(0);
    });
  };

  // -------------------------------
  // Filtering logic
  // -------------------------------
  const filteredRows = rows.filter((appointment) => {
    const status = appointment.appointment_status?.toLowerCase();

    // Exclude approved, archived, project
    if (status === 'approved' || status === 'archived' || status === 'project') {
      return false;
    }

    const matchesSearch = Object.values(appointment)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm);

    const matchesStatus =
      filterStatus === 'all' ||
      status === filterStatus.toLowerCase();

    const matchesDate = selectedDate
      ? appointment.date === dayjs(selectedDate).format('YYYY-MM-DD')
      : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleDownload = async () => {
    try {
      const response = await AxiosInstance.get("appointment/export/csv/", {
        responseType: "blob", // IMPORTANT for file download
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "appointments.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download CSV.");
    }
  };

  // Update total appointments count based on filter
  useEffect(() => {
    setTotalAppointments(filteredRows.length);
  }, [filteredRows]);

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="manage-appointment-header">
        <AppHeader headerTitle="Manage appointment" />

        <div className="approve-filter-container">
          <div className="filter">
            <DatePickerComponent
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="approve-all-btn">
            <ButtonElement
              label="All"
              variant="outlined-black"
              onClick={handleShowAll}
            />
          </div>

          <div className="approve-all-btn">
            <ButtonElement
              label="Download"
              variant="outlined-black"
              onClick={handleDownload}
            />
          </div>
        </div>
      </div>

      <div className="table-header">
        <div className="filter-appointment">
          <div className="main-dropdown">
            <StatusDropdown
              items={statusOptions}
              value={filterStatus}
              onChange={handleFilterChange}
            />
          </div>

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
                        {appointment.first_name || '—'}
                      </TableCell>
                      <TableCell align="left">
                        {appointment.date || '—'}
                      </TableCell>
                      <TableCell align="left">
                        {appointment.time || '—'}
                      </TableCell>
                      <TableCell align="left">
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
                        <span
                          style={{
                            fontWeight: 'bold',
                            color: (userCancels[appointment.user] || 0) > 2 ? '#F04438' : '#383838',
                          }}
                        >
                          {userCancels[appointment.user] ?? 0}
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
                                handleArchivedClick(appointment);
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
              maxHeight: '100vh',
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
              attire={attire}
            />
          )}
        </Dialog>
      </Paper>

      {confirmData && (
        <Confirmation
          isOpen={true}
          message={confirmData.message}
          severity={confirmData.severity}
          onConfirm={confirmArchive}
        />
      )}

      <ToastContainer />
    </>
  );
}