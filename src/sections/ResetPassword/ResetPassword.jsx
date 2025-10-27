import { Link } from 'react-router-dom';

import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import api from 'src/api/axiosConfig';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);

  // Email validation function
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value?.trim());
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (!validateEmail(e.target.value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await api.post('/clinic/forgot-password', { email });
      setMessage(response?.data?.message || 'Password reset link has been sent to your email.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      {/* Left Section: Image */}
      <Box
        sx={{
          flex: 1,
          background: 'white',
          backgroundImage: `url('/assets/login.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Right Section: Reset Password Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* Logo */}
          <img
            src="/assets/lifeline_logos-4.png"
            width={200}
            alt="logo"
            style={{ textAlign: 'center', marginBottom: '50px', marginTop: '100px' }}
          />

          {/* Reset Password Form */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Forgot Password?
          </Typography>

          {/* Error Message */}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <TextField
            label="Enter your email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={handleChange}
            error={Boolean(emailError)}
            helperText={emailError}
          />

          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ paddingY: 1.2, marginTop: 2 }}
            onClick={handleSubmit}
            disabled={loading || !email.trim() || !!emailError} // 🔹 Button disabled if email is invalid
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Reset Link'}
          </Button>

          {/* Back to Login Link */}
          <Typography variant="body2" sx={{ textAlign: 'center', marginTop: 2 }}>
            <Link to="/login" style={{ textDecoration: 'none', color: '#00AC4F' }}>
              Back to Login
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Snackbar for Success Messages */}
      <Snackbar open={!!message} autoHideDuration={3000} onClose={() => setMessage(null)}>
        <Alert onClose={() => setMessage(null)} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
