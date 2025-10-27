import { useState, useEffect } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  InputBase,
  Typography,
  IconButton,
  CardContent,
  CircularProgress,
} from '@mui/material';

import { useFetchTests } from 'src/hooks/useClinicHooks';

import { fNumber } from 'src/utils/format-number';

import CustomPagination from 'src/components/pagination';

import TestDetailsModal from '../medications/TestDetailsModal';
import UpdateTestModal from '../medications/UpdateTestModal';

export default function TestsGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(6);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, isError } = useFetchTests({
    searchTerm: searchTerm.trim(),
    filter,
    page,
    rowsPerPage,
  });

  useEffect(() => {
    if (data?.pagination?.totalPages && page >= data.pagination.totalPages) {
      setPage(0);
    }
  }, [data?.pagination?.totalPages, page]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (test) => {
    setSelectedTest(test);
    setIsEditing(true);
  };

  // Filter tests on the frontend
  const filteredTests = (data?.data || []).filter((test) =>
    [test.testName, test.description, test.price?.toString()]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box>
      {/* Search & Filter */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#F8F9FA',
          padding: '8px 12px',
          borderRadius: '12px',
          mb: 2,
        }}
      >
        <SearchIcon sx={{ color: '#F59E0B', mr: 1 }} />
        <InputBase
          placeholder="Search tests..."
          fullWidth
          sx={{ flex: 1 }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <IconButton>
          <TuneIcon />
        </IconButton>
      </Box>

      {/* Loading & Error Handling */}
      {isLoading && (
        <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4, color: '#00AC4F' }} />
      )}

      {isError && <Typography color="error">Failed to load tests.</Typography>}

      {/* Test Cards */}
      <Grid container spacing={2}>
        {filteredTests.length > 0
          ? filteredTests.map((test, index) => (
              <Grid item xs={6} key={index}>
                <Card
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    height: '170px',
                  }}
                  onClick={() => setSelectedTest(test)}
                >
                  <CardMedia
                    component="img"
                    height="100%"
                    image={test?.testImage}
                    alt={test.testName}
                  />

                  <CardContent
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      color: 'white',
                      padding: '10px',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
                    >
                      {test?.testName}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {`${fNumber(test.price)} RWF`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : !isLoading && (
              <Typography sx={{ textAlign: 'center', mt: 2, ml: '22px' }}>No appointments found.</Typography>
            )}
      </Grid>

      {/* Pagination */}
      {data?.pagination?.totalPages > 1 && (
        <CustomPagination
          count={data.pagination.totalPages}
          page={page + 1}
          onPageChange={(_, newPage) => setPage(newPage - 1)}
        />
      )}

      {/* Test Details Modal */}
      {selectedTest && !isEditing && (
        <TestDetailsModal
          test={selectedTest}
          open={Boolean(selectedTest)}
          handleClose={() => setSelectedTest(null)}
          onEdit={() => handleEdit(selectedTest)}
        />
      )}

      {/* Update Test Modal */}
      {selectedTest && isEditing && (
        <UpdateTestModal
          open={isEditing}
          handleClose={() => {
            setSelectedTest(null);
            setIsEditing(false);
          }}
          testNo={selectedTest._id}
        />
      )}
    </Box>
  );
}
