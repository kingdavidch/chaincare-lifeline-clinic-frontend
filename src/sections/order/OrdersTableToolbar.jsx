import { useState } from 'react';

import PropTypes from 'prop-types';

import {
  Box,
  Select,
  Toolbar,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Iconify from 'src/components/iconify';

export default function OrdersTableToolbar({
  filterName,
  onFilterName,
  filterStatus,
  onFilterStatusChange,
  filterPaymentMethod,
  onFilterPaymentChange,
  onFilterDateChange,
}) {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    onFilterDateChange(newValue ? newValue.format('YYYY-MM-DD') : '');
  };

  return (
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
      <OutlinedInput
        value={filterName}
        onChange={onFilterName}
        placeholder="Search Orders"
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
          '& .MuiOutlinedInput-input': { padding: '10px 14px' },
        }}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Payment Method Filter (Select) */}
        <FormControl sx={{ minWidth: 200, backgroundColor: '#f8f9fd', borderRadius: '8px' }}>
          <InputLabel>Payment Method</InputLabel>
          <Select
            value={filterPaymentMethod}
            onChange={(event) => onFilterPaymentChange(event.target.value)}
            displayEmpty
          >
            <MenuItem value="">All</MenuItem>
            {/* <MenuItem value="Lifeline Subscription">Lifeline Subscription</MenuItem> */}
            <MenuItem value="Insurance">Insurance</MenuItem>
            <MenuItem value="bank transfer">Bank Transfer</MenuItem>
            <MenuItem value="momo">MoMo</MenuItem>
          </Select>
        </FormControl>

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
      </Box>
    </Toolbar>
  );
}

OrdersTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  filterStatus: PropTypes.string,
  onFilterStatusChange: PropTypes.func,
  filterPaymentMethod: PropTypes.string,
  onFilterPaymentChange: PropTypes.func,
  onFilterDateChange: PropTypes.func,
};
