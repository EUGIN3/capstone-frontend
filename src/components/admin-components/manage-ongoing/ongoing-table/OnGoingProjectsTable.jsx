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
import AxiosInstance from '../../../API/AxiosInstance'
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import AppHeader from '../../../user-components/user-header/userHeader';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

import { useNavigate } from 'react-router-dom';


export default function OnGoingProjectsTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();


  const columns = [
    { id: 'user', label: 'UserName', minWidth: 150, align: 'center' },
    { id: 'attire_type', label: 'Attire Type', minWidth: 150, align: 'center' },
    { id: 'targeted_date', label: 'Target Date', minWidth: 150, align: 'center' },
    { id: 'process_status', label: 'Process Status', minWidth: 150, align: 'center' },
    { id: 'payment_status', label: 'Payment Status', minWidth: 150, align: 'center' },
    { id: 'amount_paid', label: 'Amount Paid', minWidth: 150, align: 'center' },
    { id: 'actions', label: 'Actions', minWidth: 100, align: 'center' },
  ];

  const fetchDesigns = async () => {
    try {
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
          userInfo: matchedUser ? matchedUser : null,
        };
      });

      // const ongoing = merged.filter(
      //   (design) => design.process_status?.toLowerCase() === 'ongoing'
      // );
    
      setRows(merged);
      setTotalProjects(merged.length);
    } catch (error) {
      console.error('❌ Failed to fetch designs or users:', error);
    }
  };

  // const formatDate = (date) => {
  //   const formattedDate = new Date(date).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //   });

  //   return formattedDate
  // }

  const formatDate = (date) => {
    if (!date) return '—';
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formattedDate;
  };



  useEffect(() => {
    fetchDesigns();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleView = (project) => {
    // alert(`Viewing project for: ${project.attire_type}`);
    navigate(`/admin/on-going-project/${project.id}`);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const filteredRows = rows.filter((project) =>
    Object.values(project).join(' ').toLowerCase().includes(searchTerm)
  );

  useEffect(() => {
    setTotalProjects(filteredRows.length);
  }, [filteredRows]);


  return (
    <div className='ongoing-projects'>
      <div className="ongoing-projects-header">
        <AppHeader headerTitle="Ongoing Projects" />
      </div>

      <div className="ongoing-projects-table-header">
        <div className="search-ongoing-container">
          <SearchIcon />
          <TextField
            variant="outlined"
            placeholder="Search ongoing projects..."
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

        <div className="total-ongoing">
          <span>Projects:</span>
          <div className="totalOngoing">{totalProjects}</div>
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
          <Table stickyHeader aria-label="ongoing projects table">
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
                    No Ongoing Projects
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((project) => (
                    <TableRow hover key={project.id} className="ongoing-projects-row">
                      <TableCell align="center">
                        {project.userInfo
                          ? `${project.userInfo.first_name || ''} ${project.userInfo.last_name || ''}`.trim()
                          : '—'}
                      </TableCell>
                      <TableCell align="center">{project.attire_type || '—'}</TableCell>
                      <TableCell align="center">{formatDate(project.targeted_date)}</TableCell>
                      <TableCell align="center">{project.process_status || '—'}</TableCell>
                      <TableCell align="center">{project.payment_status || '—'}</TableCell>
                      <TableCell align="center">{project.amount_paid || '—'}</TableCell>
                      <TableCell align="center">
                        <button
                          style={{
                            background: 'transparent',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                          }}
                          className="view-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(project);
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
