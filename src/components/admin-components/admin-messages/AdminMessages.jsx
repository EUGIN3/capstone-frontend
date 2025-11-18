import './AdminMessages.css';
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import AxiosInstance from '../../API/AxiosInstance';
// import NormalTextField from '../../forms/text-fields/NormalTextField';
import NoControl from '../../forms/text-fields/NoControl'
import ButtonElement from '../../forms/button/ButtonElement'
import { Tooltip } from '@mui/material';


const AdminMessages = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedID, setSelectedID] = useState(null)
  const [conversation, setConversation] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [userProfile, setUserProfile] = useState('')


  const fetchUsers = async () => {
    const res = await AxiosInstance('/auth/users/');
    const filtered = res.data.filter(user => user.is_superuser === false); 
    setAllUsers(filtered)
  };

  const fetchAllMessages = async () => {
    const res = await AxiosInstance('/message/messages/');
    setAllMessages(res.data)
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setSelectedID(user.id)
    setUserProfile(user)

    // FILTER conversation:
    const convo = allMessages.filter(msg => 
      msg.sender === user.id || msg.receiver === user.id
    );

    setConversation(convo);
  };


  const handleSend = async () => {
    if (!messageInput || !selectedID) return;

    try {
      await AxiosInstance.post('/message/messages/', {
        receiver: selectedID,
        content: messageInput,
      });

      setMessageInput('');        // clear input
      await fetchAllMessages();   // refresh messages
      if (selectedUser) selectUser(selectedUser);

    } catch (err) {
      console.error('Axios error:', err.response?.data || err.message);
    }
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
    console.log(conversation)
  }, [conversation])

  useEffect(() => {
    fetchUsers()
    fetchAllMessages()
  }, []);

  useEffect(() => {
    // Function to fetch messages
    const interval = setInterval(() => {
      fetchAllMessages();
      if (selectedUser) selectUser(selectedUser); // refresh current conversation
    }, 1000); // 2000ms = 2 seconds

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, [selectedUser, allMessages]);


  return (
    <div className='admin-messages-container'>
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
          { selectedUser !== null && 
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
                    
                    <Tooltip title={formatTimestamp(msg.timestamp)} placement=
                    {`${msg.sender === 1 ? "left" : "right"}`}>
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
            
            {
              selectedUser !== null && 
            
              <div className="message-input-box">
                <NoControl
                  name='Message'
                  value={messageInput}                       
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeHolder='Enter your message here.'
                  autoComplete="off"
                />

                <div className="send-button">
                  <ButtonElement
                    label='Send'
                    variant='filled-black'
                    onClick={handleSend}
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