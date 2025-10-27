import PropTypes from 'prop-types';

import { Box, Modal, Button, Typography } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

export default function ConfirmationModal({ open, onClose, onConfirm, title, message }) {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="confirmation-modal">
      <Box sx={modalStyle}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Typography sx={{ mb: 3 }}>{message}</Typography>
        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="error" onClick={onConfirm}>
            Yes, Confirm
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

ConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
};
