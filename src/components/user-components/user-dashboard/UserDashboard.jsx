import './UserDashboard.css';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../animation/AnimatedBackground';
import AxiosInstance from '../../API/AxiosInstance'
import { Tooltip, Menu, MenuItem, LinearProgress, Box, Typography, IconButton } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VisibilityIcon from '@mui/icons-material/Visibility';

function UserDashboard() {
  const navigate = useNavigate();

  const [upCommingApp, setUpCommingApp] = useState([])
  const [upCommingFit, setUpCommingFit] = useState([])
  const [projectProgress, setProjectProgress] = useState([])
  const [amountPaid, setAmountPaid] = useState(0)
  const [nearestUpcoming, setNearestUpcoming] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Process status to percentage mapping
  const STATUS_PERCENTAGES = {
    'concept': 7,
    'sketching': 14,
    'designing': 21,
    'material_selection': 28,
    'pattern_making': 35,
    'cutting': 42,
    'sewing': 50,
    'materializing': 57,
    'fitting': 64,
    'alterations': 71,
    'final_fitting': 85,
    'ready': 92,
    'picked_up': 100,
    'done': 100,
  };

  const getProgressPercentage = (processStatus) => {
    return STATUS_PERCENTAGES[processStatus] || 0;
  };

  const getProgressColor = (percentage) => {
    if (percentage < 30) return '#F04438'; // Red
    if (percentage < 70) return '#F59E0B'; // Orange
    return '#11B364'; // Green
  };

  const fetchAppointment = async () => {
    const res = await AxiosInstance('/appointment/user_appointments/')
    const pending = res.data.filter(a => a.appointment_status === 'approved');
    setUpCommingApp(pending)
  }

  const fetchDesign = async () => {
    const des = await AxiosInstance('/design/user_designs/')
    
    // Filter out completed projects (done or picked_up)
    const activeProjects = des.data.filter(
      d => d.process_status !== 'done'
    );
    
    setProjectProgress(activeProjects);
    
    // Set the first active project as selected by default
    if (activeProjects.length > 0) {
      setSelectedProject(activeProjects[0]);
    }

    const not_done = des.data.filter(d => d.fitting_successful === false);
    setUpCommingFit(not_done)

    const totalAmount = des.data.reduce(
      (sum, item) => sum + parseFloat(item.amount_paid || 0),
      0
    );

    const formattedAmount = totalAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    setAmountPaid(formattedAmount)
  }

  const getNearestUpcomingDate = (apps, fits) => {
    const today = new Date();

    const appDates = apps
      .map(a => new Date(a.date))
      .filter(d => d >= today);

    const fitDates = fits
      .map(f => new Date(f.fitting_date))
      .filter(d => d >= today);

    const allDates = [...appDates, ...fitDates];

    if (allDates.length === 0) return null;

    // Sort and return the nearest date
    allDates.sort((a, b) => a - b);
    return allDates[0];
  };

  const formatReadableDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    handleMenuClose();
  };

  const handleViewProject = (e) => {
    e.stopPropagation();
    if (selectedProject) {
      navigate(`/user/on-going-project/${selectedProject.id}`);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchAppointment();
      await fetchDesign();
    };
    loadData();
  }, []);

  useEffect(() => {
    const nearest = getNearestUpcomingDate(upCommingApp, upCommingFit);
    setNearestUpcoming(nearest);
  }, [upCommingApp, upCommingFit]);

  const slides = [
    { text: "Connect", path: "/user/message" },
    { text: "Design", path: "/user/generate" },
    { text: "Schedule", path: "/user/set-appointment" },
    { text: "Appointments", path: "/user/all-appointments" },
    { text: "Projects", path: "/user/projects" },
    { text: "Gallery", path: "/user/gallery" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef(null);

  // Auto-change text
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!hovered) {
        setFade(false);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % slides.length);
          setFade(true);
        }, 800);
      }
    }, 2500);

    return () => clearInterval(intervalRef.current);
  }, [hovered]);

  const handleClick = () => {
    navigate(slides[currentIndex].path);
  };

  const getCurrentPercentage = () => {
    if (!selectedProject) return 0;
    return getProgressPercentage(selectedProject.process_status);
  };

  const formatStatusText = (status) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-panel main-panel">
        <div className="panel-content">
          <AnimatedBackground>
            <div
              className="content"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={handleClick}
            >
              <p className={`slider-text ${fade ? 'fade-in' : 'fade-out'}`}>
                {slides[currentIndex].text}
              </p>
            </div>
          </AnimatedBackground>
        </div>
      </div>

      <div className="lowerdashboard-container">
          <div className="dashboard-panel appointment">
            <p className="lower-dashboard-label">
              🗓️ <span>Upcoming appointments</span> 
            </p>
            <p className="number-of-upcoming-appointment lower-panels-content">
              <p className="number-of-upcomming">
                {upCommingApp.length + upCommingFit.length}
              </p>
              <p className='date'>
                {nearestUpcoming ? formatReadableDate(nearestUpcoming) : "No upcoming"}
              </p>
            </p>
          </div>

          <div 
            className="dashboard-panel progress" 
            style={{ 
              cursor: 'default',
              position: 'relative'
            }}
          >
            <p className="lower-dashboard-label">
              🏗️ <span>Project progress</span> 
            </p>
            
            {projectProgress.length === 0 ? (
              <p className="project-progress lower-panels-content">
                No active projects
              </p>
            ) : (
              <Box sx={{ width: '100%', padding: '10px 20px' }}>
                {/* Project Selector with View Button */}
                <Box 
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <Box 
                    className="project-selector-dropdown"
                    onClick={handleMenuOpen}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      }
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {selectedProject?.attire_type || 'Select Project'}
                    </Typography>
                    <KeyboardArrowDownIcon />
                  </Box>

                  {/* View Button */}
                  <Tooltip title="View project details" arrow>
                    <IconButton
                      onClick={handleViewProject}
                      disabled={!selectedProject}
                      sx={{
                        backgroundColor: selectedProject ? 'rgba(17, 179, 100, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        color: selectedProject ? '#11B364' : 'rgba(0, 0, 0, 0.3)',
                        padding: '8px',
                        '&:hover': {
                          backgroundColor: selectedProject ? 'rgba(17, 179, 100, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                        },
                        '&:disabled': {
                          color: 'rgba(0, 0, 0, 0.3)',
                        }
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Progress Bar */}
                <Box sx={{ marginBottom: '8px' }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={getCurrentPercentage()}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getProgressColor(getCurrentPercentage()),
                        borderRadius: 5,
                      }
                    }}
                  />
                </Box>

                {/* Status and Percentage */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '8px'
                }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: '#666'
                    }}
                  >
                    {selectedProject ? formatStatusText(selectedProject.process_status) : '—'}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: getProgressColor(getCurrentPercentage())
                    }}
                  >
                    {getCurrentPercentage()}%
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  maxHeight: 300,
                  width: '280px',
                },
              }}
            >
              {projectProgress.map((project) => (
                <MenuItem 
                  key={project.id} 
                  onClick={() => handleProjectSelect(project)}
                  selected={selectedProject?.id === project.id}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: '4px' }}>
                      {project.attire_type}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {formatStatusText(project.process_status)} • {getProgressPercentage(project.process_status)}%
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </div>

          <div className="dashboard-panel amount">
            <p className="lower-dashboard-label">
              💵 <span>Amount Paid</span>
            </p>
            <p className="amount-paid lower-panels-content">
              ₱ {amountPaid}
            </p>
          </div>
      </div>
    </div>
  );
}

export default UserDashboard;