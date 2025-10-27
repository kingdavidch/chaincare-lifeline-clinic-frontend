import * as React from 'react';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import ViewDetails from './ViewDetails';

export default function MedicationsTableRow({ medication }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell component="th" scope="row" sx={{ paddingLeft: 5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            component="img"
            alt={medication.name}
            src="/assets/images/medications/medication_1.jpg"
            sx={{ width: 90, height: 56, borderRadius: 1.5, flexShrink: 0 }}
          />

          <Box
            sx={{
              display: 'block',
            }}
          >
            <Typography variant="h6">{medication.name}</Typography>
            <Link
              color="#9197B3"
              underline="hover"
              noWrap
              onClick={handleOpen}
              sx={{
                cursor: 'pointer',
              }}
            >
              View Details
            </Link>
            <ViewDetails
              open={open}
              setOpen={setOpen}
              handleOpen={handleOpen}
              medication={medication}
            />
          </Box>
        </Stack>
      </TableCell>

      <TableCell>{medication.category}</TableCell>

      <TableCell>{medication.stock} in stock</TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          RWF {medication.price}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {medication.total_sales}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

MedicationsTableRow.propTypes = {
  medication: PropTypes.object.isRequired,
};
