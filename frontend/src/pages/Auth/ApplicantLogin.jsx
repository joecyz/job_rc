import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { useToast } from "../../components/Toast/ToastProvider";
import logoBSU from "../../assets/images/logo-bsu-dark.png";

function ApplicantLogin() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==================================================
  // LOGIN
  // ==================================================

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login/", {
        username,
        password,
      });

      console.log(response.data);

      const role = response.data.role;

      // Pastikan akun adalah Applicant
      if (role !== "Applicant") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("role");

        setError(
          "Akun ini bukan akun Pelamar. Gunakan halaman Login Internal."
        );

        return;
      }

      // Simpan token
      localStorage.setItem(
        "access_token",
        response.data.access
      );

      localStorage.setItem(
        "refresh_token",
        response.data.refresh
      );

      localStorage.setItem("role", role);
      localStorage.setItem("username", username);

      window.dispatchEvent(new Event("login"));

      navigate("/");
    } catch (error) {
      console.error(
        "APPLICANT LOGIN ERROR:",
        error
      );

      const data = error?.response?.data;

      setError(
        data?.detail ||
          data?.non_field_errors?.[0] ||
          "Username atau password salah."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bsu-login-page">

      {/* ==================================================
          BAGIAN KIRI
      ================================================== */}

      <section className="bsu-login-left">

        <div className="login-orb login-orb-one" />
        <div className="login-orb login-orb-two" />
        <div className="login-orb login-orb-three" />
        <div className="login-grid" />

        {/* BRAND */}

        <Link
          to="/"
          className="bsu-login-brand"
        >
          <div className="brand-logo-box">
            <img
              src={logoBSU}
              alt="Bintang Sayap Utama"
            />
          </div>

          <div className="brand-text">
            <strong>
              BINTANG SAYAP UTAMA
            </strong>

            <span>
              PORTAL KARIER
            </span>
          </div>
        </Link>

        {/* HERO */}

        <div className="bsu-login-hero">

          <div className="hero-eyebrow">
            PELUANG KARIER
          </div>

          <h1>
            Bangun kariermu
            <br />
            <span>bersama BSU.</span>
          </h1>

          <p>
            Temukan peluang karier terbaik dan
            bergabung bersama PT Bintang Sayap
            Utama untuk berkembang bersama.
          </p>

          <div className="hero-line" />

          {/* BENEFITS */}

          <div className="login-benefits">

            <div className="benefit">
              <div className="benefit-icon">
                ✓
              </div>

              <div>
                <strong>
                  Peluang Karier
                </strong>

                <span>
                  Temukan posisi yang sesuai
                  dengan kemampuan Anda.
                </span>
              </div>
            </div>

            <div className="benefit">
              <div className="benefit-icon">
                ✓
              </div>

              <div>
                <strong>
                  Lingkungan Profesional
                </strong>

                <span>
                  Berkembang bersama tim
                  profesional BSU.
                </span>
              </div>
            </div>

            <div className="benefit">
              <div className="benefit-icon">
                ✓
              </div>

              <div>
                <strong>
                  Tumbuh Bersama
                </strong>

                <span>
                  Bangun masa depan karier
                  bersama kami.
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}

        <div className="login-left-footer">
          <span>
            PT BINTANG SAYAP UTAMA
          </span>

          <span>
            KARIER • PELUANG • PERTUMBUHAN
          </span>
        </div>

      </section>

      {/* ==================================================
          BAGIAN KANAN
      ================================================== */}

      <section className="bsu-login-right">

        <div className="bsu-login-card">

          {/* HEADER */}

          <div className="login-card-header">

            <div className="card-eyebrow">
              PELAMAR
            </div>

            <h2>
              Login Pelamar
            </h2>

            <p>
              Masuk ke akun Anda untuk mencari
              lowongan kerja dan mengelola proses
              lamaran.
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="bsu-login-form"
          >

            {/* ERROR */}

            {error && (
              <div className="login-error">
                <span className="error-icon">
                  !
                </span>

                <span>
                  {error}
                </span>
              </div>
            )}

            {/* USERNAME */}

            <div className="login-field">

              <label>
                Username
              </label>

              <div className="login-input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  className="bsu-login-input"
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Masukkan username"
                  autoComplete="username"
                />

              </div>
            </div>

            {/* PASSWORD */}

            <div className="login-field">

              <label>
                Password
              </label>

              <div className="login-input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  className="bsu-login-input password-input"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                />

                {/* SHOW / HIDE PASSWORD */}

                <button
                  type="button"
                  className="password-toggle"
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
                    <svg className="password-eye-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M10.58 10.58A2 2 0 0 0 13.42 13.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M9.88 4.24C10.56 4.08 11.27 4 12 4C17.5 4 21.5 8.5 22 12C21.77 13.66 20.71 15.42 19.17 16.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6.61 6.61C4.61 7.91 3.29 9.76 2 12C2.5 15.5 6.5 20 12 20C13.13 20 14.21 19.82 15.21 19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg className="password-eye-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                </button>

              </div>
            </div>

            {/* LOGIN */}

            <button
              type="submit"
              disabled={loading}
              className="login-submit"
            >
              <span>
                {loading
                  ? "Memproses..."
                  : "Login Pelamar"}
              </span>

              {!loading && (
                <span className="submit-arrow">
                  →
                </span>
              )}
            </button>

          </form>

          {/* PEMISAH */}

          <div className="login-divider">
            <span />
            <small>ATAU</small>
            <span />
          </div>

          {/* DAFTAR */}

          <Link
            to="/register"
            className="login-option"
          >
            <div className="option-icon">
              +
            </div>

            <div className="option-content">

              <small>
                BELUM PUNYA AKUN?
              </small>

              <strong>
                Daftar sebagai Pelamar
              </strong>

              <span>
                Buat akun baru untuk mulai
                melamar pekerjaan.
              </span>

            </div>

            <div className="option-arrow">
              →
            </div>
          </Link>

          {/* INTERNAL */}

          <Link
            to="/internal/login"
            className="login-option internal-option"
          >
            <div className="option-icon internal-icon">
              ⇥
            </div>

            <div className="option-content">

              <small>
                AKSES INTERNAL
              </small>

              <strong>
                Login Internal
              </strong>

              <span>
                Akses khusus untuk HR dan
                Tim Event.
              </span>

            </div>

            <div className="option-arrow">
              →
            </div>
          </Link>

          {/* KEMBALI */}

          <div className="login-back-wrapper">
            <Link
              to="/"
              className="login-back"
            >
              ← Kembali ke Beranda
            </Link>
          </div>

        </div>

      </section>

      {/* ==================================================
          STYLES
      ================================================== */}

    </div>
  );
}

export default ApplicantLogin;