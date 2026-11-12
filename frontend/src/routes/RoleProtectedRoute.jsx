import { Navigate, useLocation } from "react-router-dom";

function RoleProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const location = useLocation();

  const token =
    localStorage.getItem("access_token");

  const storedRole =
    localStorage.getItem("role");

  // ==========================================
  // BELUM LOGIN
  // ==========================================

  if (!token) {
    return (
      <Navigate
        to="/internal/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // ==========================================
  // NORMALIZE ROLE
  // ==========================================

  const role =
    storedRole?.trim() || "";

  // ==========================================
  // ROLE TIDAK DIIZINKAN
  // ==========================================

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {
    if (role === "HR") {
      return (
        <Navigate
          to="/hr/dashboard"
          replace
        />
      );
    }

    if (role === "Event Team") {
      return (
        <Navigate
          to="/event/dashboard"
          replace
        />
      );
    }

    if (role === "Applicant") {
      return (
        <Navigate
          to="/"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/internal/login"
        replace
      />
    );
  }

  // ==========================================
  // AUTHORIZED
  // ==========================================

  return children;
}

export default RoleProtectedRoute;