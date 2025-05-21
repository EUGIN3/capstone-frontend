import React from 'react'

import '../../styles/AdminComponents.css'
import './ManageSchedule.css'

import Construction from '../../Construction'

import BigCalendar from '../../BigCalendar/BigCalendar'

const ManageSchedule = () => {
  return (
    <div className='adminAppContainer manageSchedule'>
      <div className="manageSchedule-calendar">
        <BigCalendar />
      </div>
    </div>
  )
}

export default ManageSchedule