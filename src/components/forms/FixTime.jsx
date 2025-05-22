import React, { useState } from 'react';
import DropdownConponent from './DropDown';

const FixTime = ({ onSelect, disabledSlots = {} }) => {
  const timeDropdownItems = [
    { value: '7:00 - 8:30 AM', label: '7:00 - 8:30 AM' },
    { value: '8:30 - 10:00 AM', label: '8:30 - 10:00 AM' },
    { value: '10:00 - 11:30 AM', label: '10:00 - 11:30 AM' },
    { value: '1:00 - 2:30 PM', label: '1:00 - 2:30 PM' },
    { value: '2:30 - 4:00 PM', label: '2:30 - 4:00 PM' },
  ];

  const handleDropdownChange = (value) => {
    if (onSelect) {
      onSelect(value); 
    }
  };

  return (
    <div>
      <DropdownConponent 
        items={timeDropdownItems.map(item => ({
          ...item,
          disabled: disabledSlots[item.value] === true,
        }))} 
        onChange={handleDropdownChange} 
        dropDownLabel={'Select Time'} 
      />
    </div>
  );
};


export default FixTime;
