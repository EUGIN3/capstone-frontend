import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from './components/Register'


function App() {
  return (

    <div className='main'>
      <Routes>
        <Route path='/' element={<Dashboard />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/Register' element={<Register />}/>
      </Routes>
    </div>
  )
}

export default App
