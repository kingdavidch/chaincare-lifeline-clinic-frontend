import { useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import {
  useEarnings,
  useTestSales,
  usePopularTests,
  useClinicDetails,
  useEarningsOverview,
  useTestDistribution,
} from 'src/hooks/useClinicHooks';

import Loader from 'src/sections/Loader/Loader';

import ActiveCustomers from '../ActiveCustomers';
import DashboardMetrics from '../DashboardMetrics';
import MonthlyEarning from '../MonthlyEarning';
import RightCard from '../RightCard';
import SalesMade from '../SalesMade';

export default function DashboardView() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [salesFilter, setSalesFilter] = useState('monthly');
  const [earningsFilter, setEarningsFilter] = useState('monthly');

  // Fetch data using TanStack hooks
  const { data: clinic, isLoading: clinicLoading } = useClinicDetails();

  const { data: earnings, isLoading: earningsLoading } = useEarnings();
  const { data: earningsOverview, isLoading: overviewLoading } =
    useEarningsOverview(earningsFilter);
  const { data: testDistribution, isLoading: distributionLoading } = useTestDistribution();
  const { data: popularTests, isLoading: testsLoading } = usePopularTests();
  const { data: testSales, isLoading: salesLoading } = useTestSales(salesFilter);

  // Handle sales filter change
  const handleSalesFilterChange = (filterType) => {
    setSalesFilter(filterType);
  };

  // Handle menu actions
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  //  filter handler
  const handleEarningsFilterChange = (filterType) => {
    setEarningsFilter(filterType);
  };

  // Show loader if any query is still fetching
  if (
    clinicLoading ||
    earningsLoading ||
    overviewLoading ||
    distributionLoading ||
    testsLoading ||
    salesLoading
  ) {
    return (
      <Container
        sx={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Loader />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
        <Typography sx={{ textTransform: 'capitalize' }} variant="h3">
          Hi, {clinic?.clinicName} 👋
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            endIcon={<ExpandMoreIcon />}
            sx={{ backgroundColor: '#00AC4F', color: '#fff', fontWeight: '400', p: 1.2, mr: 2 }}
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            Download Report
          </Button>
        </Box>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{ mt: 1, ml: 5 }}
        >
          <MenuItem onClick={handleClose} sx={{ gap: 1 }}>
            <img alt="icon" src="/assets/icons/reports/excel.svg" />
            <Typography>Excel</Typography>
          </MenuItem>
          <MenuItem onClick={handleClose} sx={{ gap: 1 }}>
            <img alt="icon" src="/assets/icons/reports/pdf.svg" />
            <Typography>PDF</Typography>
          </MenuItem>
        </Menu>
      </Box>

      <Grid container spacing={3}>
        {/* Earnings */}
        <Grid item xs={12} sm={6} md={4}>
          <DashboardMetrics
            title="Earning"
            total={earnings?.earnings?.amount || 0}
            trend={Number(earnings?.earnings?.percentageChange) >= 0 ? 'increased' : 'decreased'}
            percent_change={Number(earnings?.earnings?.percentageChange).toFixed(1) || 0}
            subtext="this month"
            icon={<img alt="icon" src="/assets/icons/dashboard/earning.svg" />}
          />
        </Grid>

        {/* Balance */}
        <Grid item xs={12} sm={6} md={4}>
          <DashboardMetrics
            title="Balance"
            total={earnings?.balance?.amount || 0}
            trend={Number(earnings?.balance?.percentageChange) >= 0 ? 'increased' : 'decreased'}
            percent_change={Number(earnings?.balance?.percentageChange).toFixed(1) || 0}
            subtext="this month"
            icon={<img alt="icon" src="/assets/icons/dashboard/balance.svg" />}
          />
        </Grid>

        {/* Total Tests */}
        <Grid item xs={12} sm={6} md={4}>
          <DashboardMetrics
            title="Total appointment created"
            moneyValue={false}
            total={earnings?.totalTests?.amount || 0}
            trend={Number(earnings?.totalTests?.percentageChange) >= 0 ? 'increased' : 'decreased'}
            percent_change={Number(earnings?.totalTests?.percentageChange).toFixed(1) || 0}
            subtext="this week"
            icon={<img alt="icon" src="/assets/icons/dashboard/sales.svg" />}
          />
        </Grid>

        {/* Earnings Overview Chart */}
        <Grid item xs={12} md={6} lg={8}>
          <MonthlyEarning
            title="Overview"
            subheader={`${earningsFilter} Earnings`}
            selectedFilter={earningsFilter}
            chart={{
              labels:
                earningsOverview?.map((item) => {
                  if (earningsFilter === 'weekly') {
                    const [year, week] = item.period.split('-');
                    return `Week ${week}, ${year}`;
                  }
                  return item.period;
                }) || [],
              series: [
                {
                  name: 'Earnings',
                  type: 'column',
                  fill: 'solid',
                  data: earningsOverview?.map((item) => item?.earnings) || [],
                },
              ],
            }}
            onFilterChange={handleEarningsFilterChange}
          />
        </Grid>

        {/* Test Distribution Chart */}
        <Grid item xs={12} md={6} lg={4}>
          <ActiveCustomers
            title="Appointments Conducted"
            subheader="Home vs. On-site Appointment"
            chart={{
              series: [
                {
                  label: 'Home Appointments',
                  value: testDistribution?.homeTests?.count || 0,
                },
                {
                  label: 'On-site Appointments',
                  value: testDistribution?.onSiteTests?.count || 0,
                },
              ],
              colors: ['#00AC4F', '#40322E'],
            }}
          />
        </Grid>

        {/* Test Sales with Filtering */}
        <Grid item xs={12} md={6} lg={8}>
          <SalesMade
            title="Sales Made"
            subheader="Test Sales Data"
            selectedFilter={salesFilter}
            onFilterChange={handleSalesFilterChange}
            chart={{
              labels:
                testSales?.map((sale) => {
                  if (salesFilter === 'weekly') {
                    const [year, week] = sale?.period?.split('-') || [];
                    return `Week ${week}, ${year}`;
                  }
                  if (salesFilter === 'yearly') {
                    return `Year ${sale?.period}`;
                  }
                  return sale?.period ? new Date(sale.period).toISOString() : '';
                }) || [],
              series: [
                {
                  name: 'Sales Made',
                  type: 'area',
                  fill: 'gradient',
                  data: testSales?.map((sale) => sale?.sales ?? 0) || [],
                },
              ],
            }}
          />
        </Grid>

        {/* Popular Tests (Best Selling) */}
        <Grid item lg={4} md={6} xs={12}>
          <Grid item spacing={2}>
            <Grid item lg={12} md={12} xs={12}>
              <RightCard title="Popular Appointments" tests={popularTests || []} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
