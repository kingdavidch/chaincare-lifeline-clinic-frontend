import { useState } from 'react';

import PropTypes from 'prop-types';

import {
  Box,
  Grid,
  Paper,
  Button,
  Checkbox,
  TextField,
  Typography,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';

import DiscountNote from './DiscountNote';

export default function CreateDiscountSection({ onCreate, isCreating, apiError, apiSuccess }) {
  const [form, setForm] = useState({
    code: '',
    percentage: '',
    validUntil: '',
    isHidden: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.code.trim()) newErrors.code = 'Discount code is required';
    if (!form.percentage) newErrors.percentage = 'Percentage is required';
    else if (Number(form.percentage) <= 0)
      newErrors.percentage = 'Percentage must be greater than 0';
    if (!form.validUntil) newErrors.validUntil = 'Valid until date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const callback = () => {
      setForm({ code: '', percentage: '', validUntil: '', isHidden: false });
      setErrors({});
    };

    if (onCreate) onCreate(form, callback);
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <DiscountNote />

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Create Discount Code
      </Typography>

      {apiError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {apiError}
        </Typography>
      )}
      {apiSuccess && (
        <Typography color="success.main" sx={{ mb: 2 }}>
          {apiSuccess}
        </Typography>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            required
            fullWidth
            label="Discount Code"
            name="code"
            placeholder='e.g. "SUMMER20"'
            value={form.code}
            onChange={handleChange}
            error={!!errors.code}
            helperText={errors.code}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            required
            fullWidth
            label="Percentage (%)"
            name="percentage"
            placeholder="e.g. 20"
            type="number"
            value={form.percentage}
            onChange={handleChange}
            error={!!errors.percentage}
            helperText={errors.percentage}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            required
            fullWidth
            label="Valid Until"
            name="validUntil"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.validUntil}
            onChange={handleChange}
            error={!!errors.validUntil}
            helperText={errors.validUntil}
            inputProps={{
              min: new Date().toISOString().split('T')[0],
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.isHidden}
                onChange={handleChange}
                name="isHidden"
                color="primary"
              />
            }
            label="Hide this discount from patients"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#22C55E', '&:hover': { backgroundColor: '#1FA14A' } }}
          onClick={handleSubmit}
          disabled={isCreating}
        >
          {isCreating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create'}
        </Button>
      </Box>
    </Paper>
  );
}

CreateDiscountSection.propTypes = {
  onCreate: PropTypes.func.isRequired,
  isCreating: PropTypes.bool,
  apiError: PropTypes.string,
  apiSuccess: PropTypes.string,
};
