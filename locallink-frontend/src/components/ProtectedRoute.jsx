import React, { useEffect } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";

const ProtectedRoute = ({ children }) => {
  const { state, getBasicUserInfo } = useAuthContext();

  useEffect(() => {
    // Make sure the SDK is not loading and the user is authenticated
    if (!state.isLoading && state.isAuthenticated) {
      // getBasicUserInfo() reads from the ID token, no network call needed
      getBasicUserInfo().then((userInfo) => {
        const roles = userInfo.roles || [];
        const hasRequiredRole =
          roles.includes("customer") || 
          roles.includes("service_provider") ||
          roles.includes("admin"); 

        if (!hasRequiredRole && !window.location.hash.includes("select-role")) {
          console.log("Redirecting to /select-role");
          window.location.hash = "#/select-role";
        }
      });
    }
  }, [state.isLoading, state.isAuthenticated, getBasicUserInfo]);
      
  if (state.isLoading) {
    return <div>Loading...</div>; 
  }

  if (!state.isAuthenticated) {
    return (
        <div className="text-center mt-10">
          <h1 className="text-2xl font-bold">Access Denied</h1>
            <p>Please log in to view this page.</p>
        </div>
    );
  }

  return children;
};

export default ProtectedRoute;