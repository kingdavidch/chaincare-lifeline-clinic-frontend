import PropTypes from 'prop-types';

import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Tooltip, TableRow, TableCell, IconButton } from '@mui/material';

export default function TestResultsTableRow({ row, onResendResult }) {
  return (
    <TableRow hover>
      <TableCell>{row.id}</TableCell>
      <TableCell>{row.customerName}</TableCell>
      <TableCell>{row.test}</TableCell>
      <TableCell>{row.date}</TableCell>
      <TableCell>{row.time}</TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={() => onResendResult(row.id)}
        >
          Resend
        </Button>
      </TableCell>
      <TableCell>
        <Tooltip title="View Details">
          <IconButton color="primary">
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

TestResultsTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  onResendResult: PropTypes.func.isRequired,
};
