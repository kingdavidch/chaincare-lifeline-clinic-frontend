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
  CircularProgress,
} from '@mui/material';

import {
  useUpdateTest,
  useFetchTestDetails,
  useFetchTestNamesInTestItem,
} from 'src/hooks/useClinicHooks';

import { sampleTypes } from './utils';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  maxHeight: '85vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function UpdateTestModal({ open, handleClose, testNo }) {
  const { data: testData, isLoading } = useFetchTestDetails(testNo);
  const { data: testNames, isLoading: loadingTestNames } = useFetchTestNamesInTestItem();
  const { mutate: updateTest, isPending: updating } = useUpdateTest();

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

  useEffect(() => {
    if (testData) {
      const normalize = (value) => {
        if (!value) return '';
        const v = value.toLowerCase();
        if (v === 'available') return 'Available';
        if (v === 'not available') return 'Not Available';
        if (v === 'covered under lifeline subscription plans')
          return 'Covered under LifeLine subscription plans';
        if (v === 'not covered') return 'Not Covered';
        if (v === 'depends') return 'Depends';
        return value;
      };

      setFormData({
        testName: testData?.testName || '',
        price: testData?.price || '',
        turnaroundTime: testData?.turnaroundTime || '',
        preTestRequirements: testData?.preTestRequirements || '',
        homeCollection: normalize(testData?.homeCollection),
        insuranceCoverage: normalize(testData?.insuranceCoverage),
        sampleType: testData?.sampleType || '',
        description: testData?.description || '',
      });
    }
  }, [testData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!testNo) {
      alert('Error: Test number is missing!');
      return;
    }

    updateTest(
      { testNo, ...formData },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: () => alert('Failed to update test.'),
      }
    );
  };

  const extractLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };

  if (isLoading) {
    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress sx={{ color: '#00AC4F' }} />
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="update-test-modal">
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Update Test
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {/* Two-Column Layout for Inputs */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Autocomplete
              fullWidth
              options={
                testNames?.map((name) => ({
                  label: name
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
                  value: name,
                })) || []
              }
              loading={loadingTestNames}
              value={
                formData.testName
                  ? {
                      label: formData.testName
                        .split(' ')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' '),
                      value: formData.testName,
                    }
                  : null
              }
              onChange={(_, newValue) =>
                setFormData({ ...formData, testName: newValue?.value || '' })
              }
              renderInput={(params) => (
                <TextField {...params} label="Select Test" variant="outlined" required />
              )}
            />

            <TextField
              name="price"
              label="Price"
              type="number"
              variant="outlined"
              fullWidth
              required
              value={formData.price}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              select
              label="Turnaround Time"
              value={formData.turnaroundTime || ''}
              onChange={(e) => {
                setFormData({ ...formData, turnaroundTime: e.target.value });
              }}
              fullWidth
              required
            >
              <MenuItem value="24 hours">24 hours</MenuItem>
              <MenuItem value="48 hours">48 hours</MenuItem>
            </TextField>

            <TextField
              name="preTestRequirements"
              label="Pre-Test Requirements"
              variant="outlined"
              fullWidth
              value={formData.preTestRequirements}
              onChange={handleChange}
              inputProps={{ maxLength: 500 }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Home Collection</InputLabel>
              <Select
                name="homeCollection"
                value={formData.homeCollection || ''}
                onChange={handleChange}
                label="Home Collection"
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Not Available">Not Available</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Insurance Coverage</InputLabel>
              <Select
                name="insuranceCoverage"
                value={formData.insuranceCoverage || ''}
                onChange={handleChange}
                label="Insurance Coverage"
              >
                <MenuItem disabled value="">
                  Select
                </MenuItem>
                <MenuItem value="Covered under LifeLine subscription plans">Covered</MenuItem>
                <MenuItem value="Not Covered">Not Covered</MenuItem>
                <MenuItem value="Depends">Depends</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Autocomplete
            fullWidth
            options={sampleTypes}
            value={sampleTypes.find((option) => option.value === formData.sampleType) || null}
            onChange={(_, newValue) =>
              setFormData((prev) => ({ ...prev, sampleType: newValue?.value || '' }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Select Sample Type" variant="outlined" required />
            )}
          />

          {/* Description Field with Character Count and Clickable Link Preview */}
          <Box>
            <TextField
              name="description"
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              inputProps={{ maxLength: 500 }}
              helperText={`${formData.description.length}/500`}
            />
            {/* Display clickable links */}
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
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            disabled={updating}
            sx={{
              backgroundColor: '#22C55E',
              color: '#fff',
              '&:hover': { backgroundColor: '#1FA14A' },
              fontSize: 18,
            }}
          >
            {updating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Update'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

UpdateTestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  testNo: PropTypes.string.isRequired,
};
