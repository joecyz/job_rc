import { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";

function HRApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [jobDeadlineFilter, setJobDeadlineFilter] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedJobId = searchParams.get("job");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await api.get("/applications/hr/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("HR APPLICATION DATA:", response.data);

      setApplications(response.data.results || response.data);
    } catch (error) {
      console.error(
        "HR APPLICATION ERROR:",
        error.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UNIQUE FILTER OPTIONS
  // =========================

  const positions = useMemo(() => {
    return [
      ...new Set(
        applications
          .map((application) => application.job_title)
          .filter(Boolean)
      ),
    ];
  }, [applications]);

  const regions = useMemo(() => {
    return [
      ...new Set(
        applications
          .map((application) => application.region_name)
          .filter(Boolean)
      ),
    ];
  }, [applications]);

  const isDeadlinePassed = (deadline) => {
    if (!deadline) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    return deadlineDate < today;
  };

  // =========================
  // FILTER APPLICATIONS
  // =========================

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        application.applicant_name
          ?.toLowerCase()
          .includes(searchValue) ||
        application.applicant_email
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        !statusFilter ||
        application.status === statusFilter;

      const matchesPosition =
        !positionFilter ||
        application.job_title === positionFilter;

      const matchesRegion =
        !regionFilter ||
        application.region_name === regionFilter;

      const deadlinePassed = isDeadlinePassed(
        application.job_deadline
      );

      const matchesDeadline =
        !jobDeadlineFilter ||
        (jobDeadlineFilter === "OPEN" && !deadlinePassed) ||
        (jobDeadlineFilter === "EXPIRED" && deadlinePassed);

      const matchesSelectedJob =
        !selectedJobId ||
        String(application.job) === String(selectedJobId);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPosition &&
        matchesRegion &&
        matchesDeadline &&
        matchesSelectedJob
      );
    });
  }, [
    applications,
    search,
    statusFilter,
    positionFilter,
    regionFilter,
    jobDeadlineFilter,
    selectedJobId,
  ]);

  // =========================
  // DETAIL
  // =========================

  const handleViewDetail = (applicationId) => {
    navigate(`/hr/applications/${applicationId}`);
  };

  // =========================
  // HELPERS
  // =========================

  const getStatusLabel = (status) => {
    const labels = {
      APPLIED: "Applied",
      SCREENING: "Screening",
      INTERVIEW: "Interview",
      ACCEPTED: "Accepted",
      REJECTED: "Rejected",
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

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPositionFilter("");
    setRegionFilter("");
    setJobDeadlineFilter("");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <MainLayout>
        <div className="hr-applications-page">
          <div className="hr-applications-loading">
            <div className="hr-loading-spinner"></div>
            <h3>Memuat data pelamar...</h3>
            <p>Mohon tunggu sebentar.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // =========================
  // RENDER
  // =========================

  return (
    <MainLayout>
      <div className="hr-applications-page">
        {/* =========================
            HEADER
        ========================= */}

        <section className="hr-applications-hero">
          <div>
            <div className="hr-breadcrumb">
              <button
                type="button"
                onClick={() => navigate("/hr/dashboard")}
              >
                Dashboard
              </button>

              <span>/</span>

              <span>Applicants</span>
            </div>

            <span className="hr-section-kicker">
              RECRUITMENT MANAGEMENT
            </span>

            <h1>
              {selectedJobId && filteredApplications.length > 0
                ? `Pelamar - ${filteredApplications[0].job_title}`
                : selectedJobId
                ? "Pelamar Lowongan"
                : "Daftar Pelamar"}
            </h1>

            <p>
              {selectedJobId
                ? "Menampilkan kandidat yang melamar pada lowongan ini."
                : "Kelola dan review seluruh kandidat yang melamar pada lowongan PT Bintang Sayap Utama."}
            </p>
          </div>

          <div className="hr-applications-total">
            <span>Total Pelamar</span>
            <strong>{selectedJobId ? filteredApplications.length : applications.length}</strong>
          </div>
        </section>

        {/* =========================
            FILTER CARD
        ========================= */}

        <section className="hr-filter-card">
          <div className="hr-filter-header">
            <div>
              <h2>Filter Pelamar</h2>
              <p>
                Gunakan filter untuk menemukan kandidat
                dengan lebih cepat.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                className="hr-reset-button"
                onClick={resetFilters}
              >
                Reset Filter
              </button>

              {selectedJobId && (
                <button
                  type="button"
                  className="hr-reset-button"
                  onClick={() => navigate("/hr/applications")}
                >
                  Lihat Semua Pelamar
                </button>
              )}
            </div>
          </div>

          <div className="hr-filter-grid">
            {/* SEARCH */}

            <div className="hr-filter-field hr-filter-search">
              <label>Cari Pelamar</label>

              <div className="hr-input-wrapper">
                <span className="hr-input-icon">⌕</span>

                <input
                  type="text"
                  placeholder="Nama atau email applicant..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>
            </div>

            {/* STATUS */}

            <div className="hr-filter-field">
              <label>Status</label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="">Semua Status</option>
                <option value="APPLIED">Applied</option>
                <option value="SCREENING">Screening</option>
                <option value="INTERVIEW">Interview</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* POSITION */}

            <div className="hr-filter-field">
              <label>Posisi</label>

              <select
                value={positionFilter}
                onChange={(e) =>
                  setPositionFilter(e.target.value)
                }
              >
                <option value="">Semua Posisi</option>

                {positions.map((position) => (
                  <option
                    key={position}
                    value={position}
                  >
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* REGION */}

            <div className="hr-filter-field">
              <label>Penempatan</label>

              <select
                value={regionFilter}
                onChange={(e) =>
                  setRegionFilter(e.target.value)
                }
              >
                <option value="">Semua Penempatan</option>

                {regions.map((region) => (
                  <option
                    key={region}
                    value={region}
                  >
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* DEADLINE */}

            <div className="hr-filter-field">
              <label>Status Lowongan</label>

              <select
                value={jobDeadlineFilter}
                onChange={(e) =>
                  setJobDeadlineFilter(e.target.value)
                }
              >
                <option value="">Semua Lowongan</option>
                <option value="OPEN">
                  Masih Open
                </option>
                <option value="EXPIRED">
                  Deadline Lewat
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* =========================
            RESULT SUMMARY
        ========================= */}

        <div className="hr-result-summary">
          <div>
            Menampilkan{" "}
            <strong>
              {filteredApplications.length}
            </strong>{" "}
            dari{" "}
            <strong>{applications.length}</strong>{" "}
            applicant
          </div>
        </div>

        {/* =========================
            EMPTY STATE
        ========================= */}

        {filteredApplications.length === 0 ? (
          <div className="hr-applications-empty">
            <div className="hr-empty-icon">⌕</div>

            <h3>Tidak Ada Pelamar</h3>

            <p>
              {selectedJobId
                ? "Belum ada applicant yang melamar pada lowongan ini."
                : "Tidak ada applicant yang sesuai dengan filter yang dipilih."}
            </p>

            <button
              type="button"
              onClick={resetFilters}
            >
              Reset Filter
            </button>
          </div>
        ) : (
          /* =========================
             APPLICATION LIST
          ========================= */

          <div className="hr-applications-list">
            {filteredApplications.map(
              (application) => (
                <article
                  className="hr-application-card"
                  key={application.id}
                >
                  {/* TOP */}

                  <div className="hr-application-top">
                    <div className="hr-applicant-info">
                      <div className="hr-applicant-avatar">
                        {application.profile_photo ? (
                          <img
                            src={application.profile_photo}
                            alt={
                              application.applicant_name ||
                              "Applicant"
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

                      <div>
                        <h3>
                          {application.applicant_name}
                        </h3>

                        <p>
                          {application.applicant_email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`hr-status-badge ${getStatusClass(
                        application.status
                      )}`}
                    >
                      {getStatusLabel(
                        application.status
                      )}
                    </span>
                  </div>

                  {/* DETAILS */}

                  <div className="hr-application-details">
                    <div className="hr-application-detail">
                      <span>Posisi</span>
                      <strong>
                        {application.job_title || "-"}
                      </strong>
                    </div>

                    <div className="hr-application-detail">
                      <span>Penempatan</span>
                      <strong>
                        {application.region_name || "-"}
                      </strong>
                    </div>

                    <div className="hr-application-detail">
                      <span>Tanggal Apply</span>
                      <strong>
                        {formatDate(
                          application.applied_at
                        )}
                      </strong>
                    </div>

                    <div className="hr-application-detail">
                      <span>Deadline</span>
                      <strong
                        className={
                          isDeadlinePassed(
                            application.job_deadline
                          )
                            ? "deadline-expired"
                            : "deadline-active"
                        }
                      >
                        {formatDate(
                          application.job_deadline
                        )}
                      </strong>
                    </div>
                  </div>

                  {/* FOOTER */}

                  <div className="hr-application-footer">
                    <span>
                      Kandidat untuk proses rekrutmen
                    </span>

                    <button
                      type="button"
                      className="hr-detail-button"
                      onClick={() =>
                        handleViewDetail(
                          application.id
                        )
                      }
                    >
                      Lihat Detail
                      <span>→</span>
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default HRApplications;