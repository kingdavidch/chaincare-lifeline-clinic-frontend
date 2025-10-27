import { useState } from 'react';

import PropTypes from 'prop-types';

import { Box, Select, MenuItem, Typography, FormControl } from '@mui/material';

export default function DropFilter({ onFilterStatusChange }) {
  const [status, setStatus] = useState('');

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
      <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Status:</Typography>
      <FormControl sx={{ ml: 2, flex: 1 }}>
        <Select
          value={status}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{
            height: 42,
            background: 'white',
          }}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Processing">Processing</MenuItem>
          <MenuItem value="Failed">Failed</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

DropFilter.propTypes = {
  onFilterStatusChange: PropTypes.func.isRequired,
};
