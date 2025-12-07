import './AdminMessages.css';
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import AxiosInstance from '../../API/AxiosInstance';
import NoControl from '../../forms/text-fields/NoControl'
import ButtonElement from '../../forms/button/ButtonElement'
import { Tooltip } from '@mui/material';


const AdminMessages = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedID, setSelectedID] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [userProfile, setUserProfile] = useState('');
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

  const fetchUsers = async () => {
    const res = await AxiosInstance('/auth/users/');
    const filtered = res.data.filter(user => user.is_superuser === false); 
    setAllUsers(filtered);
  };

  const fetchAllMessages = async () => {
    const res = await AxiosInstance('/message/messages/');
    setAllMessages(res.data);
  };

  const selectUser = async (user) => {
    await withLoading(async () => {
      setSelectedUser(user);
      setSelectedID(user.id);
      setUserProfile(user);

      // FILTER conversation:
      const convo = allMessages.filter(msg => 
        msg.sender === user.id || msg.receiver === user.id
      );

      setConversation(convo);
    });
  };

  const handleSend = async () => {
    if (!messageInput || !selectedID) return;

    await withLoading(async () => {
      try {
        await AxiosInstance.post('/message/messages/', {
          receiver: selectedID,
          content: messageInput,
        });

        setMessageInput('');        // clear input
        await fetchAllMessages();   // refresh messages
        if (selectedUser) {
          // Update conversation without showing loading again
          const convo = allMessages.filter(msg => 
            msg.sender === selectedUser.id || msg.receiver === selectedUser.id
          );
          setConversation(convo);
        }

      } catch (err) {
        console.error('Axios error:', err.response?.data || err.message);
      }
    });
  };

  function formatTimestamp(timestamp) {
    const dateObj = new Date(timestamp);

    let month = dateObj.getMonth() + 1; // 0-indexed
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();

    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // convert 0 to 12

    return `${month.toString().padStart(2,'0')}/${day.toString().padStart(2,'0')}/${year} : ${hours.toString().padStart(2,'0')}:${minutes} ${ampm}`;
  }

  useEffect(() => {
    console.log(conversation);
  }, [conversation]);

  useEffect(() => {
    const fetchInitialData = async () => {
      await withLoading(async () => {
        await fetchUsers();
        await fetchAllMessages();
      });
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    // Function to fetch messages
    const interval = setInterval(() => {
      fetchAllMessages();
      if (selectedUser) {
        // Silent refresh without loading indicator
        const convo = allMessages.filter(msg => 
          msg.sender === selectedUser.id || msg.receiver === selectedUser.id
        );
        setConversation(convo);
      }
    }, 1000); // 1000ms = 1 second

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, [selectedUser, allMessages]);

  return (
    <div className='admin-messages-container'>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="admin-message-header"> 
        <h2>Messages</h2>
      </div>
      
      <div className="admin-message-content">
        <div className="messages-inbox">
          <p className="inbox-header">Inbox</p>

          <hr />
          {allUsers.length > 0 ? (
            allUsers.map((user) => (
              <div 
                key={user.id} 
                className={`individual-user-container ${selectedUser?.id === user.id ? "active-user" : ""}`}
                onClick={() => selectUser(user)}
                style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
              >
                <div className="user-name">
                  {user.first_name}
                </div>
              </div>
            ))
          ) : (
            <p className="no-users">No users found</p>
          )}
        </div>
        
        <div className="message-left-side">
          {selectedUser !== null && 
            <div className="user-profile-admin">
              <div className="username">
                {userProfile.first_name} {userProfile.last_name}
                <span>{userProfile.email}</span>
              </div>
              
              <p className="date-today">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>
          }

          <div className="messages-contents">
            {!selectedUser ? (
              <p className="no-user-selected">Select a user to view messages</p>
            ) : conversation.length === 0 ? (
              <p className="no-messages">No messages yet</p>
            ) : (
              conversation.map((msg) => (
                <div 
                  key={msg.id}
                  className={`indi-message ${msg.sender === 1 ? "admin-message" : "user-message"}`}
                >
                  <Tooltip title={formatTimestamp(msg.timestamp)} placement={`${msg.sender === 1 ? "left" : "right"}`}>
                    <div 
                      className={`indi-content ${msg.sender === 1 ? "admin-content" : "user-content"}`}
                    >
                      {msg.content}
                    </div>
                  </Tooltip>
                </div>
              ))
            )}
          </div>
          
          {selectedUser !== null && 
            <div className="message-input-box">
              <NoControl
                name='Message'
                value={messageInput}                       
                onChange={(e) => setMessageInput(e.target.value)}
                placeHolder='Enter your message here.'
                autoComplete="off"
                disabled={loading}
              />

              <div className="send-button">
                <ButtonElement
                  label='Send'
                  variant='filled-black'
                  onClick={handleSend}
                  disabled={loading}
                />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;