import React from 'react'

import './styles/Construction.css'

import HandymanTwoToneIcon from '@mui/icons-material/HandymanTwoTone';

function Construction() {
  return (
    <div className='underConstruction'>
        <div className="construction-icon-container">
            <HandymanTwoToneIcon 
              sx={{
                fontSize: 100,
                // color: '#1976d2',
              }} 
            />
        </div>
        Sorry, but this part is Under Construction. 
    </div>
  )
}

export default Construction