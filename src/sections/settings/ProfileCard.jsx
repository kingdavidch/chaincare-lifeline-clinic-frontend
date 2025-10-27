import React from 'react';

import PropTypes from 'prop-types';

import { Box, Stack, Avatar, Typography } from '@mui/material';

export default function ProfileCard({ name, image, location, status }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar src={image} sx={{ width: 60, height: 60 }} />
      <Box>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2" color="textSecondary">
          {location}
        </Typography>
        <Typography variant="caption" color={status === 'Online' ? 'green' : 'red'}>
          {status}
        </Typography>
      </Box>
    </Stack>
  );
}

ProfileCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};
