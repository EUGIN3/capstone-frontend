import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'

import RequestResetPassword from './components/resetPassword/RequestResetPassword'
import ResetPassword from './components/resetPassword/ResetPassword'

import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

import Navbar from './components/Navbar/Navbar'
import AdminNavbar from './components/AdminComponents/AdminNavbar/AdminNavbar'
import NotFound from './components/NotFound';


function App() {

  const admin = sessionStorage.getItem('IsAdmin') === 'true';

  return (
    <div className='main'>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/request-reset-password" element={<RequestResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to={'/user'} />} />
          <Route path="/user/*" element={<Navbar />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin/*" element={<AdminNavbar />} />
          </Route>
        </Route> */}

        {/* For development purposes */}
        <Route path="/" element={<Navigate to={'/user'} />} />
        <Route path="/user/*" element={<Navbar />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin/*" element={<AdminNavbar />} />
        </Route>


        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
