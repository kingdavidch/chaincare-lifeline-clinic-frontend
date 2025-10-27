import { useState } from 'react';

import PropTypes from 'prop-types';

import {
  Box,
  Modal,
  Button,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

import { useUpdateOrderStatus } from 'src/hooks/useClinicHooks';

import { REASONS } from '../utils';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#fff',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export default function RejectOrderModal({ open, handleClose, orderId, testId, onSuccess }) {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [errorText, setErrorText] = useState('');

  const { mutate, isPending } = useUpdateOrderStatus();
  const isCustom = reason === 'Other...';

  const handleSubmit = () => {
    const finalReason = isCustom ? customReason : reason;

    if (!finalReason.trim()) {
      setErrorText('Rejection reason is required');
      return;
    }

    mutate(
      {
        orderId,
        testId,
        status: 'rejected',
        statusReason: finalReason,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          setReason('');
          setCustomReason('');
          setErrorText('');
        },
        onError: (err) => {
          const message = err?.response?.data?.message || 'Something went wrong';
          setErrorText(message);
        },
        onSettled: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Reason for rejecting {testId ? 'test' : 'order'}
        </Typography>

        {!isCustom ? (
          <TextField
            label="Reason"
            select
            fullWidth
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setErrorText('');
            }}
            error={!!errorText && !isCustom}
            helperText={!isCustom && errorText}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f9fafb',
                '& fieldset': {
                  borderColor: '#d1d5db',
                },
                '&:hover fieldset': {
                  borderColor: '#9ca3af',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9ca3af',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#374151',
              },
            }}
          >
            {REASONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            label="Custom Reason"
            fullWidth
            multiline
            rows={3}
            value={customReason}
            onChange={(e) => {
              setCustomReason(e.target.value);
              setErrorText('');
            }}
            error={!!errorText}
            helperText={errorText}
            inputProps={{ maxLength: 300 }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f9fafb',
                '& fieldset': {
                  borderColor: '#d1d5db',
                },
                '&:hover fieldset': {
                  borderColor: '#9ca3af',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9ca3af',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#374151',
              },
            }}
          />
        )}

        <Button
          variant="contained"
          fullWidth
          disabled={isPending}
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#22C55E',
            color: '#fff',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#16A34A',
            },
            '&:focus': {
              outline: 'none',
            },
          }}
        >
          {isPending ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Done'}
        </Button>
      </Box>
    </Modal>
  );
}

RejectOrderModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  orderId: PropTypes.string.isRequired,
  testId: PropTypes.string,
  onSuccess: PropTypes.func,
};
