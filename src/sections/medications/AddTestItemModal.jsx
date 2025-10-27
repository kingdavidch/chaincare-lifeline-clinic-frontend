import { useState } from 'react';

import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Stack,
  Modal,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';

import { useCreateTestItem, useFetchTestImages } from 'src/hooks/useClinicHooks';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,

  p: 4,
};

export default function AddTestItemModal({ open, handleClose }) {
  const [formData, setFormData] = useState({ name: '', image: '', icon: '' });
  const [errors, setErrors] = useState({});
  const { mutate: createItem, isPending } = useCreateTestItem();
  const { data, isLoading } = useFetchTestImages();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSelect = (type, url) => {
    setFormData({ ...formData, [type]: url });
    setErrors((prev) => ({ ...prev, [type]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.icon) newErrors.icon = 'Please select an icon';
    if (!formData.image) newErrors.image = 'Please select an image';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createItem(formData, {
      onSuccess: () => {
        setFormData({ name: '', image: '', icon: '' });
        handleClose();
      },
      onError: (error) => {
        const message = error?.response?.data?.message || 'Something went wrong';
        if (typeof message === 'object') {
          setErrors(message);
        } else {
          setErrors({ name: message });
        }
      },
    });
  };

  const renderScrollableRow = (items, selectedUrl, type) => (
    <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, py: 1, px: 1 }}>
      {items.map((img) => (
        <Box
          key={img.public_id}
          onClick={() => handleSelect(type, img.secure_url)}
          sx={{
            height: 80,
            width: 80,
            flexShrink: 0,
            border: selectedUrl === img.secure_url ? '2px solid #22C55E' : '2px solid transparent',
            borderRadius: 2,
            cursor: 'pointer',
            backgroundColor: '#f3f4f6',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={img.secure_url}
            alt={img.public_id}
            loading="lazy"
            sx={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              borderRadius: 2,
              display: 'block',
            }}
          />
        </Box>
      ))}
    </Box>
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" mb={2}>
          Create Appointment Type
        </Typography>

        <Box
          sx={{
            mb: 2,
            p: 1.5,
            borderRadius: '6px',
            backgroundColor: '#E6F7EE',
            border: '1px solid #B2DFDB',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            💡 Before creating a new appointment type, please check if it already exists in the{' '}
            <strong>+ Add Appointment</strong> list. If it doesn’t, you can go ahead and create it here.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            name="name"
            label="Appointment Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name}
          />

          {isLoading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress sx={{ color: '#22C55E' }} />
            </Box>
          ) : (
            <>
              <Box>
                <Typography variant="subtitle2" mb={1}>
                  Select Icon
                </Typography>
                {renderScrollableRow(data?.icons || [], formData.icon, 'icon')}
                {errors.icon && (
                  <Typography variant="caption" color="error" ml={1}>
                    {errors.icon}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" mb={1} mt={2}>
                  Select Image
                </Typography>
                {renderScrollableRow(data?.images || [], formData.image, 'image')}
                {errors.image && (
                  <Typography variant="caption" color="error" ml={1}>
                    {errors.image}
                  </Typography>
                )}
              </Box>
            </>
          )}

          <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              sx={{
                backgroundColor: '#22C55E',
                '&:hover': { backgroundColor: '#22C554' },
              }}
            >
              {isPending ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create'}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

AddTestItemModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
