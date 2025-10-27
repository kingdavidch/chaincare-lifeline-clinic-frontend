import React, { useState } from 'react';

import PropTypes from 'prop-types';

import {
  Card,
  Grid,
  Table,
  Modal,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CardContent,
  TableContainer,
  LinearProgress,
  CircularProgress,
} from '@mui/material';

import { useFetchPatientClaimHistory } from 'src/hooks/useClinicHooks';

import CustomPagination from 'src/components/pagination';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function ClaimsModal({ open, setOpen, row }) {
  const handleClose = () => setOpen(false);

  // Fetch claims history API
  const { data, isLoading, isError } = useFetchPatientClaimHistory(row?.patientId);

  // Pagination State
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Ensure privilege and balance are numbers to prevent NaN errors
  const balance = Number(data?.balance) || 0;
  const privilege = Number(data?.privilege) || 1;

  // Pagination Logic
  const paginatedClaims = data?.claims?.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card sx={style}>
        <CardContent>
          {/* Header */}
          <Typography variant="h3" sx={{ mb: 5 }} gutterBottom>
            Claims History
          </Typography>
          <Typography variant="h4" sx={{ mb: 2, textTransform: 'capitalize' }}>
            {data?.patientName}
          </Typography>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <img src="/assets/icons/customers/logo.svg" alt="logo" />
            </Grid>
            <Grid item>
              <Typography variant="body1" fontWeight="bold">
                LifeLine Subscription
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We are your LifeLine
              </Typography>
            </Grid>
          </Grid>

          {/* Progress Bar and Balance */}
          <LinearProgress
            variant="determinate"
            value={(balance / privilege) * 100}
            sx={{
              my: 1,
              marginTop: 3,
              height: 6,
              borderRadius: 5,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#00AC4F',
              },
            }}
          />
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="body2" fontWeight="bold">
                Privilege: {privilege?.toLocaleString()} RWF
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" fontWeight="bold" color="#00AC4F">
                Balance: {balance?.toLocaleString()} RWF
              </Typography>
            </Grid>
          </Grid>

          {/* Table */}
          <TableContainer sx={{ marginTop: 5, maxHeight: 400, overflow: 'auto' }}>
            {/* Loading State */}
            {isLoading && (
              <Grid container justifyContent="center" sx={{ my: 4 }}>
                <CircularProgress sx={{ color: '#00AC4F' }} />
              </Grid>
            )}

            {/* Error State */}
            {!isLoading && isError && (
              <Typography color="error" align="center" sx={{ mt: 4 }}>
                Failed to load claims history.
              </Typography>
            )}

            {/* Table Data */}
            {!isLoading && !isError && paginatedClaims?.length > 0 && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Test</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedClaims?.map((claim) => (
                    <TableRow key={claim?.claimNo}>
                      <TableCell key={claim?.claimNo}>{claim?.claimNo}</TableCell>
                      <TableCell key={claim?.claimNo} sx={{ textTransform: 'capitalize' }}>
                        {claim?.testName}
                      </TableCell>
                      <TableCell key={claim?.claimNo}>
                        {new Date(claim?.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell key={claim?.claimNo}>{claim?.time}</TableCell>
                      <TableCell key={claim?.claimNo}>
                        {claim?.cost} {claim.currencySymbol}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Empty State */}
            {!isLoading && !isError && (!paginatedClaims || paginatedClaims?.length === 0) && (
              <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                No claims found.
              </Typography>
            )}
          </TableContainer>

          {/* Pagination */}
          {!isLoading && !isError && paginatedClaims?.length > 5 && (
            <CustomPagination
              count={Math.ceil((data?.claims?.length || 1) / rowsPerPage)}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
            />
          )}
        </CardContent>
      </Card>
    </Modal>
  );
}

ClaimsModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  row: PropTypes.shape({
    patientId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }),
};
