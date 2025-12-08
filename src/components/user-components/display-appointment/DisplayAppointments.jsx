import React, { useState, useEffect } from 'react'

import AppHeader from '../user-header/userHeader'
import ButtonElement from '../../forms/button/ButtonElement'
import Appointment from './appointment/Appointment'
import FittingAppointment from './appointment/FittingAppointment'
import StatusFilter from '../../forms/status-filter/StatusFilter'

import AxiosInstance from '../../API/AxiosInstance'
import { useNavigate } from 'react-router-dom'

import './DisplayAppointment.css'
import '../user-header/UserComponents.css'

import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

function DisplayAppointments() {
  const [filterStatus, setFilterStatus] = useState('');
  const [userAppointments, setUserAppointments] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const navigation = (path) => navigate(path);

  const fetchUserDesigns = async () => {
    try {
      // ⏱️ Artificial loading delay (0.4 seconds)
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const response = await AxiosInstance.get('/design/user_designs/');
      setDesigns(response.data);
      console.log('✅ Designs fetched:', response.data);
    } catch (error) {
      console.error('❌ Failed to fetch designs:', error);
      throw error;
    }
  };

  const listAppointments = async () => {
    try {
      // ⏱️ Artificial loading delay (0.4 seconds)
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const response = await AxiosInstance.get('appointment/user_appointments/');
      const reversedList = response.data.slice().reverse(); 
      setUserAppointments(reversedList);
    } catch (error) {
      console.error('❌ Failed to fetch appointments:', error);
      throw error;
    }
  };

  // ✅ Updated to refresh all data instead of updating single appointment
  const handleUpdate = async () => {
    try {
      await listAppointments();
    } catch (error) {
      console.error('❌ Failed to refresh appointments:', error);
    }
  };

  const renderAppointmentsByStatus = (statusLabel) => {
    return userAppointments
      .filter((app) => {
        // Safety check: ensure app exists
        if (!app) return false;

        if (statusLabel === "") {
          return app.appointment_status !== "archived" && app.appointment_status !== "project";
        }

        return app.appointment_status === statusLabel;
      })
      .map((app) => (
        <Appointment
          key={app.id}
          id={app.id}
          date={app.date}
          time={app.time}
          facebookLink={app.facebook_link}
          adress={app.address}
          description={app.description}
          image={app.image}
          status={app.appointment_status}
          appointment_type={app.appointment_type}
          onUpdate={handleUpdate}
        />
      ));
  };

  const renderFittingAppointment = () => {
    if (filterStatus !== 'fitting' && filterStatus !== '') return null;

    const fittingAppointments = designs.filter(
      (app) => app.fitting_date && app.fitting_time && !app.fitting_successful
    );

    return fittingAppointments.map((fit) => (
      <FittingAppointment
        key={fit.id}
        fitting_date={fit.fitting_date}
        fitting_time={fit.fitting_time}
      />
    ));
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchData();
  };

  // Skeleton loader component
  const AppointmentSkeleton = () => (
    <div className="appointment-skeleton">
      <div className="skeleton-line skeleton-header"></div>
      <div className="skeleton-line skeleton-content"></div>
      <div className="skeleton-line skeleton-content"></div>
      <div className="skeleton-line skeleton-footer"></div>
    </div>
  );

  // ✅ Fetch data on mount
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        listAppointments(),
        fetchUserDesigns()
      ]);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError('Failed to load appointments. Please try again.');
      setUserAppointments([]);
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAppointments = renderAppointmentsByStatus(filterStatus);
  const fittingAppointments = renderFittingAppointment();
  const hasAppointments = filteredAppointments.length > 0 || (fittingAppointments && fittingAppointments.length > 0);

  return (
    <div className='appContainer' style={{ position: 'relative' }}>
      
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className='top-all-app'>
        <AppHeader headerTitle='all appointment' />
        <div className='top-all-app-btn-con'>
          <ButtonElement 
            label='Set appointment' 
            variant='filled-black' 
            type='button' 
            onClick={() => navigation('/user/set-appointment')}
            disabled={loading}
          />
        </div>
      </div>

      <hr className='all-app-hr' />

      <div className='status-drop-container'>
        <StatusFilter 
          onFilterChange={setFilterStatus}
          disabled={loading}
        />
      </div>

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
      <div className="show-appointment-list">
        {loading ? (
          // Show skeleton loaders while loading
          <>
            <AppointmentSkeleton />
            <AppointmentSkeleton />
            <AppointmentSkeleton />
          </>
        ) : !error && hasAppointments ? (
          // Show actual appointments
          <>
            {filteredAppointments}
            {fittingAppointments}
          </>
        ) : !error ? (
          // Show empty state
          <div className="empty-state">
            <p>No appointments found</p>
            <p className="empty-state-subtitle">
              {filterStatus 
                ? 'Try changing the filter or create a new appointment' 
                : 'Create your first appointment to get started'}
            </p>
          </div>
        ) : null}
      </div>

      <ToastContainer />
    </div>
  );
}

export default DisplayAppointments;