import { useState } from 'react';

import {
  Box,
  Card,
  Stack,
  Table,
  TableRow,
  Skeleton,
  Container,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';

import { useWithdrawalStats, useFetchClinicWithdrawals } from 'src/hooks/useClinicHooks';

import CustomPagination from 'src/components/pagination';
import Scrollbar from 'src/components/scrollbar';

import EarningStatsGroup from '../EarningStatsGroup';
import WithdrawButton from '../WithdrawButton';
import WithdrawModal from '../WithdrawModal';
import WithdrawalsTableHead from '../WithdrawalsTableHead';
import WithdrawalsTableRow from '../WithdrawalsTableRow';
import WithdrawalsTableToolbar from '../WithdrawalsTableToolbar';

export default function WithdrawalsView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const { data: withdrawalStats, isLoading: withdrawalLoading } = useWithdrawalStats();

  const { data, isLoading } = useFetchClinicWithdrawals({
    filterStatus,
    filterDate: filterDate || '',
    searchText: filterName,
    page,
    rowsPerPage,
  });

  const withdrawals = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 0;

  const handleSort = (_, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const handleFilterStatusChange = (status) => {
    setPage(0);
    setFilterStatus(status);
  };
  const handleFilterDateChange = (date) => {
    setPage(0);
    setFilterDate(date);
  };

  if (data?.hasNoWithdrawals) {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h3">Withdrawals</Typography>
          <WithdrawButton onClick={() => setOpenModal(true)} />
        </Stack>

        <Card>
          <WithdrawalsTableToolbar />
          <Scrollbar>
            <TableContainer>
              <Table>
                <WithdrawalsTableHead order={order} orderBy={orderBy} onRequestSort={handleSort} />
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Box py={5}>
                        <Typography variant="body1" color="text.secondary">
                          No withdrawals yet
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>

        {/* ✅ Include the modal here too */}
        <WithdrawModal open={openModal} handleClose={() => setOpenModal(false)} />
      </Container>
    );
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h3">Withdrawals</Typography>
        <WithdrawButton onClick={() => setOpenModal(true)} />
      </Stack>

      <EarningStatsGroup
        stats={
          withdrawalStats
            ? [
                {
                  title: 'Wallet Balance',
                  value: `${withdrawalStats.data.balance.value.toLocaleString()} RWF`,
                  percentage: withdrawalStats.data.balance.percentage ?? 0,
                  subtext: withdrawalStats.data.balance.subtext,
                  icon: '/assets/icons/dashboard/balance.svg',
                  color: '#BFDBFE',
                },
                {
                  title: 'Total Ordered Appointments ',
                  value: withdrawalStats.data.totalTests.value.toLocaleString(),
                  percentage: withdrawalStats.data.totalTests.percentage,
                  subtext: withdrawalStats.data.totalTests.subtext,
                  icon: '/assets/icons/dashboard/sales.svg',
                  color: '#FBCFE8',
                },
              ]
            : []
        }
        isLoading={withdrawalLoading}
      />

      <Card sx={{ mt: 4 }}>
        <WithdrawalsTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
          filterStatus={filterStatus}
          onFilterStatusChange={handleFilterStatusChange}
          onFilterDateChange={handleFilterDateChange}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800, tableLayout: 'fixed' }}>
              <WithdrawalsTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'id', label: 'ID' },
                  { id: 'date', label: 'Date' },
                  { id: 'amount', label: 'Amount' },
                  { id: 'provider', label: 'Provider' },
                  { id: 'status', label: 'Status' },
                ]}
              />

              <TableBody>
                {isLoading
                  ? [...Array(rowsPerPage)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          <Skeleton variant="text" width={40} sx={{ mx: 'auto' }} />
                        </TableCell>
                        <TableCell align="center">
                          <Skeleton variant="text" width={80} sx={{ mx: 'auto' }} />
                        </TableCell>
                        <TableCell align="center">
                          <Skeleton variant="text" width={80} sx={{ mx: 'auto' }} />
                        </TableCell>
                        <TableCell align="center">
                          <Skeleton variant="text" width={80} sx={{ mx: 'auto' }} />
                        </TableCell>
                        <TableCell align="center">
                          <Skeleton variant="text" width={80} sx={{ mx: 'auto' }} />
                        </TableCell>
                      </TableRow>
                    ))
                  : withdrawals.map((row) => <WithdrawalsTableRow key={row.id} row={row} />)}

                {!isLoading && withdrawals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No withdrawals found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {totalPages > 1 && (
          <CustomPagination
            count={totalPages}
            page={page + 1}
            onPageChange={(_, newPage) => handleChangePage(null, newPage - 1)}
          />
        )}
      </Card>
      <WithdrawModal open={openModal} handleClose={() => setOpenModal(false)} />
    </Container>
  );
}
