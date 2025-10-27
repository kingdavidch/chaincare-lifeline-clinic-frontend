import { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import { Chip, Button, TableRow, TableCell, Typography } from '@mui/material';

import ClinicOrderDetailsModal from './ClinicOrderDetails';

export default function OrdersTableRow({ order, onStatusChange }) {
  const [currentStatus, setCurrentStatus] = useState(order.Status);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: '#FEF0C7', color: '#B54708', border: '#FDD999' };
      case 'sample_collected':
        return { bg: '#E0F7FA', color: '#00796B', border: '#B2EBF2' };
      case 'processing':
        return { bg: '#FFF3E0', color: '#FB8C00', border: '#FFE0B2' };
      case 'result_ready':
        return { bg: '#E3F2FD', color: '#1565C0', border: '#90CAF9' };
      case 'result_sent':
        return { bg: '#D1FADF', color: '#027A48', border: '#A3E4C1' };
      case 'rejected':
        return { bg: '#FECDCA', color: '#B42318', border: '#F8A9A4' };
      case 'cancelled':
        return { bg: '#F3E5F5', color: '#6A1B9A', border: '#E1BEE7' };
      case 'failed':
        return { bg: '#FFEBEE', color: '#C62828', border: '#FFCDD2' };
      case 'mixed':
        return { bg: '#E0E0E0', color: '#555', border: '#BDBDBD' };
      default:
        return { bg: '#F5F5F5', color: '#444', border: '#CCC' };
    }
  };

  const statusStyles = getStatusColor(currentStatus);

  useEffect(() => {
    setCurrentStatus(order.Status);
  }, [order.Status]);

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>{order?.orderId}</TableCell>
        <TableCell>
          <Typography sx={{ textTransform: 'capitalize' }} variant="subtitle2" noWrap>
            {order?.CustomerName}
          </Typography>
        </TableCell>
        <TableCell sx={{ textTransform: 'capitalize' }}>{order?.Test}</TableCell>
        <TableCell>
          {order?.currencySymbol} {order?.price?.toLocaleString()}
        </TableCell>
        <TableCell>{order?.Date}</TableCell>
        <TableCell>{order?.Time}</TableCell>
        <TableCell sx={{ textTransform: 'capitalize' }}>{order?.PaymentMethod}</TableCell>
        <TableCell>
          <Chip
            label={order?.resultSent ? 'Result Sent' : 'Result Not Sent'}
            color={order?.resultSent ? 'success' : 'warning'}
            variant="filled"
            size="small"
            sx={{ fontWeight: 500, color: '#fff', textTransform: 'capitalize' }}
          />
        </TableCell>

        <TableCell>
          <Typography
            sx={{
              backgroundColor: statusStyles.bg,
              color: statusStyles.color,
              border: `2px solid ${statusStyles.border}`,
              fontWeight: 'bold',
              textTransform: 'capitalize',
              borderRadius: '8px',
              padding: '6px 12px',
              display: 'inline-block',
              textAlign: 'center',
              minWidth: 100,
            }}
          >
            {currentStatus}
          </Typography>
        </TableCell>
        <TableCell>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setOpenDetailsModal(true)}
            sx={{
              color: '#00AC4F',
              borderColor: '#00AC4F',
              textTransform: 'capitalize',
              '&:hover': {
                borderColor: '#008B42',
                backgroundColor: '#E6F7EF',
              },
            }}
          >
            View
          </Button>
        </TableCell>
      </TableRow>

      <ClinicOrderDetailsModal
        orderId={order.id}
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
      />
    </>
  );
}

OrdersTableRow.propTypes = {
  order: PropTypes.object.isRequired,
  onStatusChange: PropTypes.func,
};
