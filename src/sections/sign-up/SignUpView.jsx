import { useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';

import { SignUpForm } from './SignUpForm';

export default function SignUpView() {
  const navigate = useNavigate();

  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      {/* Left Section: Image */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'block' },
          background: 'white',
          backgroundImage: `url('/assets/bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'auto', 
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: 4,
            minHeight: 'min-content',
          }}
        >
          <SignUpForm navigate={navigate} />
        </Box>
      </Box>
    </Box>
  );
}
