import React, {useState, useEffect} from 'react'
import './UserProjects.css'
import AppHeader from '../user-header/userHeader'
import IndividualProject from './IndividualProject'

import AxiosInstance from '../../API/AxiosInstance'

function UserProjects() {
  const [project, setProject] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchProject = async () => {
    try {
      const response = await AxiosInstance.get('/design/user_designs');
      const data = response.data;

      // ✅ Filter out designs with process_status === 'done' (case-insensitive)
      const filteredData = Array.isArray(data) 
        ? data.filter(project => 
            project.process_status?.toLowerCase().trim() !== 'done'
          )
        : [];

      setProject(filteredData);
    } catch (error) {
      console.error('❌ Failed to fetch user designs:', error);
      throw error; // Re-throw to be caught by main try-catch
    }
  };

  const fetchAppointment = async () => {
    try {
      const response = await AxiosInstance.get('/appointment/user_appointments/');
      const archived = response.data.filter(a => a.appointment_status === 'archived');
      setAppointment(archived);
    } catch (error) {
      console.error('❌ Failed to fetch appointments:', error);
      throw error; // Re-throw to be caught by main try-catch
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch both data sets simultaneously
        await Promise.all([
          fetchProject(),
          fetchAppointment()
        ]);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        setError('Failed to load projects. Please try again.');
        // Set fallback empty arrays on error
        setProject([]);
        setAppointment([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Retry function for error state
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    
    Promise.all([
      fetchProject().catch(() => {}),
      fetchAppointment().catch(() => {})
    ]).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className='UserProjects' style={{ position: 'relative' }}>
      
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <AppHeader 
        headerTitle="Projects:"
      />

      {/* Error State */}
      {error && !loading && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {!error && (
        <IndividualProject 
          project={project} 
          appointment={appointment}
          loading={loading}
        />
      )}
    </div>
  )
}

export default UserProjects