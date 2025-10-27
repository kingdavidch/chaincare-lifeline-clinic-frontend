import * as React from 'react';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

export default function DropFilter({ onFilterStatusChange }) {
  const [status, setStatus] = React.useState('');

  const handleChange = (event) => {
    const selectedStatus = event.target.value;
    setStatus(selectedStatus);
    onFilterStatusChange(selectedStatus);
  };

  return (
    <Box
      sx={{
        border: '1px solid #dddddd',
        borderRadius: 1,
        pl: 2,
        color: 'text.disabled',
        width: 220,
        display: 'flex',
        alignItems: 'center',
        background: '#F8F9FD',
      }}
    >
      <Typography>Filter by:</Typography>
      <FormControl
        sx={{
          '& .MuiOutlinedInput-root': {
            borderColor: '#F8F9FD',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#F8F9FD',
            },
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: '#F8F9FD',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#F8F9FD',
            },
          },
        }}
      >
        <Select
          value={status}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{
            height: 42,
          }}
          InputProps={{
            endAdornment: null,
          }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="denied">Denied</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

DropFilter.propTypes = {
  onFilterStatusChange: PropTypes.func,
};
