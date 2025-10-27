import PropTypes from 'prop-types';
// import Tooltip from '@mui/material/Tooltip';

import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

import FilterByCategory from './FilterByCategory';

export default function MedicationsTableToolbar({
  filterName,
  onFilterName,
  medications,
  category,
  setCategory,
}) {
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
          Medications
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <FilterByCategory medications={medications} category={category} setCategory={setCategory} />
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
      </Box>
    </Toolbar>
  );
}

MedicationsTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  medications: PropTypes.array,
  category: PropTypes.string,
  setCategory: PropTypes.string,
};
