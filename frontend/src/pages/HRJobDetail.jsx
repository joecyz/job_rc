import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getJobDetail,
  deleteJob,
} from "../services/jobService";

import { useToast } from "../components/Toast/ToastProvider";
import HRNavbar from "../components/HRNavbar/HRNavbar";

function HRJobDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);

      const data = await getJobDetail(id);

      setJob(data);
    } catch (error) {
      console.error("GET JOB DETAIL ERROR:", error);

      showToast(
        error?.response?.data?.detail ||
          "Gagal mengambil detail lowongan.",
        "error"
      );

      navigate("/hr/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!job) {
      return;
    }

    const confirmed = window.confirm(
      `Yakin ingin menghapus lowongan "${job.position_name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteJob(id);

      showToast(
        "Lowongan berhasil dihapus.",
        "success"
      );

      navigate("/hr/dashboard");
    } catch (error) {
      console.error("DELETE JOB ERROR:", error);

      showToast(
        error?.response?.data?.detail ||
          "Gagal menghapus lowongan.",
        "error"
      );
    }
  };

  const getStatusLabel = (status) => {
    if (status === "OPEN") {
      return "Lowongan Aktif";
    }

    if (status === "CLOSED") {
      return "Lowongan Ditutup";
    }

    return status || "Tidak Diketahui";
  };

  const getStatusText = (status) => {
    if (status === "OPEN") {
      return "Terbuka";
    }

    if (status === "CLOSED") {
      return "Ditutup";
    }

    return status || "-";
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleDateString(
        "id-ID",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  if (loading) {
    return (
      <>
        <HRNavbar />

        <main style={styles.page}>
          <div style={styles.loadingWrapper}>
            <div style={styles.loadingIcon}>
              <div style={styles.loadingDot} />
            </div>

            <h2 style={styles.loadingTitle}>
              Memuat Detail Lowongan
            </h2>

            <p style={styles.loadingText}>
              Mohon tunggu sebentar...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <HRNavbar />

        <main style={styles.page}>
          <div style={styles.emptyWrapper}>
            <div style={styles.emptyIcon}>
              !
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "7px 12px",
                borderRadius: "999px",
                background: "#eaf2ff",
                color: "#0b4ea2",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Portal Human Resources
            </div>

            <h2 style={styles.emptyTitle}>
              Lowongan Tidak Ditemukan
            </h2>

            <p style={styles.emptyText}>
              Data lowongan yang ingin kamu lihat
              tidak tersedia.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/hr/dashboard")
              }
              style={styles.primaryButton}
            >
              ← Kembali ke Dashboard
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <HRNavbar />

      <main style={styles.page}>
        {/* ==================================================
            HERO
        ================================================== */}
        <section style={styles.hero}>
          <div style={styles.heroGlowOne} />
          <div style={styles.heroGlowTwo} />

          <div style={styles.heroInner}>
            <button
              type="button"
              onClick={() =>
                navigate("/hr/dashboard")
              }
              style={styles.backButton}
            >
              ← Kembali ke Dashboard
            </button>

            <div style={styles.heroContent}>
              <div style={styles.heroMain}>
                <div style={styles.eyebrow}>
                  PORTAL HUMAN RESOURCES
                </div>

                <div style={styles.badgeRow}>
                  <span style={styles.heroBadge}>
                    {job.division_name || "Lowongan"}
                  </span>

                  <span
                    style={{
                      ...styles.heroBadge,
                      background:
                        job.status === "OPEN"
                          ? "rgba(147,197,253,0.16)"
                          : "rgba(255,255,255,0.08)",
                      borderColor:
                        job.status === "OPEN"
                          ? "rgba(147,197,253,0.25)"
                          : "rgba(255,255,255,0.14)",
                    }}
                  >
                    {job.status || "-"}
                  </span>
                </div>

                <h1 style={styles.heroTitle}>
                  {job.position_name}
                </h1>

                <p style={styles.heroDescription}>
                  Kelola detail lowongan, pantau status
                  rekrutmen, dan lakukan tindakan
                  administrasi untuk posisi ini.
                </p>
              </div>

              <div style={styles.heroActions}>
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/hr/applications?job=${id}`
                    )
                  }
                  style={styles.heroSecondaryButton}
                >
                  Lihat Pelamar
                  <span>→</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/hr/jobs/${id}/edit`
                    )
                  }
                  style={styles.heroPrimaryButton}
                >
                  Edit Lowongan
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            CONTENT
        ================================================== */}
        <div style={styles.contentWrapper}>
          <div style={styles.contentGrid}>
            {/* ==================================================
                MAIN CONTENT
            ================================================== */}
            <section style={styles.mainColumn}>
              {/* INFORMATION */}
              <div style={styles.card}>
                <div style={styles.sectionHeader}>
                  <div style={styles.sectionAccent} />

                  <div>
                    <div style={styles.sectionEyebrow}>
                      INFORMASI LOWONGAN
                    </div>

                    <h2 style={styles.sectionTitle}>
                      Detail Posisi
                    </h2>
                  </div>
                </div>

                <div style={styles.infoGrid}>
                  <InfoItem
                    label="Divisi"
                    value={
                      job.division_name || "-"
                    }
                  />

                  <InfoItem
                    label="Posisi"
                    value={
                      job.position_name || "-"
                    }
                  />

                  <InfoItem
                    label="Penempatan"
                    value={
                      job.region_name || "-"
                    }
                  />

                  <InfoItem
                    label="Jenjang Pendidikan"
                    value={
                      job.education_level_name ||
                      "-"
                    }
                  />

                  <InfoItem
                    label="Kuota"
                    value={
                      job.quota ?? "-"
                    }
                  />

                  <InfoItem
                    label="Tanggal Dibuka"
                    value={formatDate(
                      job.open_date
                    )}
                  />

                  <InfoItem
                    label="Batas Pendaftaran"
                    value={formatDate(
                      job.deadline
                    )}
                  />

                  <InfoItem
                    label="Status"
                    value={
                      getStatusText(job.status)
                    }
                    highlight={
                      job.status === "OPEN"
                    }
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div style={styles.card}>
                <div style={styles.sectionHeader}>
                  <div style={styles.sectionAccent} />

                  <div>
                    <div style={styles.sectionEyebrow}>
                      DESKRIPSI
                    </div>

                    <h2 style={styles.sectionTitle}>
                      Tentang Posisi
                    </h2>
                  </div>
                </div>

                <div style={styles.textContent}>
                  {job.description ? (
                    job.description
                  ) : (
                    <span
                      style={styles.emptyContent}
                    >
                      Belum ada deskripsi untuk
                      lowongan ini.
                    </span>
                  )}
                </div>
              </div>

              {/* REQUIREMENTS */}
              <div style={styles.card}>
                <div style={styles.sectionHeader}>
                  <div style={styles.sectionAccent} />

                  <div>
                    <div style={styles.sectionEyebrow}>
                      KUALIFIKASI
                    </div>

                    <h2 style={styles.sectionTitle}>
                      Persyaratan
                    </h2>
                  </div>
                </div>

                <div style={styles.textContent}>
                  {job.requirements ? (
                    job.requirements
                  ) : (
                    <span
                      style={styles.emptyContent}
                    >
                      Belum ada persyaratan untuk
                      lowongan ini.
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* ==================================================
                SIDEBAR
            ================================================== */}
            <aside style={styles.sidebar}>
              {/* STATUS CARD */}
              <div style={styles.statusCard}>
                <div style={styles.statusEyebrow}>
                  STATUS LOWONGAN
                </div>

                <h2 style={styles.statusTitle}>
                  {getStatusLabel(job.status)}
                </h2>

                <div
                  style={{
                    ...styles.statusPill,
                    background:
                      job.status === "OPEN"
                        ? "#eaf2ff"
                        : "#f1f5f9",
                    color:
                      job.status === "OPEN"
                        ? "#0b4ea2"
                        : "#64748b",
                  }}
                >
                  <span
                    style={{
                      ...styles.statusDot,
                      background:
                        job.status === "OPEN"
                          ? "#0b4ea2"
                          : "#94a3b8",
                    }}
                  />

                  {job.status === "OPEN"
                    ? "LOWONGAN AKTIF"
                    : "LOWONGAN DITUTUP"}
                </div>

                <div style={styles.deadlineBox}>
                  <div style={styles.deadlineLabel}>
                    BATAS PENDAFTARAN
                  </div>

                  <div style={styles.deadlineValue}>
                    {formatDate(job.deadline)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/hr/applications?job=${id}`
                    )
                  }
                  style={styles.applicantButton}
                >
                  Lihat Pelamar
                  <span>→</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/hr/jobs/${id}/edit`
                    )
                  }
                  style={styles.editButton}
                >
                  Edit Lowongan
                </button>
              </div>

              {/* ACTION CARD */}
              <div style={styles.actionCard}>
                <div style={styles.actionEyebrow}>
                  AKSI LOWONGAN
                </div>

                <h3 style={styles.actionTitle}>
                  Kelola posisi ini
                </h3>

                <p style={styles.actionDescription}>
                  Lakukan perubahan informasi atau
                  hapus lowongan apabila sudah tidak
                  diperlukan.
                </p>

                <button
                  type="button"
                  onClick={handleDelete}
                  style={styles.deleteButton}
                >
                  Hapus Lowongan
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <style>
        {`
          * {
            box-sizing: border-box;
          }

          button {
            font-family: inherit;
          }

          @media (max-width: 1000px) {
            .hr-job-content-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 700px) {
            .hr-job-hero-inner {
              padding: 40px 20px 50px !important;
            }

            .hr-job-hero-content {
              flex-direction: column !important;
              align-items: stretch !important;
            }

            .hr-job-hero-actions {
              width: 100% !important;
            }

            .hr-job-hero-actions button {
              width: 100% !important;
            }

            .hr-job-info-grid {
              grid-template-columns: 1fr !important;
            }

            .hr-job-content-wrapper {
              padding: 24px 16px 60px !important;
            }

            .hr-job-title {
              font-size: 38px !important;
            }
          }

          @media (max-width: 480px) {
            .hr-job-title {
              font-size: 32px !important;
            }

            .hr-job-card {
              padding: 22px !important;
            }
          }
        `}
      </style>
    </>
  );
}

/* ============================================================
   INFO ITEM
============================================================ */

function InfoItem({
  label,
  value,
  highlight = false,
}) {
  return (
    <div style={styles.infoItem}>
      <div style={styles.infoLabel}>
        {label}
      </div>

      <div
        style={{
          ...styles.infoValue,
          color: highlight
            ? "#0b4ea2"
            : "#071a3d",
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f9",
    color: "#071a3d",
    paddingTop: "72px",
  },

  /* =========================
     LOADING
  ========================= */

  loadingWrapper: {
    minHeight: "calc(100vh - 72px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },

  loadingIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#eaf2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "18px",
  },

  loadingDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "#0b4ea2",
  },

  loadingTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
    color: "#071a3d",
  },

  loadingText: {
    margin: "8px 0 0",
    fontSize: "14px",
    color: "#64748b",
  },

  /* =========================
     EMPTY
  ========================= */

  emptyWrapper: {
    minHeight: "calc(100vh - 72px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "40px 24px",
  },

  emptyIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background: "#eaf2ff",
    color: "#0b4ea2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: 900,
    marginBottom: "20px",
  },

  emptyTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 800,
    color: "#071a3d",
  },

  emptyText: {
    margin: "10px 0 24px",
    maxWidth: "450px",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.7,
  },

  /* =========================
     HERO
  ========================= */

  hero: {
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(120deg, #061938 0%, #0a2f68 55%, #1457a6 100%)",
    color: "#ffffff",
  },

  heroGlowOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    border:
      "1px solid rgba(147,197,253,0.10)",
    top: "-280px",
    right: "-70px",
  },

  heroGlowTwo: {
    position: "absolute",
    width: "330px",
    height: "330px",
    borderRadius: "50%",
    border:
      "1px solid rgba(147,197,253,0.08)",
    bottom: "-260px",
    left: "-130px",
  },

  heroInner: {
    position: "relative",
    zIndex: 2,
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "40px 28px 72px",
  },

  backButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40px",
    padding: "0 15px",
    borderRadius: "9px",
    border:
      "1px solid rgba(255,255,255,0.20)",
    background:
      "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: "36px",
  },

  heroContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "50px",
  },

  heroMain: {
    maxWidth: "820px",
  },

  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    color: "#93c5fd",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.16em",
    marginBottom: "18px",
  },

  badgeRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "18px",
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 13px",
    borderRadius: "999px",
    background:
      "rgba(255,255,255,0.10)",
    border:
      "1px solid rgba(255,255,255,0.14)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 700,
  },

  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(40px, 5vw, 64px)",
    lineHeight: 1.02,
    fontWeight: 850,
    letterSpacing: "-0.04em",
  },

  heroDescription: {
    maxWidth: "720px",
    margin: "20px 0 0",
    color: "#dbeafe",
    fontSize: "15px",
    lineHeight: 1.75,
  },

  heroActions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "220px",
    flexShrink: 0,
  },

  heroSecondaryButton: {
    width: "100%",
    minHeight: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 18px",
    borderRadius: "10px",
    border:
      "1px solid rgba(255,255,255,0.20)",
    background:
      "rgba(255,255,255,0.07)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
  },

  heroPrimaryButton: {
    width: "100%",
    minHeight: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 18px",
    borderRadius: "10px",
    border: "none",
    background: "#ffffff",
    color: "#071a3d",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.14)",
  },

  /* =========================
     CONTENT
  ========================= */

  contentWrapper: {
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "28px 28px 70px",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.7fr) minmax(300px, 0.7fr)",
    gap: "22px",
    alignItems: "start",
  },

  mainColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "28px",
    boxShadow:
      "0 12px 35px rgba(15,23,42,0.05)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
    marginBottom: "24px",
  },

  sectionAccent: {
    width: "4px",
    minHeight: "42px",
    borderRadius: "999px",
    background:
      "linear-gradient(180deg, #0b4ea2, #60a5fa)",
    flexShrink: 0,
  },

  sectionEyebrow: {
    color: "#0b4ea2",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.14em",
    marginBottom: "4px",
  },

  sectionTitle: {
    margin: 0,
    color: "#071a3d",
    fontSize: "22px",
    lineHeight: 1.25,
    fontWeight: 800,
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },

  infoItem: {
    padding: "17px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
  },

  infoLabel: {
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "7px",
  },

  infoValue: {
    color: "#071a3d",
    fontSize: "14px",
    fontWeight: 750,
    lineHeight: 1.4,
  },

  textContent: {
    color: "#475569",
    fontSize: "14px",
    lineHeight: 1.85,
    whiteSpace: "pre-line",
  },

  emptyContent: {
    color: "#94a3b8",
    fontStyle: "italic",
  },

  /* =========================
     SIDEBAR
  ========================= */

  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    position: "sticky",
    top: "92px",
  },

  statusCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "24px",
    boxShadow:
      "0 12px 35px rgba(15,23,42,0.06)",
  },

  statusEyebrow: {
    display: "inline-flex",
    alignItems: "center",
    padding: "7px 11px",
    borderRadius: "8px",
    background: "#eaf2ff",
    color: "#0b4ea2",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.10em",
    marginBottom: "15px",
  },

  statusTitle: {
    margin: 0,
    color: "#071a3d",
    fontSize: "21px",
    lineHeight: 1.3,
    fontWeight: 800,
  },

  statusPill: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    marginTop: "18px",
    minHeight: "44px",
    padding: "0 14px",
    borderRadius: "11px",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.04em",
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },

  deadlineBox: {
    marginTop: "12px",
    padding: "16px",
    borderRadius: "12px",
    background: "#f1f6fd",
    border: "1px solid #dbeafe",
  },

  deadlineLabel: {
    color: "#64748b",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    marginBottom: "7px",
  },

  deadlineValue: {
    color: "#071a3d",
    fontSize: "15px",
    fontWeight: 800,
  },

  applicantButton: {
    width: "100%",
    minHeight: "48px",
    marginTop: "14px",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(90deg, #071a3d, #1457a6)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow:
      "0 10px 24px rgba(11,78,162,0.18)",
  },

  editButton: {
    width: "100%",
    minHeight: "46px",
    marginTop: "9px",
    borderRadius: "10px",
    border: "1px solid #dbe3ee",
    background: "#ffffff",
    color: "#0b4ea2",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
  },

  actionCard: {
    background: "#071a3d",
    borderRadius: "18px",
    padding: "24px",
    color: "#ffffff",
    boxShadow:
      "0 14px 35px rgba(7,26,61,0.14)",
  },

  actionEyebrow: {
    color: "#93c5fd",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.12em",
    marginBottom: "10px",
  },

  actionTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "19px",
    fontWeight: 800,
  },

  actionDescription: {
    margin: "9px 0 18px",
    color: "#bfdbfe",
    fontSize: "13px",
    lineHeight: 1.65,
  },

  deleteButton: {
    width: "100%",
    minHeight: "44px",
    borderRadius: "9px",
    border:
      "1px solid rgba(255,255,255,0.15)",
    background:
      "rgba(255,255,255,0.07)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 750,
    cursor: "pointer",
  },

  primaryButton: {
    minHeight: "46px",
    padding: "0 18px",
    borderRadius: "10px",
    border: "none",
    background:
      "linear-gradient(90deg, #071a3d, #1457a6)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
  },
};

export default HRJobDetail;