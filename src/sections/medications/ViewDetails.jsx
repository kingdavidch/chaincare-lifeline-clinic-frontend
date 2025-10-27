import * as React from 'react';

import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 6,
};

export default function ViewDetails({ medication, open, setOpen }) {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              mb: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {medication.name}
            </Typography>
            <CloseIcon cursor="pointer" onClick={handleClose} />
          </Box>
          <Box mb={5}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2" fontWeight="bold">
                  ID
                </Typography>
                <Typography>{medication.id}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Group
                </Typography>
                <Typography>{medication.category}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Left In Stock
                </Typography>
                <Typography>{medication.stock}</Typography>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <Box mt={4} mb={5}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              How To Use
            </Typography>
            <Typography>
              Take this medication by mouth with or without food as directed by your doctor, usually
              once daily.
            </Typography>
          </Box>
          <Divider />
          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Side Effects
            </Typography>
            <Typography>
              Dizziness, lightheartedness, drowsiness, nausea, vomiting, tiredness, excess
              saliva/drooling, blurred vision, weight gain, constipation, headache, and trouble
              sleeping may occur. If any of these effects persist or worsen, consult your doctor.
            </Typography>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

ViewDetails.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  medication: PropTypes.object.isRequired,
};
