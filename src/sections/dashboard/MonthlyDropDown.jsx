// import React, { useState } from 'react';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import PropTypes from 'prop-types';

// export default function MonthlyDropDown({ onFilterChange }) {
//   const [selectedFilter, setSelectedFilter] = useState('monthly');

//   const handleChange = (event) => {
//     const newFilter = event.target.value;
//     setSelectedFilter(newFilter);
//     onFilterChange(newFilter);
//   };

//   return (
//     <FormControl
//       sx={{
//         minWidth: 150,
//         '& .MuiOutlinedInput-root': {
//           '&:hover .MuiOutlinedInput-notchedOutline': {
//             borderColor: 'rgba(0,0,0,0.2)',
//           },
//           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//             borderColor: '#00AC4F',
//           },
//         },
//       }}
//     >
//       <Select
//         value={selectedFilter}
//         onChange={handleChange}
//         displayEmpty
//         inputProps={{ 'aria-label': 'Without label' }}
//         sx={{
//           height: 50,
//           opacity: 0.8,
//         }}
//       >
//         <MenuItem value="monthly">Monthly</MenuItem>
//         <MenuItem value="daily">Daily</MenuItem>
//         <MenuItem value="weekly">Weekly</MenuItem>
//         <MenuItem value="yearly">Yearly</MenuItem>
//       </Select>
//     </FormControl>
//   );
// }

// MonthlyDropDown.propTypes = {
//   onFilterChange: PropTypes.func.isRequired, 
// };



import React from 'react';

import PropTypes from 'prop-types';

import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function MonthlyDropDown({ selectedFilter, onFilterChange }) {
  const handleChange = (event) => {
    const newFilter = event.target.value;
    onFilterChange(newFilter);
  };

  return (
    <FormControl
      sx={{
        minWidth: 150,
        '& .MuiOutlinedInput-root': {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0,0,0,0.2)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00AC4F',
          },
        },
      }}
    >
      <Select
        value={selectedFilter}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        sx={{
          height: 50,
          opacity: 0.8,
        }}
      >
        <MenuItem value="monthly">Monthly</MenuItem>
        <MenuItem value="daily">Daily</MenuItem>
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="yearly">Yearly</MenuItem>
      </Select>
    </FormControl>
  );
}

MonthlyDropDown.propTypes = {
  selectedFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};