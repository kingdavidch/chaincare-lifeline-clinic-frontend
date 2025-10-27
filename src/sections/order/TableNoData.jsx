import PropTypes from 'prop-types';

import { Box, Paper, TableRow, TableCell, Typography } from '@mui/material';

export default function TableNoData({ query, hasNoOrders }) {
  let title;
  let bodyMessage;

  if (query) {
    title = 'Not Found';
    bodyMessage = (
      <Typography variant="body2">
        No results found for <strong>&quot;{query}&quot;</strong>.
        <br />
        Try checking for typos or using complete words.
      </Typography>
    );
  } else if (hasNoOrders) {
    title = 'No orders yet';
    bodyMessage = <Typography variant="body2">There are no orders in the system yet.</Typography>;
  } else {
    title = 'No orders found';
    bodyMessage = <Typography variant="body2">No orders match the current filters.</Typography>;
  }

  return (
    <TableRow>
      <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Paper elevation={0} sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h6" paragraph>
              {title}
            </Typography>
            {bodyMessage}
          </Paper>
        </Box>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
  hasNoOrders: PropTypes.bool,
};
