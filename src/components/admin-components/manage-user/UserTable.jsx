import './styles/manageUser.css';
import * as React from 'react';
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
import ModalForDisplaying from './manage-info/ModalForDisplaying';

export default function UserTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDisplay, setOpenDisplay] = useState(false);
  const [userId, setUserId] = useState('');

  const handleOpenDisplay = (id) => {
    setOpenDisplay(true);
    setUserId(id);
  };

  const handleCloseDisplay = () => {
    setOpenDisplay(false);
  };

  // Loading wrapper function
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const withLoading = async (cb) => {
    try {
      setLoading(true);
      await delay(400); // visible delay
      await cb();
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Calculate user statistics based on designs
  const calculateUserStats = (userId) => {
    const userDesigns = designs.filter(design => design.user === userId);
    
    const finishedCount = userDesigns.filter(design => 
      design.process_status === 'done' || design.process_status === 'picked_up'
    ).length;
    
    const cancelledCount = userDesigns.filter(design => 
      design.process_status === 'cancelled'
    ).length;

    const ongoingCount = userDesigns.filter(design => 
      design.process_status !== 'done' && 
      design.process_status !== 'picked_up' && 
      design.process_status !== 'cancelled'
    ).length;

    return {
      total_finish: finishedCount,
      total_cancelled: cancelledCount,
      total_ongoing: ongoingCount
    };
  };

  const filteredRows = rows.filter((user) =>
    Object.values(user)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm)
  );

  const handleChangePage = async (event, newPage) => {
    await withLoading(async () => {
      setPage(newPage);
    });
  };

  const handleChangeRowsPerPage = async (event) => {
    await withLoading(async () => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    });
  };

  const columns = [
    { id: 'full_name', label: 'Full Name', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 150, align: 'center' },
    { id: 'address', label: 'Address', minWidth: 150, align: 'center' },
    { id: 'facebook_link', label: 'Facebook Link', minWidth: 120, align: 'center' },
    { id: 'contact', label: 'Contact', minWidth: 120, align: 'center' },
    { id: 'ongoing', label: 'Ongoing', minWidth: 100, align: 'center' },
    { id: 'cancels', label: 'Cancels', minWidth: 100, align: 'center' },
    { id: 'finish', label: 'Finish Projects', minWidth: 130, align: 'center' },
    { id: 'Measurement', label: 'Measurement', minWidth: 120, align: 'center' },
  ];

  const fetchUsers = async () => {
    try {
      const response = await AxiosInstance.get('/auth/users/');
      setRows(response.data.reverse());
      setTotalUsers(response.data.length);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchDesigns = async () => {
    try {
      const response = await AxiosInstance.get('/design/designs/');
      setDesigns(response.data);
    } catch (error) {
      console.error('Failed to fetch designs:', error);
    }
  };

  const fetchAllData = async () => {
    await withLoading(async () => {
      await Promise.all([fetchUsers(), fetchDesigns()]);
    });
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    console.log('Users:', rows);
    console.log('Designs:', designs);
  }, [rows, designs]);

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="table-header">
        <div className="search-user-container">
          <SearchIcon />
          <TextField 
            id="outlined-basic" 
            label="" 
            variant="outlined" 
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none', 
                },
                '&:hover fieldset': {
                  border: 'none', 
                },
                '&.Mui-focused fieldset': {
                  border: 'none', 
                },
              },
            }}
            placeholder='Search user...'
            onChange={handleSearchChange}
            value={searchTerm}
          />
        </div>

        <div className="total-user">
          <span>Users:</span><div className="totalUser">{totalUsers}</div>
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
          <Table stickyHeader aria-label="users table">
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
                    No Data Available
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => {
                    // Combine first_name and last_name into full_name
                    const fullName = [user.first_name, user.last_name]
                      .filter(Boolean)
                      .join(' ') || '—';

                    // Calculate user statistics
                    const stats = calculateUserStats(user.id);

                    return (
                      <TableRow hover key={user.id}>
                        <TableCell>{fullName}</TableCell>
                        <TableCell align="center">{user.email}</TableCell>
                        <TableCell align="center">{user.address || '—'}</TableCell>
                        <TableCell align="center">
                          {user.facebook_link ? (
                            <a
                              href={user.facebook_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#1976d2', textDecoration: 'none' }}
                            >
                              Visit
                            </a>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {user.phone_number || '—'}
                        </TableCell>
                        <TableCell align="center">
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontWeight: '600',
                            color: stats.total_ongoing > 0 ? '#F59E0B' : '#6B7280'
                          }}>
                            {stats.total_ongoing}
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontWeight: '600',
                            color: user.cancels > 0 ? '#F04438' : '#6B7280'
                          }}>
                            {user.cancels}
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontWeight: '600',
                            color: stats.total_finish > 0 ? '#11B364' : '#6B7280'
                          }}>
                            {stats.total_finish}
                          </div>
                        </TableCell>
                        <TableCell 
                          align="center"
                          onClick={() => handleOpenDisplay(user.id)}
                          sx={{
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            }
                          }}
                        >
                          {user.has_messurements ? (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              gap: '5px',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              transition: 'all 0.2s ease',
                            }}>
                              <span style={{ 
                                color: '#11B364', 
                                fontWeight: '600',
                              }}>
                                Yes
                              </span>
                            </div>
                          ) : (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              gap: '5px',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              transition: 'all 0.2s ease',
                            }}>
                              <span style={{ 
                                color: '#F04438', 
                                fontWeight: '600',
                              }}>
                                No
                              </span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={openDisplay}
          onClose={handleCloseDisplay}
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
          <ModalForDisplaying 
            isOpen={openDisplay}
            onClose={handleCloseDisplay}
            id={userId}
          />
        </Dialog>

        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}