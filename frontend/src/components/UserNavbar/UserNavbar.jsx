import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoBSU from "../../assets/images/logo-bsu.png";

function UserNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );

  const [role, setRole] = useState(
    localStorage.getItem("role")
  );

  const navigate = useNavigate();

  // ==================================================
  // CHECK LOGIN STATE
  // ==================================================

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(
        !!localStorage.getItem("access_token")
      );

      setRole(
        localStorage.getItem("role")
      );
    };

    checkLogin();

    window.addEventListener(
      "login",
      checkLogin
    );

    window.addEventListener(
      "logout",
      checkLogin
    );

    return () => {
      window.removeEventListener(
        "login",
        checkLogin
      );

      window.removeEventListener(
        "logout",
        checkLogin
      );
    };
  }, []);

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    window.dispatchEvent(
      new Event("logout")
    );

    navigate("/");
  };

  // ==================================================
  // LOGO CLICK
  // ==================================================

  const handleLogoClick = (e) => {
    e.preventDefault();

    if (role === "HR") {
      navigate("/hr/dashboard");
    } else {
      navigate("/");
    }
  };

  // ==================================================
  // STYLES
  // ==================================================

  const navLinkStyle = {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
    padding: "8px 4px",
    transition: "opacity 0.2s ease",
  };

  const loginButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    background: "#ffffff",
    color: "#071a3d",

    padding: "10px 20px",
    borderRadius: "8px",

    textDecoration: "none",
    fontWeight: "800",
    fontSize: "14px",

    border:
      "1px solid rgba(255,255,255,0.35)",

    boxSizing: "border-box",
    flexShrink: 0,
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "80px",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        boxSizing: "border-box",
        padding: "0 48px",

        background:
          "rgba(7, 26, 61, 0.76)",

        backdropFilter:
          "blur(18px) saturate(150%)",

        WebkitBackdropFilter:
          "blur(18px) saturate(150%)",

        borderBottom:
          "1px solid rgba(255,255,255,0.10)",

        boxShadow:
          "0 8px 30px rgba(4,19,45,0.18)",

        zIndex: 9999,
      }}
    >

      {/* ==================================================
          LOGO
      ================================================== */}

      <Link
        to={
          role === "HR"
            ? "/hr/dashboard"
            : "/"
        }
        onClick={handleLogoClick}
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <img
          src={logoBSU}
          alt="Bintang Sayap Utama"
          style={{
            width: "150px",
            maxHeight: "60px",
            objectFit: "contain",
            display: "block",

            filter:
              "brightness(0) invert(1)",
          }}
        />
      </Link>

      {/* ==================================================
          GUEST
      ================================================== */}

      {!isLoggedIn && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
          }}
        >
          <Link
            to="/jobs"
            style={navLinkStyle}
          >
            Jobs
          </Link>

          <Link
            to="/events"
            style={navLinkStyle}
          >
            Events
          </Link>

          <Link
            to="/faq"
            style={navLinkStyle}
          >
            FAQ
          </Link>

          <Link
            to="/login"
            style={loginButtonStyle}
          >
            Login
          </Link>
        </div>
      )}

      {/* ==================================================
          APPLICANT
      ================================================== */}

      {isLoggedIn &&
        role === "Applicant" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
            }}
          >
            <Link
              to="/jobs"
              style={navLinkStyle}
            >
              Jobs
            </Link>

            <Link
              to="/applications"
              style={navLinkStyle}
            >
              Applications
            </Link>

            <Link
              to="/events"
              style={navLinkStyle}
            >
              Events
            </Link>

            <Link
              to="/faq"
              style={navLinkStyle}
            >
              FAQ
            </Link>

            {/* ==================================================
                PROFILE
            ================================================== */}

            <Link
              to="/profile"
              className="navbar-profile-button"
            >
              Profile
            </Link>
          </div>
        )}

      {/* ==================================================
          HR
      ================================================== */}

      {isLoggedIn &&
        role === "HR" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
            }}
          >
            <Link
              to="/hr/dashboard"
              style={navLinkStyle}
            >
              HR
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",

                background: "#ffffff",
                color: "#071a3d",

                padding: "10px 20px",

                minWidth: "94px",
                height: "44px",

                borderRadius: "8px",

                border:
                  "1px solid rgba(255,255,255,0.35)",

                cursor: "pointer",

                fontWeight: "800",
                fontSize: "14px",

                boxSizing: "border-box",
              }}
            >
              Logout
            </button>
          </div>
        )}
    </nav>
  );
}

export default UserNavbar;