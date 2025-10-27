import { useState, useEffect } from 'react';

import {
  Card,
  Grid,
  Stack,
  Table,
  Skeleton,
  TableRow,
  Container,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';

import { useFetchPatients, useFetchPatientMetrics } from 'src/hooks/useClinicHooks';

import CustomPagination from 'src/components/pagination';
import Scrollbar from 'src/components/scrollbar';

import DashboardMetrics from 'src/sections/dashboard/DashboardMetrics';

import UserTableHead from '../customers-table-head';
import UserTableRow from '../customers-table-row';
import UserTableToolbar from '../customers-table-toolbar';
import TableNoData from '../table-no-data';
import { applyFilter, getComparator } from '../utils';

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('');

  const { data, isLoading, isError } = useFetchPatients({
    searchTerm: '',
    filterStatus,
    page,
    rowsPerPage,
  });

  // Fetch patient metrics
  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    isError: isErrorMetrics,
  } = useFetchPatientMetrics();

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterStatusChange = (status) => {
    setPage(0);
    setFilterStatus(status);
  };

  // Apply search filtering on frontend
  const dataFiltered = applyFilter({
    inputData: data?.patients || [],
    comparator: getComparator(order, orderBy),
    filterName,
  });

  useEffect(() => {
    if (data?.pagination?.totalPages && page >= data.pagination.totalPages) {
      setPage(0);
    }
  }, [data?.pagination?.totalPages, page]);

  const notFound = !dataFiltered?.length && (!!filterName || !!filterStatus);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h3">Patients</Typography>
      </Stack>

      {/* Loading Indicator */}
      {isLoadingMetrics && (
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Show Metrics Only When Data is Loaded */}
      {!isLoadingMetrics && !isErrorMetrics && (
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {/* All Patients Metric */}
          <Grid item xs={12} sm={6} md={4}>
            <DashboardMetrics
              title="All Patients"
              total={metrics?.allPatients?.amount || 0}
              trend={metrics?.allPatients?.percentageChange >= 0 ? 'increased' : 'decreased'}
              percent_change={Number(metrics?.allPatients?.percentageChange) || 0}
              subtext="Overall count"
              moneyValue={false}
              icon={<img alt="icon" src="/assets/icons/customers/customers.svg" />}
            />
          </Grid>

          {/* Members Metric */}
          <Grid item xs={12} sm={6} md={4}>
            <DashboardMetrics
              title="Members"
              total={metrics?.members?.amount || 0}
              trend={metrics?.members?.percentageChange >= 0 ? 'increased' : 'decreased'}
              percent_change={Number(metrics?.members?.percentageChange) || 0}
              subtext="All-time members"
              moneyValue={false}
              icon={<img alt="icon" src="/assets/icons/customers/members.svg" />}
            />
          </Grid>

          {/* Active Patients Metric */}
          <Grid item xs={12} sm={6} md={4}>
            <DashboardMetrics
              title="Active Patients"
              total={metrics?.active?.amount || 0}
              moneyValue={false}
              icon={<img alt="icon" src="/assets/icons/customers/active.svg" />}
              metricsVariant="avatar"
              trend={metrics?.active?.percentageChange >= 0 ? 'increased' : 'decreased'}
              percent_change={Number(metrics?.active?.percentageChange) || 0}
            />
          </Grid>
        </Grid>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <Card>
          <UserTableToolbar filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  numSelected={0}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: 'id', label: 'ID' },
                    { id: 'name', label: 'Patient Name' },
                    { id: 'status', label: 'Status' },
                    { id: 'Claim', label: 'Claim History' },
                  ]}
                />
                <TableBody>
                  {[...Array(rowsPerPage)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton variant="text" width={40} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width="60%" />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width={80} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width={100} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      )}

      {/* Show Table Only When Data is Loaded */}
      {!isLoading && !isError && (
        <Card>
          <UserTableToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
            onFilterStatusChange={handleFilterStatusChange}
            filterStatus={filterStatus}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  numSelected={0}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: 'id', label: 'ID' },
                    { id: 'name', label: 'Patient Name' },
                    { id: 'status', label: 'Status' },
                    { id: 'Claim', label: 'Claim History' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    ?.filter((patient) => filterStatus === '' || patient?.status === filterStatus)
                    ?.map((row, index) => (
                      <UserTableRow
                        key={row?.patientId || index}
                        patientId={row?.patientId?.toString()}
                        index={page * rowsPerPage + index + 1}
                        name={row?.patientName}
                        status={row?.status}
                        row={row}
                      />
                    ))}

                  {notFound && <TableNoData query={filterName.trim()} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          {data?.pagination?.totalRecords > 10 && (
            <CustomPagination
              count={Math.ceil(data.pagination.totalRecords / rowsPerPage)}
              page={page + 1}
              onPageChange={(_, newPage) => handleChangePage(null, newPage - 1)}
            />
          )}
        </Card>
      )}
    </Container>
  );
}
