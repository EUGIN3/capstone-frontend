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
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import Dialog from '@mui/material/Dialog';
import ModalDetails from '../manage-appointment/ModalDetails';
import ProjectModal from './project-modal/ProjectModal';
import dayjs from 'dayjs';
import noImage from '../../../assets/no-image.jpg';
import { Tooltip } from '@mui/material';
import DatePickerComponent from '../../forms/date-picker/DatePicker';
import ButtonElement from '../../forms/button/ButtonElement';
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function ApprovedAppointmentTable() {
  const [loading, setLoading] = useState(false);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const withLoading = async (cb) => {
    try {
      setLoading(true);
      await delay(400);
      await cb();
    } finally {
      setLoading(false);
    }
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [attire, setAttire] = useState(null);

  const timeOrder = {
    '7:00 - 8:30 AM': 1,
    '8:30 - 10:00 AM': 2,
    '10:00 - 11:30 AM': 3,
    '1:00 - 2:30 PM': 4,
    '2:30 - 4:00 PM': 5,
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
      setPage(0);
    });
  };

  const handleDownload = async () => {
    try {
      const response = await AxiosInstance.get("appointment/export/csv/", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "approved_appointments.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Download successful!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Slide,
      });

    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download approved appointments.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Slide,
      });
    }
  };

  const columns = [
    { id: 'firstName', label: 'First Name', minWidth: 150, align: 'center' },
    { id: 'lastName', label: 'Last Name', minWidth: 150, align: 'center' },
    { id: 'date', label: 'Date', minWidth: 100, align: 'center' },
    { id: 'time', label: 'Time', minWidth: 100, align: 'center' },
    { id: 'appointment_status', label: 'Status', minWidth: 120, align: 'center' },
    { id: 'actions', label: 'Actions', minWidth: 100, align: 'center' },
  ];

  const fetchAppointments = async () => {
    await withLoading(async () => {
      const response = await AxiosInstance.get('appointment/appointments/');
      const approvedAppointments = response.data
        .filter((app) => app.appointment_status?.toLowerCase() === 'approved')
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
          const timeA = timeOrder[a.time] || 999;
          const timeB = timeOrder[b.time] || 999;
          return timeA - timeB;
        });

      setRows(approvedAppointments);
      setTotalAppointments(approvedAppointments.length);
    });
  };

  const refreshAppointments = async () => {
    try {
      const response = await AxiosInstance.get('appointment/appointments/');
      const approvedAppointments = response.data
        .filter((app) => app.appointment_status?.toLowerCase() === 'approved')
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
          const timeA = timeOrder[a.time] || 999;
          const timeB = timeOrder[b.time] || 999;
          return timeA - timeB;
        });

      setRows(approvedAppointments);
      setTotalAppointments(approvedAppointments.length);
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  const getAttireImage = async (appointment) => {
    if (!appointment.attire_from_gallery) {
      setAttire(null);
      return;
    }
    try {
      const response = await AxiosInstance.get(
        `/gallery/admin/attire/${appointment.attire_from_gallery}/`
      );
      setAttire(response.data);
    } catch (err) {
      console.error("Failed to fetch attire:", err);
      setAttire(null);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpen = async (appointment) => {
    setSelectedAppointment(appointment);
    await getAttireImage(appointment);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedAppointment(null);
    setAttire(null);
    setOpen(false);
  };

  const handleOpenCreate = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setSelectedAppointment(null);
    setOpenCreate(false);
  };

  const handleSearchChange = async (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setPage(0);
  };

  const handleChangePage = async (event, newPage) => {
    await withLoading(async () => setPage(newPage));
  };

  const handleChangeRowsPerPage = async (event) => {
    await withLoading(async () => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    });
  };

  const getStatusColor = (status) => {
    if (status?.toLowerCase() === 'approved') return '#11B364';
    return '#000000';
  };

  const filteredRows = rows.filter((appointment) => {
    const matchesSearch = Object.values(appointment)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm);

    const matchesDate = selectedDate
      ? appointment.date === dayjs(selectedDate).format('YYYY-MM-DD')
      : true;

    return matchesSearch && matchesDate;
  });

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
        <AppHeader headerTitle="Approved Appointments" />

        <div className="approve-filter-container">
          <div className="filter">
            <DatePickerComponent
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="approve-all-btn">
            <ButtonElement
              label='All'
              variant='outlined-black'
              onClick={handleShowAll}
            />
          </div>

          <div className="approve-all-btn">
            <ButtonElement
              label='Download'
              variant='outlined-black download'
              onClick={handleDownload}
            />
          </div>
        </div>
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
                <TableRow sx={{ height: '100px' }}>
                  <TableCell colSpan={columns.length} align="center">
                    No Approved Appointments
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
                        <div className="actions">
                          <button
                            style={{
                              background: 'transparent',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
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
                                color: 'rgba(56, 56, 56, 0.72)',
                                fontSize: 26,
                                cursor: 'pointer',
                                '&:hover': { color: '#000000ff' },
                                transition: 'all 0.3s ease',
                              }}
                            />
                          </button>

                          <button
                            style={{
                              background: 'transparent',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            className="done-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenCreate(appointment);
                            }}
                          >
                            <CheckCircleTwoToneIcon
                              sx={{
                                color: '#11b3658a',
                                fontSize: 24,
                                cursor: 'pointer',
                                '&:hover': { color: '#11b365ff' },
                              }}
                            />
                          </button>
                        </div>
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
              attire={attire}
            />
          )}
        </Dialog>

        <Dialog
          open={openCreate}
          onClose={handleCloseCreate}
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
            <ProjectModal 
              onClose={handleCloseCreate}
              appointment={selectedAppointment}
              onUpdate={fetchAppointments}
            />
          )}
        </Dialog>
      </Paper>

      <ToastContainer />
    </>
  );
}
