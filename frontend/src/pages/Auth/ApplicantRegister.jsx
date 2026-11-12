import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { useToast } from "../../components/Toast/ToastProvider";
import logoBSU from "../../assets/images/logo-bsu-dark.png";

function ApplicantRegister() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ==================================================
  // CHANGE
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================================================
  // REGISTER
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==========================
    // VALIDATION
    // ==========================

    if (!formData.username.trim()) {
      showToast(
        "Username wajib diisi.",
        "warning"
      );
      return;
    }

    if (!formData.email.trim()) {
      showToast(
        "Email wajib diisi.",
        "warning"
      );
      return;
    }

    if (!formData.password) {
      showToast(
        "Password wajib diisi.",
        "warning"
      );
      return;
    }

    if (formData.password.length < 8) {
      showToast(
        "Password minimal 8 karakter.",
        "warning"
      );
      return;
    }

    // ==========================
    // SEND REGISTER
    // ==========================

    try {
      setLoading(true);

      await api.post(
        "/auth/register/",
        formData
      );

      showToast(
        "Akun Pelamar berhasil dibuat.",
        "success"
      );

      setTimeout(() => {
        navigate("/login");
      }, 800);

    } catch (error) {
      console.error(
        "APPLICANT REGISTER ERROR:",
        error?.response?.data || error
      );

      const errorData =
        error?.response?.data;

      if (
        errorData &&
        typeof errorData === "object"
      ) {
        const messages =
          Object.entries(errorData)
            .map(([field, message]) => {
              const text =
                Array.isArray(message)
                  ? message.join(", ")
                  : message;

              return `${field}: ${text}`;
            })
            .join("\n");

        showToast(
          messages ||
            "Gagal membuat akun.",
          "error"
        );
      } else {
        showToast(
          "Gagal membuat akun.",
          "error"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bsu-register-page">

      {/* ==================================================
          BAGIAN KIRI
      ================================================== */}

      <section className="bsu-register-left">

        <div className="register-orb register-orb-one" />
        <div className="register-orb register-orb-two" />
        <div className="register-grid" />

        {/* BRAND */}

        <Link
          to="/"
          className="register-brand"
        >
          <div className="register-logo-box">
            <img
              src={logoBSU}
              alt="Bintang Sayap Utama"
            />
          </div>

          <div className="register-brand-text">
            <strong>
              BINTANG SAYAP UTAMA
            </strong>

            <span>
              PORTAL KARIER
            </span>
          </div>
        </Link>

        {/* CONTENT */}

        <div className="register-intro">

          <div className="register-eyebrow">
            MULAI PERJALANANMU
          </div>

          <h1>
            Karier barumu
            <br />
            <span>dimulai di sini.</span>
          </h1>

          <p>
            Buat akun Pelamar dan mulai
            temukan peluang karier yang sesuai
            dengan kemampuan serta tujuanmu.
          </p>

          {/* FEATURES */}

          <div className="register-features">

            <div className="register-feature">

              <span className="feature-number">
                01
              </span>

              <div>
                <strong>
                  Buat akunmu
                </strong>

                <p>
                  Daftarkan data dasar untuk
                  membuat akun Pelamar.
                </p>
              </div>

            </div>

            <div className="register-feature">

              <span className="feature-number">
                02
              </span>

              <div>
                <strong>
                  Lengkapi profilmu
                </strong>

                <p>
                  Lengkapi nama lengkap,
                  profil, pendidikan,
                  dan dokumen.
                </p>
              </div>

            </div>

            <div className="register-feature">

              <span className="feature-number">
                03
              </span>

              <div>
                <strong>
                  Lamar pekerjaan
                </strong>

                <p>
                  Temukan dan lamar posisi yang
                  sesuai dengan profilmu.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="register-left-footer">

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

      <section className="bsu-register-right">

        <div className="register-card">

          {/* HEADER */}

          <div className="register-header">

            <div className="register-card-eyebrow">
              PENDAFTARAN PELAMAR
            </div>

            <h2>
              Buat Akun
            </h2>

            <p>
              Isi data berikut untuk membuat
              akun Pelamar baru.
            </p>

          </div>


          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="register-form"
          >

            {/* ==================================================
                USERNAME
            ================================================== */}

            <div className="register-field">

              <label htmlFor="username">
                Username
              </label>

              <div className="register-input-wrapper">

                <span>
                  ＠
                </span>

                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Buat username"
                  autoComplete="username"
                />

              </div>

            </div>


            {/* ==================================================
                EMAIL
            ================================================== */}

            <div className="register-field">

              <label htmlFor="email">
                Email
              </label>

              <div className="register-input-wrapper">

                <span>
                  ✉
                </span>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  autoComplete="email"
                />

              </div>

            </div>


            {/* ==================================================
                PASSWORD
            ================================================== */}

            <div className="register-field">

              <div className="password-label-row">

                <label htmlFor="password">
                  Password
                </label>

                <span>
                  MIN. 8 KARAKTER
                </span>

              </div>

              <div className="register-input-wrapper">

                <span>
                  ⌑
                </span>

                <input
                  id="password"
                  name="password"
                  className="register-password-input"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Buat password"
                  autoComplete="new-password"
                />


                {/* ==================================================
                    SHOW / HIDE PASSWORD
                ================================================== */}

                <button
                  type="button"
                  className="register-password-toggle"
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
                      className="password-eye-icon"
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
                      className="password-eye-icon"
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


            {/* ==================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              disabled={loading}
              className="register-submit"
            >

              <span>
                {loading
                  ? "Membuat Akun..."
                  : "Daftar sebagai Pelamar"}
              </span>

              {!loading && (
                <span>
                  →
                </span>
              )}

            </button>

          </form>


          {/* ==================================================
              LOGIN
          ================================================== */}

          <div className="already-account">

            <span>
              Sudah punya akun?
            </span>

            <Link to="/login">
              Login di sini
            </Link>

          </div>


          {/* ==================================================
              HOME
          ================================================== */}

          <div className="register-back">

            <Link to="/">
              ← Kembali ke Beranda
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default ApplicantRegister;