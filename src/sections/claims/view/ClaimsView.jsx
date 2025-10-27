import { useState } from 'react';

import {
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

import { useClinicDetails, useFetchAllClaims } from 'src/hooks/useClinicHooks';

import CustomPagination from 'src/components/pagination';
import Scrollbar from 'src/components/scrollbar';
import WelcomeToLifeLine from 'src/components/welcome/WelcomeToLifeLine';

import ClaimsTableHead from '../claims-table-head';
import ClaimsTableRow from '../claims-table-row';
import ClaimsTableToolbar from '../claims-table-toolbar';
import NewClaimsTableToolbar from '../newClaims-table-toolbar';
import TableNoData from '../table-no-data';

export default function ClaimsView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('claimNo');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState(null);

  // Fetch claims
  const { data: allClaimsData, isLoading: loadingAll } = useFetchAllClaims({
    searchTerm: '',
    filterStatus,
    page,
    rowsPerPage,
    filterDate,
  });

  // Fetch clinic details
  const { data: clinic, isLoading: loadingClinic } = useClinicDetails();

  if (!loadingClinic && !clinic?.contractAccepted) {
    return <WelcomeToLifeLine />;
  }

  const allClaims = allClaimsData?.data || [];

  const filterClaims = (claims, searchTerm, date) =>
    claims.filter((claim) => {
      const matchesSearch =
        !searchTerm ||
        claim.claimNo?.toString().includes(searchTerm.toLowerCase()) ||
        claim.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.testName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.cost?.toString().includes(searchTerm.toLowerCase()) ||
        new Date(claim.date).toLocaleDateString().includes(searchTerm);

      const matchesDate = !date || new Date(claim.date).toISOString().split('T')[0] === date;

      return matchesSearch && matchesDate;
    });

  const dataFiltered = filterClaims(allClaims, filterName);

  const handleSort = (_event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id) {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  if (allClaimsData?.hasNoClaims) {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h3">Claims</Typography>
        </Stack>

        <NewClaimsTableToolbar hasNoClaims={allClaimsData?.hasNoClaims} />

        <Card
          sx={{
            height: '25vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            py: 3,
          }}
        >
          <TableContainer>
            <Table>
              <ClaimsTableHead
                headLabel={[
                  { id: 'claimNo', label: 'ID' },
                  { id: 'name', label: "Patient's Name" },
                  { id: 'date', label: 'Date' },
                  { id: 'testName', label: 'Test' },
                  { id: 'cost', label: 'Cost' },
                ]}
              />
            </Table>
          </TableContainer>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            No claims filed
          </Typography>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h3">Claims</Typography>
      </Stack>

      <NewClaimsTableToolbar />

      {/* All Claims */}
      <Card>
        <ClaimsTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
          onFilterStatusChange={setFilterStatus}
          onDateFilterChange={setFilterDate}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ClaimsTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'claimNo', label: 'ID' },
                  { id: 'name', label: "Patient's Name" },
                  { id: 'date', label: 'Date' },
                  { id: 'testName', label: 'Test' },
                  { id: 'cost', label: 'Cost' },
                ]}
              />
              <TableBody>
                {loadingAll
                  ? [...Array(rowsPerPage)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton variant="text" width={40} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="60%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="50%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="70%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="40%" />
                        </TableCell>
                      </TableRow>
                    ))
                  : dataFiltered?.map((row) => (
                      <ClaimsTableRow
                        key={row?._id}
                        index={row?.claimNo}
                        claimNo={row?.claimNo}
                        currencySymbol={row.currencySymbol}
                        patient={row?.patient?.fullName || 'N/A'}
                        date={new Date(row?.date).toLocaleDateString()}
                        testName={row?.testName}
                        cost={row?.cost}
                      />
                    ))}
                {!loadingAll && !dataFiltered?.length && (
                  <TableNoData query={filterName} hasNoClaims={allClaimsData?.hasNoClaims} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {allClaimsData?.pagination?.totalClaims > 10 && (
          <CustomPagination
            count={Math.ceil(allClaimsData.pagination.totalClaims / rowsPerPage)}
            page={page + 1}
            onPageChange={(_, newPage) => setPage(newPage - 1)}
          />
        )}
      </Card>
    </Container>
  );
}
