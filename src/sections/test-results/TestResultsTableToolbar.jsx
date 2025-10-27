import { useState } from 'react';

import PropTypes from 'prop-types';

import { Box, Button, Toolbar, OutlinedInput, InputAdornment } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Iconify from 'src/components/iconify';

import AddTestResultModal from './AddTestResultModal';

export default function TestResultsTableToolbar({ filterName, onFilterName, onFilterDateChange }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    onFilterDateChange(newValue ? newValue.format('YYYY-MM-DD') : '');
  };

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const commonHeight = 48;

  return (
    <>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        {/* Search Bar */}
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search Results"
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
            minWidth: 250,
            height: commonHeight,
            '& .MuiOutlinedInput-input': { padding: '10px 14px' },
          }}
        />

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                height: commonHeight,
                '& .MuiInputBase-root': { height: commonHeight },
              }}
            />
          </LocalizationProvider>

          {/* Add New Test Result Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#00AC4F',
              color: '#fff',
              height: commonHeight,
              '&:hover': { backgroundColor: '#1FA14A' },
            }}
            onClick={handleOpen}
          >
            + Add New
          </Button>
        </Box>
      </Toolbar>

      {/* Upload Test Result Modal */}
      <AddTestResultModal open={openModal} handleClose={handleClose} />
    </>
  );
}

TestResultsTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterDateChange: PropTypes.func,
};
