import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { useToast } from "../../components/Toast/ToastProvider";
import logoBSU from "../../assets/images/logo-bsu-dark.png";

function InternalLogin() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ==========================
  // HANDLE CHANGE
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================
  // SUBMIT LOGIN
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      showToast("Username wajib diisi.", "warning");
      return;
    }

    if (!formData.password) {
      showToast("Password wajib diisi.", "warning");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login/", {
        username: formData.username,
        password: formData.password,
      });

      const data = response.data;

      const accessToken =
        data?.access ||
        data?.access_token;

      const refreshToken =
        data?.refresh ||
        data?.refresh_token;

      const user =
        data?.user ||
        data?.profile ||
        null;

      const role =
        data?.role ||
        user?.role ||
        "";

      console.log("LOGIN RESPONSE:", data);
      console.log("LOGIN ROLE:", role);

      // ==========================
      // TOKEN CHECK
      // ==========================
      if (!accessToken) {
        showToast(
          "Login berhasil tetapi access token tidak ditemukan.",
          "error"
        );
        return;
      }

      // ==========================
      // INTERNAL ROLE CHECK
      // ==========================
      if (
        role !== "HR" &&
        role !== "Event Team"
      ) {
        showToast(
          "Akun ini bukan akun internal.",
          "error"
        );
        return;
      }

      // ==========================
      // SIMPAN TOKEN
      // ==========================
      localStorage.setItem(
        "access_token",
        accessToken
      );

      if (refreshToken) {
        localStorage.setItem(
          "refresh_token",
          refreshToken
        );
      }

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      localStorage.setItem(
        "role",
        role
      );

      showToast(
        `Login ${role} berhasil.`,
        "success"
      );

      // ==========================
      // REDIRECT HR
      // ==========================
      if (role === "HR") {
        navigate("/hr/dashboard");
        return;
      }

      // ==========================
      // REDIRECT EVENT TEAM
      // ==========================
      if (role === "Event Team") {
        navigate("/event/dashboard");
        return;
      }

    } catch (error) {
      console.error(
        "INTERNAL LOGIN ERROR:",
        error?.response?.data || error
      );

      const errorData =
        error?.response?.data;

      let message =
        "Username atau password salah.";

      if (errorData?.detail) {
        message = errorData.detail;
      } else if (
        errorData?.non_field_errors?.length
      ) {
        message =
          errorData.non_field_errors[0];
      } else if (
        typeof errorData === "string"
      ) {
        message = errorData;
      }

      showToast(
        message,
        "error"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="internal-login-page">

      {/* =====================================================
          LEFT SIDE
      ====================================================== */}
      <section className="internal-login-left">

        {/* Decorative Grid */}
        <div className="internal-grid" />

        {/* Decorative Circles */}
        <div className="internal-circle internal-circle-one" />
        <div className="internal-circle internal-circle-two" />

        {/* BRAND */}
        <div className="internal-brand">

          <div className="internal-logo-box">
            <img
              src={logoBSU}
              alt="PT Bintang Sayap Utama"
            />
          </div>

          <div className="internal-brand-text">
            <strong>
              BINTANG SAYAP UTAMA
            </strong>

            <span>
              PORTAL INTERNAL
            </span>
          </div>

        </div>

        {/* MAIN CONTENT */}
        <div className="internal-left-content">

          <div className="internal-eyebrow">
            AKSES INTERNAL
          </div>

          <h1>
            Kelola proses
            <br />
            <span>rekrutmen BSU.</span>
          </h1>

          <p className="internal-description">
            Portal internal untuk mendukung
            proses rekrutmen, pengelolaan
            kandidat, event, dan kebutuhan
            operasional tim Bintang Sayap Utama.
          </p>

          {/* INFORMATION */}
          <div className="internal-info-list">

            <div className="internal-info-item">

              <div className="internal-info-number">
                01
              </div>

              <div>
                <strong>
                  Kelola Rekrutmen
                </strong>

                <p>
                  Kelola proses rekrutmen dan
                  kandidat secara terpusat.
                </p>
              </div>

            </div>


            <div className="internal-info-item">

              <div className="internal-info-number">
                02
              </div>

              <div>
                <strong>
                  Kelola Aktivitas
                </strong>

                <p>
                  Mendukung kebutuhan operasional
                  tim internal BSU.
                </p>
              </div>

            </div>


            <div className="internal-info-item">

              <div className="internal-info-number">
                03
              </div>

              <div>
                <strong>
                  Akses Terpusat
                </strong>

                <p>
                  Satu portal untuk kebutuhan
                  internal perusahaan.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* LEFT FOOTER */}
        <div className="internal-left-footer">

          <span>
            PT BINTANG SAYAP UTAMA
          </span>

          <span>
            REKRUTMEN • PELUANG • PERTUMBUHAN
          </span>

        </div>

      </section>


      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}
      <section className="internal-login-right">

        <div className="internal-login-card">

          {/* HEADER */}
          <div className="internal-card-header">

            <div className="internal-card-eyebrow">
              PORTAL INTERNAL
            </div>

            <h2>
              Login Internal
            </h2>

            <p>
              Masuk untuk mengelola proses
              rekrutmen dan aktivitas perusahaan.
            </p>

          </div>


          {/* FORM */}
          <form onSubmit={handleSubmit}>

            {/* USERNAME */}
            <div className="internal-field">

              <label htmlFor="username">
                Username
              </label>

              <div className="internal-input-wrapper">

                <span className="internal-input-icon">
                  @
                </span>

                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  autoComplete="username"
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="internal-field internal-password-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="internal-input-wrapper">

                <span className="internal-input-icon">
                  •
                </span>

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                />

                {/* PASSWORD EYE */}
                <button
                  type="button"
                  className="internal-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                  title={
                    showPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >

                  {showPassword ? (

                    /* EYE OFF */
                    <svg
                      className="internal-password-eye-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >

                      <path
                        d="M3 3L21 21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                      <path
                        d="M10.58 10.58A2 2 0 0 0 13.42 13.42"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                      <path
                        d="M9.88 4.24C10.56 4.08 11.27 4 12 4C17.5 4 21.5 8.5 22 12C21.77 13.66 20.71 15.42 19.17 16.83"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M6.61 6.61C4.61 7.91 3.29 9.76 2 12C2.5 15.5 6.5 20 12 20C13.13 20 14.21 19.82 15.21 19.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                    </svg>

                  ) : (

                    /* EYE */
                    <svg
                      className="internal-password-eye-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >

                      <path
                        d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />

                    </svg>

                  )}

                </button>

              </div>

            </div>


            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="internal-login-button"
            >
              {loading
                ? "Memproses..."
                : "Masuk ke Portal Internal →"}
            </button>

          </form>


          {/* FOOTER LINKS */}
          <div className="internal-card-footer">

            <Link to="/login">
              ← Kembali ke Login Applicant
            </Link>

            <Link to="/">
              Kembali ke Beranda
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          STYLES
      ====================================================== */}
      <style>
        {`

          * {
            box-sizing: border-box;
          }


          .internal-login-page {
            min-height: 100vh;

            display: grid;

            grid-template-columns:
              1.05fr 0.95fr;

            background: #f4f6f9;

            font-family:
              Inter,
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
          }


          /* =================================================
             LEFT SIDE
          ================================================= */

          .internal-login-left {
            min-height: 100vh;

            position: relative;
            overflow: hidden;

            display: flex;
            flex-direction: column;
            justify-content: space-between;

            padding:
              46px 60px;

            color: #ffffff;

            background:
              linear-gradient(
                145deg,
                #061735 0%,
                #071a3d 52%,
                #0b4ea2 100%
              );
          }


          .internal-grid {
            position: absolute;
            inset: 0;

            background-image:
              linear-gradient(
                rgba(255,255,255,0.045) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.045) 1px,
                transparent 1px
              );

            background-size: 52px 52px;

            opacity: 0.55;

            pointer-events: none;
          }


          .internal-circle {
            position: absolute;

            border-radius: 50%;

            border:
              1px solid
              rgba(147,197,253,0.11);

            pointer-events: none;
          }


          .internal-circle-one {
            width: 540px;
            height: 540px;

            top: -290px;
            right: -210px;
          }


          .internal-circle-two {
            width: 340px;
            height: 340px;

            bottom: -190px;
            right: 30px;

            border-color:
              rgba(96,165,250,0.08);
          }


          /* =================================================
             BRAND
          ================================================= */

          .internal-brand {
            position: relative;
            z-index: 2;

            display: flex;
            align-items: center;

            gap: 14px;
          }


          .internal-logo-box {
            width: 54px;
            height: 54px;

            display: flex;
            align-items: center;
            justify-content: center;

            background: #ffffff;

            border-radius: 13px;

            padding: 8px;
          }


          .internal-logo-box img {
            width: 100%;
            height: 100%;

            object-fit: contain;

            display: block;
          }


          .internal-brand-text {
            display: flex;
            flex-direction: column;

            gap: 4px;
          }


          .internal-brand-text strong {
            font-size: 16px;
            font-weight: 900;

            letter-spacing: 0.7px;
          }


          .internal-brand-text span {
            color: #93c5fd;

            font-size: 9px;
            font-weight: 800;

            letter-spacing: 2px;
          }


          /* =================================================
             LEFT CONTENT
          ================================================= */

          .internal-left-content {
            position: relative;
            z-index: 2;

            width: 100%;
            max-width: 620px;

            margin: auto 0;

            padding:
              70px 0;
          }


          .internal-eyebrow {
            display: inline-flex;

            margin-bottom: 18px;

            color: #93c5fd;

            font-size: 11px;
            font-weight: 900;

            letter-spacing: 2px;
          }


          .internal-left-content h1 {
            margin: 0;

            color: #ffffff;

            font-size:
              clamp(44px, 5vw, 68px);

            line-height: 1.02;

            letter-spacing: -2.8px;

            font-weight: 900;
          }


          .internal-left-content h1 span {
            color: #60a5fa;
          }


          .internal-description {
            max-width: 590px;

            margin:
              25px 0 35px;

            color: #dbeafe;

            font-size: 16px;

            line-height: 1.75;
          }


          /* =================================================
             INFO LIST
          ================================================= */

          .internal-info-list {
            display: grid;

            gap: 12px;

            max-width: 560px;
          }


          .internal-info-item {
            display: flex;
            align-items: center;

            gap: 14px;

            padding:
              12px 0;
          }


          .internal-info-number {
            width: 38px;
            height: 38px;

            flex-shrink: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 10px;

            background:
              rgba(96,165,250,0.10);

            border:
              1px solid
              rgba(96,165,250,0.22);

            color: #93c5fd;

            font-size: 10px;

            font-weight: 900;
          }


          .internal-info-item strong {
            display: block;

            margin-bottom: 4px;

            color: #ffffff;

            font-size: 13px;

            font-weight: 800;
          }


          .internal-info-item p {
            margin: 0;

            color: #a9bdd8;

            font-size: 11px;

            line-height: 1.5;
          }


          /* =================================================
             LEFT FOOTER
          ================================================= */

          .internal-left-footer {
            position: relative;
            z-index: 2;

            display: flex;
            justify-content: space-between;
            align-items: center;

            gap: 20px;

            padding-top: 20px;

            border-top:
              1px solid
              rgba(255,255,255,0.12);

            color:
              rgba(255,255,255,0.55);

            font-size: 9px;

            font-weight: 800;

            letter-spacing: 1.5px;
          }


          /* =================================================
             RIGHT SIDE
          ================================================= */

          .internal-login-right {
            min-height: 100vh;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 40px;

            background: #f4f6f9;
          }


          .internal-login-card {
            width: 100%;

            max-width: 500px;

            padding: 46px 38px 34px;

            background: #ffffff;

            border:
              1px solid #e2e8f0;

            border-radius: 20px;

            box-shadow:
              0 24px 70px
              rgba(7,26,61,0.10);
          }


          /* =================================================
             CARD HEADER
          ================================================= */

          .internal-card-header {
            margin-bottom: 32px;
          }


          .internal-card-eyebrow {
            margin-bottom: 10px;

            color: #0b4ea2;

            font-size: 10px;

            font-weight: 900;

            letter-spacing: 1.8px;
          }


          .internal-card-header h2 {
            margin: 0;

            color: #071a3d;

            font-size: 38px;

            line-height: 1.1;

            letter-spacing: -1.5px;

            font-weight: 900;
          }


          .internal-card-header p {
            max-width: 420px;

            margin:
              11px 0 0;

            color: #64748b;

            font-size: 13px;

            line-height: 1.7;
          }


          /* =================================================
             FORM
          ================================================= */

          .internal-field {
            margin-bottom: 19px;
          }


          .internal-password-field {
            margin-bottom: 26px;
          }


          .internal-field label {
            display: block;

            margin-bottom: 9px;

            color: #334155;

            font-size: 11px;

            font-weight: 800;
          }


          .internal-input-wrapper {
            position: relative;
          }


          .internal-input-icon {
            position: absolute;

            left: 15px;
            top: 50%;

            transform:
              translateY(-50%);

            color: #94a3b8;

            font-size: 14px;

            font-weight: 800;

            pointer-events: none;
          }


          .internal-input-wrapper input {
            width: 100%;

            height: 52px;

            padding:
              0 50px 0 39px;

            border:
              1px solid #dbe2ea;

            border-radius: 11px;

            outline: none;

            background: #f8fafc;

            color: #071a3d;

            font-size: 13px;

            transition:
              border-color 0.2s ease,
              background 0.2s ease,
              box-shadow 0.2s ease;
          }


          .internal-input-wrapper input::placeholder {
            color: #94a3b8;
          }


          .internal-input-wrapper input:focus {
            border-color: #0b4ea2;

            background: #ffffff;

            box-shadow:
              0 0 0 3px
              rgba(11,78,162,0.08);
          }


          /* =================================================
             PASSWORD EYE TOGGLE
          ================================================= */

          .internal-password-toggle {
            position: absolute;

            right: 10px;
            top: 50%;

            width: 34px;
            height: 34px;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 0;

            border: 0;

            border-radius: 8px;

            transform:
              translateY(-50%) !important;

            background: transparent;

            color: #94a3b8;

            cursor: pointer;

            transition:
              background-color 0.2s ease,
              color 0.2s ease,
              opacity 0.2s ease;
          }


          .internal-password-toggle:hover {
            transform:
              translateY(-50%) !important;

            background: #f1f5f9;

            color: #0b4ea2;
          }


          .internal-password-toggle:focus {
            outline: none;
          }


          .internal-password-toggle:focus-visible {
            outline:
              2px solid
              rgba(11,78,162,0.25);

            outline-offset: 2px;
          }


          .internal-password-eye-icon {
            width: 18px;
            height: 18px;

            display: block;

            pointer-events: none;
          }


          /* =================================================
             LOGIN BUTTON
          ================================================= */

          .internal-login-button {
            width: 100%;

            height: 53px;

            border: 0;

            border-radius: 11px;

            background:
              linear-gradient(
                90deg,
                #071a3d,
                #0b4ea2
              );

            color: #ffffff;

            font-size: 13px;

            font-weight: 800;

            cursor: pointer;

            box-shadow:
              0 10px 24px
              rgba(11,78,162,0.20);

            transition:
              transform 0.2s ease,
              box-shadow 0.2s ease,
              opacity 0.2s ease;
          }


          .internal-login-button:hover:not(:disabled) {
            transform:
              translateY(-1px);

            box-shadow:
              0 14px 28px
              rgba(11,78,162,0.25);
          }


          .internal-login-button:disabled {
            opacity: 0.65;

            cursor: not-allowed;
          }


          /* =================================================
             CARD FOOTER
          ================================================= */

          .internal-card-footer {
            display: flex;
            flex-direction: column;

            align-items: center;

            gap: 10px;

            margin-top: 28px;

            padding-top: 22px;

            border-top:
              1px solid #edf0f5;
          }


          .internal-card-footer a {
            color: #334155;

            font-size: 11px;

            font-weight: 700;

            text-decoration: none;

            transition:
              color 0.2s ease;
          }


          .internal-card-footer a:last-child {
            color: #94a3b8;

            font-size: 10px;

            font-weight: 600;
          }


          .internal-card-footer a:hover {
            color: #0b4ea2;
          }


          /* =================================================
             RESPONSIVE
          ================================================= */

          @media (max-width: 1000px) {

            .internal-login-page {
              grid-template-columns: 1fr;
            }


            .internal-login-left {
              min-height: auto;

              padding:
                40px;
            }


            .internal-left-content {
              padding:
                70px 0;
            }


            .internal-login-right {
              min-height: auto;

              padding:
                50px 30px;
            }

          }


          @media (max-width: 600px) {

            .internal-login-left {
              padding:
                28px 22px;
            }


            .internal-left-content {
              padding:
                60px 0 50px;
            }


            .internal-left-content h1 {
              font-size: 42px;

              letter-spacing:
                -1.8px;
            }


            .internal-description {
              font-size: 14px;
            }


            .internal-left-footer {
              flex-direction: column;

              align-items: flex-start;

              gap: 7px;
            }


            .internal-login-right {
              padding:
                25px 16px 40px;
            }


            .internal-login-card {
              padding:
                32px 22px 28px;

              border-radius: 17px;
            }


            .internal-card-header h2 {
              font-size: 30px;
            }

          }

        `}
      </style>

    </div>
  );
}

export default InternalLogin;