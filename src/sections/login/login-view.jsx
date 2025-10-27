import { Link } from 'react-router-dom';

import React, { useState } from 'react';

import { Card, CardHeader, CardContent } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/AuthContext';
import api from 'src/api/axiosConfig';

import Iconify from 'src/components/iconify';

export default function LoginView() {
  const { setUserId } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Invalid email format';
    }
    if (!password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setShowResend(false);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.post('/clinic/login', { email, password });
      const newUserId = response?.data?.id;
      setUserId(newUserId);

      setSnackbarMessage('Login successful!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setTimeout(() => {
        setLoading(false);
        router.push('/');
      }, 1500);
    } catch (err) {
      setLoading(false);
      const errorMessage = err?.response?.data?.message || 'Login failed!';
      if (errorMessage.includes('not verified')) {
        setError('Your account is not verified. Please check your email.');
        setShowResend(true);
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email before resending verification.');
      return;
    }

    setResendLoading(true);
    setError(null);

    try {
      const response = await api.post('/clinic/resend-verification', { email });
      setSnackbarMessage(
        response?.data?.message || 'A new verification link has been sent to your email.'
      );
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err?.response?.data?.message || 'Failed to resend email.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }

    setResendLoading(false);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      {/* Left Section: Background Image */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url('/assets/bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Right Section: Login Card */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          backgroundColor: '#f9f9f9',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400, p: 3, borderRadius: 3, boxShadow: 4 }}>
          <CardHeader
            title={
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src="/assets/lifeline_logos-4.png"
                  width={180}
                  alt="logo"
                  style={{ marginBottom: '20px' }}
                />
                <Typography variant="h6">Welcome Back 👋</Typography>
                <Typography variant="body2" color="text.secondary">
                  Log in to continue to your account
                </Typography>
              </Box>
            }
          />

          <CardContent>
            {error && (
              <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                {error}
              </Typography>
            )}

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mt: 2 }}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ py: 1.2, mt: 3 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Log In'}
            </Button>

            {showResend && (
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ py: 1.2, mt: 2 }}
                onClick={handleResendVerification}
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <CircularProgress size={24} sx={{ color: 'blue' }} />
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
            )}

            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                to="/reset-password/email"
                style={{ textDecoration: 'none', color: '#00AC4F' }}
              >
                Forgot password?
              </Link>
            </Typography>

            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
              {`Don't have an account? `}
              <Link to="/sign-up" style={{ textDecoration: 'none', color: '#00AC4F' }}>
                Sign Up
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
