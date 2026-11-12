import { useEffect, useState } from "react";

import PublicNavbar from "../components/PublicNavbar/PublicNavbar";
import UserNavbar from "../components/UserNavbar/UserNavbar";
import HRNavbar from "../components/HRNavbar/HRNavbar";
import EventNavbar from "../components/EventNavbar/EventNavbar";

function MainLayout({ children }) {
  const [role, setRole] = useState(
    localStorage.getItem("role")
  );

  useEffect(() => {
    const checkRole = () => {
      setRole(localStorage.getItem("role"));
    };

    checkRole();

    window.addEventListener("login", checkRole);
    window.addEventListener("logout", checkRole);

    return () => {
      window.removeEventListener("login", checkRole);
      window.removeEventListener("logout", checkRole);
    };
  }, []);

  const renderNavbar = () => {
    if (role === "HR") {
      return <HRNavbar />;
    }

    if (role === "Event Team") {
      return <EventNavbar />;
    }

    if (role === "Applicant") {
      return <UserNavbar />;
    }

    return <PublicNavbar />;
  };

  return (
    <>
      {renderNavbar()}

      <main
        style={{
          paddingTop: "72px",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>
    </>
  );
}

export default MainLayout;