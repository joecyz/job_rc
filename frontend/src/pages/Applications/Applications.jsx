import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getMyApplications } from "../../services/applicationService";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNotes, setSelectedNotes] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyApplications();

      console.log("APPLICATION DATA:", data);

      if (Array.isArray(data.results)) {
        setApplications(data.results);
      } else if (Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error(
        "APPLICATION ERROR:",
        error.response?.data || error
      );

      if (error.response?.status === 403) {
        setError(
          "Kamu tidak memiliki akses untuk melihat history lamaran."
        );
      } else {
        setError("Gagal mengambil history lamaran.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPLIED":
        return {
          background: "#edf4ff",
          color: "#0b4ea2",
          border: "1px solid #c9dcf5",
        };

      case "SCREENING":
        return {
          background: "#eaf2ff",
          color: "#1457a6",
          border: "1px solid #bfd5f5",
        };

      case "INTERVIEW":
        return {
          background: "#f1edff",
          color: "#6546a5",
          border: "1px solid #d9cff7",
        };

      case "ACCEPTED":
        return {
          background: "#e7f7ee",
          color: "#18734a",
          border: "1px solid #b9e5cc",
        };

      case "REJECTED":
        return {
          background: "#fff0f0",
          color: "#b42318",
          border: "1px solid #f2c1c1",
        };

      default:
        return {
          background: "#f2f4f7",
          color: "#475467",
          border: "1px solid #d0d5dd",
        };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "APPLIED":
        return "Applied";

      case "SCREENING":
        return "Screening";

      case "INTERVIEW":
        return "Interview";

      case "ACCEPTED":
        return "Accepted";

      case "REJECTED":
        return "Rejected";

      default:
        return status || "-";
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={styles.page}>
          <section style={styles.hero}>
            <div style={styles.heroGlow}></div>

            <div style={styles.heroContent}>
              <div style={styles.heroEyebrow}>
                BSU CAREER
              </div>

              <h1 style={styles.heroTitle}>
                My Applications
              </h1>

              <p style={styles.heroDescription}>
                Pantau perkembangan setiap lamaran pekerjaan
                kamu di Bintang Sayap Utama.
              </p>
            </div>
          </section>

          <div style={styles.loadingBox}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>
              Loading applications...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={styles.page}>
        {/* =========================
            HERO
        ========================= */}
        <section style={styles.hero}>
          <div style={styles.heroGlow}></div>

          <div style={styles.heroContent}>
            <div style={styles.heroEyebrow}>
              BSU CAREER
            </div>

            <h1 style={styles.heroTitle}>
              My Applications
            </h1>

            <p style={styles.heroDescription}>
              Pantau perkembangan setiap lamaran pekerjaan
              kamu di Bintang Sayap Utama.
            </p>
          </div>

          <div style={styles.heroVisual}>
            <div style={styles.visualLine}></div>
            <div style={styles.visualCircle}></div>
            <div style={styles.visualCircleSmall}></div>
          </div>
        </section>

        {/* =========================
            CONTENT
        ========================= */}
        <main style={styles.content}>
          {/* SUMMARY */}
          {!error && (
            <section style={styles.summary}>
              <div style={styles.summaryMain}>
                <div style={styles.summaryIcon}>
                  <span>✓</span>
                </div>

                <div>
                  <div style={styles.summaryLabel}>
                    TOTAL LAMARAN
                  </div>

                  <div style={styles.summaryNumber}>
                    {applications.length}
                  </div>
                </div>
              </div>

              <div style={styles.summaryDivider}></div>

              <div style={styles.summaryDescription}>
                <strong>
                  {applications.length === 0
                    ? "Belum ada lamaran"
                    : "Riwayat lamaran kamu"}
                </strong>

                <span>
                  Semua aplikasi pekerjaan yang sudah
                  kamu ajukan melalui BSU Career.
                </span>
              </div>
            </section>
          )}

          {/* ERROR */}
          {error && (
            <section style={styles.errorBox}>
              <div style={styles.errorIcon}>!</div>

              <div style={styles.errorContent}>
                <div style={styles.errorTitle}>
                  Terjadi Kesalahan
                </div>

                <div style={styles.errorText}>
                  {error}
                </div>
              </div>
            </section>
          )}

          {/* EMPTY */}
          {!error && applications.length === 0 && (
            <section style={styles.emptyBox}>
              <div style={styles.emptyIcon}>
                <span>📄</span>
              </div>

              <div style={styles.emptyEyebrow}>
                APPLICATION HISTORY
              </div>

              <h2 style={styles.emptyTitle}>
                Belum Ada Lamaran
              </h2>

              <p style={styles.emptyText}>
                Kamu belum mengajukan lamaran pekerjaan.
                Temukan posisi yang sesuai dan mulai
                perjalanan kariermu bersama BSU.
              </p>
            </section>
          )}

          {/* APPLICATION LIST */}
          {!error && applications.length > 0 && (
            <section>
              <div style={styles.sectionHeader}>
                <div>
                  <div style={styles.sectionEyebrow}>
                    APPLICATION HISTORY
                  </div>

                  <h2 style={styles.sectionTitle}>
                    Lamaran Saya
                  </h2>
                </div>

                <div style={styles.applicationCount}>
                  {applications.length} Lamaran
                </div>
              </div>

              <div style={styles.applicationList}>
                {applications.map((application, index) => (
                  <article
                    key={application.id}
                    style={styles.applicationCard}
                  >
                    {/* CARD HEADER */}
                    <div style={styles.cardHeader}>
                      <div style={styles.cardIdentity}>
                        <div style={styles.cardNumber}>
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div style={styles.cardTitleWrapper}>
                          <div style={styles.cardEyebrow}>
                            JOB APPLICATION
                          </div>

                          <h3 style={styles.jobTitle}>
                            {application.job_title}
                          </h3>
                        </div>
                      </div>

                      <span
                        style={{
                          ...styles.statusBadge,
                          ...getStatusStyle(
                            application.status
                          ),
                        }}
                      >
                        <span style={styles.statusDot}></span>

                        {getStatusLabel(
                          application.status
                        )}
                      </span>
                    </div>

                    {/* INFO */}
                    <div style={styles.infoGrid}>
                      <div style={styles.infoItem}>
                        <div style={styles.infoIcon}>
                          ▦
                        </div>

                        <div>
                          <div style={styles.infoLabel}>
                            DIVISION
                          </div>

                          <div style={styles.infoValue}>
                            {application.division_name ||
                              "-"}
                          </div>
                        </div>
                      </div>

                      <div style={styles.infoItem}>
                        <div style={styles.infoIcon}>
                          ◉
                        </div>

                        <div>
                          <div style={styles.infoLabel}>
                            REGION
                          </div>

                          <div style={styles.infoValue}>
                            {application.region_name ||
                              "-"}
                          </div>
                        </div>
                      </div>

                      <div style={styles.infoItem}>
                        <div style={styles.infoIcon}>
                          ◷
                        </div>

                        <div>
                          <div style={styles.infoLabel}>
                            APPLIED AT
                          </div>

                          <div style={styles.infoValue}>
                            {formatDate(
                              application.applied_at
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div style={styles.cardFooter}>
                      <div style={styles.statusProgress}>
                        <div style={styles.progressLabel}>
                          APPLICATION STATUS
                        </div>

                        <div style={styles.progressRow}>
                          <div
                            style={{
                              ...styles.progressBar,
                            }}
                          >
                            <div
                              style={{
                                ...styles.progressFill,
                                width:
                                  application.status ===
                                  "APPLIED"
                                    ? "20%"
                                    : application.status ===
                                      "SCREENING"
                                    ? "40%"
                                    : application.status ===
                                      "INTERVIEW"
                                    ? "65%"
                                    : application.status ===
                                      "ACCEPTED"
                                    ? "100%"
                                    : application.status ===
                                      "REJECTED"
                                    ? "100%"
                                    : "20%",
                              }}
                            ></div>
                          </div>

                          <span style={styles.progressStatus}>
                            {getStatusLabel(
                              application.status
                            )}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedNotes(
                            application.hr_notes
                          )
                        }
                        style={styles.notesButton}
                      >
                        <span style={styles.notesIcon}>
                          💬
                        </span>

                        <span>HR Notes</span>

                        <span style={styles.arrow}>
                          →
                        </span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* =========================
            NOTES MODAL
        ========================= */}
        {selectedNotes !== null && (
          <div
            onClick={() => setSelectedNotes(null)}
            style={styles.modalOverlay}
          >
            <div
              onClick={(event) =>
                event.stopPropagation()
              }
              style={styles.modal}
            >
              <div style={styles.modalHeader}>
                <div>
                  <div style={styles.modalEyebrow}>
                    APPLICATION
                  </div>

                  <h2 style={styles.modalTitle}>
                    HR Notes
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedNotes(null)
                  }
                  style={styles.closeButton}
                >
                  ×
                </button>
              </div>

              <div style={styles.modalDivider}></div>

              <div style={styles.notesBox}>
                <div style={styles.notesBoxLabel}>
                  CATATAN DARI HR
                </div>

                <div style={styles.notesContent}>
                  {selectedNotes
                    ? selectedNotes
                    : "Belum ada catatan dari HR."}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedNotes(null)
                }
                style={styles.modalCloseButton}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f9",
    color: "#071a3d",
  },

  /* =========================
      HERO
  ========================= */

  hero: {
    position: "relative",
    overflow: "hidden",
    minHeight: "265px",
    background:
      "linear-gradient(135deg, #071a3d 0%, #0b4ea2 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    padding: "55px 7%",
    boxSizing: "border-box",
  },

  heroContent: {
    position: "relative",
    zIndex: 3,
    maxWidth: "720px",
  },

  heroEyebrow: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 11px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.15)",
    fontSize: "10px",
    fontWeight: 900,
    letterSpacing: "1.8px",
    color: "#dce8f8",
    marginBottom: "14px",
  },

  heroTitle: {
    margin: 0,
    fontSize: "44px",
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-1.5px",
  },

  heroDescription: {
    margin: "15px 0 0",
    maxWidth: "600px",
    fontSize: "15px",
    lineHeight: 1.7,
    color: "#dce8f8",
  },

  heroGlow: {
    position: "absolute",
    width: "430px",
    height: "430px",
    borderRadius: "50%",
    right: "-180px",
    top: "-120px",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow:
      "0 0 0 80px rgba(255,255,255,0.025), 0 0 0 160px rgba(255,255,255,0.018)",
  },

  heroVisual: {
    position: "absolute",
    right: "7%",
    top: 0,
    width: "300px",
    height: "100%",
    pointerEvents: "none",
  },

  visualLine: {
    position: "absolute",
    width: "190px",
    height: "1px",
    background: "rgba(255,255,255,0.12)",
    transform: "rotate(-35deg)",
    right: "20px",
    top: "80px",
  },

  visualCircle: {
    position: "absolute",
    width: "145px",
    height: "145px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.12)",
    right: "30px",
    bottom: "-30px",
  },

  visualCircleSmall: {
    position: "absolute",
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    right: "130px",
    top: "48px",
  },

  /* =========================
      CONTENT
  ========================= */

  content: {
    width: "100%",
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "38px 24px 70px",
    boxSizing: "border-box",
  },

  /* =========================
      SUMMARY
  ========================= */

  summary: {
    display: "flex",
    alignItems: "center",
    gap: "26px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "21px 25px",
    marginBottom: "38px",
    boxShadow:
      "0 8px 24px rgba(7,26,61,0.045)",
  },

  summaryMain: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    minWidth: "180px",
  },

  summaryIcon: {
    width: "43px",
    height: "43px",
    borderRadius: "11px",
    background: "#edf4ff",
    color: "#0b4ea2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: 900,
  },

  summaryLabel: {
    fontSize: "9px",
    fontWeight: 900,
    letterSpacing: "1.5px",
    color: "#64748b",
    marginBottom: "2px",
  },

  summaryNumber: {
    fontSize: "29px",
    lineHeight: 1,
    fontWeight: 900,
    color: "#071a3d",
  },

  summaryDivider: {
    width: "1px",
    height: "38px",
    background: "#e2e8f0",
  },

  summaryDescription: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    fontSize: "12px",
    color: "#64748b",
    lineHeight: 1.5,
  },

  summaryDescriptionStrong: {
    color: "#071a3d",
  },

  /* =========================
      ERROR
  ========================= */

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "#fff5f5",
    border: "1px solid #f2c1c1",
    borderRadius: "13px",
    padding: "18px 20px",
    marginBottom: "30px",
  },

  errorIcon: {
    width: "36px",
    height: "36px",
    flexShrink: 0,
    borderRadius: "50%",
    background: "#fee2e2",
    color: "#b42318",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },

  errorContent: {
    minWidth: 0,
  },

  errorTitle: {
    fontSize: "14px",
    fontWeight: 800,
    color: "#842029",
    marginBottom: "3px",
  },

  errorText: {
    fontSize: "13px",
    color: "#9b3030",
    lineHeight: 1.5,
  },

  /* =========================
      EMPTY
  ========================= */

  emptyBox: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "17px",
    padding: "72px 30px",
    textAlign: "center",
    boxShadow:
      "0 8px 25px rgba(7,26,61,0.035)",
  },

  emptyIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "16px",
    background: "#edf4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 17px",
    fontSize: "25px",
  },

  emptyEyebrow: {
    fontSize: "9px",
    fontWeight: 900,
    letterSpacing: "1.5px",
    color: "#0b4ea2",
    marginBottom: "7px",
  },

  emptyTitle: {
    margin: "0 0 8px",
    fontSize: "23px",
    fontWeight: 900,
    color: "#071a3d",
  },

  emptyText: {
    maxWidth: "480px",
    margin: "0 auto",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.7,
  },

  /* =========================
      SECTION
  ========================= */

  sectionHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "17px",
  },

  sectionEyebrow: {
    fontSize: "9px",
    fontWeight: 900,
    letterSpacing: "1.6px",
    color: "#0b4ea2",
    marginBottom: "5px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 900,
    letterSpacing: "-0.5px",
    color: "#071a3d",
  },

  applicationCount: {
    fontSize: "11px",
    fontWeight: 800,
    color: "#475569",
    background: "#ffffff",
    border: "1px solid #dce3ed",
    borderRadius: "999px",
    padding: "8px 13px",
  },

  applicationList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  /* =========================
      APPLICATION CARD
  ========================= */

  applicationCard: {
    position: "relative",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "22px",
    boxShadow:
      "0 6px 20px rgba(7,26,61,0.035)",
    transition: "all 0.2s ease",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
  },

  cardIdentity: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    minWidth: 0,
  },

  cardNumber: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    borderRadius: "11px",
    background: "#edf4ff",
    color: "#0b4ea2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 900,
  },

  cardTitleWrapper: {
    minWidth: 0,
  },

  cardEyebrow: {
    fontSize: "8px",
    fontWeight: 900,
    letterSpacing: "1.3px",
    color: "#94a3b8",
    marginBottom: "3px",
  },

  jobTitle: {
    margin: 0,
    fontSize: "20px",
    lineHeight: 1.3,
    fontWeight: 900,
    color: "#071a3d",
    wordBreak: "break-word",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    flexShrink: 0,
    padding: "7px 11px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: 900,
  },

  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "currentColor",
  },

  /* =========================
      INFO
  ========================= */

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "12px",
    marginTop: "20px",
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    background: "#f8fafc",
    border: "1px solid #eef2f6",
    borderRadius: "11px",
    padding: "12px 13px",
    minWidth: 0,
  },

  infoIcon: {
    width: "30px",
    height: "30px",
    flexShrink: 0,
    borderRadius: "8px",
    background: "#edf4ff",
    color: "#0b4ea2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 900,
  },

  infoLabel: {
    fontSize: "8px",
    fontWeight: 900,
    letterSpacing: "1.1px",
    color: "#94a3b8",
    marginBottom: "4px",
  },

  infoValue: {
    fontSize: "12px",
    fontWeight: 750,
    color: "#334155",
    lineHeight: 1.4,
    wordBreak: "break-word",
  },

  /* =========================
      FOOTER
  ========================= */

  cardFooter: {
    marginTop: "18px",
    paddingTop: "15px",
    borderTop: "1px solid #edf0f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },

  statusProgress: {
    flex: 1,
    minWidth: 0,
  },

  progressLabel: {
    fontSize: "8px",
    fontWeight: 900,
    letterSpacing: "1px",
    color: "#94a3b8",
    marginBottom: "7px",
  },

  progressRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  progressBar: {
    width: "150px",
    maxWidth: "35%",
    height: "5px",
    borderRadius: "999px",
    background: "#e7edf5",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg, #0b4ea2, #1457a6)",
    transition: "width 0.3s ease",
  },

  progressStatus: {
    fontSize: "11px",
    fontWeight: 800,
    color: "#0b4ea2",
  },

  notesButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "1px solid #d7e0eb",
    background: "#ffffff",
    color: "#071a3d",
    padding: "9px 13px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "11px",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },

  notesIcon: {
    fontSize: "12px",
  },

  arrow: {
    color: "#0b4ea2",
    fontSize: "14px",
    marginLeft: "1px",
  },

  /* =========================
      LOADING
  ========================= */

  loadingBox: {
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "75px 24px",
    textAlign: "center",
  },

  loadingSpinner: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "3px solid #dce6f4",
    borderTop: "3px solid #0b4ea2",
    margin: "0 auto 15px",
    animation: "spin 0.8s linear infinite",
  },

  loadingText: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  /* =========================
      MODAL
  ========================= */

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(3, 13, 31, 0.70)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
    boxSizing: "border-box",
    backdropFilter: "blur(4px)",
  },

  modal: {
    width: "100%",
    maxWidth: "520px",
    background: "#ffffff",
    borderRadius: "17px",
    padding: "26px",
    boxSizing: "border-box",
    boxShadow:
      "0 25px 70px rgba(0,0,0,0.25)",
  },

  modalHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "15px",
  },

  modalEyebrow: {
    fontSize: "9px",
    fontWeight: 900,
    letterSpacing: "1.4px",
    color: "#0b4ea2",
    marginBottom: "5px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#071a3d",
    fontWeight: 900,
  },

  closeButton: {
    width: "33px",
    height: "33px",
    border: "none",
    borderRadius: "9px",
    background: "#f1f4f8",
    color: "#52627a",
    fontSize: "21px",
    lineHeight: 1,
    cursor: "pointer",
  },

  modalDivider: {
    height: "1px",
    background: "#e8edf3",
    margin: "20px 0",
  },

  notesBox: {
    background: "#f7f9fc",
    border: "1px solid #e1e7ef",
    borderRadius: "11px",
    padding: "17px",
  },

  notesBoxLabel: {
    fontSize: "9px",
    fontWeight: 900,
    letterSpacing: "1.2px",
    color: "#8491a5",
    marginBottom: "10px",
  },

  notesContent: {
    minHeight: "90px",
    color: "#344054",
    fontSize: "14px",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  },

  modalCloseButton: {
    display: "block",
    width: "100%",
    marginTop: "18px",
    padding: "12px",
    border: "none",
    borderRadius: "9px",
    background: "#071a3d",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "13px",
  },
};

export default Applications;  