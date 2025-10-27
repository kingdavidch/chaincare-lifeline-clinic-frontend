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

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  if (!a[orderBy]) return 1;
  if (!b[orderBy]) return -1;
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({ inputData, comparator, filterName, orderBy }) {
  let filteredData = inputData;

  if (filterName) {
    const searchText = filterName.toLowerCase();
    filteredData = inputData.filter((discount) =>
      Object.entries(discount).some(([key, value]) => {
        const searchableFields = ['code', 'percentage', 'validUntil', 'status', 'createdAt'];
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
