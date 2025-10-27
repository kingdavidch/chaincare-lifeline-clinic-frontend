import React from 'react';

import PropTypes from 'prop-types';

import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

export default function SearchBar({ placeholder, ...other }) {
  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          height: 48,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0,0,0,0.2)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00AC4F',
          },
        },
      }}
    />
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
};
