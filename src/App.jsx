import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from './components/Register'

import RequestResetPassword from './components/RequestResetPassword'
import ResetPassword from './components/ResetPassword'


function App() {
  return (

    <div className='main'>
      <Routes>
        <Route path='/' element={<Dashboard />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/request-reset-password' element={<RequestResetPassword />}/>
        <Route path='/reset-password' element={<ResetPassword />}/>
        {/* <Route path='/reset-password/:token' element={<RequestResetPassword />}/> */}
      </Routes>
    </div>
  )
}

export default App
