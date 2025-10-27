import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Modal,
  Button,
  Tooltip,
  TextField,
  Typography,
  IconButton,
  Autocomplete,
  CircularProgress,
} from '@mui/material';

import { useCreateClaim, useSupportedTests } from 'src/hooks/useClinicHooks';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default function NewClaimsTableToolbar() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [patientEmail, setPatientEmail] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [errors, setErrors] = useState({});

  const { data: testOptions = [], isLoading: loadingTests } = useSupportedTests();

  const { mutate: createClaim, isPending } = useCreateClaim();

  const handleSubmit = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const newErrors = {};

    if (!patientEmail) newErrors.patientEmail = 'Patient email is required';
    else if (!emailRegex.test(patientEmail)) newErrors.patientEmail = 'Invalid email address';

    if (!selectedTest) newErrors.testId = 'Please select a test';
    else if (!selectedTest.hasTest)
      newErrors.testId = 'This test is not available in your clinic setup';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createClaim(
      { patientEmail: patientEmail.trim(), testId: selectedTest.id },
      {
        onSuccess: () => {
          setPatientEmail('');
          setSelectedTest(null);
          setErrors({});
          handleClose();
        },
        onError: (error) => {
          setErrors({ submit: error.response?.data?.message || 'Failed to add claim.' });
        },
      }
    );
  };

  const handlePatientEmailChange = (e) => {
    const { value } = e.target;
    setPatientEmail(value);
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.patientEmail;
      return updated;
    });
  };

  const handleTestIdChange = (_, newValue) => {
    setSelectedTest(newValue || null);

    setErrors((prev) => {
      const updated = { ...prev };
      if (newValue?.hasTest) delete updated.testId;
      return updated;
    });
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" alignItems="center" width="100%" p={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: '#00ac4f',
            borderRadius: '10px',
            color: 'white',
            padding: '8px 16px',
            height: '45px',
            '&:hover': { backgroundColor: '#009A48' },
          }}
          onClick={handleOpen}
        >
          Add Claim
        </Button>
      </Box>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title">
        <Box sx={style}>
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

          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Claim
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Patient's Email"
              variant="outlined"
              fullWidth
              type="email"
              value={patientEmail}
              onChange={handlePatientEmailChange}
              error={!!errors.patientEmail}
              helperText={errors.patientEmail}
            />

            <Autocomplete
              fullWidth
              loading={loadingTests}
              options={testOptions}
              getOptionLabel={(option) => option.name}
              value={selectedTest}
              isOptionEqualToValue={(option, value) => option.name === value?.name}
              onChange={handleTestIdChange}
              renderOption={(props, option) => {
                const isUnavailable = !option.hasTest;
                return (
                  <li {...props} key={option.name}>
                    <Tooltip
                      title={isUnavailable ? 'This test has not been created for your clinic.' : ''}
                      arrow
                      placement="right"
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          color: isUnavailable ? 'text.disabled' : 'inherit',
                          cursor: isUnavailable ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {option.name}
                      </Box>
                    </Tooltip>
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Test"
                  variant="outlined"
                  error={!!errors?.testId}
                  helperText={errors?.testId}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingTests ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            {errors?.submit && (
              <Typography color="error" align="center">
                {errors?.submit}
              </Typography>
            )}

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: '#00ac4f',
                color: 'white',
                borderRadius: '8px',
                mt: 3,
                py: 1.6,
                '&:hover': { backgroundColor: '#009A48' },
              }}
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Add Claim'}
            </Button>

            {/* Terms and Conditions Section */}
            <Box mt={4}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Terms and Conditions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Only medical clinics that offer all of the supported medical clinical tests listed
                above are eligible to participate in LifeLine’s subscription program. Clinics must
                verify their ability to conduct these tests to qualify. LifeLine reserves the right
                to deny subscription access to clinics that do not support the specified tests.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
