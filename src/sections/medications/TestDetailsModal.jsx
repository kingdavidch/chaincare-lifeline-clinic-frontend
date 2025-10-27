import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import { Box, Link, Stack, Modal, Button, Divider, Typography, IconButton } from '@mui/material';

import { fNumber } from '../../utils/format-number';

export default function TestDetailsModal({ test, open, handleClose, onEdit }) {
  if (!test) return null;

  // Function to detect links and render clickable URLs
  const renderDescriptionWithLinks = (text) => {
    if (!text) return 'N/A';

    // Regex to detect URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split and map to clickable links
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <Link
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: '#1E90FF', wordBreak: 'break-word' }}
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 850,
          height: 440, // Reduced height
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'row',
          gap: 4,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 15,
            top: 15,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Left Section - Image and Edit Button */}
        <Box sx={{ width: '38%' }}>
          <Box
            component="img"
            src={test?.testImage}
            alt={test?.testName}
            sx={{
              width: '100%',
              height: 240,
              objectFit: 'cover',
              borderRadius: 3,
            }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#22C55E',
              color: '#fff',
              mt: 2,
              py: 1.3,
              fontSize: '1rem',
              '&:hover': { backgroundColor: '#1FA14A' },
            }}
            onClick={() => onEdit(test)}
          >
            Edit
          </Button>
        </Box>

        {/* Right Section - Test Details */}
        <Box sx={{ width: '60%', overflowY: 'auto' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
            {test?.testName}
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            <strong>{`${fNumber(test.price)} RWF`}</strong>
          </Typography>

          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="body1">
              Turnaround Time: <strong>{test?.turnaroundTime}</strong>
            </Typography>
            <Typography variant="body1">
              Home Collection:{' '}
              <strong style={{ textTransform: 'capitalize' }}>{test?.homeCollection}</strong>
            </Typography>
          </Stack>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Pre-Test Requirements: <strong>{test?.preTestRequirements || 'N/A'}</strong>
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, textTransform: 'capitalize' }}>
            Sample: <strong>{test?.sampleType}</strong>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, textTransform: 'capitalize' }}>
            Insurance Coverage: <strong>{test?.insuranceCoverage}</strong>
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" sx={{ fontSize: '1rem' }}>
            Description:{' '}
            <strong style={{ fontWeight: 500 }}>{renderDescriptionWithLinks(test?.description)}</strong>
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
}

TestDetailsModal.propTypes = {
  test: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    testName: PropTypes.string.isRequired,
    testImage: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    insuranceCoverage: PropTypes.string.isRequired,
    turnaroundTime: PropTypes.string,
    homeCollection: PropTypes.string,
    testNo: PropTypes.string,
    preTestRequirements: PropTypes.string,
    sampleType: PropTypes.string,
    description: PropTypes.string,
  }),
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
