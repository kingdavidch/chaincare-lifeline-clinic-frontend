import PropTypes from 'prop-types';

import { Grid, Typography } from '@mui/material';

const OrderInfoSection = ({
  patient,
  publicBooker,
  deliveryAddress,
  paymentMethod,
  currencySymbol,
  totalAmount,
  createdAt,
  deliveryMethod,
  isPublicBooking,
}) => {
  const patientData = isPublicBooking ? publicBooker : patient;
  const showDeliveryAddress = isPublicBooking
    ? deliveryMethod?.toLowerCase() === 'home service'
    : true;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography fontWeight="bold">Patient Info</Typography>
        <Typography sx={{ textTransform: 'capitalize' }}>
          Name: {patientData?.fullName || 'N/A'}
        </Typography>
        <Typography>Email: {patientData?.email || 'N/A'}</Typography>
        <Typography>Phone: {patientData?.phoneNumber || 'N/A'}</Typography>
      </Grid>

      {showDeliveryAddress && (
        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold">Delivery Address</Typography>
          <Typography sx={{ textTransform: 'capitalize' }}>
            Name: {deliveryAddress?.fullName || 'N/A'}
          </Typography>
          <Typography>Phone: {deliveryAddress?.phoneNo || 'N/A'}</Typography>
          <Typography sx={{ textTransform: 'capitalize' }}>
            Address: {deliveryAddress?.address || 'N/A'}
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} md={6}>
        <Typography fontWeight="bold">Payment</Typography>
        <Typography sx={{ textTransform: 'capitalize' }}>
          Method: {paymentMethod || 'N/A'}
        </Typography>
        <Typography>
          Total: {currencySymbol || ''} {totalAmount?.toLocaleString() || '0'}
        </Typography>
        <Typography>Date: {createdAt ? new Date(createdAt).toLocaleString() : 'N/A'}</Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography fontWeight="bold">Delivery Method</Typography>
        <Typography sx={{ textTransform: 'capitalize' }}>{deliveryMethod || 'N/A'}</Typography>
      </Grid>
    </Grid>
  );
};

OrderInfoSection.propTypes = {
  patient: PropTypes.object,
  publicBooker: PropTypes.object,
  deliveryAddress: PropTypes.object,
  paymentMethod: PropTypes.string,
  currencySymbol: PropTypes.string,
  totalAmount: PropTypes.number,
  createdAt: PropTypes.string,
  deliveryMethod: PropTypes.string,
  isPublicBooking: PropTypes.bool,
};

export default OrderInfoSection;
