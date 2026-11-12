import { Link, useNavigate } from "react-router-dom";
import logoBSU from "../../assets/images/logo-bsu.png";

function EventNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    window.dispatchEvent(new Event("logout"));

    navigate("/internal/login");
  };

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "72px",
          zIndex: 1000,
          background: "rgba(7, 26, 61, 0.96)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: "0 28px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO */}
          <Link
            to="/event/dashboard"
            aria-label="Kembali ke Dashboard Event"
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

          {/* RIGHT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#60a5fa",
                  boxShadow:
                    "0 0 0 4px rgba(96,165,250,0.12)",
                  display: "inline-block",
                }}
              />

              Portal Event
            </div>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                minHeight: "40px",
                padding: "0 18px",
                borderRadius: "9px",
                border: "1px solid rgba(255,255,255,0.22)",
                background: "rgba(255,255,255,0.06)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition:
                  "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
              }}
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <style>
        {`
          button:hover {
            background: rgba(255,255,255,0.12) !important;
            border-color: rgba(255,255,255,0.34) !important;
            transform: translateY(-1px);
          }

          button:active {
            transform: translateY(0);
          }

          @media (max-width: 600px) {
            header > div {
              padding: 0 16px !important;
            }

            header img {
              height: 40px !important;
            }

            header div div {
              gap: 12px !important;
            }

            header button {
              min-height: 38px !important;
              padding: 0 14px !important;
            }
          }

          @media (max-width: 420px) {
            header div div div {
              display: none !important;
            }
          }
        `}
      </style>
    </>
  );
}

export default EventNavbar;