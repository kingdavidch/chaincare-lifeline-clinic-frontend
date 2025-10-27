import { useState } from 'react';

import PropTypes from 'prop-types';

import { Box, Select, Toolbar, MenuItem, Typography, InputLabel, FormControl, OutlinedInput, InputAdornment } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Iconify from 'src/components/iconify';

export default function WithdrawalsTableToolbar({
  filterName,
  onFilterName,
  filterStatus,
  onFilterStatusChange,
  onFilterDateChange,
}) {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    onFilterDateChange(newValue ? newValue.format('YYYY-MM-DD') : '');
  };

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: 3,
      }}
    >
      <Box>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          All Withdrawals
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Search Input */}
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search"
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
          sx={{
            backgroundColor: '#f8f9fd',
            borderRadius: '8px',
            minWidth: 220,
          }}
        />

        {/* Date Picker */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={selectedDate}
            onChange={handleDateChange}
            sx={{
              backgroundColor: '#f8f9fd',
              borderRadius: '8px',
              width: 180,
            }}
          />
        </LocalizationProvider>

        {/* Status Filter */}
        <FormControl sx={{ minWidth: 150, backgroundColor: '#f8f9fd', borderRadius: '8px' }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(event) => onFilterStatusChange(event.target.value)}
            displayEmpty
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Processing">Processing</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Toolbar>
  );
}

WithdrawalsTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  filterStatus: PropTypes.string,
  onFilterStatusChange: PropTypes.func,
  onFilterDateChange: PropTypes.func,
};