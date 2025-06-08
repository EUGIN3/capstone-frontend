import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function StatusDropdown(props) {
  const { items, onChange, dropDownLabel, value } = props;

  const handleChange = (event) => {
    const newValue = event.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="controlled-select-label">{dropDownLabel}</InputLabel>
      <Select
        labelId="controlled-select-label"
        id="controlled-select"
        label={dropDownLabel}
        value={value || ''}
        onChange={handleChange}
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
