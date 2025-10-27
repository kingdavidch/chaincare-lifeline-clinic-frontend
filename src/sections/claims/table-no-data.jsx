import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

export default function TableNoData({ query, hasNoClaims }) {
  let title;
  let bodyMessage;

  if (query) {
    // User searched and found no results
    title = 'Not Found';
    bodyMessage = (
      <Typography variant="body2">
        No results found for &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br /> Try checking for typos or using complete words.
      </Typography>
    );
  } else if (hasNoClaims) {
    // No claims exist in the database
    title = 'No claims filed';
    bodyMessage = (
      <Typography variant="body2">There are no claims filed in the system yet.</Typography>
    );
  } else {
    // No claims match the current filters
    title = 'No claims found';
    bodyMessage = <Typography variant="body2">No claims match the current filters.</Typography>;
  }

  return (
    <TableRow>
      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
        <Paper
          sx={{
            textAlign: 'center',
          }}
        >
          {/* Title */}
          <Typography variant="h6" paragraph>
            {title}
          </Typography>

          {/* Body Message */}
          {bodyMessage}
        </Paper>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
  hasNoClaims: PropTypes.bool,
};
