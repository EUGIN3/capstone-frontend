import * as React from 'react';
import './OnGoingProjectsTable.css';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Dialog, DialogContent } from '@mui/material';
import AxiosInstance from '../../../API/AxiosInstance'
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import AppHeader from '../../../user-components/user-header/userHeader';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import DatePickerComponent from '../../../forms/date-picker/DatePicker';
import ButtonElement from '../../../forms/button/ButtonElement';
import { toast } from 'react-toastify';
import CreateProjectModal from './CreateProjectModal';

export default function OnGoingProjectsTable() {
  const [loading, setLoading] = useState(false);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const withLoading = async (cb) => {
    try {
      setLoading(true);
      await delay(400); // visible delay
      await cb();
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'user', label: 'UserName', minWidth: 150, align: 'left' },
    { id: 'attire_type', label: 'Attire Type', minWidth: 150, align: 'center' },
    { id: 'targeted_date', label: 'Target Date', minWidth: 150, align: 'center' },
    { id: 'process_status', label: 'Status', minWidth: 150, align: 'center' },
    { id: 'payment_status', label: 'Payment Status', minWidth: 150, align: 'center' },
    { id: 'balance', label: 'Balance', minWidth: 150, align: 'center' },
    { id: 'actions', label: 'Actions', minWidth: 100, align: 'center' },
  ];

  const [isCreate, setIsCreate] = useState(false);

  const handleOpenCreate = () => {
    setIsCreate(true);
  };

  const handleCloseCreate = () => {
    setIsCreate(false);
  };

  const fetchDesigns = async () => {
    await withLoading(async () => {
      const [designRes, userRes] = await Promise.all([
        AxiosInstance.get('design/designs/'),
        AxiosInstance.get('auth/users/'),
      ]);

      const users = userRes.data;
      const designs = designRes.data;

      const merged = designs.map((design) => {
        const matchedUser = users.find((u) => u.id === design.user);
        return {
          ...design,
          userInfo: matchedUser || null,
        };
      });

      const ongoing = merged.filter(
        (design) => design.process_status?.toLowerCase().trim() !== 'done'
      );

      setRows(ongoing);
      setTotalProjects(ongoing.length);
    });
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0);
  };

  const handleView = (project) => {
    navigate(`/admin/on-going-project/${project.id}`);
  };

  const handleChangePage = async (event, newPage) => {
    await withLoading(() => setPage(newPage));
  };

  const handleChangeRowsPerPage = async (event) => {
    await withLoading(() => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    });
  };

  const handleDateChange = async (newValue) => {
    await withLoading(() => {
      setSelectedDate(newValue);
      setPage(0);
    });
  };

  const handleShowAll = async () => {
    await withLoading(() => {
      setSelectedDate(null);
      setSearchTerm('');
      setPage(0);
    });
  };

  const filteredRows = rows.filter((project) => {
    // Get full name from userInfo
    const fullName = project.userInfo 
      ? `${project.userInfo.first_name || ''} ${project.userInfo.last_name || ''}`.trim().toLowerCase()
      : '';
    
    // Build searchable string including full name
    const searchableFields = [
      fullName,
      project.attire_type,
      project.process_status,
      project.payment_status,
      project.balance
    ].filter(Boolean).join(' ').toLowerCase();
    
    const matchesSearch = searchableFields.includes(searchTerm);
    
    const matchesDate = selectedDate
      ? dayjs(project.targeted_date).format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD')
      : true;
    
    return matchesSearch && matchesDate;
  });

  useEffect(() => {
    setTotalProjects(filteredRows.length);
  }, [filteredRows]);

  // ✅ CSV Export function
  const handleDownloadCSV = async () => {
    try {
      const res = await AxiosInstance.get('design/export/csv/', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'designs.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV downloaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to download CSV.');
    }
  };

  return (
    <div className='ongoing-projects'>
      {/* Create Project Modal Dialog */}
      <Dialog 
        open={isCreate} 
        onClose={handleCloseCreate}
        maxWidth="sm"
        fullWidth
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
        <DialogContent sx={{ padding: 0 }}>
          <CreateProjectModal 
            onClose={handleCloseCreate}
            onProjectCreated={fetchDesigns}
          />
        </DialogContent>
      </Dialog>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="ongoing-projects-header">
        <AppHeader headerTitle="Ongoing Projects" />
        <div className="ongoing-filter-container">
          <div className="filter">
            <DatePickerComponent value={selectedDate} onChange={handleDateChange} />
          </div>
          <div className="ongoing-all-btn">
            <ButtonElement label="All" variant="outlined-black" onClick={handleShowAll} />
          </div>
          <div className="ongoing-download-btn">
            <ButtonElement label="Download" variant="outlined-black" onClick={handleDownloadCSV} />
          </div>
        </div>
      </div>

      <div className="ongoing-projects-table-header">
        <div className='create-search'>
          <div className="create-project">
            <ButtonElement
              label='Create'
              variant='filled-black'
              onClick={handleOpenCreate}
            />
          </div>

          <div className="search-ongoing-container">
            <SearchIcon />
            <TextField
              variant="outlined"
              placeholder="Name, attire type, status..."
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } } }}
              onChange={handleSearchChange}
              value={searchTerm}
            />
          </div>
        </div>


        <div className="total-ongoing">
          <span>Projects:</span>
          <div className="totalOngoing">{totalProjects}</div>
        </div>
      </div>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: '63vh', overflowY: 'scroll', scrollbarGutter: 'stable', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#bdbdbd', borderRadius: '10px' } }}>
          <Table stickyHeader aria-label="ongoing projects table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, fontWeight: 'bold' }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow sx={{ height: '100px' }}>
                  <TableCell colSpan={columns.length} align="center">No Ongoing Projects</TableCell>
                </TableRow>
              ) : (
                filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project) => (
                  <TableRow hover key={project.id} className="ongoing-projects-row">
                    <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
                      {project.userInfo ? `${project.userInfo.first_name || ''} ${project.userInfo.last_name || ''}`.trim() : '—'}
                    </TableCell>
                    <TableCell align="center" sx={{ textTransform: 'capitalize' }}>{project.attire_type || '—'}</TableCell>
                    <TableCell align="center">{formatDate(project.targeted_date)}</TableCell>
                    <TableCell align="center">{project.process_status ? project.process_status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '—'}</TableCell>
                    <TableCell align="center">{project.payment_status ? project.payment_status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '—'}</TableCell>
                    <TableCell align="center">{project.balance || '—'}</TableCell>
                    <TableCell align="center">
                      <button style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
                        className="view-btn" onClick={(e) => { e.stopPropagation(); handleView(project); }}>
                        <VisibilityTwoToneIcon sx={{ color: 'rgba(56, 56, 56, 0.72)', fontSize: 26, cursor: 'pointer', '&:hover': { color: '#000000ff' }, transition: 'all 0.3s ease' }} />
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
    </div>
  );
}