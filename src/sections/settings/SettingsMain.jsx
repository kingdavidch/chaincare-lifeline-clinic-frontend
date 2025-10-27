import React from 'react';

import { Box, Grid, Paper, Typography } from '@mui/material';

import SettingsForm from './SettingsForm';
import UserProfile from './UserProfile';

export default function Settings() {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 4 }}>
      {/* Title */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Settings
      </Typography>

      <Grid container spacing={4}>
        {/* Left - Settings Form */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <SettingsForm />
          </Paper>
        </Grid>

        {/* Right - Profile Section */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <UserProfile />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
