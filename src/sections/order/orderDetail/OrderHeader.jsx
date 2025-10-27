import PropTypes from 'prop-types';

import { Divider, Typography } from '@mui/material';

const OrderHeader = ({ orderId }) => (
  <>
    <Typography variant="h6" gutterBottom>
      Order {orderId}
    </Typography>
    <Divider sx={{ mb: 2 }} />
  </>
);

OrderHeader.propTypes = {
  orderId: PropTypes.string.isRequired,
};

export default OrderHeader;
