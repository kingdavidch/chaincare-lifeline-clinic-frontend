import { useState } from 'react';

import PropTypes from 'prop-types';

import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Modal,
  Table,
  Avatar,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  InputBase,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';

import { useFetchClinicTestItems } from 'src/hooks/useClinicHooks';

import EditAppointmentTypeModal from './EditAppointmentTypeModal';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function ManageAppointmentTypeModal({ open, handleClose }) {
  const { data, isLoading } = useFetchClinicTestItems();
  const items = data?.data || [];

  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  const filtered = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={3}>
            Manage Appointment Types
          </Typography>

          {/* Search */}
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              width: 300,
              px: 2,
              py: 1,
              borderRadius: 2,
              border: '1px solid #ddd',
              backgroundColor: 'white',
              boxShadow: 2,
            }}
          >
            <SearchIcon sx={{ mr: 1 }} />
            <InputBase
              placeholder="Search appointment type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1 }}
            />
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Icon</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          No appointment types found.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <Avatar src={item.icon} alt={item.name} />
                      </TableCell>
                      <TableCell>
                        {item.name
                          .split(' ')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </TableCell>
                      <TableCell>
                        <Avatar src={item.image} variant="rounded" sx={{ width: 56, height: 56 }} />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEdit(item)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Box>
      </Modal>

      {selectedItem && (
        <EditAppointmentTypeModal
          open={editOpen}
          handleClose={() => setEditOpen(false)}
          item={selectedItem}
        />
      )}
    </>
  );
}

ManageAppointmentTypeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
