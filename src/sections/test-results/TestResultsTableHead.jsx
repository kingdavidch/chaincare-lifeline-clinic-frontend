import PropTypes from 'prop-types';

import { Box, TableRow, TableHead, TableCell, TableSortLabel } from '@mui/material';

import { visuallyHidden } from './utils';

const headCells = [
  { id: 'id', label: 'ID' },
  { id: 'customerName', label: 'Customer Name' },
  { id: 'sessionResult', label: 'Session Result' },
  { id: 'orderId', label: 'Order ID' },
  { id: 'date', label: 'Date' },
  { id: 'time', label: 'Time' },
  { id: 'resend', label: 'Resend Result', disableSorting: true },
  { id: 'action', label: 'Action', disableSorting: true },
];

export default function TestResultsTableHead({ order, orderBy, onRequestSort }) {
  const handleSort = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="left" sx={{ fontWeight: 'bold', minWidth: 120 }}>
            {!headCell.disableSorting ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={order}
                onClick={handleSort(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

TestResultsTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  onRequestSort: PropTypes.func,
};
