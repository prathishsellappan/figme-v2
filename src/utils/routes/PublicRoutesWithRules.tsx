import {  Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PublicRoutesWithRules = () => {
  const auth = useAuth();
  const isAuthenticated = !!auth.state.user; 
  
  if (auth.state.loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If authenticated, redirect to the dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, allow access to child routes
  return <Outlet />;
};

export default PublicRoutesWithRules;
