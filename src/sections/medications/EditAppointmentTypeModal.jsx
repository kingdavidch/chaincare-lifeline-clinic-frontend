import { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Modal,
  Alert,
  Stack,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';

import {
  useFetchTestImages,
  useDeleteTestItemByClinic,
  useUpdateTestItemByClinic,
} from 'src/hooks/useClinicHooks';

import { ConfirmationModal } from 'src/components/ConfirmationModal';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

export default function EditAppointmentTypeModal({ open, handleClose, item }) {
  const [formData, setFormData] = useState({ name: '', image: '', icon: '' });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  const { mutate: updateType, isPending: updating } = useUpdateTestItemByClinic();
  const { mutate: deleteType, isPending: deleting } = useDeleteTestItemByClinic();
  const { data, isLoading } = useFetchTestImages();

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        image: item.image || '',
        icon: item.icon || '',
      });
    }
  }, [item]);

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
    if (!item?._id) return;

    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.icon) newErrors.icon = 'Please select an icon';
    if (!formData.image) newErrors.image = 'Please select an image';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateType(
      { id: item._id, ...formData },
      {
        onSuccess: () => {
          setError(null);
          handleClose();
        },
        onError: (err) => {
          const message = err?.response?.data?.message || 'Failed to update appointment type';
          setError(message);
        },
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!item?._id) return;
    deleteType(item._id, {
      onSuccess: () => {
        handleClose();
        setOpenDeleteModal(false);
        setError(null);
      },
      onError: (err) => {
        setError(err?.response?.data?.message || 'Failed to delete appointment type');
        setOpenDeleteModal(false);
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
            }}
          />
        </Box>
      ))}
    </Box>
  );

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" mb={2}>
            Edit Appointment Type
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              name="name"
              label="Type Name"
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

            <Stack direction="row" spacing={2} mt={3} justifyContent="space-between">
              <Button
                type="submit"
                variant="contained"
                disabled={updating}
                sx={{
                  backgroundColor: '#22C55E',
                  '&:hover': { backgroundColor: '#1FA14A' },
                }}
              >
                {updating ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Save Changes'}
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpenDeleteModal(true)}
                startIcon={<DeleteIcon />}
                disabled={deleting}
              >
                {deleting ? <CircularProgress size={20} sx={{ color: '#22C55E' }} /> : 'Delete'}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>

      <ConfirmationModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this appointment type? This action cannot be undone."
      />
    </>
  );
}

EditAppointmentTypeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  item: PropTypes.object,
};
