import './UserDashboard.css';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../animation/AnimatedBackground';

function UserDashboard() {
  const navigate = useNavigate();

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



      
        <div className="dashboard-panel">
          <h2>Panel 2</h2>
          <div className="panel-content">
            <p>Your content for panel 2</p>
          </div>
        </div>

        <div className="dashboard-panel">
          <h2>Panel 3</h2>
          <div className="panel-content">
            <p>Your content for panel 3</p>
          </div>
        </div>




      </div>
    </div>
  );
}

export default UserDashboard;
