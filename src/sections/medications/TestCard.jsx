import { useState } from 'react';

import PropTypes from 'prop-types';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Card,
  Chip,
  Menu,
  Stack,
  MenuItem,
  Typography,
  IconButton,
  CardContent,
} from '@mui/material';

import { useRemoveTest } from 'src/hooks/useClinicHooks';

import { fNumber } from 'src/utils/format-number';

import { ConfirmationModal } from 'src/components/ConfirmationModal';

import TestDetailsModal from './TestDetailsModal';
import UpdateTestModal from './UpdateTestModal';

export default function TestCard({ test, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);

  const { mutate: removeTest, isPending: removing } = useRemoveTest();

  const handleConfirmRemove = () => {
    removeTest(test._id, {
      onSuccess: () => {
        setOpenRemoveModal(false);
        handleMenuClose();
      },
    });
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setOpenDetailsModal(false);
    setOpenUpdateModal(true);
    handleMenuClose();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setOpenRemoveModal(true);
  };

  return (
    <>
      <Card
        sx={{
          position: 'relative',
          borderRadius: 2,
          boxShadow: 3,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {test.coveredByLifeLine && (
          <Chip
            label="Covered by LifeLine"
            color="success"
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              fontSize: 10,
              fontWeight: 500,
              backgroundColor: '#22C55E',
              color: '#fff',
            }}
          />
        )}

        <Box
          component="img"
          src={test?.testImage}
          alt={test.testName}
          onClick={() => setOpenDetailsModal(true)}
          sx={{
            width: '90%',
            height: 280,
            objectFit: 'cover',
            backgroundColor: 'grey.300',
            display: 'block',
            borderRadius: 1,
            margin: '13px auto 0',
            cursor: 'pointer',
          }}
        />

        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {test?.testName}
              </Typography>
              <Typography color="text.secondary">
                <strong>{`${fNumber(test?.price)} ${test.currencySymbol}`}</strong>
              </Typography>
            </Box>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleMenuOpen(e);
              }}
              sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            >
              <MoreVertIcon sx={{ transform: 'rotate(90deg)' }} />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleEdit}>
                <EditIcon sx={{ mr: 1 }} /> Edit
              </MenuItem>
              <MenuItem onClick={handleRemove} disabled={removing}>
                <DeleteIcon sx={{ mr: 1, color: 'red' }} /> Remove
              </MenuItem>
            </Menu>
          </Stack>
        </CardContent>
      </Card>

      <TestDetailsModal
        test={test}
        open={openDetailsModal}
        handleClose={() => setOpenDetailsModal(false)}
        onEdit={handleEdit}
      />

      {openUpdateModal && (
        <UpdateTestModal
          open={openUpdateModal}
          handleClose={() => setOpenUpdateModal(false)}
          testNo={test?._id}
        />
      )}

      <ConfirmationModal
        open={openRemoveModal}
        onClose={() => setOpenRemoveModal(false)}
        onConfirm={handleConfirmRemove}
        title="Confirm Removal"
        message="Are you sure you want to remove this test?"
      />
    </>
  );
}

TestCard.propTypes = {
  test: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    currencySymbol: PropTypes.string.isRequired,
    testNo: PropTypes.number.isRequired,
    testName: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    testImage: PropTypes.string.isRequired,
    insuranceCoverage: PropTypes.string.isRequired,
    coveredByLifeLine: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};
