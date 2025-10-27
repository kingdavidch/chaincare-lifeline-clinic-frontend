import * as React from 'react';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

export default function SortItem({ onFilterStatusChange, status }) {
  const handleChange = (event) => {
    const selectedStatus = event.target.value;
    onFilterStatusChange(selectedStatus);
  };
  return (
    <Box
      sx={{
        border: '1px solid #dddddd',
        borderRadius: 1,
        pl: 2,
        color: 'text.disabled',
        width: 180,
        display: 'flex',
        alignItems: 'center',
        background: '#F8F9FD',
      }}
    >
      <Typography>Sort by:</Typography>
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
        <Select value={status} onChange={handleChange} displayEmpty sx={{ height: 42 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="locked">Locked</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="expired">Expired</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

SortItem.propTypes = {
  onFilterStatusChange: PropTypes.func,
  status: PropTypes.string,
};
