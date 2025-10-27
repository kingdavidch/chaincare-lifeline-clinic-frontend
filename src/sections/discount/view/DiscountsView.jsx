import { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Table,
  TableRow,
  Skeleton,
  Container,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';
import { Stack } from '@mui/system';

import {
  useCreateDiscount,
  useDeleteDiscount,
  useFetchAllDiscounts,
} from 'src/hooks/useClinicHooks';

import { ConfirmationModal } from 'src/components/ConfirmationModal';
import CustomPagination from 'src/components/pagination';
import Scrollbar from 'src/components/scrollbar';

import CreateDiscountSection from '../CreateDiscountSection';
import DiscountsTableHead from '../DiscountsTableHead';
import DiscountsTableRow from '../DiscountsTableRow';
import DiscountsTableToolbar from '../DiscountsTableToolbar';
import TableNoData from '../TableNoData';
import { applyFilter, getComparator } from '../utils';

export default function DiscountsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(null);
  const [filterName, setFilterName] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  const { mutate: createDiscount, isPending: isCreating } = useCreateDiscount();
  const { mutate: deleteDiscount, isLoading: isDeleting } = useDeleteDiscount();

  const { data, isLoading } = useFetchAllDiscounts({
    filterStatus: '',
    filterCode: filterName,
    page,
    rowsPerPage,
  });

  console.log(data);

  useEffect(() => {
    if (data?.pagination?.totalPages && page >= data.pagination.totalPages) {
      setPage(0);
    }
  }, [data?.pagination?.totalPages, page]);

  const handleCreateDiscount = (form, resetForm) => {
    setApiError('');
    setApiSuccess('');
    createDiscount(form, {
      onSuccess: () => {
        setApiSuccess('Discount created successfully ✅');
        resetForm();
      },
      onError: (err) => {
        const msg = err?.response?.data?.message || 'Failed to create discount ❌';
        setApiError(msg);
      },
    });
  };

  const handleSortRequest = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterByName = (e) => {
    setPage(0);
    setFilterName(e.target.value);
  };

  const handleDeleteClick = (discountNo) => {
    setSelectedDiscount(discountNo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDiscount(null);
  };

  const handleConfirmDelete = () => {
    if (selectedDiscount) {
      deleteDiscount(selectedDiscount, {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    }
  };

  const dataFiltered = applyFilter({
    inputData: data?.data || [],
    comparator: orderBy ? getComparator(order, orderBy) : () => 0,
    filterName: filterName || '',
    orderBy,
  });

  useEffect(() => {
    let timer;
    if (apiSuccess) {
      timer = setTimeout(() => setApiSuccess(''), 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [apiSuccess]);

  if (data?.hasNoDiscounts) {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h3">Discounts</Typography>
        </Stack>

        <CreateDiscountSection
          onCreate={handleCreateDiscount}
          isCreating={isCreating}
          apiError={apiError}
          apiSuccess={apiSuccess}
        />

        <Card>
          <Scrollbar>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Percentage</TableCell>
                    <TableCell>Valid Until</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box py={5}>
                        <Typography variant="body1" color="text.secondary">
                          No discounts yet
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
      <CreateDiscountSection
        onCreate={handleCreateDiscount}
        isCreating={isCreating}
        apiError={apiError}
        apiSuccess={apiSuccess}
      />

      <Card>
        <DiscountsTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

        <Scrollbar>
          <TableContainer>
            <Table>
              <DiscountsTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSortRequest}
              />
              <TableBody>
                {isLoading
                  ? [...Array(rowsPerPage)].map((_, index) => (
                      <TableRow key={index}>
                        {[...Array(6)].map((__, i) => (
                          <TableCell key={i}>
                            <Skeleton variant="text" width={i === 1 ? '60%' : 80} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : dataFiltered.map((row) => (
                      <DiscountsTableRow
                        key={row.discountNo}
                        row={row}
                        onDelete={() => handleDeleteClick(row.discountNo)}
                      />
                    ))}

                {!isLoading && !dataFiltered.length && (
                  <TableNoData query={filterName} hasNoDiscounts={data?.hasNoDiscounts} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {data?.pagination?.totalPages > 1 && (
          <CustomPagination
            count={data.pagination.totalPages}
            page={page + 1}
            onPageChange={(_, newPage) => setPage(newPage - 1)}
          />
        )}
      </Card>

      <ConfirmationModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Are you sure?"
        message={
          isDeleting ? 'Deleting discount...' : 'Do you really want to delete this discount?'
        }
      />
    </Container>
  );
}
