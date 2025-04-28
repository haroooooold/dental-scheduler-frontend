import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

interface DecodedToken {
  exp: number;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds

    if (decoded.exp < currentTime) {
      // Token expired
      localStorage.removeItem("authToken");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // Invalid token
    localStorage.removeItem("authToken");
    return <Navigate to="/login" replace />;
  }

  return children;
}
