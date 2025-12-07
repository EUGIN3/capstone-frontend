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
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

export default function UserTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

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
    { id: 'first_name', label: 'First Name', minWidth: 120 },
    { id: 'last_name', label: 'Last Name', minWidth: 120, align: 'center' },
    { id: 'email', label: 'Email', minWidth: 180, align: 'center' },
    { id: 'address', label: 'Address', minWidth: 180, align: 'center' },
    { id: 'facebook_link', label: 'Facebook Link', minWidth: 180, align: 'center' },
    { id: 'actions', label: 'Actions', minWidth: 100, align: 'center' },
  ];

  const fetchUsers = async () => {
    await withLoading(async () => {
      try {
        const response = await AxiosInstance.get('auth/users/');
        setRows(response.data.reverse());
        setTotalUsers(response.data.length);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
                  .map((user) => (
                    <TableRow hover key={user.id}>
                      <TableCell>{user.first_name || '—'}</TableCell>
                      <TableCell align="center">{user.last_name || '—'}</TableCell>
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
                        <button
                          style={{
                            background: 'transparent',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                          }}
                          onClick={() => alert(`Viewing user ${user.email}`)}
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
