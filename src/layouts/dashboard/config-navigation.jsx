import { Link } from 'react-router-dom';

import React, { memo, useMemo, useState, useCallback } from 'react';

import PropTypes from 'prop-types';

import { ChevronRight } from '@mui/icons-material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';

import { usePathname } from 'src/routes/hooks';

import { useAuth } from 'src/AuthContext';

import { ConfirmationModal } from 'src/components/ConfirmationModal';
import SvgColor from 'src/components/svg-color';

// Memoized icon component
const MemoizedIcon = memo(({ name }) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
));

MemoizedIcon.propTypes = {
  name: PropTypes.string.isRequired,
};

// Static nav configuration
const NAV_CONFIG = [
  { title: 'Dashboard', path: '/', icon: <MemoizedIcon name="dashboard" /> },
  { title: 'Appointments', path: '/appointments', icon: <MemoizedIcon name="tests" /> },
  // { title: 'Patient', path: '/patients', icon: <MemoizedIcon name="customers" /> },
  // { title: 'Claims', path: '/claims', icon: <MemoizedIcon name="claims" /> },
  { title: 'Orders', path: '/orders', icon: <MemoizedIcon name="orders" /> },
  { title: 'session result', path: '/session', icon: <MemoizedIcon name="test_result" /> },
  { title: 'Wallet', path: '/wallet', icon: <MemoizedIcon name="ion_wallet-outline" /> },
  { title: 'Discounts', path: '/discounts', icon: <MemoizedIcon name="discount" /> },
  { title: 'FAQ', path: '/faq', icon: <HelpOutlineIcon sx={{ fontSize: 24 }} /> },
  { title: 'Help', path: 'mailto:Clinical@mylifeline.world', icon: <MemoizedIcon name="help" /> },
];

const NavConfig = memo(() => {
  const [isModalOpen, setModalOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleOpenModal = useCallback(() => setModalOpen(true), []);
  const handleCloseModal = useCallback(() => setModalOpen(false), []);
  const handleConfirmLogout = useCallback(() => {
    logout();
    handleCloseModal();
  }, [logout, handleCloseModal]);

  const activeSettings = pathname === '/settings';

  // Memoized button styles
  const buttonStyles = useMemo(
    () => ({
      minHeight: 44,
      borderRadius: 0.75,
      typography: 'body2',
      textTransform: 'capitalize',
      fontWeight: 'fontWeightMedium',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 1,
    }),
    []
  );

  const settingsButtonStyles = useMemo(
    () => ({
      ...buttonStyles,
      color: activeSettings ? 'white' : 'text.secondary',
      bgcolor: activeSettings ? '#00AC4F' : 'transparent',
      '&:hover': {
        bgcolor: activeSettings ? '#008C3A' : 'rgba(0, 0, 0, 0.04)',
      },
    }),
    [activeSettings, buttonStyles]
  );

  const logoutButtonStyles = useMemo(
    () => ({
      ...buttonStyles,
      color: 'text.primary',
      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
      justifyContent: 'flex-start',
    }),
    [buttonStyles]
  );

  return (
    <>
      <Stack component="nav" spacing={2} sx={{ px: 2, mt: 5, flexGrow: 1 }}>
        {NAV_CONFIG.map((item) => (
          <MemoizedNavItem key={item.title} item={item} active={pathname === item.path} />
        ))}

        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ flexGrow: 1 }} />

        {/* Settings Button */}
        <ListItemButton component={Link} to="/settings" sx={settingsButtonStyles}>
          <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
            <SettingsOutlinedIcon sx={{ fontSize: 20, mr: 1 }} />
            Settings
          </Box>
          <ChevronRight sx={{ fontSize: 20 }} />
        </ListItemButton>

        {/* Logout Button */}
        <ListItemButton onClick={handleOpenModal} sx={logoutButtonStyles}>
          <LogoutOutlinedIcon sx={{ fontSize: 20, mr: 1 }} />
          Log Out
        </ListItemButton>
      </Stack>

      <ConfirmationModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
        title="Are you sure?"
        message="Do you really want to log out?"
      />
    </>
  );
});

const MemoizedNavItem = memo(({ item, active }) => {
  const navItemStyles = useMemo(
    () => ({
      minHeight: 44,
      borderRadius: 0.75,
      typography: 'body2',
      textTransform: 'capitalize',
      fontWeight: 'fontWeightMedium',
      color: active ? 'white' : 'text.secondary',
      bgcolor: active ? '#00AC4F' : 'transparent',
      '&:hover': { bgcolor: active ? alpha('#00AC4F', 0.95) : 'rgba(0, 0, 0, 0.04)' },
    }),
    [active]
  );

  return (
    <ListItemButton component={Link} to={item.path} sx={navItemStyles}>
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>
      <Box component="span">{item.title}</Box>
      {!active && (
        <Box component="span" sx={{ width: 24, height: 24, position: 'absolute', right: 2 }}>
          <ChevronRight />
        </Box>
      )}
    </ListItemButton>
  );
});

MemoizedNavItem.propTypes = {
  item: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
};

NavConfig.displayName = 'NavConfig';
MemoizedNavItem.displayName = 'MemoizedNavItem';

export default NavConfig;
