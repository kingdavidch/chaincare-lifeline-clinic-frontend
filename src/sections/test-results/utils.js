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
 * Calculates the number of empty rows for pagination.
 * @param {number} page - Current page number.
 * @param {number} rowsPerPage - Number of rows per page.
 * @param {number} arrayLength - Total number of items.
 * @returns {number} - Number of empty rows.
 */
export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

/**
 * Comparator function for sorting data in descending order.
 * @param {Object} a - First item to compare.
 * @param {Object} b - Second item to compare.
 * @param {string} orderBy - The key to sort by.
 * @returns {number} - Sorting result (-1, 0, 1).
 */
function descendingComparator(a, b, orderBy) {
  if (!a[orderBy]) return 1;
  if (!b[orderBy]) return -1;
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

/**
 * Returns a comparator function for sorting data.
 * @param {string} order - Sorting order ('asc' or 'desc').
 * @param {string} orderBy - The key to sort by.
 * @returns {function} - Comparator function.
 */
export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

/**
 * Filters and sorts test results.
 * @param {Object} params - Filtering parameters.
 * @param {Array} params.inputData - Raw test results data.
 * @param {function} params.comparator - Comparator function.
 * @param {string} params.filterName - Search query.
 * @returns {Array} - Filtered and sorted test results.
 */
export function applyFilter({ inputData, comparator, filterName, orderBy }) {
  let filteredData = inputData;

  if (filterName) {
    const searchText = filterName.toLowerCase();
    filteredData = inputData.filter((result) =>
      Object.entries(result).some(([key, value]) => {
        const searchableFields = ['refNo', 'patientName', 'testName', 'date', 'time'];
        if (searchableFields.includes(key) && value) {
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
      const comp = comparator(a[0], b[0]);
      return comp !== 0 ? comp : a[1] - b[1];
    });
    filteredData = stabilizedThis.map((el) => el[0]);
  }

  return filteredData;
}
