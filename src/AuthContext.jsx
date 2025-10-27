import { useNavigate } from 'react-router-dom';

import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

import PropTypes from 'prop-types';

import api from 'src/api/axiosConfig';

import { setLogoutHandler } from './auth/logoutHandler';
import { startTokenRefresher } from './auth/startTokenRefresher';

const AuthContext = createContext({
  userId: null,
  setUserId: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  const logout = useCallback(() => {
    api.post('/clinic/logout').finally(() => {
      setUserId(null);
      navigate('/login');
    });
  }, [navigate]);

  useEffect(() => {
    setLogoutHandler(logout);
  }, [logout]);

  useEffect(() => {
    const intervalId = startTokenRefresher();
    return () => clearInterval(intervalId);
  }, []);

  const value = useMemo(() => ({ userId, setUserId, logout }), [userId, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
