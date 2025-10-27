import PropTypes from 'prop-types';

import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';

export default function DashboardMetrics({
  title,
  total,
  icon,
  subtext,
  percent_change = 0,
  trend,
  moneyValue = true,
  sx,
  metricsVariant = 'default',
  ...other
}) {
  return (
    <Card
      sx={{
        px: 3,
        py: 3,
        borderRadius: 2,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 180,
        ...sx,
      }}
      {...other}
    >
      {icon && <Box sx={{ width: 40, height: 40 }}>{icon}</Box>}

      <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
        {title}
      </Typography>

      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {moneyValue ? `${fNumber(total)} RWF` : fNumber(total)}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: trend === 'increased' ? '#00AC4F' : '#D0004B',
            fontWeight: 700,
          }}
        >
          {trend === 'increased' ? (
            <ArrowUpward fontSize="inherit" />
          ) : (
            <ArrowDownward fontSize="inherit" />
          )}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, ml: 0.3 }}>
            {percent_change}%
          </Typography>
        </Box>
        {subtext && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subtext}
          </Typography>
        )}
      </Stack>
    </Card>
  );
}

DashboardMetrics.propTypes = {
  trend: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
  subtext: PropTypes.string,
  moneyValue: PropTypes.bool,
  metricsVariant: PropTypes.string,
  percent_change: PropTypes.number,
};
