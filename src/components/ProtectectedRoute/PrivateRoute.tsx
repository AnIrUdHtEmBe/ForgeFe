// src/components/PrivateRoute.tsx
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import type { JSX } from "react";

interface PrivateRouteProps {
  children: JSX.Element;
}

const isValidToken = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    // Optional: Check for expiration
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      console.warn("Token has expired");
      return false;
    }

    localStorage.setItem("userId", JSON.stringify(decoded.sub));
    return true;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return false;
  }
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = isValidToken();

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
