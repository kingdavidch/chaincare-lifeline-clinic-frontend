import PropTypes from 'prop-types';

import { Grid, Divider, Typography } from '@mui/material';

import TestRow from './TestRow';

const TestList = ({
  tests,
  statusMap,
  successMap,
  errorMap,
  loadingMap,
  isRejectable,
  currencySymbol,
  onSelectChange,
  renderExtraActions,
}) => (
  <>
    <Divider sx={{ my: 2 }} />
    <Typography fontWeight="bold" gutterBottom>
      Appointment
    </Typography>

    <Grid container spacing={2}>
      {tests.map((test) => (
        <TestRow
          key={test._id}
          test={test}
          currentStatus={statusMap[test._id] || test.status}
          error={errorMap[test._id]}
          success={successMap[test._id]}
          loading={loadingMap[test._id]}
          isRejectable={isRejectable}
          currencySymbol={currencySymbol}
          onStatusChange={(status) => onSelectChange(status, test)}
          renderExtraActions={renderExtraActions ? () => renderExtraActions(test) : undefined}
        />
      ))}
    </Grid>
  </>
);

TestList.propTypes = {
  tests: PropTypes.array.isRequired,
  statusMap: PropTypes.object.isRequired,
  successMap: PropTypes.object.isRequired,
  errorMap: PropTypes.object.isRequired,
  loadingMap: PropTypes.object.isRequired,
  isRejectable: PropTypes.bool.isRequired,
  currencySymbol: PropTypes.string.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  renderExtraActions: PropTypes.func,
};

export default TestList;
