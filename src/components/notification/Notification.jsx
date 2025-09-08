import './Notification.css';
import { useState, useEffect } from 'react';

import React from 'react'

function Notification() {
  return (
    <div className="notification-container">
      <div className="header-container">
        <div className="header-left">
          <h1>Notification</h1>
        </div>
      </div>

      <div className="notification-content">
        <p className="no-notif">No new notifications</p>
      </div>
    </div>
  )
}

export default Notification

