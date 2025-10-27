import { useQueryClient } from '@tanstack/react-query';

import { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Link,
  Modal,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
  Autocomplete,
  FormHelperText,
  CircularProgress,
} from '@mui/material';

import { useCreateTest, useFetchTestNamesInTestItem } from 'src/hooks/useClinicHooks';

import socket from 'src/lib/socket';

import { sampleTypes } from './utils';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default function AddTestModal({ open, handleClose }) {
  const [formData, setFormData] = useState({
    testName: '',
    price: '',
    turnaroundTime: '',
    preTestRequirements: '',
    homeCollection: '',
    insuranceCoverage: '',
    sampleType: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const { mutate: createTest, isPending } = useCreateTest();
  const { data: tests, isLoading } = useFetchTestNamesInTestItem();
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on('testItem:add', () => {
      queryClient.invalidateQueries({ queryKey: ['testNames'] });
    });
    return () => {
      socket.off('testItem:add');
    };
  }, [queryClient]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.testName) newErrors.testName = 'Test name is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.turnaroundTime) newErrors.turnaroundTime = 'Turnaround time is required';
    if (!formData.homeCollection) newErrors.homeCollection = 'Home Collection is required';
    if (!formData.insuranceCoverage) newErrors.insuranceCoverage = 'Insurance Coverage is required';
    if (!formData.sampleType) newErrors.sampleType = 'Sample type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'description') {
      if (value.length <= maxChars) {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setCharCount(value.length);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[name];
      setErrors(updatedErrors);
    }

    if (backendError) setBackendError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    createTest(formData, {
      onSuccess: () => {
        setFormData({
          testName: '',
          price: '',
          turnaroundTime: '',
          preTestRequirements: '',
          homeCollection: '',
          insuranceCoverage: '',
          sampleType: '',
          description: '',
        });
        setErrors({});
        setBackendError('');
        setCharCount(0);
        handleClose();
      },
      onError: (error) => {
        setBackendError(error?.response?.data?.message || 'Failed to create test.');
      },
    });
  };

  // 🔗 Function to extract links from text
  const extractLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="add-test-modal">
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Add New Appointment
        </Typography>

        {backendError && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {backendError}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Autocomplete
            fullWidth
            options={
              tests?.map((name) => ({
                label: name
                  .split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' '),
                value: name,
              })) || []
            }
            loading={isLoading}
            value={
              formData.testName
                ? {
                    label: formData.testName
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(' '),
                    value: formData.testName,
                  }
                : null
            }
            onChange={(_, newValue) => {
              setFormData((prev) => ({ ...prev, testName: newValue?.value || '' }));
              setErrors((prev) => {
                const updated = { ...prev };
                delete updated.testName;
                return updated;
              });
              setBackendError('');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Appointment Name"
                variant="outlined"
                error={!!errors.testName}
                helperText={errors.testName}
              />
            )}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, alignItems: 'end' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                sx={{ color: 'text.secondary' }}
              >
                (Add 6% on top of the original price to cover the payment processing cost)
              </Typography>
              <TextField
                name="price"
                label="Price"
                variant="outlined"
                fullWidth
                value={formData.price}
                onChange={(e) => {
                  const { value } = e.target;
                  if (/^\d*\.?\d*$/.test(value)) {
                    setFormData((prev) => ({ ...prev, price: value }));
                    setErrors((prev) => {
                      const updated = { ...prev };
                      delete updated.price;
                      return updated;
                    });
                    setBackendError('');
                  }
                }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                error={!!errors.price}
                helperText={errors.price}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                sx={{ color: 'text.secondary', mt: 1 }}
              >
                (Turnaround time refers to the period patients should expect their documented
                feedback or results from the appointments)
              </Typography>
              <TextField
                select
                label="Turnaround Time"
                value={formData.turnaroundTime || ''}
                onChange={(e) => setFormData({ ...formData, turnaroundTime: e.target.value })}
                error={!!errors.turnaroundTime}
                helperText={errors.turnaroundTime}
                fullWidth
              >
                <MenuItem value="24 hours">24 hours</MenuItem>
                <MenuItem value="48 hours">48 hours</MenuItem>
              </TextField>
            </Box>
          </Box>

          <Typography
            variant="caption"
            display="block"
            gutterBottom
            sx={{ color: 'text.secondary', mb: -1 }}
          >
            (Is there anything you would like your clients to do before the appointment?)
          </Typography>
          <TextField
            name="preTestRequirements"
            label="Pre-appointment Requirements."
            variant="outlined"
            fullWidth
            value={formData.preTestRequirements}
            onChange={handleChange}
            error={!!errors.preTestRequirements}
            helperText={errors.preTestRequirements}
            inputProps={{ maxLength: 300 }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormControl fullWidth error={!!errors.homeCollection}>
              <InputLabel>Home Service</InputLabel>
              <Select name="homeCollection" value={formData.homeCollection} onChange={handleChange}>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Not Available">Not Available</MenuItem>
              </Select>
              {errors.homeCollection && <FormHelperText>{errors.homeCollection}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!errors.insuranceCoverage}>
              <InputLabel>Insurance Coverage</InputLabel>
              <Select
                name="insuranceCoverage"
                value={formData.insuranceCoverage}
                onChange={handleChange}
              >
                <MenuItem value="Covered under LifeLine subscription plans">Covered</MenuItem>
                <MenuItem value="Not Covered">Not Covered</MenuItem>
                <MenuItem value="Depends">Depends</MenuItem>
              </Select>
              {errors.insuranceCoverage && (
                <FormHelperText>{errors.insuranceCoverage}</FormHelperText>
              )}
            </FormControl>
          </Box>

          <Autocomplete
            fullWidth
            options={sampleTypes}
            value={sampleTypes.find((option) => option.value === formData.sampleType)}
            onChange={(_, newValue) =>
              setFormData((prev) => ({ ...prev, sampleType: newValue?.value || '' }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Sample Type"
                variant="outlined"
                error={!!errors.sampleType}
                helperText={errors.sampleType}
              />
            )}
          />

          <Typography
            variant="caption"
            display="block"
            gutterBottom
            sx={{ color: 'text.secondary', mb: -1 }}
          >
            (We encourage you to provide a well-detailed description of the appointment so clients
            can know more about the appointment before booking)
          </Typography>

          <TextField
            name="description"
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            inputProps={{ maxLength: maxChars }}
          />

          {/* ✅ Added link extraction display here */}
          {extractLinks(formData.description).length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Links found:
              </Typography>
              {extractLinks(formData.description).map((url, i) => (
                <Link
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'block', color: '#1E88E5' }}
                >
                  {url}
                </Link>
              ))}
            </Box>
          )}

          <Typography
            variant="caption"
            sx={{
              textAlign: 'right',
              color: charCount >= maxChars ? 'error.main' : 'text.secondary',
            }}
          >
            {charCount} / {maxChars} characters
          </Typography>

          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            sx={{
              backgroundColor: '#22C55E',
              color: '#fff',
              '&:hover': { backgroundColor: '#1FA14A' },
              fontSize: 18,
            }}
          >
            {isPending ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

AddTestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
