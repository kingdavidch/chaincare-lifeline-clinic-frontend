import PropTypes from 'prop-types';

import { Grid, Divider, Typography } from '@mui/material';

import { getInsuranceName } from '../utils';


const InsuranceDetails = ({ insuranceDetails }) => {
  if (!insuranceDetails) return null;

  return (
    <Grid item xs={12}>
      <Divider sx={{ my: 2 }} />
      <Typography fontWeight="bold" gutterBottom>Insurance Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography>Provider: {getInsuranceName(insuranceDetails.insuranceId)}</Typography>
          <Typography>Policy Number: {insuranceDetails.policyNumber}</Typography>
          <Typography>Affiliation Number: {insuranceDetails.affiliationNumber}</Typography>
          <Typography sx={{ textTransform: 'capitalize' }}>Relationship: {insuranceDetails.relationship}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          {insuranceDetails.fullName && (
            <Typography sx={{ textTransform: 'capitalize' }}>Name: {insuranceDetails.fullName}</Typography>
          )}
          {insuranceDetails.gender && (
            <Typography sx={{ textTransform: 'capitalize' }}>Gender: {insuranceDetails.gender}</Typography>
          )}
          {insuranceDetails.phoneNumber && (
            <Typography>Phone: {insuranceDetails.phoneNumber}</Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

InsuranceDetails.propTypes = {
  insuranceDetails: PropTypes.object,
};

export default InsuranceDetails;
