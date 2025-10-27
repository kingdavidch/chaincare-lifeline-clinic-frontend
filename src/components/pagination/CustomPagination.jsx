import PropTypes from 'prop-types';

import { Stack, Pagination, PaginationItem } from '@mui/material';

export default function CustomPagination({ count, page, onPageChange }) {
  return (
    <Stack spacing={2} alignItems="flex-end" sx={{ mt: 3 }}>
      <Pagination
        count={count}
        page={page}
        onChange={onPageChange}
        variant="outlined"
        shape="rounded"
        sx={{
          '& .MuiPaginationItem-root': {
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            fontWeight: 'bold',
            color: '#000',
          },
          '& .MuiPaginationItem-page.Mui-selected': {
            backgroundColor: '#00AC4F',
            color: '#fff',
          },
          '& .MuiPaginationItem-ellipsis': {
            color: '#000',
          },
          '& .MuiPaginationItem-icon': {
            color: '#000',
          },
        }}
        renderItem={(item) => <PaginationItem {...item} />}
      />
    </Stack>
  );
}

CustomPagination.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
