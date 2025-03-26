import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = getCookie("authToken");

  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
