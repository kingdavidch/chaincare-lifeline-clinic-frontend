import PropTypes from 'prop-types';

import { Box, Skeleton, Typography } from '@mui/material';

function EarningMetricCard({ title, value, percentage, subtext, icon, color, isLoading }) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: isLoading ? 'grey.100' : color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isLoading ? (
          <Skeleton variant="circular" width={70} height={70} />
        ) : (
          <img src={icon} alt={title} width={70} height={70} loading="lazy" />
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {isLoading ? (
          <>
            <Skeleton variant="text" width={80} height={20} />
            <Skeleton variant="text" width={100} height={28} />
            <Skeleton variant="text" width={120} height={20} />
          </>
        ) : (
          <>
            <Typography sx={{ fontSize: 16, fontWeight: 500 }} color="text.secondary">
              {title}
            </Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 700 }}>{value}</Typography>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: percentage >= 0 ? '#22C55E' : '#D92D20',
              }}
            >
              {percentage >= 0 ? `↑ ${percentage}%` : `↓ ${Math.abs(percentage)}%`} {subtext}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}

EarningMetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  percentage: PropTypes.number,
  subtext: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  isLoading: PropTypes.bool,
};

function EarningStatsGroup({ stats, isLoading }) {
  return (
    <Box
      sx={{
        borderRadius: '24px',
        backgroundColor: '#fff',
        boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.05)',
        px: 6,
        py: 5,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {(isLoading ? Array.from(new Array(3)) : stats).map((stat, index) => (
        <Box
          key={stat?.title || index}
          sx={{
            flex: 1,
            px: 3,
            ...(index !== 2 && { borderRight: '1px solid #EAEAEA' }),
          }}
        >
          <EarningMetricCard {...(stat || {})} isLoading={isLoading} />
        </Box>
      ))}
    </Box>
  );
}

EarningStatsGroup.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.string,
      percentage: PropTypes.number,
      subtext: PropTypes.string,
      icon: PropTypes.string,
      color: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
};

export default EarningStatsGroup;
