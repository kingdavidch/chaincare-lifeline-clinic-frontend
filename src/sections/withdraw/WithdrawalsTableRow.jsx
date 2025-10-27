import PropTypes from 'prop-types';

import { TableRow, TableCell, Typography } from '@mui/material';

import { fNumber } from 'src/utils/format-number';

export default function WithdrawalsTableRow({ row }) {
  const getStatusColor = (status) => {
    const colors = {
      Completed: '#22C55E',
      Processing: '#FACC15',
      Failed: '#EF4444',
    };
    return colors[status] || '#6B7280';
  };

  return (
    <TableRow hover>
      <TableCell align="center">{row.id}</TableCell>
      <TableCell align="center">{row.date}</TableCell>
      <TableCell align="center">{fNumber(row.amount)}</TableCell>
      <TableCell align="center">{row.provider}</TableCell>
      <TableCell align="center">
        <Typography
          sx={{
            color: getStatusColor(row.status),
            fontWeight: 'bold',
            textTransform: 'capitalize',
          }}
        >
          {row.status}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

WithdrawalsTableRow.propTypes = {
  row: PropTypes.object.isRequired,
};
