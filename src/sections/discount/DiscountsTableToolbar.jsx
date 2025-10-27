import PropTypes from 'prop-types';

import { Toolbar, OutlinedInput, InputAdornment } from '@mui/material';

import Iconify from 'src/components/iconify';

export default function DiscountsTableToolbar({ filterName, onFilterName }) {
  return (
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
      <OutlinedInput
        value={filterName}
        onChange={onFilterName}
        placeholder="Search Discounts"
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
          minWidth: 300,
          height: 48,
          '& .MuiOutlinedInput-input': { padding: '10px 14px' },
        }}
      />
    </Toolbar>
  );
}

DiscountsTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
