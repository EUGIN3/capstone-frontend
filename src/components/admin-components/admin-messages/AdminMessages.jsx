import './AdminMessages.css';

import React from 'react';

const AdminMessages = () => {
  return (
    <div className='admin-messages-container'>
      <div className="admin-message-header"> 
        <h2>Messages</h2>
      </div>
      
     
      <div className="admin-message-content">
        <div className="messages-inbox">
          <p className="inbox-header">Inbox</p>

          <hr />

          <div className="individual-user-container">
            <div className="user-name">Eugine</div>
            <div className="message-preview">Hello, I would like to inquire about...</div>
          </div>
        </div>

        <div className="messages-contents">Content</div>

      </div>
    </div>
  );
};

export default AdminMessages;