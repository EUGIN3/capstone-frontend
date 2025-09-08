import './App.css';

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// Components
import LandingPage from './components/landing-page/LandingPage';
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import NotFound from './components/not-found/NotFound';
import Register from './components/login-register/Register';
import Login from './components/login-register/Login';
import RequestResetPassword from './components/reset-password/RequestResetPassword';
import ResetPassword from './components/reset-password/ResetPassword';
import Navbar from './components/user-components/Navbar/Navbar';
import AdminNavbar from './components/admin-components/AdminNavbar/AdminNavbar';


function App() {
  return (
    <div className='main'>
      <Routes>
        <Route path="/estrope" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/request-reset-password" element={<RequestResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to={'/user'} />} />
          <Route path="/user/*" element={<Navbar />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin/*" element={<AdminNavbar />} />
            <Route path="/admin" element={<Navigate to={'/admin/dashboard'} />} />
          </Route>
        </Route> */}

        {/* For development purposes */}
        <Route path="/" element={<Navigate to={'/user'} />} />
        <Route path="/user/*" element={<Navbar />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/*" element={<AdminNavbar />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />


        {/* test */}
        <Route path="test" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;