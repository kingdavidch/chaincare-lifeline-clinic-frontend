import { useNavigate } from 'react-router-dom';

import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography'; // For navigation
import { RouterLink } from 'src/routes/components'; // For routing
import Logo from 'src/components/logo'; // Your logo component

export default function ErrorBoundaryView() {
  const navigate = useNavigate(); // Hook for navigation

  const renderHeader = (
    <Box
      component="header"
      sx={{
        top: 0,
        left: 0,
        width: 1,
        lineHeight: 0,
        position: 'fixed',
        p: (theme) => ({ xs: theme.spacing(3, 3, 0), sm: theme.spacing(5, 5, 0) }),
      }}
    >
      <Logo />
    </Box>
  );

  return (
    <>
      {renderHeader}

      <Container>
        <Box
          sx={{
            py: 12,
            maxWidth: 480,
            mx: 'auto',
            display: 'flex',
            minHeight: '100vh',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h3" sx={{ mb: 3 }}>
            Oops! Something went wrong.
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            An unexpected error occurred. Please try again or contact support if the problem
            persists.
          </Typography>

          <Box
            component="img"
            src="/assets/illustrations/illustration_error.svg" // Replace with your error illustration
            sx={{
              mx: 'auto',
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              size="large"
              variant="outlined"
              onClick={() => navigate(-1)} // Go back to the previous page
              sx={{
                borderColor: '#00AC4F',
                color: '#00AC4F',
                '&:hover': {
                  borderColor: '#00AC4F',
                  backgroundColor: '#00AC4F',
                  color: '#fff',
                },
              }}
            >
              Go Back
            </Button>

            <Button
              href="/"
              size="large"
              variant="contained"
              component={RouterLink}
              sx={{
                backgroundColor: '#00AC4F',
                '&:hover': {
                  backgroundColor: '#00AC4F',
                },
              }}
            >
              Go to Home
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
