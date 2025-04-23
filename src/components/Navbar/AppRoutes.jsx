import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../appComponents/Dashboard';
import Appointment from '../appComponents/Appointment';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/dashboard" />}  />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/appointment" element={<Appointment />} />
    </Routes>
  );
}

export default AppRoutes;