import React, { useState } from 'react';

import PropTypes from 'prop-types';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';

import ClaimsModal from './claimsModal';

export default function UserTableRow({ patientId, name, status, row }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  return (
    <TableRow hover tabIndex={patientId}>
      {/* Ensure correct patient ID is displayed */}
      <TableCell component="th" scope="row" sx={{ paddingLeft: 5 }}>
        {patientId}
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }} noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell>
        <Label
          color={
            (status === 'active' && 'success') || (status === 'expired' && 'error') || 'warning'
          }
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 1.5,
            py: 0.5, 
            width: 'fit-content',
            borderRadius: 1,
          }}
        >
          <Typography
            sx={{
              textTransform: 'capitalize',
              fontWeight: 'bold',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}
          >
            {status}
          </Typography>
        </Label>
      </TableCell>

      <TableCell>
        <Typography onClick={handleOpen} variant="subtitle2" sx={{ cursor: 'pointer' }} noWrap>
          View
        </Typography>
      </TableCell>

      <ClaimsModal open={open} setOpen={setOpen} handleOpen={handleOpen} row={row} />
    </TableRow>
  );
}

UserTableRow.propTypes = {
  patientId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  name: PropTypes.string,
  status: PropTypes.string,
  row: PropTypes.object,
};
