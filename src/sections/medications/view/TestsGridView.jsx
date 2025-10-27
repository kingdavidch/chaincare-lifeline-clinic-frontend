import { useState, useEffect } from 'react';

import { Grid, Card, Skeleton, Container, Typography } from '@mui/material';

import { useFetchTests } from 'src/hooks/useClinicHooks';

import CustomPagination from 'src/components/pagination';

import TestCard from '../TestCard';
import TestsHeader from '../TestsHeader';

export default function TestsGridView() {
  const [searchInput, setSearchInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const rowsPerPage = 6;

  // Send filter value only if not "all"
  const apiFilter = filter === 'all' ? '' : filter;

  const { data, isLoading, isError } = useFetchTests({
    searchTerm: searchInput.trim(),
    filter: apiFilter,
    page,
    rowsPerPage,
  });

  // Reset to first page when filter or search changes
  useEffect(() => {
    setPage(0);
  }, [filter, searchInput]);

  // Ensure we don't exceed totalPages
  useEffect(() => {
    if (data?.pagination?.totalPages && page >= data.pagination.totalPages) {
      setPage(0);
    }
  }, [data?.pagination?.totalPages, page]);

  const tests = data?.data || [];

  return (
    <Container sx={{ py: 4 }}>
      {/* Header with Search & Filter */}
      <TestsHeader filter={filter} setFilter={setFilter} onSearch={setSearchInput} />

      {/* Error State */}
      {isError && (
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          Failed to load tests. Please try again.
        </Typography>
      )}

      {/* Parent Card Holding All Tests */}
      <Card
        sx={{
          backgroundColor: 'white',
          boxShadow: 3,
          borderRadius: 2,
          padding: 3,
          width: '100%',
        }}
      >
        <Grid container spacing={3}>
          {/* Loading State */}
          {isLoading &&
            [...Array(rowsPerPage)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
                <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
                <Skeleton variant="text" width="60%" />
              </Grid>
            ))}

          {/* Loaded Tests */}
          {!isLoading &&
            tests?.length > 0 &&
            tests.map((test) => (
              <Grid item xs={12} sm={6} md={4} key={test._id}>
                <TestCard test={test} />
              </Grid>
            ))}

          {/* No Results */}
          {!isLoading && tests?.length === 0 && (
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 4 }}>
              <Typography color="text.secondary">No Appointment found.</Typography>
            </Grid>
          )}
        </Grid>
      </Card>

      {/* Pagination */}
      {data?.pagination?.totalPages > 1 && (
        <CustomPagination
          count={data.pagination.totalPages}
          page={page + 1}
          onPageChange={(_, newPage) => setPage(newPage - 1)}
        />
      )}
    </Container>
  );
}
