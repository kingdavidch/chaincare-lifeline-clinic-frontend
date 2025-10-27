import PropTypes from 'prop-types';

import { Box, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';

import { visuallyHidden } from './utils';

export default function WithdrawalsTableHead({ order, orderBy, onRequestSort }) {
  const headLabel = [
    { id: 'id', label: 'ID' },
    { id: 'date', label: 'Date' },
    { id: 'amount', label: 'Amount' },
    { id: 'provider', label: 'Provider' },
    { id: 'status', label: 'Status' },
  ];

  const onSort = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={onSort(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

WithdrawalsTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  onRequestSort: PropTypes.func.isRequired,
};
