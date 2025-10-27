import PropTypes from 'prop-types';

import { TableRow, TableCell, Typography } from '@mui/material';

export default function ClaimsTableRow({
  index,
  claimNo,
  patient,
  date,
  testName,
  cost,
  currencySymbol,
}) {
  return (
    <TableRow hover tabIndex={index}>
      <TableCell component="th" scope="row">
        {claimNo}
      </TableCell>

      <TableCell>
        <Typography sx={{ textTransform: 'capitalize' }} variant="subtitle2" noWrap>
          {patient}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {date}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography sx={{ textTransform: 'capitalize' }} variant="subtitle2" noWrap>
          {testName}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {cost} {currencySymbol}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

ClaimsTableRow.propTypes = {
  index: PropTypes.number,
  claimNo: PropTypes.number,
  patient: PropTypes.string,
  date: PropTypes.string,
  testName: PropTypes.string,
  currencySymbol: PropTypes.string,
  cost: PropTypes.number,
};
