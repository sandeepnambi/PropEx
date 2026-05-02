// frontend/src/components/utils/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, role, isLoading } = useAuth();

  if (isLoading) {
    // Show a minimal loader while authentication status is being determined
    return <div className="text-center py-10 text-primary">Loading user data...</div>;
  }

  if (!isLoggedIn) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/auth?redirect=true" replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    // Redirect unauthorized users to a general landing or access denied page
    return <Navigate to="/" replace />; 
  }

  return <>{children}</>;
};

export default ProtectedRoute;
