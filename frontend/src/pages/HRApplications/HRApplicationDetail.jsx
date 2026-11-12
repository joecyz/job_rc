import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import api from "../../api/axios";
import { useToast } from "../../components/Toast/ToastProvider";

function HRApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPersonalData, setShowPersonalData] = useState(true);

  // ======================================================
  // FETCH
  // ======================================================

  const fetchApplication = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        showToast(
          "Session login tidak ditemukan.",
          "warning"
        );

        navigate("/login");
        return;
      }

      const response = await api.get(
        `/applications/hr/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "HR APPLICATION DETAIL:",
        response.data
      );

      console.log(
        "PROFILE:",
        response.data.profile
      );

      console.log(
        "EDUCATION:",
        response.data.education
      );

      console.log(
        "DOCUMENTS:",
        response.data.documents
      );

      setApplication(response.data);
    } catch (error) {
      console.error(
        "HR APPLICATION DETAIL ERROR:",
        error.response?.data || error
      );

      showToast(
        error.response?.data?.detail ||
          "Gagal mengambil detail applicant.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  // ======================================================
  // FILE
  // ======================================================

  const getFileUrl = (filePath) => {
    if (!filePath) {
      return null;
    }

    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    return `http://127.0.0.1:8000${filePath}`;
  };

  const openFile = (url, fileName) => {
    if (!url) {
      showToast(
        `Applicant belum mengupload ${fileName}.`,
        "warning"
      );

      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ======================================================
  // STATUS
  // ======================================================

  const updateStatus = async () => {
    try {
      const token =
        localStorage.getItem("access_token");

      const response = await api.patch(
        `/applications/hr/${id}/`,
        {
          status: application.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "STATUS UPDATED:",
        response.data
      );

      setApplication(response.data);

      showToast(
        "Status applicant berhasil diperbarui.",
        "success"
      );
    } catch (error) {
      console.error(
        "UPDATE STATUS ERROR:",
        error.response?.data || error
      );

      showToast(
        error.response?.data?.detail ||
          "Gagal memperbarui status.",
        "error"
      );
    }
  };

  // ======================================================
  // NOTES
  // ======================================================

  const updateNotes = async () => {
    try {
      const token =
        localStorage.getItem("access_token");

      const response = await api.patch(
        `/applications/hr/${id}/`,
        {
          hr_notes:
            application.hr_notes || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplication(response.data);

      showToast(
        "Catatan berhasil disimpan.",
        "success"
      );
    } catch (error) {
      console.error(
        "UPDATE NOTES ERROR:",
        error.response?.data || error
      );

      showToast(
        error.response?.data?.detail ||
          "Gagal menyimpan catatan.",
        "error"
      );
    }
  };

  // ======================================================
  // HELPERS
  // ======================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatusLabel = (status) => {
    const labels = {
      APPLIED: "Diajukan",
      SCREENING: "Seleksi",
      INTERVIEW: "Wawancara",
      ACCEPTED: "Diterima",
      REJECTED: "Ditolak",
    };

    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "APPLIED":
        return "status-applied";

      case "SCREENING":
        return "status-screening";

      case "INTERVIEW":
        return "status-interview";

      case "ACCEPTED":
        return "status-accepted";

      case "REJECTED":
        return "status-rejected";

      default:
        return "status-default";
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <MainLayout>
        <div className="hr-application-detail-page">
          <div className="hr-detail-loading">
            <div className="hr-loading-spinner" />

            <h3>
              Memuat detail kandidat
            </h3>

            <p>
              Mohon tunggu sebentar.
            </p>
          </div>
        </div>

        <HRApplicationDetailStyles />
      </MainLayout>
    );
  }

  // ======================================================
  // NOT FOUND
  // ======================================================

  if (!application) {
    return (
      <MainLayout>
        <div className="hr-application-detail-page">
          <div className="hr-detail-empty">

            <div className="hr-detail-empty-icon">
              !
            </div>

            <h2>
              Data Kandidat Tidak Ditemukan
            </h2>

            <p>
              Detail kandidat yang kamu cari
              tidak tersedia.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/hr/applications")
              }
            >
              ← Kembali ke Pelamar
            </button>

          </div>
        </div>

        <HRApplicationDetailStyles />
      </MainLayout>
    );
  }

  const profile = application.profile;
  const education = application.education;
  const documents = application.documents;

  const cvUrl = getFileUrl(
    documents?.cv_file
  );

  const ktpUrl = getFileUrl(
    documents?.ktp_file
  );

  const kkUrl = getFileUrl(
    documents?.kk_file
  );

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <MainLayout>
      <div className="hr-application-detail-page">

        {/* ==================================================
            TOP NAVIGATION
        ================================================== */}

        <div className="hr-detail-topbar">

          <button
            type="button"
            className="hr-back-link"
            onClick={() =>
              navigate("/hr/applications")
            }
          >
            <span>←</span>
            Daftar Pelamar
          </button>

          <span className="hr-topbar-divider">
            /
          </span>

          <span>
            Detail Kandidat
          </span>

        </div>

        {/* ==================================================
            HERO
        ================================================== */}

        <section className="hr-candidate-hero">

          <div className="hr-candidate-hero-main">

            <div className="hr-candidate-avatar">

              {profile?.profile_photo ? (
                <img
                  src={profile.profile_photo}
                  alt={
                    profile.full_name ||
                    application.applicant_name ||
                    "Kandidat"
                  }
                />
              ) : (
                <span>
                  {application.applicant_name
                    ?.charAt(0)
                    ?.toUpperCase() || "A"}
                </span>
              )}

            </div>

            <div className="hr-candidate-identity">

              <span className="hr-detail-kicker">
                CANDIDATE PROFILE
              </span>

              <h1>
                {application.applicant_name ||
                  "Kandidat"}
              </h1>

              <p>
                {application.applicant_email ||
                  "-"}
              </p>

              <div className="hr-candidate-meta">

                <span>
                  {application.job_title ||
                    "-"}
                </span>

                <i />

                <span>
                  {application.region_name ||
                    "-"}
                </span>

              </div>

            </div>

          </div>

          <div className="hr-candidate-status-box">

            <span>
              STATUS KANDIDAT
            </span>

            <strong
              className={`hr-status-badge ${getStatusClass(
                application.status
              )}`}
            >
              {getStatusLabel(
                application.status
              )}
            </strong>

          </div>

        </section>

        {/* ==================================================
            APPLICATION INFO
        ================================================== */}

        <section className="hr-detail-card">

          <div className="hr-detail-card-header">

            <div>

              <span className="hr-card-kicker">
                APPLICATION
              </span>

              <h2>
                Informasi Lamaran
              </h2>

              <p>
                Informasi lowongan dan riwayat
                pengajuan kandidat.
              </p>

            </div>

          </div>

          <div className="hr-info-grid">

            <InfoItem
              label="Nama Pelamar"
              value={
                application.applicant_name ||
                "-"
              }
            />

            <InfoItem
              label="Email"
              value={
                application.applicant_email ||
                "-"
              }
            />

            <InfoItem
              label="Posisi"
              value={
                application.job_title ||
                "-"
              }
            />

            <InfoItem
              label="Divisi"
              value={
                application.division_name ||
                "-"
              }
            />

            <InfoItem
              label="Penempatan"
              value={
                application.region_name ||
                "-"
              }
            />

            <InfoItem
              label="Tanggal Apply"
              value={formatDateTime(
                application.applied_at
              )}
            />

            <InfoItem
              label="Terakhir Diperbarui"
              value={formatDateTime(
                application.updated_at
              )}
            />

          </div>

        </section>

        {/* ==================================================
            CANDIDATE DATA
        ================================================== */}

        <section className="hr-detail-card">

          <div className="hr-detail-card-header hr-header-with-action">

            <div>

              <span className="hr-card-kicker">
                CANDIDATE DATA
              </span>

              <h2>
                Data Kandidat
              </h2>

              <p>
                Informasi pribadi, pendidikan,
                dan dokumen kandidat.
              </p>

            </div>

            <button
              type="button"
              className="hr-outline-button"
              onClick={() =>
                setShowPersonalData(
                  !showPersonalData
                )
              }
            >
              {showPersonalData
                ? "Sembunyikan Data"
                : "Tampilkan Data"}
            </button>

          </div>

          {/* DOCUMENTS */}

          <div className="hr-document-section">

            <div className="hr-document-heading">
              <span>DOCUMENTS</span>
              <p>
                Dokumen yang diunggah kandidat
              </p>
            </div>

            <div className="hr-document-grid">

              <DocumentButton
                icon="CV"
                title="CV Pelamar"
                description="Curriculum vitae kandidat"
                onClick={() =>
                  openFile(cvUrl, "CV")
                }
              />

              <DocumentButton
                icon="ID"
                title="KTP"
                description="Dokumen identitas kandidat"
                onClick={() =>
                  openFile(ktpUrl, "KTP")
                }
              />

              <DocumentButton
                icon="KK"
                title="Kartu Keluarga"
                description="Dokumen keluarga kandidat"
                onClick={() =>
                  openFile(kkUrl, "KK")
                }
              />

            </div>

          </div>

          {/* PERSONAL */}

          {showPersonalData && (
            <div className="hr-personal-content">

              {/* PERSONAL DATA */}

              <div className="hr-subsection">

                <div className="hr-subsection-title">
                  <span>01</span>

                  <div>
                    <h3>
                      Data Pribadi
                    </h3>

                    <p>
                      Informasi dasar kandidat
                    </p>
                  </div>
                </div>

                {profile ? (
                  <div className="hr-info-grid">

                    <InfoItem
                      label="Nama Lengkap"
                      value={
                        profile.full_name ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="Tempat Lahir"
                      value={
                        profile.birth_place ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="Tanggal Lahir"
                      value={formatDate(
                        profile.birth_date
                      )}
                    />

                    <InfoItem
                      label="Jenis Kelamin"
                      value={
                        profile.gender ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="Email"
                      value={
                        application.applicant_email ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="No. HP"
                      value={
                        profile.phone ||
                        application.applicant_phone ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="NIK"
                      value={
                        profile.nik || "-"
                      }
                    />

                  </div>
                ) : (
                  <UnavailableData
                    text="Data profile kandidat belum tersedia."
                  />
                )}

              </div>

              {/* EDUCATION */}

              <div className="hr-subsection">

                <div className="hr-subsection-title">
                  <span>02</span>

                  <div>
                    <h3>
                      Pendidikan
                    </h3>

                    <p>
                      Riwayat pendidikan terakhir
                    </p>
                  </div>
                </div>

                {education ? (
                  <div className="hr-info-grid">

                    <InfoItem
                      label="Jenjang"
                      value={
                        education.education_level ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="Sekolah / Universitas"
                      value={
                        education.school_name ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="Jurusan"
                      value={
                        education.major ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="Tahun Masuk"
                      value={
                        education.entry_year ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="Tahun Lulus"
                      value={
                        education.graduation_year ||
                        "-"
                      }
                    />

                  </div>
                ) : (
                  <UnavailableData
                    text="Data pendidikan kandidat belum tersedia."
                  />
                )}

              </div>

            </div>
          )}

        </section>

        {/* ==================================================
            RECRUITMENT PROCESS
        ================================================== */}

        <section className="hr-detail-card">

          <div className="hr-detail-card-header">

            <div>

              <span className="hr-card-kicker">
                RECRUITMENT PROCESS
              </span>

              <h2>
                Proses Rekrutmen
              </h2>

              <p>
                Perbarui tahapan proses kandidat
                sesuai hasil evaluasi HR.
              </p>

            </div>

          </div>

          <div className="hr-process-layout">

            <div className="hr-process-current">

              <span>
                STATUS SAAT INI
              </span>

              <strong
                className={`hr-status-badge ${getStatusClass(
                  application.status
                )}`}
              >
                {getStatusLabel(
                  application.status
                )}
              </strong>

            </div>

            <div className="hr-process-arrow">
              →
            </div>

            <div className="hr-process-control">

              <label>
                Ubah Status
              </label>

              <select
                value={application.status}
                onChange={(e) =>
                  setApplication({
                    ...application,
                    status: e.target.value,
                  })
                }
              >
                <option value="APPLIED">
                  Diajukan
                </option>

                <option value="SCREENING">
                  Seleksi
                </option>

                <option value="INTERVIEW">
                  Wawancara
                </option>

                <option value="ACCEPTED">
                  Diterima
                </option>

                <option value="REJECTED">
                  Ditolak
                </option>
              </select>

            </div>

            <button
              type="button"
              className="hr-primary-button"
              onClick={updateStatus}
            >
              Simpan Status
            </button>

          </div>

        </section>

        {/* ==================================================
            HR NOTES
        ================================================== */}

        <section className="hr-detail-card">

          <div className="hr-detail-card-header">

            <div>

              <span className="hr-card-kicker">
                INTERNAL NOTE
              </span>

              <h2>
                Catatan HR
              </h2>

              <p>
                Tambahkan catatan internal mengenai
                kandidat untuk kebutuhan proses
                rekrutmen.
              </p>

            </div>

          </div>

          <textarea
            className="hr-notes-textarea"
            value={
              application.hr_notes || ""
            }
            onChange={(e) =>
              setApplication({
                ...application,
                hr_notes: e.target.value,
              })
            }
            placeholder="Tulis catatan mengenai kandidat..."
            rows={7}
          />

          <div className="hr-notes-footer">

            <div className="hr-notes-hint">
              <span />
              Catatan ini hanya digunakan
              untuk kebutuhan internal HR.
            </div>

            <button
              type="button"
              className="hr-primary-button"
              onClick={updateNotes}
            >
              Simpan Catatan
            </button>

          </div>

        </section>

        {/* ==================================================
            BOTTOM
        ================================================== */}

        <div className="hr-detail-bottom">

          <button
            type="button"
            onClick={() =>
              navigate("/hr/applications")
            }
          >
            ← Kembali ke Daftar Pelamar
          </button>

        </div>

      </div>

      <HRApplicationDetailStyles />
    </MainLayout>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function InfoItem({ label, value }) {
  return (
    <div className="hr-info-item">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

function DocumentButton({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      className="hr-document-button"
      onClick={onClick}
    >

      <span className="hr-document-icon">
        {icon}
      </span>

      <span className="hr-document-text">

        <strong>
          {title}
        </strong>

        <small>
          {description}
        </small>

      </span>

      <b>
        ↗
      </b>

    </button>
  );
}

function UnavailableData({ text }) {
  return (
    <div className="hr-data-unavailable">
      {text}
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

function HRApplicationDetailStyles() {
  return (
    <style>
      {`

        .hr-application-detail-page {
          min-height: calc(100vh - 72px);
          background: #f4f6f9;
          padding: 34px 24px 80px;
          color: #334155;
        }

        .hr-application-detail-page > * {
          max-width: 1180px;
          margin-left: auto;
          margin-right: auto;
        }

        /* =================================================
           TOP BAR
        ================================================= */

        .hr-detail-topbar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          color: #94a3b8;
          font-size: 12px;
        }

        .hr-back-link {
          border: none;
          background: transparent;
          color: #0b4ea2;
          padding: 0;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .hr-back-link span {
          margin-right: 6px;
          font-size: 15px;
        }

        .hr-back-link:hover {
          color: #071a3d;
        }

        .hr-topbar-divider {
          color: #cbd5e1;
        }

        /* =================================================
           HERO
        ================================================= */

        .hr-candidate-hero {
          min-height: 230px;
          margin-bottom: 22px;
          padding: 30px 34px;
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 90% 5%,
              rgba(96,165,250,0.20),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #071a3d 0%,
              #0b4ea2 100%
            );
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          overflow: hidden;
          position: relative;
          box-shadow:
            0 18px 45px rgba(7,26,61,0.13);
        }

        .hr-candidate-hero::before {
          content: "";
          position: absolute;
          width: 290px;
          height: 290px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.08);
          right: -120px;
          bottom: -170px;
        }

        .hr-candidate-hero-main {
          display: flex;
          align-items: center;
          gap: 18px;
          position: relative;
          z-index: 1;
          min-width: 0;
        }

        .hr-candidate-avatar {
          width: 76px;
          height: 76px;
          flex-shrink: 0;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 28px;
          font-weight: 800;
        }

        .hr-candidate-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hr-candidate-identity {
          min-width: 0;
        }

        .hr-detail-kicker {
          display: inline-block;
          color: #bfdbfe;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          margin-bottom: 8px;
        }

        .hr-candidate-identity h1 {
          margin: 0;
          color: #ffffff;
          font-size: clamp(26px, 3.5vw, 38px);
          line-height: 1.1;
          letter-spacing: -0.03em;
          font-weight: 800;
        }

        .hr-candidate-identity > p {
          margin: 8px 0 0;
          color: #dbeafe;
          font-size: 13px;
        }

        .hr-candidate-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 13px;
          color: #bfdbfe;
          font-size: 12px;
          font-weight: 600;
        }

        .hr-candidate-meta i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #93c5fd;
        }

        .hr-candidate-status-box {
          min-width: 175px;
          padding: 20px;
          border-radius: 17px;
          background: rgba(255,255,255,0.09);
          border: 1px solid rgba(255,255,255,0.13);
          backdrop-filter: blur(12px);
          position: relative;
          z-index: 1;
        }

        .hr-candidate-status-box > span {
          display: block;
          color: #bfdbfe;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          margin-bottom: 9px;
        }

        /* =================================================
           CARD
        ================================================= */

        .hr-detail-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 27px;
          margin-bottom: 18px;
          box-shadow:
            0 8px 30px rgba(15,23,42,0.035);
        }

        .hr-detail-card-header {
          margin-bottom: 22px;
        }

        .hr-header-with-action {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .hr-card-kicker {
          color: #0b4ea2;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .hr-detail-card-header h2 {
          margin: 7px 0 0;
          color: #071a3d;
          font-size: 21px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .hr-detail-card-header p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
        }

        /* =================================================
           INFO GRID
        ================================================= */

        .hr-info-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 0;
          border-top: 1px solid #edf1f5;
          border-left: 1px solid #edf1f5;
          border-radius: 12px;
          overflow: hidden;
        }

        .hr-info-item {
          min-width: 0;
          padding: 15px;
          background: #ffffff;
          border-right: 1px solid #edf1f5;
          border-bottom: 1px solid #edf1f5;
        }

        .hr-info-item span {
          display: block;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .hr-info-item strong {
          display: block;
          color: #334155;
          font-size: 13px;
          line-height: 1.45;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        /* =================================================
           BUTTON
        ================================================= */

        .hr-outline-button {
          min-height: 40px;
          padding: 0 14px;
          border-radius: 9px;
          border: 1px solid #dbe3ed;
          background: #ffffff;
          color: #334155;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .hr-outline-button:hover {
          border-color: #b8c5d6;
          background: #f8fafc;
        }

        .hr-primary-button {
          min-height: 42px;
          padding: 0 17px;
          border: none;
          border-radius: 9px;
          background: #071a3d;
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .hr-primary-button:hover {
          background: #0b4ea2;
          transform: translateY(-1px);
        }

        /* =================================================
           STATUS
        ================================================= */

        .hr-status-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: fit-content;
          padding: 7px 11px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
        }

        .status-applied {
          background: #eaf2ff;
          color: #0b4ea2;
        }

        .status-screening {
          background: #f1edff;
          color: #6851c7;
        }

        .status-interview {
          background: #fff3e6;
          color: #b76512;
        }

        .status-accepted {
          background: #e9f8ef;
          color: #16834d;
        }

        .status-rejected {
          background: #fff0f0;
          color: #c23b3b;
        }

        .status-default {
          background: #f1f5f9;
          color: #475569;
        }

        /* =================================================
           DOCUMENT
        ================================================= */

        .hr-document-section {
          padding-bottom: 24px;
          margin-bottom: 25px;
          border-bottom: 1px solid #edf1f5;
        }

        .hr-document-heading {
          margin-bottom: 13px;
        }

        .hr-document-heading span {
          color: #071a3d;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .hr-document-heading p {
          margin: 4px 0 0;
          color: #94a3b8;
          font-size: 11px;
        }

        .hr-document-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 11px;
        }

        .hr-document-button {
          width: 100%;
          min-width: 0;
          padding: 13px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          display: flex;
          align-items: center;
          gap: 11px;
          text-align: left;
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .hr-document-button:hover {
          border-color: #b9cce3;
          background: #f8fbff;
          transform: translateY(-1px);
        }

        .hr-document-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 10px;
          background: #eaf2ff;
          color: #0b4ea2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 900;
        }

        .hr-document-text {
          min-width: 0;
          flex: 1;
        }

        .hr-document-text strong {
          display: block;
          color: #071a3d;
          font-size: 12px;
          font-weight: 800;
        }

        .hr-document-text small {
          display: block;
          margin-top: 3px;
          color: #94a3b8;
          font-size: 10px;
          line-height: 1.4;
        }

        .hr-document-button b {
          color: #0b4ea2;
          font-size: 15px;
        }

        /* =================================================
           PERSONAL
        ================================================= */

        .hr-personal-content {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .hr-subsection + .hr-subsection {
          padding-top: 28px;
          border-top: 1px solid #edf1f5;
        }

        .hr-subsection-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
        }

        .hr-subsection-title > span {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: #071a3d;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
        }

        .hr-subsection-title h3 {
          margin: 0;
          color: #071a3d;
          font-size: 15px;
          font-weight: 800;
        }

        .hr-subsection-title p {
          margin: 2px 0 0;
          color: #94a3b8;
          font-size: 10px;
        }

        .hr-data-unavailable {
          padding: 18px;
          border: 1px dashed #dbe3ed;
          border-radius: 11px;
          background: #f8fafc;
          color: #64748b;
          font-size: 12px;
          text-align: center;
        }

        /* =================================================
           PROCESS
        ================================================= */

        .hr-process-layout {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 19px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e8edf3;
        }

        .hr-process-current {
          min-width: 145px;
        }

        .hr-process-current > span {
          display: block;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .hr-process-arrow {
          color: #94a3b8;
          font-size: 19px;
        }

        .hr-process-control {
          flex: 1;
        }

        .hr-process-control label {
          display: block;
          color: #475569;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 7px;
        }

        .hr-process-control select {
          width: 100%;
          height: 42px;
          border: 1px solid #dbe3ed;
          border-radius: 9px;
          background: #ffffff;
          color: #334155;
          padding: 0 12px;
          font-size: 12px;
          outline: none;
        }

        .hr-process-control select:focus {
          border-color: #0b4ea2;
          box-shadow:
            0 0 0 3px rgba(11,78,162,0.08);
        }

        /* =================================================
           NOTES
        ================================================= */

        .hr-notes-textarea {
          width: 100%;
          min-height: 150px;
          resize: vertical;
          padding: 15px;
          border: 1px solid #dbe3ed;
          border-radius: 12px;
          background: #ffffff;
          color: #334155;
          font-family: inherit;
          font-size: 13px;
          line-height: 1.7;
          outline: none;
        }

        .hr-notes-textarea::placeholder {
          color: #a3afbd;
        }

        .hr-notes-textarea:focus {
          border-color: #0b4ea2;
          box-shadow:
            0 0 0 3px rgba(11,78,162,0.08);
        }

        .hr-notes-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 13px;
        }

        .hr-notes-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 11px;
        }

        .hr-notes-hint span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #60a5fa;
        }

        /* =================================================
           BOTTOM
        ================================================= */

        .hr-detail-bottom {
          padding-top: 2px;
        }

        .hr-detail-bottom button {
          border: none;
          background: transparent;
          padding: 9px 0;
          color: #0b4ea2;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .hr-detail-bottom button:hover {
          color: #071a3d;
        }

        /* =================================================
           EMPTY
        ================================================= */

        .hr-detail-empty {
          min-height: 55vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 50px 25px;
        }

        .hr-detail-empty-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: #eaf2ff;
          color: #0b4ea2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 17px;
        }

        .hr-detail-empty h2 {
          margin: 0;
          color: #071a3d;
          font-size: 21px;
        }

        .hr-detail-empty p {
          margin: 8px 0 20px;
          color: #64748b;
          font-size: 13px;
        }

        .hr-detail-empty button {
          border: none;
          background: #071a3d;
          color: #ffffff;
          padding: 10px 16px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .hr-detail-empty button:hover {
          background: #0b4ea2;
        }

        /* =================================================
           LOADING
        ================================================= */

        .hr-detail-loading {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .hr-loading-spinner {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 3px solid #dbeafe;
          border-top-color: #0b4ea2;
          animation: hrDetailSpin 0.8s linear infinite;
          margin-bottom: 18px;
        }

        .hr-detail-loading h3 {
          margin: 0;
          color: #071a3d;
          font-size: 18px;
        }

        .hr-detail-loading p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        @keyframes hrDetailSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =================================================
           RESPONSIVE
        ================================================= */

        @media (max-width: 950px) {

          .hr-info-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .hr-document-grid {
            grid-template-columns: 1fr;
          }

          .hr-process-layout {
            flex-wrap: wrap;
          }

          .hr-process-control {
            min-width: 220px;
          }

        }

        @media (max-width: 720px) {

          .hr-application-detail-page {
            padding: 25px 14px 60px;
          }

          .hr-candidate-hero {
            padding: 24px;
            flex-direction: column;
            align-items: flex-start;
          }

          .hr-candidate-status-box {
            width: 100%;
          }

          .hr-detail-card {
            padding: 20px;
          }

          .hr-header-with-action {
            flex-direction: column;
          }

          .hr-outline-button {
            width: 100%;
          }

          .hr-process-layout {
            flex-direction: column;
            align-items: stretch;
          }

          .hr-process-arrow {
            display: none;
          }

          .hr-process-current {
            min-width: 0;
          }

          .hr-process-control {
            min-width: 0;
          }

          .hr-process-layout .hr-primary-button {
            width: 100%;
          }

          .hr-notes-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .hr-notes-footer .hr-primary-button {
            width: 100%;
          }

        }

        @media (max-width: 520px) {

          .hr-candidate-hero-main {
            align-items: flex-start;
          }

          .hr-candidate-avatar {
            width: 60px;
            height: 60px;
            border-radius: 16px;
            font-size: 22px;
          }

          .hr-candidate-identity h1 {
            font-size: 25px;
          }

          .hr-candidate-meta {
            align-items: flex-start;
            flex-direction: column;
            gap: 5px;
          }

          .hr-candidate-meta i {
            display: none;
          }

          .hr-info-grid {
            grid-template-columns: 1fr;
          }

          .hr-info-item {
            border-right: none;
          }

          .hr-detail-topbar {
            font-size: 11px;
          }

        }

      `}
    </style>
  );
}

export default HRApplicationDetail;