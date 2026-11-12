import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // Belum login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Sudah login tapi role tidak diizinkan
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "Applicant") {
      return <Navigate to="/" replace />;
    }

    if (role === "HR") {
      return <Navigate to="/hr/dashboard" replace />;
    }

    if (role === "Event") {
      return <Navigate to="/events/all" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;