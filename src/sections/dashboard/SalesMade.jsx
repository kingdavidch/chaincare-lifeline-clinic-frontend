import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import Chart, { useChart } from 'src/components/chart';

import MonthlyDropDown from './MonthlyDropDown';

export default function SalesMade({
  title,
  subheader,
  chart,
  onFilterChange,
  selectedFilter,
  ...other
}) {
  const { series, options, labels } = chart;

  const chartOptions = useChart({
    colors: ['#00AC4F'],
    xaxis: {
      type: ['weekly', 'yearly'].includes(selectedFilter) ? 'category' : 'datetime',
    },
    labels,
    ...options,
  });

  return (
    <Card {...other}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 5,
          py: 2,
        }}
      >
        <CardHeader sx={{ p: 0 }} title={title} subheader={subheader} />
        <MonthlyDropDown selectedFilter={selectedFilter} onFilterChange={onFilterChange} />
      </Box>
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="line"
          series={series}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}

SalesMade.propTypes = {
  chart: PropTypes.object.isRequired,
  subheader: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  selectedFilter: PropTypes.string.isRequired,
};
