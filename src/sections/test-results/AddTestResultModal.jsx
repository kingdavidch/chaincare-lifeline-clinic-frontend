import { useState } from 'react';

import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
  Box,
  Modal,
  Stack,
  Button,
  TextField,
  IconButton,
  Typography,
  Autocomplete,
  CircularProgress,
} from '@mui/material';

import {
  useUploadTestResult,
  useFetchTestNamesInTestItem,
  useFetchClinicOrdersForAutoComplete,
} from 'src/hooks/useClinicHooks';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default function AddTestResultModal({ open, handleClose }) {
  const [formData, setFormData] = useState({
    orderId: '',
    testName: '',
    patientName: '',
    patientEmail: '',
  });

  const [fileName, setFileName] = useState('');
  const [fileURL, setFileURL] = useState(null);

  const onFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed!');
        e.target.value = '';
        setFileName('');
        setFileURL(null);
        return;
      }
      setFileName(file.name);
      setFileURL(URL.createObjectURL(file));
      handleFileChange(e);
    }
  };

  const { data: tests, isLoading: testsLoading } = useFetchTestNamesInTestItem();
  const { data: ordersResponse, isLoading: ordersLoading } = useFetchClinicOrdersForAutoComplete();
  const orders = ordersResponse?.data || [];

  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const { mutate: uploadTestResult, isPending } = useUploadTestResult();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.orderId) newErrors.orderId = 'Patient/order is required';
    if (!formData.testName) newErrors.testName = 'Session name is required';
    if (!formData.resultFile) newErrors.resultFile = 'Session result file is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, resultFile: file }));
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.resultFile;
        return updatedErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append('orderId', formData.orderId);
    formDataToSend.append('testName', formData.testName);
    formDataToSend.append('resultFile', formData.resultFile);

    uploadTestResult(formDataToSend, {
      onSuccess: () => {
        setFormData({ orderId: '', testName: '', resultFile: null });
        setFileName('');
        setFileURL(null);
        setErrors({});
        setBackendError('');
        handleClose();
      },
      onError: (error) => {
        setBackendError(error?.response?.data?.message || 'Failed to upload test result.');
      },
    });
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="add-test-result-modal">
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Add New Session Result
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
          {/* Order/Patient autocomplete */}
          <Autocomplete
            fullWidth
            options={
              orders?.map((o) => ({
                label: o.orderId,
                value: o.orderId,
                patientName: o.patientName,
                patientEmail: o.patientEmail,
              })) || []
            }
            loading={ordersLoading}
            value={formData.orderId ? { label: formData.orderId, value: formData.orderId } : null}
            onChange={(_, newValue) => {
              setFormData((prev) => ({
                ...prev,
                orderId: newValue?.value || '',
                patientName: newValue?.patientName || '',
                patientEmail: newValue?.patientEmail || '',
              }));
              setErrors((prev) => {
                const updated = { ...prev };
                delete updated.orderId;
                return updated;
              });
            }}
            getOptionLabel={(option) => option.label || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Order ID"
                variant="outlined"
                error={!!errors.orderId}
                helperText={errors.orderId}
              />
            )}
          />
          {/* Show selected patient info */}
          {formData.patientName && formData.patientEmail && (
            <Typography variant="body2" sx={{ mt: 1, color: '#111827', fontWeight: 500 }} ty>
              Patient: {formData.patientName.replace(/\b\w/g, (char) => char.toUpperCase())} |
              Email: {formData.patientEmail}
            </Typography>
          )}

          {/* Test name autocomplete */}
          <Autocomplete
            fullWidth
            options={
              tests?.map((name) => ({
                label: name?.toLowerCase()?.replace(/\b\w/g, (char) => char.toUpperCase()),
                value: name,
              })) || []
            }
            loading={testsLoading}
            onChange={(_, newValue) => {
              setFormData((prev) => ({ ...prev, testName: newValue?.value || '' }));
              setErrors((prev) => {
                const updated = { ...prev };
                delete updated.testName;
                return updated;
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Session"
                variant="outlined"
                error={!!errors.testName}
                helperText={errors.testName}
              />
            )}
          />
          {/* Upload Test Result */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <IconButton
                component="label"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#F3F4F6',
                  border: '2px dashed #ddd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': { backgroundColor: '#E5E7EB' },
                }}
              >
                {fileURL ? (
                  <PictureAsPdfIcon fontSize="large" color="error" />
                ) : (
                  <CloudUploadIcon fontSize="large" />
                )}
                <input
                  type="file"
                  id="upload-test-result"
                  hidden
                  accept="application/pdf"
                  onChange={onFileChange}
                />
              </IconButton>
            </Box>

            <Button
              variant="outlined"
              size="small"
              onClick={() => document.getElementById('upload-test-result')?.click()}
            >
              Upload Session Result
            </Button>

            {fileName && (
              <Typography
                variant="body2"
                sx={{ fontStyle: 'italic', color: '#4B5563', cursor: 'pointer' }}
                onClick={() => window.open(fileURL, '_blank')}
              >
                {fileName.length > 20 ? `${fileName.substring(0, 17)}...` : fileName}
              </Typography>
            )}

            {errors.resultFile && (
              <Typography color="error" sx={{ fontSize: '0.75rem' }}>
                {errors.resultFile}
              </Typography>
            )}
          </Stack>
          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            sx={{
              backgroundColor: '#22C55E',
              color: '#fff',
              '&:hover': { backgroundColor: '#1FA14A' },
            }}
          >
            {isPending ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

AddTestResultModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
