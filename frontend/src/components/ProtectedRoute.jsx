import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute Component
 * 
 * Checks if user is authenticated and has the correct role before allowing access.
 * Uses localStorage for token and role persistence.
 */
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // If no token exists, user is not logged in
  if (!token) {
    return <Navigate to="/" />;
  }

  // If a specific role is required and user doesn't have it, deny access
  if (role && role !== userRole) {
    return <Navigate to="/" />;
  }

  // User is authenticated and has correct role
  return children;
};

export default ProtectedRoute;
