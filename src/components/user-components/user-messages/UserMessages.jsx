import './UserMessages.css'
import { useEffect, useState } from 'react';
import AxiosInstance from '../../API/AxiosInstance';
import NoControl from '../../forms/text-fields/NoControl'
import ButtonElement from '../../forms/button/ButtonElement';
import { Tooltip } from '@mui/material';

export default function UserChat() {
  const [messageInput, setMessageInput] = useState('');
  const [profile, setProfile] = useState(null); // use null for "not loaded"
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await AxiosInstance.get('/auth/profile/');
      setProfile(res.data);
    } catch (err) {
      console.error('fetchProfile error:', err.response?.data || err.message || err);
      setLoading(false);
    }
  }

  const fetchMessages = async () => {
    // guard: ensure profile is loaded
    if (!profile?.id) return;

    try {
      const mes = await AxiosInstance.get('/message/messages/');
      const filtered = mes.data.filter(msg =>
        msg.sender === profile.id || msg.receiver === profile.id
      );
      setMessages(filtered);
    } catch (err) {
      console.error('fetchMessages error:', err.response?.data || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!messageInput.trim() || sending) return;
    
    setSending(true);
    try {
      await AxiosInstance.post('/message/messages/', {
        receiver: 1, // or if this is user->admin flow, use admin id or logic
        content: messageInput
      });
      setMessageInput('');
      await fetchMessages();
    } catch (err) {
      console.error('handleSend error:', err.response?.data || err.message || err);
      alert('❌ Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  }

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
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile?.id) {
      fetchMessages();
      // optionally set interval to refresh every X seconds:
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [profile]);

  useEffect(() => {
    console.log('messages:', messages);
  }, [messages]);

  return (
    <div id='userMessages' style={{ position: 'relative' }}>
      
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="header">Messages</div>

      <div className="messages-content-container">
        <div className="user-profile">
          <p className="user-name">ADMIN <span>admin@gmail.com</span></p>
          <p className="date-today">
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>
        <div className="admin-messages-contents">
          {loading ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>Loading messages...</p>
          ) : messages.length > 0 ? (
            messages.map(msg => (
              <div key={msg.id} className={`messages-component ${msg.sender === profile?.id ? 'from-you' : 'from-admin'}`}>
                  
                <Tooltip title={formatTimestamp(msg.timestamp)} placement={`${msg.sender === profile.id ? "right" : "left"}`}>
                  <div className={`${msg.sender === profile?.id ? 'your-messages' : 'admin-messages'} indi-messages-component`}>
                    {msg.content}
                  </div>
                </Tooltip>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No messages yet</p>
          )}
        </div>

        <div className="send-text-box-container">
          <NoControl
            name='Message'
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeHolder='Enter your message here.'
            autoComplete="off"
            disabled={sending || loading}
          />

          <div className="send-button">
            <ButtonElement
              label={sending ? 'Sending...' : 'Send'}
              variant='filled-black'
              onClick={handleSend}
              disabled={sending || loading || !messageInput.trim()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}