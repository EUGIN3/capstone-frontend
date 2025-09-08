import './AdminDashboard.css';
import React from 'react';

function AdminDashboard() {
  return (
    <div className="admin-dashboard-container">
      {/* Header Section */}
      <div className="header-container">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, Administrator</p>
        </div>
      </div>

      {/* Top Panel */}
      <div className="dashboard-panel main-panel">
        <h2>Overview Statistics</h2>
        <div className="panel-content">
          {/* Add analytics overview components here */}
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="lower-dashboard-container">
        {/* Left Panel */}
        <div className="dashboard-panel left-panel">
          <h2>Recent Activities</h2>
          <div className="panel-content">
            {/* Add activity list or timeline here */}
          </div>
        </div>

        {/* Right Section with 4 Panels */}
        <div className="right-panels-grid">
          <div className="dashboard-panel small-panel">
            <h2>Appointments</h2>
            <div className="panel-content">
              {/* Add appointment statistics here */}
            </div>
          </div>
          <div className="dashboard-panel small-panel">
            <h2>Users</h2>
            <div className="panel-content">
              {/* Add user statistics here */}
            </div>
          </div>
          <div className="dashboard-panel small-panel">
            <h2>Services</h2>
            <div className="panel-content">
              {/* Add service statistics here */}
            </div>
          </div>
          <div className="dashboard-panel small-panel">
            <h2>Revenue</h2>
            <div className="panel-content">
              {/* Add revenue statistics here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
