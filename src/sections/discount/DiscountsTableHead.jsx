import PropTypes from 'prop-types';

import { Box, TableRow, TableHead, TableCell, TableSortLabel } from '@mui/material';

import { visuallyHidden } from './utils';

const headCells = [
  { id: 'code', label: 'Code' },
  { id: 'percentage', label: 'Percentage (%)' },
  { id: 'validUntil', label: 'Valid Until' },
  { id: 'status', label: 'Status' },
  { id: 'visibility', label: 'Visibility' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'action', label: 'Action', disableSorting: true },
];

export default function DiscountsTableHead({ order, orderBy, onRequestSort }) {
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

DiscountsTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  onRequestSort: PropTypes.func,
};
