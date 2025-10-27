import { useState, useEffect } from 'react';

import {
  Box,
  Card,
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

import { useFetchAllOrders } from 'src/hooks/useClinicHooks';

import CustomPagination from 'src/components/pagination';
import Scrollbar from 'src/components/scrollbar';

import OrdersTableHead from '../OrdersTableHead';
import OrdersTableRow from '../OrdersTableRow';
import OrdersTableToolbar from '../OrdersTableToolbar';
import TableEmptyRows from '../TableEmptyRows';
import TableNoData from '../TableNoData';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function OrdersPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(null); 
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage] = useState(10);
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const { data, isLoading } = useFetchAllOrders({
    filterPaymentMethod,
    filterDate,
    page,
    rowsPerPage,
  });

  useEffect(() => {
    if (data?.pagination?.totalPages && page >= data.pagination.totalPages) {
      setPage(0);
    }
  }, [data?.pagination?.totalPages, page]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage - 1);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterStatusChange = (status) => {
    setPage(0);
  };

  const handleFilterPaymentChange = (paymentMethod) => {
    setPage(0);
    setFilterPaymentMethod(paymentMethod);
  };

  const handleFilterDateChange = (date) => {
    setPage(0);
    setFilterDate(date);
  };

  const dataFiltered = applyFilter({
    inputData: data?.data || [],
    comparator: getComparator(order, orderBy),
    filterName,
    orderBy,
  });

  if (data?.hasNoOrders) {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h3">Orders</Typography>
        </Stack>

        <Card>
          <OrdersTableToolbar />
          <Scrollbar>
            <TableContainer>
              <Table>
                <OrdersTableHead
                  headLabel={[
                    { id: 'orderId', label: 'ID' },
                    { id: 'CustomerName', label: 'Customer Name' },
                    { id: 'Appointment', label: 'Appointment' },
                    { id: 'price', label: 'Price' },
                    { id: 'Date', label: 'Date' },
                    { id: 'Time', label: 'Time' },
                    { id: 'PaymentMethod', label: 'Payment Method' },
                    { id: 'resultSent', label: 'Result Sent' },
                    { id: 'Status', label: 'Status' },
                    { id: 'actions', label: 'Action' },
                  ]}
                />
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Box py={5}>
                        <Typography variant="body1" color="text.secondary">
                          No orders yet
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h3">Orders</Typography>
      </Stack>

      <Card>
        <OrdersTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
          onFilterStatusChange={handleFilterStatusChange}
          onFilterPaymentChange={handleFilterPaymentChange}
          onFilterDateChange={handleFilterDateChange}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <OrdersTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'orderId', label: 'ID' },
                  { id: 'CustomerName', label: 'Customer Name' },
                  { id: 'Appointment', label: 'Appointment' },
                  { id: 'price', label: 'Price' },
                  { id: 'Date', label: 'Date' },
                  { id: 'Time', label: 'Time' },
                  { id: 'PaymentMethod', label: 'Payment Method' },
                  { id: 'resultSent', label: 'Result Sent' },
                  { id: 'Status', label: 'Status' },
                  { id: 'actions', label: 'Action' },
                ]}
              />
              <TableBody>
                {isLoading
                  ? [...Array(rowsPerPage)].map((_, index) => (
                      <TableRow key={index}>
                        {[...Array(10)].map((__, i) => (
                          <TableCell key={i}>
                            <Skeleton variant="text" width={i === 1 ? '60%' : 80} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : dataFiltered?.map((row, index) => <OrdersTableRow key={index} order={row} />)}

                <TableEmptyRows
                  emptyRows={emptyRows(page, rowsPerPage, dataFiltered?.length || 0)}
                />

                {!isLoading && !dataFiltered?.length && (
                  <TableNoData query={filterName} hasNoOrders={data?.hasNoOrders} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {data?.pagination?.totalPages > 1 && (
          <CustomPagination
            count={data.pagination.totalPages}
            page={page + 1}
            onPageChange={handleChangePage}
          />
        )}
      </Card>
    </Container>
  );
}
