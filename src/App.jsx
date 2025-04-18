import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'

import RequestResetPassword from './components/RequestResetPassword'
import ResetPassword from './components/ResetPassword'

import ProtectedRoute from './components/ProtectedRoute'


function App() {
  return (

    <div className='main'>
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/request-reset-password' element={<RequestResetPassword />}/>
        <Route path='/reset-password/:token' element={<ResetPassword />}/>
      </Routes>

      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<Home />}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
