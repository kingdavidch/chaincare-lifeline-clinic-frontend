import { INSURANCE_OPTIONS } from 'src/constant/insurance.options';

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

/**
 * Calculates empty rows for pagination.
 */
export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

/**
 * Comparator function for sorting orders.
 */
function descendingComparator(a, b, orderBy) {
  if (a[orderBy] === null) return 1;
  if (b[orderBy] === null) return -1;
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

/**
 * Returns the sorting comparator function.
 */
export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

/**
 * Filters and sorts order data.
 */
export function applyFilter({ inputData, comparator, filterName, orderBy }) {
  let filteredData = inputData;

  if (filterName) {
    const searchText = filterName.toLowerCase();
    filteredData = inputData.filter((order) =>
      Object.entries(order).some(([key, value]) => {
        const searchableFields = [
          'orderId',
          'CustomerName',
          'Test',
          'Date',
          'Time',
          'PaymentMethod',
          'Status',
        ];

        if (searchableFields.includes(key)) {
          const fieldValue = String(value).toLowerCase();
          return fieldValue.includes(searchText);
        }
        return false;
      })
    );
  }

  if (orderBy) {
    const stabilizedThis = filteredData.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      return order !== 0 ? order : a[1] - b[1];
    });
    filteredData = stabilizedThis.map((el) => el[0]);
  }

  return filteredData;
}

export const getInsuranceName = (id) =>
  INSURANCE_OPTIONS.find((opt) => opt.id === id)?.name || `ID: ${id}`;

export const getStatusStyles = (status) => {
  switch (status) {
    case 'pending':
      return { bg: '#FEF0C7', color: '#B54708', border: '#FDD999' };
    case 'sample_collected':
      return { bg: '#E0F7FA', color: '#00796B', border: '#B2EBF2' };
    case 'processing':
      return { bg: '#FFF3E0', color: '#FB8C00', border: '#FFE0B2' };
    case 'result_ready':
      return { bg: '#E3F2FD', color: '#1565C0', border: '#90CAF9' };
    case 'result_sent':
      return { bg: '#D1FADF', color: '#027A48', border: '#A3E4C1' };
    case 'rejected':
      return { bg: '#FECDCA', color: '#B42318', border: '#F8A9A4' };
    case 'cancelled':
      return { bg: '#F3E5F5', color: '#6A1B9A', border: '#E1BEE7' };
    case 'failed':
      return { bg: '#FFEBEE', color: '#C62828', border: '#FFCDD2' };
    default:
      return { bg: '#E0E0E0', color: '#333', border: '#BDBDBD' };
  }
};

export const REASONS = [
  'Prescription Error',
  'Insurance Error',
  'Out Of Stock',
  'Delivery Delay',
  'Other...',
];
