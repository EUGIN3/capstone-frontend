import './UserDashboard.css';
import React, { useEffect, useState } from 'react';

function UserDashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-panel main-panel">
        <h2>Panel 1</h2>
        <div className="panel-content">
          <p>Your content for panel 1</p>
          {/* Add your panel 1 content here */}
        </div>
      </div>
      
      <div className="lowerdashboard-container">
        <div className="dashboard-panel">
          <h2>Panel 2</h2>
          <div className="panel-content">
            <p>Your content for panel 2</p>
            {/* Add your panel 2 content here */}
          </div>
        </div>

        <div className="dashboard-panel">
          <h2>Panel 3</h2>
          <div className="panel-content">
            <p>Your content for panel 3</p>
            {/* Add your panel 3 content here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;

