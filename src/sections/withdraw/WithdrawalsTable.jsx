import { useState } from 'react';

import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  OutlinedInput,
  TableContainer,
  InputAdornment,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import CustomPagination from 'src/components/pagination';
import Scrollbar from 'src/components/scrollbar';

/**
 * Dummy data for withdrawals table.
 * All withdrawals are now through **MTN MoMo**.
 */
const dummyWithdrawals = [
  { id: 1, date: '31-07-2024', amount: '$200', method: 'MTN MoMo', status: 'Completed' },
  { id: 2, date: '30-07-2024', amount: '$150', method: 'MTN MoMo', status: 'Processing' },
  { id: 3, date: '29-07-2024', amount: '$300', method: 'MTN MoMo', status: 'Failed' },
  { id: 4, date: '28-07-2024', amount: '$500', method: 'MTN MoMo', status: 'Completed' },
  { id: 5, date: '27-07-2024', amount: '$100', method: 'MTN MoMo', status: 'Processing' },
];

/**
 * Get status color based on the status value.
 */
const getStatusColor = (status) => {
  const colors = {
    Completed: '#22C55E',
    Processing: '#FACC15',
    Failed: '#EF4444',
  };
  return colors[status] || '#6B7280'; // Default to gray if no match
};

export default function WithdrawalsTable() {
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const handleFilter = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  const filteredData = dummyWithdrawals.filter(
    (row) =>
      row.method.toLowerCase().includes(filter) ||
      row.status.toLowerCase().includes(filter) ||
      row.date.includes(filter)
  );

  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Withdrawals</Typography>

        {/* Search Filter */}
        <OutlinedInput
          value={filter}
          onChange={handleFilter}
          placeholder="Search"
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
          sx={{
            backgroundColor: '#f8f9fd',
            borderRadius: '8px',
            pr: 2,
            minWidth: 200,
            '& .MuiOutlinedInput-input': {
              padding: '10px 14px',
            },
          }}
        />
      </Stack>

      <Scrollbar>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>{row.method}</TableCell>
                      <TableCell>
                        <Typography sx={{ color: getStatusColor(row.status), fontWeight: 'bold' }}>
                          {row.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton>
                          <Iconify icon="eva:eye-outline" width={20} height={20} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
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

      {/* Pagination */}
      <CustomPagination
        count={Math.ceil(dummyWithdrawals.length / rowsPerPage)}
        page={page + 1}
        onPageChange={(_, newPage) => setPage(newPage - 1)}
      />
    </Card>
  );
}
