import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import { Box, Modal, Stack, Divider, Typography, IconButton } from '@mui/material';

const StatusHistoryModal = ({ open, onClose, history }) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 3,
        m: 'auto',
        mt: 10,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Status History</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {history?.length > 0 ? (
        <Stack spacing={1}>
          {history.map((entry, index) => (
            <Box key={index}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {entry.status.replace(/_/g, ' ')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(entry.changedAt).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography>No status history available.</Typography>
      )}
    </Box>
  </Modal>
);

StatusHistoryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  history: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      changedAt: PropTypes.string.isRequired, 
    })
  ).isRequired,
};

export default StatusHistoryModal;
