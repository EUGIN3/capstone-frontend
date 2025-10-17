import DropdownComponentTime from '../time-dropdown/DropDownForTime'

const FixTime = ({ onSelect, disabledSlots = {}, value, control, name }) => {
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
      <DropdownComponentTime 
        items={timeDropdownItems.map(item => ({
          ...item,
          disabled: disabledSlots[item.value] === true,
        }))} 
        onChange={handleDropdownChange}
        dropDownLabel={'Select Time'}
        value={value}
        control={control}
        name={name} 
      />
    </div>
  );
};


export default FixTime;



// import * as React from 'react';
// import Box from '@mui/material/Box';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

// export default function FixTime() {
//   const [age, setAge] = React.useState('');

//   const handleChange = (event) => {
//     setAge(event.target.value);
//   };

//   return (
//     <Box sx={{ minWidth: 120 }}>
//       <FormControl fullWidth>
//         <InputLabel id="demo-simple-select-label">Age</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           value={age}
//           label="Age"
//           onChange={handleChange}
//         >
//           <MenuItem value={10}>Ten</MenuItem>
//           <MenuItem value={20}>Twenty</MenuItem>
//           <MenuItem value={30}>Thirty</MenuItem>
//         </Select>
//       </FormControl>
//     </Box>
//   );
// }

