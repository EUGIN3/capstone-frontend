import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function StatusDropdown({ items, onChange, value }) {
  const handleChange = (event) => {
    const newValue = event.target.value;
    if (onChange) onChange(newValue);
  };

  return (
    <FormControl fullWidth>
      <Select
        id="controlled-select"
        value={value || ''}
        onChange={handleChange}
        className='dropdown'
      >
        {items.map((item, index) => (
          <MenuItem key={index} value={item.value} disabled={item.disabled}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
