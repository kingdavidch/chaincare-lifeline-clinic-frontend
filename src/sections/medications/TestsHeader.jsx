import { useState } from 'react';

import PropTypes from 'prop-types';

import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Select,
  MenuItem,
  InputBase,
  Typography,
  IconButton,
  FormControl,
} from '@mui/material';

import AddTestItemModal from './AddTestItemModal';
import AddTestModal from './AddTestModal';
import ManageAppointmentTypeModal from './ManageAppointmentTypeModal';

export default function TestsHeader({ filter, setFilter, onSearch }) {
  const [openTestModal, setOpenTestModal] = useState(false);
  const [openTestItemModal, setOpenTestItemModal] = useState(false);
  const [openManageTypeModal, setOpenManageTypeModal] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      {/* Title */}
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        Appointments
      </Typography>

      {/* Search Input */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: 400,
          px: 2,
          py: 1,
          borderRadius: 2,
          border: '1px solid #ddd',
          backgroundColor: 'white',
          boxShadow: 3,
        }}
      >
        <IconButton sx={{ p: 0 }}>
          <SearchIcon />
        </IconButton>
        <InputBase
          placeholder="Search"
          sx={{ flex: 1, fontSize: 14 }}
          onChange={(e) => onSearch(e.target.value)}
        />
      </Box>

      {/* Dropdown Filter */}
      <FormControl sx={{ minWidth: 150 }}>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          displayEmpty
          sx={{ height: 42, backgroundColor: '#F8F9FD' }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="lifeline">Covered by LifeLine</MenuItem>
        </Select>
      </FormControl>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => setOpenTestModal(true)}
          sx={{
            backgroundColor: '#22C55E',
            color: '#fff',
            '&:hover': { backgroundColor: '#1FA14A' },
          }}
        >
          + Add Appointment
        </Button>

        <Button
          variant="outlined"
          onClick={() => setOpenTestItemModal(true)}
          sx={{
            color: '#22C55E',
            borderColor: '#22C55E',
            '&:hover': { backgroundColor: '#ECFDF5', borderColor: '#1FA14A' },
          }}
        >
          + Appointment Type
        </Button>

        <Button
          variant="outlined"
          onClick={() => setOpenManageTypeModal(true)}
          sx={{
            color: '#22C55E',
            borderColor: '#22C55E',
            '&:hover': { backgroundColor: '#FFF9E5', borderColor: '#1FA14A' },
          }}
        >
          Manage Appointment Types
        </Button>
      </Box>

      {/* Modals */}
      <AddTestModal open={openTestModal} handleClose={() => setOpenTestModal(false)} />
      <AddTestItemModal open={openTestItemModal} handleClose={() => setOpenTestItemModal(false)} />
      <ManageAppointmentTypeModal
        open={openManageTypeModal}
        handleClose={() => setOpenManageTypeModal(false)}
      />
    </Box>
  );
}

TestsHeader.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};
