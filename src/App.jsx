import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'

import RequestResetPassword from './components/RequestResetPassword'
import ResetPassword from './components/ResetPassword'

import ProtectedRoute from './components/ProtectedRoute'

import Navbar from './components/Navbar/Navbar'
import NotFound from './components/NotFound';


function App() {
  return (
    <div className='main'>
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/request-reset-password' element={<RequestResetPassword />}/>
        <Route path='/reset-password/:token' element={<ResetPassword />}/>

        {/* <Route path="/" element={<Navigate to="/user/dashboard"/>}/>
        <Route path='/user/*' element={<Navbar/>}/> */}
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/user"/>}/>
          <Route path='/user/*' element={<Navbar/>}/>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
