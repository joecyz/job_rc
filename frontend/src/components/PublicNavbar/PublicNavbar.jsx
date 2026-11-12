import { Link, useLocation } from "react-router-dom";
import logoBSU from "../../assets/images/logo-bsu.png";

function PublicNavbar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      label: "Lowongan",
      path: "/jobs",
    },
    {
      label: "Event",
      path: "/events",
    },
    {
      label: "FAQ",
      path: "/faq",
    },
  ];

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "rgba(7, 26, 61, 0.94)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "72px",
            padding: "0 24px",
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
          }}
        >
          {/* LOGO */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Link
              to="/"
              aria-label="Kembali ke Dashboard"
              title="Kembali ke Dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <img
                src={logoBSU}
                alt="PT Bintang Sayap Utama"
                style={{
                  height: "44px",
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Link>
          </div>

          {/* NAVIGATION */}

          <nav
            className="public-navbar-links"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            {navItems.map((item) => {
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    position: "relative",
                    padding: "9px 14px",
                    borderRadius: "9px",
                    color: active
                      ? "#ffffff"
                      : "rgba(255,255,255,0.72)",
                    background: active
                      ? "rgba(255,255,255,0.10)"
                      : "transparent",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: active ? 700 : 600,
                    transition:
                      "color 0.2s ease, background 0.2s ease",
                  }}
                >
                  {item.label}

                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        left: "14px",
                        right: "14px",
                        bottom: "4px",
                        height: "2px",
                        borderRadius: "999px",
                        background: "#60a5fa",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ACTIONS */}

          <div
            className="public-navbar-actions"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Link
              to="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "40px",
                padding: "0 17px",
                borderRadius: "9px",
                border: "1px solid rgba(255,255,255,0.20)",
                color: "#ffffff",
                background: "rgba(255,255,255,0.06)",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 700,
                transition:
                  "background 0.2s ease, border-color 0.2s ease",
              }}
            >
              Masuk
            </Link>

            <Link
              to="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "40px",
                padding: "0 18px",
                borderRadius: "9px",
                background: "#ffffff",
                color: "#071a3d",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 800,
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                transition:
                  "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              Daftar
            </Link>
          </div>
        </div>
      </header>

      <style>
        {`
          .public-navbar-links a:hover {
            color: #ffffff !important;
            background: rgba(255,255,255,0.08) !important;
          }

          .public-navbar-actions a:first-child:hover {
            background: rgba(255,255,255,0.12) !important;
            border-color: rgba(255,255,255,0.30) !important;
          }

          .public-navbar-actions a:last-child:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 24px rgba(0,0,0,0.18);
          }

          @media (max-width: 700px) {
            .public-navbar-links {
              gap: 2px !important;
            }

            .public-navbar-links a {
              padding: 8px 9px !important;
              font-size: 13px !important;
            }

            .public-navbar-actions a:first-child {
              display: none !important;
            }

            .public-navbar-actions a:last-child {
              padding: 0 14px !important;
            }
          }

          @media (max-width: 480px) {
            .public-navbar-links {
              display: none !important;
            }

            .public-navbar-actions a:last-child {
              min-height: 38px !important;
            }
          }
        `}
      </style>
    </>
  );
}

export default PublicNavbar;