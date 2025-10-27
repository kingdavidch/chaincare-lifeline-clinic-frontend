import { useState } from 'react';

import {
  Card,
  Stack,
  Table,
  Button,
  Skeleton,
  TableRow,
  Container,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { useFetchTestResults, useResendTestResultEmail } from 'src/hooks/useClinicHooks';

import CustomPagination from 'src/components/pagination';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../TableNoData';
import TestResultsTableHead from '../TestResultsTableHead';
import TestResultsTableToolbar from '../TestResultsTableToolbar';
import { applyFilter, getComparator } from '../utils';

export default function TestResultsPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage] = useState(4);
  const [filterDate, setFilterDate] = useState('');

  const { data, isLoading } = useFetchTestResults({ page, rowsPerPage, date: filterDate });
  const { mutateAsync: resendEmail } = useResendTestResultEmail();

  const handleSortRequest = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const [sendingStatus, setSendingStatus] = useState({});

  const handleResendResult = async (testResultId) => {
    setSendingStatus((prev) => ({ ...prev, [testResultId]: 'sending' }));

    try {
      await resendEmail(testResultId);
      setSendingStatus((prev) => ({ ...prev, [testResultId]: 'sent' }));
      setTimeout(() => {
        setSendingStatus((prev) => ({ ...prev, [testResultId]: 'resend' }));
      }, 3000);
    } catch (error) {
      setSendingStatus((prev) => ({ ...prev, [testResultId]: 'resend' }));
    }
  };

  const getButtonLabel = (status) => {
    if (status === 'sending') return 'Sending...';
    if (status === 'sent') return 'Sent';
    return 'Resend';
  };

  const filteredName = String(filterName || '');

  const dataFiltered = applyFilter({
    inputData: data?.data || [],
    comparator: orderBy ? getComparator(order, orderBy) : () => 0,
    filterName: filteredName,
    orderBy,
  });

  const handleFilterByName = (e) => {
    setPage(0);
    setFilterName(e.target.value);
  };

  const handleFilterDateChange = (date) => {
    setPage(0);
    setFilterDate(date);
  };

  if (data?.hasNoTestResults) {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h3">Session Result</Typography>
        </Stack>

        <Card>
          {/* Search Bar & Filters */}
          <TestResultsTableToolbar />

          {/* Table Structure */}
          <Scrollbar>
            <TableContainer>
              <Table>
                <TestResultsTableHead />
                <TableBody>
                  {/* No Data Message */}
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No Appointment results yet.
                      </Typography>
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
        <Typography variant="h3">Session Result</Typography>
      </Stack>

      <Card>
        <TestResultsTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
          onFilterDateChange={handleFilterDateChange}
        />

        <Scrollbar>
          <TableContainer>
            <Table>
              <TestResultsTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSortRequest}
              />
              <TableBody>
                {isLoading
                  ? [...Array(rowsPerPage)].map((_, index) => (
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
                        <TableCell>
                          <Skeleton variant="text" width={80} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={80} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={80} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={80} />
                        </TableCell>
                      </TableRow>
                    ))
                  : dataFiltered?.map((row) => (
                      <TableRow key={row?.id}>
                        <TableCell>{row?.refNo}</TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>
                          {row?.patientName}
                        </TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>{row?.testName}</TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>{row?.orderId}</TableCell>
                        <TableCell>{row?.date}</TableCell>
                        <TableCell>{row?.time}</TableCell>
                        <TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color={sendingStatus[row?.id] === 'sent' ? 'primary' : 'success'}
                              size="small"
                              onClick={() => handleResendResult(row?.id)}
                              disabled={sendingStatus[row?.id] === 'sending'}
                              sx={{
                                minWidth: 100,
                                fontWeight: 'bold',
                                textTransform: 'capitalize',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              {getButtonLabel(sendingStatus[row?.id])}
                              {sendingStatus[row?.id] === 'sending' && (
                                <CircularProgress size={20} sx={{ color: '#fff', mr: 1 }} />
                              )}
                            </Button>
                          </TableCell>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() =>
                              window.open(row?.resultFile, '_blank', 'noopener,noreferrer')
                            }
                            sx={{ color: '#00AC4F', textTransform: 'none' }}
                            all-caps
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                {!isLoading && dataFiltered.length === 0 && (
                  <TableNoData query="No session result found." />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {data?.pagination?.totalPages > 10 && (
          <CustomPagination
            count={data?.pagination?.totalPages}
            page={page + 1}
            onPageChange={(_, newPage) => setPage(newPage - 1)}
          />
        )}
      </Card>
    </Container>
  );
}
