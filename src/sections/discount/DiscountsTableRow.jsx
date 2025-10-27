import dayjs from 'dayjs';

import PropTypes from 'prop-types';

import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip, TableRow, TableCell, IconButton, Typography } from '@mui/material';

export default function DiscountsTableRow({ row, onDelete }) {
  const daysLeft = dayjs(row.validUntil).diff(dayjs(), 'day');

  const getStatusColor = (status, days) => {
    if (status === 0 && days <= 7) {
      return { bg: '#FEF0C7', color: '#B54708', border: '#FDD999' };
    }
    if (status === 0) {
      return { bg: '#D1FADF', color: '#027A48', border: '#A3E4C1' };
    }
    if (status === 1) {
      return { bg: '#FECDCA', color: '#B42318', border: '#F8A9A4' };
    }
    return { bg: '#F5F5F5', color: '#444', border: '#CCC' };
  };

  const statusStyles = getStatusColor(row.status, daysLeft);

  const getStatusLabel = () => {
    if (row.status === 0 && daysLeft <= 7) return `Expiring (${daysLeft}d)`;
    if (row.status === 0) return 'Active';
    return 'Expired';
  };

  return (
    <TableRow hover>
      <TableCell>{row.code}</TableCell>
      <TableCell>{row.percentage}%</TableCell>
      <TableCell>{row.validUntil}</TableCell>
      <TableCell>
        <Typography
          sx={{
            backgroundColor: statusStyles.bg,
            color: statusStyles.color,
            border: `2px solid ${statusStyles.border}`,
            fontWeight: 'bold',
            textTransform: 'capitalize',
            borderRadius: '8px',
            padding: '4px 10px',
            display: 'inline-block',
            textAlign: 'center',
            minWidth: 110,
          }}
        >
          {getStatusLabel()}
        </Typography>
      </TableCell>

      {/* New column for visibility */}
      <TableCell>
        {row.isHidden ? (
          <Typography
            sx={{
              color: '#B42318',
              fontWeight: 'bold',
              backgroundColor: '#FECDCA',
              borderRadius: '6px',
              padding: '2px 6px',
              textAlign: 'center',
              display: 'inline-block',
            }}
          >
            Hidden
          </Typography>
        ) : (
          <Typography
            sx={{
              color: '#027A48',
              fontWeight: 'bold',
              backgroundColor: '#D1FADF',
              borderRadius: '6px',
              padding: '2px 6px',
              textAlign: 'center',
              display: 'inline-block',
            }}
          >
            Visible
          </Typography>
        )}
      </TableCell>

      <TableCell>{row.createdAt}</TableCell>
      <TableCell>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => onDelete(row.id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

DiscountsTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};
