import {  Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoutes = () => {
  const auth = useAuth();
  const isAuthenticated = !!auth.state.user; 
  const isEmailVerified = !!auth.state.user?.emailVerified;
  

  if (isAuthenticated && isEmailVerified ) {
    return <Outlet />;
  }

  // Redirect to login if user is not authenticated or email not verified
  return <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
