import { Navigate } from 'react-router-dom';

import PropTypes from 'prop-types';

import { useAuth } from 'src/AuthContext';

export default function ProtectedRoute({ children, requiresAuth }) {
  const { userId } = useAuth();

  if (requiresAuth && !userId) {
    return <Navigate to="/login" replace />;
  }

  if (!requiresAuth && userId) {
    return <Navigate to="/" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiresAuth: PropTypes.bool,
};
