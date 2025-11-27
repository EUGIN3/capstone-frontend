import './UserDashboard.css';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../animation/AnimatedBackground';
import AxiosInstance from '../../API/AxiosInstance'
import { Tooltip } from '@mui/material'

function UserDashboard() {
  const navigate = useNavigate();

  const [upCommingApp, setUpCommingApp] = useState([])
  const [upCommingFit, setUpCommingFit] = useState([])
  const [projectProgress, setProjectProgress] = useState([])
  const [amountPaid, setAmountPaid] = useState(0)
  const [nearestUpcoming, setNearestUpcoming] = useState(null);


  const fetchAppointment = async () => {
    const res = await AxiosInstance('/appointment/user_appointments/')
    const pending = res.data.filter(a => a.appointment_status === 'approved');
    setUpCommingApp(pending)
  }

  const fetchDesign = async () => {
    const des = await AxiosInstance('/design/user_designs/')
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

  useEffect(() => {
    fetchAppointment()
    fetchDesign()
  }, [])
  

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
    }, 2500); // change every 4 seconds

    return () => clearInterval(intervalRef.current);
  }, [hovered]);

  const handleClick = () => {
    navigate(slides[currentIndex].path);
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

        <Tooltip title='See more' arrow>
          <div className="dashboard-panel appointment">
            <p className="lower-dashboard-label">
              🗓️ <span>Upcomming appointments</span> 
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
        </Tooltip>

        <Tooltip title='See more' arrow>
          <div className="dashboard-panel progress">
            <p className="lower-dashboard-label">
              🏗️ <span>Project progress</span> 
            </p>
            <p className="project-progress lower-panels-content">
              {/* {projectProgress} */} 0
            </p>
          </div>
        </Tooltip>


        <Tooltip title='See more' arrow>
          <div className="dashboard-panel amount">
            <p className="lower-dashboard-label">
              💵 <span>Amount Paid</span>
            </p>
            <p className="amount-paid lower-panels-content">
              ₱ {amountPaid}
            </p>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}

export default UserDashboard;
