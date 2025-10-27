import React from 'react';

import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';

export default function RightCard({ title, tests }) {
  return (
    <Card sx={{ padding: 1, borderRadius: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CardHeader
          title={title}
          sx={{
            p: 0,
            fontWeight: 'bold',
          }}
        />
      </Box>

      <CardContent>
        {tests && tests.length > 0 ? (
          <Grid container spacing={2}>
            {tests.map((test, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 2,
                    px: 1.5,
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                  }}
                >
                  <Avatar
                    src={test.testImage || '/assets/images/placeholder.png'}
                    alt={test.testName}
                    sx={{ width: 50, height: 50, marginRight: 2, borderRadius: 1 }}
                  />
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ fontSize: 14, textTransform: 'capitalize' }}
                      >
                        {test.testName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ fontSize: 12 }}>
                        {test.totalBookings} bookings
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="body1" fontWeight="bold" sx={{ fontSize: 14 }}>
                        {fNumber(test.price)} RWF
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
            No popular appointment available.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

RightCard.propTypes = {
  title: PropTypes.string.isRequired,
  tests: PropTypes.array.isRequired,
};
