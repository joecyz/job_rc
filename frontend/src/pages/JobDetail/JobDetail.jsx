import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import { getJobDetail } from "../../services/jobService";
import { applyJob } from "../../services/applicationService";
import { checkProfileCompletion } from "../../services/profileService";

import { useToast } from "../../components/Toast/ToastProvider";

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);
  const [applying, setApplying] = useState(false);

  // ==================================================
  // LOAD JOB DETAIL
  // ==================================================

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getJobDetail(id);

      setJob(data);
    } catch (error) {
      console.error(
        "GET JOB DETAIL ERROR:",
        error?.response?.data || error
      );

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Gagal mengambil detail lowongan.";

      setErrorMessage(message);

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // APPLY JOB
  // ==================================================

  const handleApply = async () => {
    const token = localStorage.getItem("access_token");

    // BELUM LOGIN
    if (!token) {
      localStorage.setItem(
        "redirect_after_login",
        `/jobs/${id}`
      );

      navigate("/login");
      return;
    }

    try {
      const completion = await checkProfileCompletion();

      if (!completion.isComplete) {
        const missing = [];

        if (!completion.profile) {
          missing.push("Profile");
        }

        if (!completion.education) {
          missing.push("Education");
        }

        if (!completion.document) {
          missing.push("Documents");
        }

        showToast(
          `Lengkapi ${missing.join(
            ", "
          )} terlebih dahulu sebelum melamar.`,
          "warning"
        );

        localStorage.setItem(
          "pending_apply_job",
          String(id)
        );

        navigate("/profile");
        return;
      }

      setShowApplyConfirm(true);
    } catch (error) {
      console.error("APPLY ERROR:", error);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Terjadi kesalahan.";

      showToast(message, "error");
    }
  };

  const handleConfirmApply = async () => {
    try {
      setApplying(true);

      await applyJob(id);

      setShowApplyConfirm(false);

      showToast(
        "Lamaran berhasil dikirim!",
        "success"
      );

      fetchJob();
    } catch (error) {
      console.error("APPLY ERROR:", error);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Terjadi kesalahan saat melamar.";

      showToast(message, "error");
    } finally {
      setApplying(false);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <MainLayout>
        <div
          style={{
            minHeight: "calc(100vh - 80px)",
            background: "#f4f6f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
          }}
        >
          <div
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                border: "4px solid #dbeafe",
                borderTop: "4px solid #0b4ea2",
                borderRadius: "50%",
                margin: "0 auto 18px",
                animation:
                  "jobDetailSpin 1s linear infinite",
              }}
            />

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Memuat detail lowongan...
            </p>
          </div>
        </div>

        <style>
          {`
            @keyframes jobDetailSpin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </MainLayout>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (!job) {
    return (
      <MainLayout>
        <div
          style={{
            minHeight: "calc(100vh - 80px)",
            background: "#f4f6f9",
            padding: "60px 20px",
          }}
        >
          <div
            style={{
              maxWidth: "620px",
              margin: "0 auto",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "50px 30px",
              textAlign: "center",
              boxShadow:
                "0 10px 30px rgba(7,26,61,0.06)",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "18px",
                background: "#fef2f2",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                fontSize: "25px",
                fontWeight: 800,
              }}
            >
              !
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                color: "#071a3d",
                fontSize: "24px",
                fontWeight: 800,
              }}
            >
              Lowongan Tidak Ditemukan
            </h2>

            <p
              style={{
                margin: "0 0 24px",
                color: "#64748b",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              {errorMessage ||
                "Detail lowongan tidak tersedia."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/jobs")}
              style={{
                padding: "12px 22px",
                border: "none",
                borderRadius: "9px",
                background: "#071a3d",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ← Kembali ke Jobs
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ==================================================
  // JOB STATUS
  // ==================================================

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(
    `${job.deadline}T00:00:00`
  );

  deadline.setHours(0, 0, 0, 0);

  const isClosed = job.status !== "OPEN";
  const isExpired = deadline < today;
  const isFull = job.is_full === true;
  const hasApplied = job.has_applied === true;

  let statusLabel = "OPEN";
  let statusBackground = "#eaf2fb";
  let statusColor = "#1457a6";

  if (hasApplied) {
    statusLabel = "SUDAH MELAMAR";
    statusBackground = "#dcfce7";
    statusColor = "#166534";
  } else if (isClosed) {
    statusLabel = "CLOSED";
    statusBackground = "#f1f5f9";
    statusColor = "#64748b";
  } else if (isFull) {
    statusLabel = "QUOTA PENUH";
    statusBackground = "#f1f5f9";
    statusColor = "#64748b";
  } else if (isExpired) {
    statusLabel = "BERAKHIR";
    statusBackground = "#fef2f2";
    statusColor = "#dc2626";
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <MainLayout>
      <div
        style={{
          minHeight: "100vh",
          background: "#f4f6f9",
          paddingBottom: "90px",
        }}
      >
        {/* ==================================================
            HERO
        ================================================== */}

        <section
          style={{
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #071a3d 0%, #0b4ea2 100%)",
            color: "#ffffff",
            padding: "55px 24px 95px",
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              width: "360px",
              height: "360px",
              borderRadius: "50%",
              background:
                "rgba(255,255,255,0.05)",
              top: "-230px",
              right: "-80px",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "230px",
              height: "230px",
              borderRadius: "50%",
              background:
                "rgba(20,87,166,0.28)",
              bottom: "-170px",
              left: "-70px",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "1100px",
              margin: "0 auto",
            }}
          >
            {/* BACK */}
            <button
              type="button"
              onClick={() => navigate("/jobs")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 14px",
                marginBottom: "28px",
                border:
                  "1px solid rgba(255,255,255,0.2)",
                borderRadius: "9px",
                background:
                  "rgba(255,255,255,0.08)",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 700,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.08)";
              }}
            >
              ← Kembali ke Jobs
            </button>

            <div
              style={{
                maxWidth: "820px",
              }}
            >
              {/* BADGES */}
              <div
                style={{
                  display: "flex",
                  gap: "9px",
                  flexWrap: "wrap",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "7px 12px",
                    borderRadius: "999px",
                    background:
                      "rgba(255,255,255,0.12)",
                    border:
                      "1px solid rgba(255,255,255,0.12)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.3px",
                  }}
                >
                  {job.division_name ||
                    "GENERAL"}
                </span>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "7px 12px",
                    borderRadius: "999px",
                    background:
                      "rgba(255,255,255,0.12)",
                    border:
                      "1px solid rgba(255,255,255,0.12)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {statusLabel}
                </span>
              </div>

              <h1
                style={{
                  margin: "0 0 14px",
                  fontSize:
                    "clamp(32px, 5vw, 52px)",
                  lineHeight: 1.08,
                  fontWeight: 800,
                  letterSpacing: "-1.2px",
                }}
              >
                {job.position_name ||
                  "Lowongan"}
              </h1>

              <p
                style={{
                  margin: 0,
                  maxWidth: "720px",
                  color:
                    "rgba(255,255,255,0.78)",
                  fontSize: "15px",
                  lineHeight: 1.7,
                }}
              >
                Bergabung bersama PT Bintang
                Sayap Utama dan berkembang
                bersama tim kami.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <main
          style={{
            maxWidth: "1100px",
            margin: "-48px auto 0",
            padding: "0 20px",
            position: "relative",
            zIndex: 5,
            boxSizing: "border-box",
          }}
        >
          <div
            className="job-detail-layout"
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1fr) 330px",
              gap: "22px",
              alignItems: "start",
            }}
          >
            {/* ==================================================
                LEFT CONTENT
            ================================================== */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {/* JOB INFORMATION */}
              <section
                style={{
                  background: "#ffffff",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius: "17px",
                  padding: "26px",
                  boxShadow:
                    "0 7px 25px rgba(7,26,61,0.055)",
                }}
              >
                <SectionHeading>
                  Informasi Lowongan
                </SectionHeading>

                <div
                  className="job-info-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, minmax(0, 1fr))",
                    gap: "11px",
                  }}
                >
                  {[
                    {
                      label: "Division",
                      value:
                        job.division_name ||
                        "-",
                    },
                    {
                      label: "Position",
                      value:
                        job.position_name ||
                        "-",
                    },
                    {
                      label: "Penempatan",
                      value:
                        job.region_name ||
                        "-",
                    },
                    {
                      label: "Jenjang Pendidikan",
                      value:
                        job.education_level_name ||
                        job.education_level ||
                        "-",
                    },
                    {
                      label: "Quota",
                      value:
                        job.quota ?? "-",
                    },
                    {
                      label: "Open Date",
                      value:
                        job.open_date ||
                        "-",
                    },
                    {
                      label: "Deadline",
                      value:
                        job.deadline ||
                        "-",
                    },
                    {
                      label: "Status",
                      value:
                        job.status ||
                        "-",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        padding: "14px",
                        borderRadius: "11px",
                        background:
                          "#f8fafc",
                        border:
                          "1px solid #e8edf3",
                      }}
                    >
                      <div
                        style={{
                          marginBottom: "5px",
                          color: "#94a3b8",
                          fontSize: "9px",
                          fontWeight: 800,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.5px",
                        }}
                      >
                        {item.label}
                      </div>

                      <div
                        style={{
                          color: "#334155",
                          fontSize: "13px",
                          lineHeight: 1.4,
                          fontWeight: 700,
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* DESCRIPTION */}
              <section
                style={{
                  background: "#ffffff",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius: "17px",
                  padding: "26px",
                  boxShadow:
                    "0 7px 25px rgba(7,26,61,0.055)",
                }}
              >
                <SectionHeading>
                  Description
                </SectionHeading>

                <p
                  style={{
                    margin: 0,
                    color: "#475569",
                    fontSize: "14px",
                    lineHeight: 1.85,
                    whiteSpace: "pre-line",
                  }}
                >
                  {job.description ||
                    "Tidak ada deskripsi."}
                </p>
              </section>

              {/* REQUIREMENTS */}
              <section
                style={{
                  background: "#ffffff",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius: "17px",
                  padding: "26px",
                  boxShadow:
                    "0 7px 25px rgba(7,26,61,0.055)",
                }}
              >
                <SectionHeading>
                  Requirements
                </SectionHeading>

                <p
                  style={{
                    margin: 0,
                    color: "#475569",
                    fontSize: "14px",
                    lineHeight: 1.85,
                    whiteSpace: "pre-line",
                  }}
                >
                  {job.requirements ||
                    "Tidak ada requirements."}
                </p>
              </section>
            </div>

            {/* ==================================================
                RIGHT APPLY CARD
            ================================================== */}

            <aside
              style={{
                position: "sticky",
                top: "92px",
                background: "#ffffff",
                border:
                  "1px solid #e2e8f0",
                borderRadius: "17px",
                padding: "24px",
                boxShadow:
                  "0 10px 30px rgba(7,26,61,0.08)",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  background: "#eaf2fb",
                  color: "#0b4ea2",
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                  marginBottom: "12px",
                }}
              >
                STATUS LOWONGAN
              </div>

              <h2
                style={{
                  margin: "0 0 16px",
                  color: "#071a3d",
                  fontSize: "21px",
                  lineHeight: 1.3,
                  fontWeight: 800,
                }}
              >
                {hasApplied
                  ? "Lamaran Sudah Dikirim"
                  : isClosed
                  ? "Lowongan Ditutup"
                  : isFull
                  ? "Quota Sudah Penuh"
                  : isExpired
                  ? "Masa Lamaran Berakhir"
                  : "Lowongan Masih Terbuka"}
              </h2>

              {/* STATUS */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  padding: "12px 13px",
                  borderRadius: "10px",
                  background:
                    statusBackground,
                  color: statusColor,
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: statusColor,
                    flexShrink: 0,
                  }}
                />

                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                  }}
                >
                  {statusLabel}
                </span>
              </div>

              {/* DEADLINE */}
              <div
                style={{
                  padding: "15px",
                  borderRadius: "11px",
                  background: "#eaf2fb",
                  border:
                    "1px solid #d7e7f8",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "9px",
                    fontWeight: 800,
                    letterSpacing: "0.5px",
                    marginBottom: "6px",
                  }}
                >
                  DEADLINE PENDAFTARAN
                </div>

                <div
                  style={{
                    color: "#071a3d",
                    fontSize: "17px",
                    fontWeight: 800,
                  }}
                >
                  {job.deadline || "-"}
                </div>
              </div>

              {/* APPLY BUTTON */}
              {hasApplied ? (
                <button
                  type="button"
                  disabled
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#dcfce7",
                    color: "#166534",
                    fontWeight: 800,
                    cursor: "not-allowed",
                    fontSize: "14px",
                  }}
                >
                  ✓ Sudah Melamar
                </button>
              ) : isClosed ? (
                <button
                  type="button"
                  disabled
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#eef2f7",
                    color: "#64748b",
                    fontWeight: 800,
                    cursor: "not-allowed",
                    fontSize: "14px",
                  }}
                >
                  Job Closed
                </button>
              ) : isFull ? (
                <button
                  type="button"
                  disabled
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#eef2f7",
                    color: "#64748b",
                    fontWeight: 800,
                    cursor: "not-allowed",
                    fontSize: "14px",
                  }}
                >
                  Quota Reached
                </button>
              ) : isExpired ? (
                <button
                  type="button"
                  disabled
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#fef2f2",
                    color: "#dc2626",
                    fontWeight: 800,
                    cursor: "not-allowed",
                    fontSize: "14px",
                  }}
                >
                  Application Closed
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleApply}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#0b4ea2",
                    color: "#ffffff",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontSize: "14px",
                    boxShadow:
                      "0 8px 18px rgba(11,78,162,0.20)",
                    transition:
                      "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "#071a3d";
                    e.currentTarget.style.transform =
                      "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "#0b4ea2";
                    e.currentTarget.style.transform =
                      "translateY(0)";
                  }}
                >
                  Apply Now →
                </button>
              )}

              <p
                style={{
                  margin: "14px 0 0",
                  color: "#94a3b8",
                  fontSize: "11px",
                  lineHeight: 1.65,
                  textAlign: "center",
                }}
              >
                Pastikan profile, education,
                dan dokumen kamu sudah lengkap
                sebelum melamar.
              </p>

              {/* QUICK INFO */}
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "18px",
                  borderTop:
                    "1px solid #eef2f7",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: "12px",
                    paddingBottom: "11px",
                    marginBottom: "11px",
                    borderBottom:
                      "1px solid #f1f5f9",
                  }}
                >
                  <span
                    style={{
                      color: "#94a3b8",
                      fontSize: "11px",
                    }}
                  >
                    Penempatan
                  </span>

                  <strong
                    style={{
                      color: "#334155",
                      fontSize: "11px",
                      textAlign: "right",
                    }}
                  >
                    {job.region_name ||
                      "-"}
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      color: "#94a3b8",
                      fontSize: "11px",
                    }}
                  >
                    Quota
                  </span>

                  <strong
                    style={{
                      color: "#334155",
                      fontSize: "11px",
                    }}
                  >
                    {job.quota ?? "-"}
                  </strong>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>


      {/* ==================================================
          APPLY CONFIRMATION MODAL
      ================================================== */}
      {showApplyConfirm && (
        <div
          onClick={() => {
            if (!applying) {
              setShowApplyConfirm(false);
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(7,26,61,0.48)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "430px",
              background: "#ffffff",
              borderRadius: "18px",
              padding: "28px",
              boxSizing: "border-box",
              boxShadow: "0 24px 70px rgba(7,26,61,0.22)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                marginBottom: "16px",
                borderRadius: "13px",
                background: "#eaf2fb",
                color: "#0b4ea2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: 800,
              }}
            >
              ?
            </div>

            <h3
              style={{
                margin: "0 0 8px",
                color: "#071a3d",
                fontSize: "21px",
                fontWeight: 800,
              }}
            >
              Konfirmasi Lamaran
            </h3>

            <p
              style={{
                margin: "0 0 7px",
                color: "#334155",
                fontSize: "14px",
                lineHeight: 1.6,
                fontWeight: 700,
              }}
            >
              {job.position_name || "Lowongan ini"}
            </p>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "13px",
                lineHeight: 1.7,
              }}
            >
              Apakah kamu yakin ingin melamar posisi ini?
              Pastikan data profile, education, dan dokumen
              kamu sudah benar.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "25px",
              }}
            >
              <button
                type="button"
                disabled={applying}
                onClick={() => setShowApplyConfirm(false)}
                style={{
                  padding: "11px 18px",
                  border: "1px solid #dbe3ed",
                  borderRadius: "9px",
                  background: "#f8fafc",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: applying ? "not-allowed" : "pointer",
                }}
              >
                Batal
              </button>

              <button
                type="button"
                disabled={applying}
                onClick={handleConfirmApply}
                style={{
                  padding: "11px 18px",
                  border: "none",
                  borderRadius: "9px",
                  background: "#0b4ea2",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: applying ? "not-allowed" : "pointer",
                  opacity: applying ? 0.7 : 1,
                }}
              >
                {applying ? "Mengirim..." : "Ya, Apply"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @media (max-width: 850px) {
            .job-detail-layout {
              grid-template-columns: 1fr !important;
            }

            .job-detail-layout aside {
              position: relative !important;
              top: auto !important;
            }
          }

          @media (max-width: 600px) {
            .job-info-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </MainLayout>
  );
}

// ==================================================
// SECTION HEADING
// ==================================================

function SectionHeading({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "18px",
      }}
    >
      <div
        style={{
          width: "4px",
          height: "25px",
          borderRadius: "999px",
          background: "#0b4ea2",
          flexShrink: 0,
        }}
      />

      <h2
        style={{
          margin: 0,
          color: "#071a3d",
          fontSize: "21px",
          fontWeight: 800,
          letterSpacing: "-0.3px",
        }}
      >
        {children}
      </h2>
    </div>
  );
}

export default JobDetail;