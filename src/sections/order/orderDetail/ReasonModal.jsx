import { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import {
  Dialog,
  Button,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

const ReasonModal = ({ open, onClose, onConfirm, title, message, loading }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setReason('');
      setError('');
    }
  }, [open]);

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Reason is required');
      return;
    }
    onConfirm(reason.trim());
    setReason('');
    setError('');
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 1 }}>{message}</Typography>
        <TextField
          label="Reason"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError('');
          }}
          fullWidth
          multiline
          rows={3}
          required
          error={!!error}
          helperText={error}
          inputProps={{ maxLength: 500 }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
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
            '& .MuiFormLabel-root.Mui-focused': {
              color: '#374151',
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!reason.trim() || loading}
          sx={{
            backgroundColor: '#22C55E',
            color: '#fff',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#16A34A',
            },
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ReasonModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  loading: PropTypes.bool,
};

ReasonModal.defaultProps = {
  title: '',
  message: '',
  loading: false,
};

export default ReasonModal;
