import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoutes = () => {
  const auth = useAuth();
  const location = useLocation();
  const isAuthenticated = !!auth.state.user; 
  
  if (auth.state.loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-backgroundDash">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Outlet />;
  }

  // Redirect to login if user is not authenticated, preserving the target location
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoutes;
