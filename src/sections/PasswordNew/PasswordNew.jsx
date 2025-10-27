import { useLocation, useNavigate } from 'react-router-dom';

import { useState, useEffect } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import api from 'src/api/axiosConfig';

import Iconify from 'src/components/iconify';

export default function PasswordNew() {
  const [showPassword, setShowPassword] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Extract token from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Invalid or missing token.');
    }
  }, [location.search]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    const newErrors = {};

    if (!token.trim()) newErrors.token = 'Invalid or missing token.';
    if (!newPassword.trim()) newErrors.newPassword = 'New password is required.';
    if (!confirmPassword.trim()) newErrors.confirmPassword = 'Confirm password is required.';
    if (newPassword.length < 8)
      newErrors.newPassword = 'Password must be at least 8 characters long.';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

    if (Object.keys(newErrors).length > 0) {
      setError(Object.values(newErrors).join(' '));
      setLoading(false);
      return;
    }

    try {
      const response = await api.patch('/clinic/reset-password', {
        token,
        newPassword,
        confirmPassword,
      });

      setSuccess(response?.data?.message || 'Password reset successful! Redirecting...');
      setLoading(false);

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      {/* Left Section: Image */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url('/assets/login.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Right Section: Form */}
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
          <img
            src="/assets/lifeline_logos-4.png"
            width={200}
            alt="logo"
            style={{ textAlign: 'center', marginBottom: '50px', marginTop: '100px' }}
          />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Reset Password
          </Typography>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              {success}
            </Typography>
          )}

          <TextField
            fullWidth
            name="newPassword"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            sx={{ marginTop: 2 }}
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
          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={confirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            sx={{ marginTop: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setConfirm(!confirm)} edge="end">
                    <Iconify icon={confirm ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ paddingY: 1.2, marginTop: 2 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Reset Password'}
          </Button>
        </Box>
      </Box>

      {/* Snackbar for Success Messages */}
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess(null)}>
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
