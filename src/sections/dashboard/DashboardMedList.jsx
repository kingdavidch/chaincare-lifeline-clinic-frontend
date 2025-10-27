import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import MedicationsTableToolbar from '../medications/medications-table-toolbar';

export default function DashboardMedList({ title, list, ...other }) {
  const navigate = useNavigate();

  return (
    <Card {...other}>
      {/* <CardHeader title={title} /> */}
      <MedicationsTableToolbar />

      <Scrollbar>
        <Box sx={{ px: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Medication Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Total Sales</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list?.map((medication) => (
                <MedItem key={medication?.id} medication={medication} />
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
          onClick={() => navigate('/medications')}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}

DashboardMedList.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

function MedItem({ medication }) {
  const { image, name, description, category, stock, price, totalSales } = medication;

  return (
    <TableRow>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            component="img"
            alt={name}
            src={image}
            sx={{ width: 90, height: 56, borderRadius: 1.5, flexShrink: 0 }}
          />
          <Box>
            <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
              {name}
            </Link>
            <Typography variant="body2" color="text.secondary">
              {description.length > 60 ? `${description.substring(0, 60)}...` : description}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>{category}</TableCell>
      <TableCell>{stock} in stock</TableCell>
      <TableCell>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 'bold',
          }}
        >
          RWF {price}
        </Typography>
      </TableCell>
      <TableCell>{totalSales}</TableCell>
    </TableRow>
  );
}

MedItem.propTypes = {
  medication: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    stock: PropTypes.string,
    price: PropTypes.string,
    totalSales: PropTypes.number,
  }).isRequired,
};
