import PropTypes from 'prop-types';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  Grid,
  Chip,
  Stack,
  Avatar,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
} from '@mui/material';

import { getStatusStyles } from '../utils';

const TestRow = ({
  test,
  currentStatus,
  error,
  success,
  loading,
  isRejectable,
  currencySymbol,
  onStatusChange,
  renderExtraActions,
}) => {
  const statusStyles = getStatusStyles(currentStatus);

  return (
    <Grid item xs={12} sm={6}>
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 1, fontWeight: 500 }}>
          {error}
        </Typography>
      )}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        border="1px solid #ccc"
        p={1.5}
        borderRadius={2}
        gap={2}
      >
        <Avatar src={test.image} variant="rounded" />
        <Box flexGrow={1} ml={2} sx={{ overflow: 'hidden' }}>
          <Typography sx={{ textTransform: 'capitalize' }} noWrap>
            {test.testName}
          </Typography>
          <Typography variant="body2" noWrap>
            {currencySymbol} {test.price.toLocaleString()}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '1rem' }}
          >
            Appointment Date: {test.date}
          </Typography>
          {test.clinicName && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
              <Avatar src={test.clinicImage} sx={{ width: 20, height: 20 }} />
              <Typography variant="caption" noWrap sx={{ color: '#1976d2' }}>
                {test.clinicName}
              </Typography>
            </Stack>
          )}
          {renderExtraActions && (
            <Box mt={0.5}>
              <Box display="flex" alignItems="center" gap={1}>
                {renderExtraActions()}
              </Box>
            </Box>
          )}
        </Box>

        <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
          <Select
            value={currentStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            size="small"
            IconComponent={() =>
              loading ? (
                <CircularProgress size={20} sx={{ color: statusStyles.color }} />
              ) : (
                <KeyboardArrowDownIcon sx={{ color: statusStyles.color, cursor: 'pointer' }} />
              )
            }
            sx={{
              backgroundColor: statusStyles.bg,
              color: statusStyles.color,
              border: `2px solid ${statusStyles.border}`,
              fontWeight: 600,
              textTransform: 'capitalize',
              fontSize: 12,
              borderRadius: '6px',
              minWidth: 120,
              height: 30,
              px: 1,
              '.MuiOutlinedInput-notchedOutline': { border: 'none' },
            }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="sample_collected">Sample Collected</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="result_ready">Result Ready</MenuItem>
            <MenuItem value="result_sent">Result Sent</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            {isRejectable && <MenuItem value="rejected">Rejected</MenuItem>}
          </Select>
          <Chip
            label={test.resultSent ? 'Result Sent' : 'Result Not Sent'}
            color={test.resultSent ? 'success' : 'warning'}
            variant="filled"
            size="small"
            sx={{ fontWeight: 500, color: '#fff', textTransform: 'capitalize' }}
          />
        </Box>
      </Box>

      {success && (
        <Typography
          variant="caption"
          sx={{ color: 'green', fontWeight: 600, mt: 0.5, textAlign: 'center' }}
        >
          ✅ Status updated
        </Typography>
      )}
    </Grid>
  );
};

TestRow.propTypes = {
  test: PropTypes.shape({
    image: PropTypes.string,
    testName: PropTypes.string,
    price: PropTypes.number,
    resultSent: PropTypes.bool,
    clinicName: PropTypes.string,
    clinicImage: PropTypes.string,
    date: PropTypes.string,
  }).isRequired,
  currentStatus: PropTypes.string.isRequired,
  error: PropTypes.string,
  success: PropTypes.bool,
  loading: PropTypes.bool,
  isRejectable: PropTypes.bool,
  currencySymbol: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  renderExtraActions: PropTypes.func,
};

export default TestRow;
