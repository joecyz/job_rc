import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import { getJobs } from "../../services/jobService";
import { applyJob } from "../../services/applicationService";
import { checkProfileCompletion } from "../../services/profileService";

import { useToast } from "../../components/Toast/ToastProvider";

function Jobs() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);

  // ==================================================
  // LOAD JOBS
  // ==================================================

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const data = await getJobs();

      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        setJobs(data.results || []);
      }
    } catch (error) {
      console.error("ERROR GET JOBS:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // FILTER OPTIONS
  // ==================================================

  const regions = useMemo(() => {
    return [
      ...new Set(
        jobs
          .map((job) => job.region_name)
          .filter(Boolean)
      ),
    ];
  }, [jobs]);

  const divisions = useMemo(() => {
    return [
      ...new Set(
        jobs
          .map((job) => job.division_name)
          .filter(Boolean)
      ),
    ];
  }, [jobs]);

  const levels = useMemo(() => {
    return [
      ...new Set(
        jobs
          .map((job) => job.education_level_name)
          .filter(Boolean)
      ),
    ];
  }, [jobs]);

  // ==================================================
  // FILTER + SORT
  // ==================================================

  const filteredJobs = useMemo(() => {
    const filtered = jobs.filter((job) => {
      const keyword = search.toLowerCase().trim();

      const position =
        job.position_name?.toLowerCase() || "";

      const division =
        job.division_name?.toLowerCase() || "";

      const region =
        job.region_name?.toLowerCase() || "";

      const description =
        job.description?.toLowerCase() || "";

      const educationLevel = (
        job.education_level_name || ""
      ).toLowerCase();

      const matchesSearch =
        !keyword ||
        position.includes(keyword) ||
        division.includes(keyword) ||
        region.includes(keyword) ||
        description.includes(keyword);

      const matchesRegion =
        !regionFilter ||
        job.region_name === regionFilter;

      const matchesDivision =
        !divisionFilter ||
        job.division_name === divisionFilter;

      const matchesLevel =
        !levelFilter ||
        educationLevel === levelFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesRegion &&
        matchesDivision &&
        matchesLevel
      );
    });

    return filtered.sort((a, b) => {
      const deadlineA = new Date(
        `${a.deadline}T00:00:00`
      );

      const deadlineB = new Date(
        `${b.deadline}T00:00:00`
      );

      return deadlineA - deadlineB;
    });
  }, [
    jobs,
    search,
    regionFilter,
    divisionFilter,
    levelFilter,
  ]);

  // ==================================================
  // APPLY JOB
  // ==================================================

  const handleApply = async (job) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      localStorage.setItem(
        "redirect_after_login",
        `/jobs/${job.id}`
      );

      navigate("/login");
      return;
    }

    try {
      const completion =
        await checkProfileCompletion();

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
          String(job.id)
        );

        navigate("/profile");
        return;
      }

      setSelectedJob(job);
      setShowApplyConfirm(true);
    } catch (error) {
      console.error("APPLY ERROR:", error);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Terjadi kesalahan saat melamar.";

      showToast(message, "error");
    }
  };

  const handleConfirmApply = async () => {
    if (!selectedJob) return;

    try {
      setApplying(true);

      await applyJob(selectedJob.id);

      setShowApplyConfirm(false);
      setSelectedJob(null);

      showToast(
        "Lamaran berhasil dikirim!",
        "success"
      );

      fetchJobs();
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
  // RESET FILTER
  // ==================================================

  const resetFilters = () => {
    setSearch("");
    setRegionFilter("");
    setDivisionFilter("");
    setLevelFilter("");
  };

  // ==================================================
  // JOB STATUS
  // ==================================================

  const getJobStatus = (job) => {
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

    if (hasApplied) {
      return {
        label: "SUDAH MELAMAR",
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (isClosed) {
      return {
        label: "CLOSED",
        background: "#f1f5f9",
        color: "#64748b",
      };
    }

    if (isFull) {
      return {
        label: "QUOTA PENUH",
        background: "#f1f5f9",
        color: "#64748b",
      };
    }

    if (isExpired) {
      return {
        label: "BERAKHIR",
        background: "#fef2f2",
        color: "#dc2626",
      };
    }

    return {
      label: "OPEN",
      background: "#eaf2fb",
      color: "#1457a6",
    };
  };

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
            padding: "68px 24px 105px",
          }}
        >
          {/* Decorative Circle */}
          <div
            style={{
              position: "absolute",
              width: "380px",
              height: "380px",
              borderRadius: "50%",
              background:
                "rgba(255,255,255,0.05)",
              top: "-220px",
              right: "-80px",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background:
                "rgba(20,87,166,0.3)",
              bottom: "-170px",
              left: "-80px",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "850px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "7px 15px",
                marginBottom: "18px",
                borderRadius: "999px",
                background:
                  "rgba(255,255,255,0.10)",
                border:
                  "1px solid rgba(255,255,255,0.16)",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.8px",
              }}
            >
              CAREER OPPORTUNITY
            </div>

            <h1
              style={{
                margin: "0 0 15px",
                fontSize:
                  "clamp(38px, 5vw, 56px)",
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-1.5px",
              }}
            >
              Temukan Kariermu
              <br />
              Bersama BSU
            </h1>

            <p
              style={{
                maxWidth: "650px",
                margin: "0 auto",
                color:
                  "rgba(255,255,255,0.82)",
                fontSize: "16px",
                lineHeight: 1.7,
              }}
            >
              Jelajahi berbagai peluang karier
              dan temukan posisi yang paling
              sesuai dengan kemampuan,
              pengalaman, dan minat kamu.
            </p>
          </div>
        </section>

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <main
          style={{
            maxWidth: "1180px",
            margin: "-55px auto 0",
            padding: "0 24px",
            position: "relative",
            zIndex: 5,
            boxSizing: "border-box",
          }}
        >
          {/* ==================================================
              SEARCH PANEL
          ================================================== */}

          <section
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "26px",
              boxShadow:
                "0 18px 45px rgba(7,26,61,0.11)",
              marginBottom: "42px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "7px",
                  }}
                >
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#0b4ea2",
                    }}
                  />

                  <span
                    style={{
                      color: "#0b4ea2",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.6px",
                      textTransform: "uppercase",
                    }}
                  >
                    Job Search
                  </span>
                </div>

                <h2
                  style={{
                    margin: 0,
                    color: "#071a3d",
                    fontSize: "23px",
                    fontWeight: 800,
                  }}
                >
                  Cari Lowongan
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Gunakan pencarian dan filter
                  untuk menemukan posisi yang
                  sesuai.
                </p>
              </div>

              {(search ||
                regionFilter ||
                divisionFilter ||
                levelFilter) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  style={{
                    padding: "10px 15px",
                    border:
                      "1px solid #dbe3ed",
                    borderRadius: "9px",
                    background: "#f8fafc",
                    color: "#071a3d",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 800,
                  }}
                >
                  Reset Filter
                </button>
              )}
            </div>

            {/* SEARCH */}
            <div
              style={{
                position: "relative",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  color: "#64748b",
                  fontSize: "20px",
                  pointerEvents: "none",
                  lineHeight: 1,
                }}
              >
                ⌕
              </span>

              <input
                type="text"
                placeholder="Cari posisi, divisi, lokasi, atau kata kunci..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding:
                    "15px 17px 15px 46px",
                  borderRadius: "10px",
                  border:
                    "1px solid #dbe3ed",
                  background: "#f8fafc",
                  color: "#172033",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            {/* FILTERS */}
            <div
              className="jobs-filter-grid"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, minmax(0, 1fr))",
                gap: "12px",
              }}
            >
              <select
                value={regionFilter}
                onChange={(e) =>
                  setRegionFilter(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  borderRadius: "10px",
                  border:
                    "1px solid #dbe3ed",
                  background: "#ffffff",
                  color: "#334155",
                  fontSize: "13px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="">
                  Semua Penempatan
                </option>

                {regions.map((region) => (
                  <option
                    key={region}
                    value={region}
                  >
                    {region}
                  </option>
                ))}
              </select>

              <select
                value={divisionFilter}
                onChange={(e) =>
                  setDivisionFilter(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  borderRadius: "10px",
                  border:
                    "1px solid #dbe3ed",
                  background: "#ffffff",
                  color: "#334155",
                  fontSize: "13px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="">
                  Semua Divisi
                </option>

                {divisions.map((division) => (
                  <option
                    key={division}
                    value={division}
                  >
                    {division}
                  </option>
                ))}
              </select>

              <select
                value={levelFilter}
                onChange={(e) =>
                  setLevelFilter(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  borderRadius: "10px",
                  border:
                    "1px solid #dbe3ed",
                  background: "#ffffff",
                  color: "#334155",
                  fontSize: "13px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="">
                  Semua Jenjang
                </option>

                {levels.map((level) => (
                  <option
                    key={level}
                    value={level}
                  >
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* ==================================================
              RESULT HEADER
          ================================================== */}

          {!loading && (
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "flex-end",
                gap: "20px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    width: "42px",
                    height: "4px",
                    background: "#0b4ea2",
                    borderRadius: "999px",
                    marginBottom: "10px",
                  }}
                />

                <h2
                  style={{
                    margin: 0,
                    color: "#071a3d",
                    fontSize: "27px",
                    fontWeight: 800,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Daftar Lowongan
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Menampilkan{" "}
                  <strong
                    style={{
                      color: "#0b4ea2",
                    }}
                  >
                    {filteredJobs.length}
                  </strong>{" "}
                  lowongan berdasarkan
                  deadline terdekat.
                </p>
              </div>
            </div>
          )}

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (
            <div
              style={{
                background: "#ffffff",
                border:
                  "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "75px 20px",
                textAlign: "center",
                boxShadow:
                  "0 8px 25px rgba(7,26,61,0.05)",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  border:
                    "4px solid #dbeafe",
                  borderTop:
                    "4px solid #0b4ea2",
                  borderRadius: "50%",
                  margin: "0 auto 18px",
                  animation:
                    "jobsSpin 1s linear infinite",
                }}
              />

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Memuat lowongan...
              </p>
            </div>
          )}

          {/* ==================================================
              EMPTY
          ================================================== */}

          {!loading &&
            filteredJobs.length === 0 && (
              <div
                style={{
                  background: "#ffffff",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "75px 25px",
                  textAlign: "center",
                  boxShadow:
                    "0 8px 25px rgba(7,26,61,0.05)",
                }}
              >
                <div
                  style={{
                    width: "66px",
                    height: "66px",
                    margin:
                      "0 auto 18px",
                    borderRadius: "18px",
                    background: "#eaf2fb",
                    color: "#0b4ea2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    fontWeight: 800,
                  }}
                >
                  ?
                </div>

                <h2
                  style={{
                    margin: "0 0 8px",
                    color: "#071a3d",
                    fontSize: "22px",
                    fontWeight: 800,
                  }}
                >
                  Lowongan tidak ditemukan
                </h2>

                <p
                  style={{
                    margin: "0 0 22px",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Coba ubah kata pencarian
                  atau filter yang digunakan.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  style={{
                    padding: "11px 22px",
                    border: "none",
                    borderRadius: "9px",
                    background: "#071a3d",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  Reset Filter
                </button>
              </div>
            )}

          {/* ==================================================
              JOB LIST
          ================================================== */}

          {!loading &&
            filteredJobs.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {filteredJobs.map((job) => {
                  const educationLevel =
                    job.education_level_name;

                  const today = new Date();
                  today.setHours(
                    0,
                    0,
                    0,
                    0
                  );

                  const deadline = new Date(
                    `${job.deadline}T00:00:00`
                  );

                  deadline.setHours(
                    0,
                    0,
                    0,
                    0
                  );

                  const isClosed =
                    job.status !== "OPEN";

                  const isExpired =
                    deadline < today;

                  const isFull =
                    job.is_full === true;

                  const hasApplied =
                    job.has_applied === true;

                  const status =
                    getJobStatus(job);

                  return (
                    <article
                      key={job.id}
                      style={{
                        position: "relative",
                        background: "#ffffff",
                        border:
                          "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding:
                          "24px 26px",
                        boxShadow:
                          "0 6px 22px rgba(7,26,61,0.045)",
                        transition:
                          "transform 180ms ease, box-shadow 180ms ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 14px 32px rgba(7,26,61,0.09)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 22px rgba(7,26,61,0.045)";
                      }}
                    >
                      {/* TOP ACCENT */}
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "22px",
                          width: "4px",
                          height: "58px",
                          borderRadius:
                            "0 5px 5px 0",
                          background:
                            "#0b4ea2",
                        }}
                      />

                      {/* HEADER */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "flex-start",
                          gap: "20px",
                          paddingLeft: "10px",
                          marginBottom: "20px",
                        }}
                      >
                        <div
                          style={{
                            minWidth: 0,
                          }}
                        >
                          <span
                            style={{
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              padding:
                                "6px 10px",
                              borderRadius:
                                "6px",
                              background:
                                "#eaf2fb",
                              color:
                                "#0b4ea2",
                              fontSize: "10px",
                              fontWeight: 800,
                              letterSpacing:
                                "0.4px",
                              textTransform:
                                "uppercase",
                              marginBottom:
                                "9px",
                            }}
                          >
                            {job.division_name ||
                              "LOWONGAN"}
                          </span>

                          <h3
                            style={{
                              margin: 0,
                              color: "#071a3d",
                              fontSize:
                                "22px",
                              lineHeight: 1.3,
                              fontWeight: 800,
                              letterSpacing:
                                "-0.3px",
                            }}
                          >
                            {job.position_name}
                          </h3>
                        </div>

                        <span
                          style={{
                            flexShrink: 0,
                            padding:
                              "7px 11px",
                            borderRadius:
                              "999px",
                            background:
                              status.background,
                            color:
                              status.color,
                            fontSize: "10px",
                            fontWeight: 800,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {status.label}
                        </span>
                      </div>

                      {/* INFO */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(4, minmax(0, 1fr))",
                          gap: "1px",
                          background:
                            "#e2e8f0",
                          border:
                            "1px solid #e2e8f0",
                          borderRadius: "11px",
                          overflow: "hidden",
                          marginBottom: "16px",
                        }}
                      >
                        {[
                          {
                            label:
                              "Penempatan",
                            value:
                              job.region_name ||
                              "-",
                          },
                          {
                            label: "Jenjang",
                            value:
                              educationLevel ||
                              "-",
                          },
                          {
                            label: "Quota",
                            value:
                              job.quota ?? "-",
                          },
                          {
                            label: "Deadline",
                            value:
                              job.deadline ||
                              "-",
                            danger:
                              isExpired,
                          },
                        ].map(
                          (item) => (
                            <div
                              key={
                                item.label
                              }
                              style={{
                                background:
                                  "#f8fafc",
                                padding:
                                  "14px 15px",
                              }}
                            >
                              <div
                                style={{
                                  color:
                                    "#94a3b8",
                                  fontSize:
                                    "9px",
                                  fontWeight:
                                    800,
                                  textTransform:
                                    "uppercase",
                                  letterSpacing:
                                    "0.4px",
                                  marginBottom:
                                    "5px",
                                }}
                              >
                                {item.label}
                              </div>

                              <div
                                style={{
                                  color:
                                    item.danger
                                      ? "#dc2626"
                                      : "#334155",
                                  fontSize:
                                    "13px",
                                  fontWeight:
                                    700,
                                  wordBreak:
                                    "break-word",
                                }}
                              >
                                {item.value}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      {/* DATE + DESCRIPTION */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "16px",
                          marginBottom:
                            job.description
                              ? "10px"
                              : "16px",
                          color: "#64748b",
                          fontSize: "12px",
                        }}
                      >
                        <span>
                          <strong
                            style={{
                              color:
                                "#071a3d",
                            }}
                          >
                            Open:
                          </strong>{" "}
                          {job.open_date || "-"}
                        </span>

                        <span>
                          <strong
                            style={{
                              color:
                                "#071a3d",
                            }}
                          >
                            Deadline:
                          </strong>{" "}
                          {job.deadline || "-"}
                        </span>
                      </div>

                      {job.description && (
                        <p
                          style={{
                            margin:
                              "0 0 16px",
                            color: "#64748b",
                            fontSize: "13px",
                            lineHeight: 1.65,
                            display:
                              "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient:
                              "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {job.description}
                        </p>
                      )}

                      {/* ACTIONS */}
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          paddingTop: "16px",
                          borderTop:
                            "1px solid #eef2f7",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/jobs/${job.id}`
                            )
                          }
                          style={{
                            flex: 1,
                            padding:
                              "12px 14px",
                            border:
                              "1px solid #dbe3ed",
                            borderRadius:
                              "9px",
                            background:
                              "#ffffff",
                            color:
                              "#071a3d",
                            cursor:
                              "pointer",
                            fontWeight: 700,
                            fontSize:
                              "13px",
                            transition:
                              "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor =
                              "#0b4ea2";
                            e.currentTarget.style.color =
                              "#0b4ea2";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor =
                              "#dbe3ed";
                            e.currentTarget.style.color =
                              "#071a3d";
                          }}
                        >
                          Lihat Detail
                        </button>

                        {hasApplied ? (
                          <button
                            type="button"
                            disabled
                            style={{
                              flex: 1,
                              padding:
                                "12px 14px",
                              border: "none",
                              borderRadius:
                                "9px",
                              background:
                                "#dcfce7",
                              color:
                                "#166534",
                              cursor:
                                "not-allowed",
                              fontWeight: 700,
                              fontSize:
                                "13px",
                            }}
                          >
                            ✓ Sudah Melamar
                          </button>
                        ) : isClosed ? (
                          <button
                            type="button"
                            disabled
                            style={{
                              flex: 1,
                              padding:
                                "12px 14px",
                              border: "none",
                              borderRadius:
                                "9px",
                              background:
                                "#eef2f7",
                              color:
                                "#64748b",
                              cursor:
                                "not-allowed",
                              fontWeight: 700,
                              fontSize:
                                "13px",
                            }}
                          >
                            Job Closed
                          </button>
                        ) : isFull ? (
                          <button
                            type="button"
                            disabled
                            style={{
                              flex: 1,
                              padding:
                                "12px 14px",
                              border: "none",
                              borderRadius:
                                "9px",
                              background:
                                "#eef2f7",
                              color:
                                "#64748b",
                              cursor:
                                "not-allowed",
                              fontWeight: 700,
                              fontSize:
                                "13px",
                            }}
                          >
                            Quota Reached
                          </button>
                        ) : isExpired ? (
                          <button
                            type="button"
                            disabled
                            style={{
                              flex: 1,
                              padding:
                                "12px 14px",
                              border: "none",
                              borderRadius:
                                "9px",
                              background:
                                "#fef2f2",
                              color:
                                "#dc2626",
                              cursor:
                                "not-allowed",
                              fontWeight: 700,
                              fontSize:
                                "13px",
                            }}
                          >
                            Application Closed
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleApply(
                                job
                              )
                            }
                            style={{
                              flex: 1,
                              padding:
                                "12px 14px",
                              border: "none",
                              borderRadius:
                                "9px",
                              background:
                                "#0b4ea2",
                              color:
                                "#ffffff",
                              cursor:
                                "pointer",
                              fontWeight: 800,
                              fontSize:
                                "13px",
                              transition:
                                "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "#071a3d";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "#0b4ea2";
                            }}
                          >
                            Apply Now →
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
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
              {selectedJob?.position_name || "Lowongan ini"}
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
          @keyframes jobsSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 768px) {
            .jobs-filter-grid {
              grid-template-columns: 1fr !important;
            }

            article > div:nth-child(3) {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 600px) {
            article {
              padding: 20px !important;
            }

            article > div:nth-child(2) {
              flex-direction: column !important;
            }

            article > div:nth-child(2) > span:last-child {
              align-self: flex-start !important;
            }

            article > div:nth-child(3) {
              grid-template-columns: 1fr 1fr !important;
            }

            article > div:last-child {
              flex-direction: column !important;
            }
          }
        `}
      </style>
    </MainLayout>
  );
}

export default Jobs;