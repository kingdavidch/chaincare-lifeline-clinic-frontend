import React, { useState } from 'react';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Iconify from 'src/components/iconify';

export default function ClaimsTableToolbar({
  filterName,
  onFilterName,
  onFilterStatusChange,
  onDateFilterChange,
}) {
  const [selectedDate, setSelectedDate] = useState(null);

  // Function to format date as 'YYYY-MM-DD'
  const formatSelectedDate = (date) => (date ? date.format('YYYY-MM-DD') : '');

  // Handle date change
  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    onDateFilterChange(formatSelectedDate(newValue));
  };

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 3, 0, 3),
      }}
    >
      <Box>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          All Claims
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            pr: 2,
            minWidth: 220,
            '& .MuiOutlinedInput-input': {
              padding: '10px 14px',
            },
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
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                height: '42px',
                width: '150px',
              },
              '& .MuiInputLabel-shrink': {
                color: 'red',
              },
              '& .MuiInputBase-input': {
                color: 'black',
                fontWeight: 'bold',
              },
              '& .MuiFormLabel-root': {
                color: 'gray',
                marginTop: '-6px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ccc',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black',
              },
            }}
          />
        </LocalizationProvider>
      </Box>
    </Toolbar>
  );
}

ClaimsTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterStatusChange: PropTypes.func,
  onDateFilterChange: PropTypes.func,
};
