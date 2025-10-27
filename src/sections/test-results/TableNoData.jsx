import PropTypes from 'prop-types';

import { Paper, TableRow, TableCell, Typography } from '@mui/material';

export default function TableNoData({ query }) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
        <Paper sx={{ textAlign: 'center' }}>
          <Typography variant="h6" paragraph>
            Not found
          </Typography>
          <Typography variant="body2">
            No results found for <strong>&quot;{query}&quot;</strong>.
            <br />
            Try checking for typos or using complete words.
          </Typography>
        </Paper>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
};
