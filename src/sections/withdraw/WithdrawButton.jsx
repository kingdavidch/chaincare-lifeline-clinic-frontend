import PropTypes from 'prop-types';

import { Button } from '@mui/material';

export default function WithdrawButton({ onClick }) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: '#22C55E',
        color: '#fff',
        fontWeight: 'bold',
        px: 3,
        py: 1,
        borderRadius: '8px',
        '&:hover': { backgroundColor: '#1FA14A' },
      }}
    >
      Withdraw
    </Button>
  );
}

WithdrawButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
