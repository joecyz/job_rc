import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import logoBSU from "../../assets/images/logo-bsu.png";

import {
  getJobs,
  getRegions,
  getDivisions,
} from "../../services/jobService";

import api from "../../api/axios";

function HRDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [regions, setRegions] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [applications, setApplications] = useState([]);


  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH DATA
  // ======================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

const [jobsData, regionsData, divisionsData, applicationsData] =
  await Promise.all([
    getJobs(),
    getRegions(),
    getDivisions(),
    api.get("/applications/hr/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  ]);

      setJobs(
        jobsData?.results ||
          jobsData ||
          []
      );

      setRegions(
        regionsData?.results ||
          regionsData ||
          []
      );

      setDivisions(
        divisionsData?.results ||
          divisionsData ||
          []
      );

      setApplications(
  applicationsData.data?.results ||
    applicationsData.data ||
    []
);
    } catch (error) {
      console.error(
        "HR DASHBOARD ERROR:",
        error?.response?.data || error
      );

      setError(
        error?.response?.data?.detail ||
          "Gagal mengambil data dashboard HR."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("logout"));

    navigate("/");
  };

  // ======================================================
  // FILTER
  // ======================================================

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const keyword = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !keyword ||
        job.title
          ?.toLowerCase()
          .includes(keyword) ||
        job.position_name
          ?.toLowerCase()
          .includes(keyword) ||
        job.description
          ?.toLowerCase()
          .includes(keyword) ||
        job.division_name
          ?.toLowerCase()
          .includes(keyword) ||
        job.region_name
          ?.toLowerCase()
          .includes(keyword);

      const matchesRegion =
        !selectedRegion ||
        String(job.region) ===
          String(selectedRegion) ||
        String(job.region_id) ===
          String(selectedRegion);

      const matchesDivision =
        !selectedDivision ||
        String(job.division) ===
          String(selectedDivision) ||
        String(job.division_id) ===
          String(selectedDivision);

      return (
        matchesSearch &&
        matchesRegion &&
        matchesDivision
      );
    });
  }, [
    jobs,
    search,
    selectedRegion,
    selectedDivision,
  ]);

  // ======================================================
  // STATISTICS
  // ======================================================

  const totalJobs = jobs.length;

  const totalApplicants = applications.length;

  const activeJobs = jobs.filter((job) => {
    const status = String(
      job.status || ""
    ).toLowerCase();

    return (
      !status ||
      ![
        "closed",
        "inactive",
        "expired",
        "nonaktif",
      ].includes(status)
    );
  }).length;

  // ======================================================
  // HELPERS
  // ======================================================

  const getJobTitle = (job) => {
    return (
      job.title ||
      job.position_name ||
      "Lowongan"
    );
  };

  const getDivisionName = (job) => {
    return (
      job.division_name ||
      job.division?.name ||
      "-"
    );
  };

  const getRegionName = (job) => {
    return (
      job.region_name ||
      job.region?.name ||
      "-"
    );
  };

  const getStatusLabel = (status) => {
    if (!status) {
      return "Aktif";
    }

    const value = String(status).toLowerCase();

    if (
      value === "active" ||
      value === "aktif"
    ) {
      return "Aktif";
    }

    if (
      value === "closed" ||
      value === "ditutup"
    ) {
      return "Ditutup";
    }

    if (
      value === "expired" ||
      value === "kadaluarsa"
    ) {
      return "Berakhir";
    }

    return status;
  };

  const getStatusClass = (status) => {
    const value = String(
      status || "active"
    ).toLowerCase();

    if (
      value === "closed" ||
      value === "ditutup" ||
      value === "expired" ||
      value === "kadaluarsa"
    ) {
      return "status-closed";
    }

    return "status-active";
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <>
        <HRNavbar onLogout={handleLogout} />

        <div className="hr-dashboard-page">
          <div className="hr-loading">
            <div className="hr-loading-spinner" />

            <h2>
              Memuat Dashboard HR
            </h2>

            <p>
              Sedang mengambil data lowongan...
            </p>
          </div>
        </div>

        <DashboardStyles />
      </>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <>
        <HRNavbar onLogout={handleLogout} />

        <div className="hr-dashboard-page">
          <div className="hr-error-card">
            <div className="hr-error-icon">
              !
            </div>

            <div>
              <div className="hr-error-label">
                TERJADI KESALAHAN
              </div>

              <h2>
                Dashboard tidak dapat dimuat
              </h2>

              <p>
                {error}
              </p>

              <button
                onClick={fetchDashboardData}
                className="hr-primary-button"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>

        <DashboardStyles />
      </>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <>
      {/* ==================================================
          HR NAVBAR
      ================================================== */}

      <HRNavbar onLogout={handleLogout} />

      <main className="hr-dashboard-page">
        <div className="hr-dashboard-container">

          {/* ==================================================
              HERO
          ================================================== */}

          <section className="hr-dashboard-hero">

            <div className="hr-hero-pattern" />

            <div className="hr-dashboard-hero-circle" />

            <div className="hr-hero-content">

              <div className="hr-eyebrow">
                PORTAL HUMAN RESOURCES
              </div>

              <h1>
                Kelola Rekrutmen
                <br />
                <span>
                  BSU dengan lebih mudah.
                </span>
              </h1>

              <p>
                Pantau lowongan, kebutuhan tenaga
                kerja, dan proses rekrutmen dalam
                satu dashboard.
              </p>

            </div>

            <div className="hr-hero-actions">

              <button
                className="hr-hero-secondary"
                onClick={() =>
                  navigate("/hr/applications")
                }
              >
                <span>
                  Lihat Pelamar
                </span>

                <span>
                  →
                </span>
              </button>

              <button
                className="hr-hero-primary"
                onClick={() =>
                  navigate("/hr/jobs/create")
                }
              >
                + Tambah Lowongan
              </button>

            </div>

          </section>

          {/* ==================================================
              STATISTICS
          ================================================== */}

          <section className="hr-stat-grid">

            <div className="hr-stat-card">
              <div className="hr-stat-top">
                <span>
                  TOTAL LOWONGAN
                </span>

                <div className="hr-stat-icon">
                  JD
                </div>
              </div>

              <strong>
                {totalJobs}
              </strong>

              <p>
                Seluruh lowongan yang tersedia
              </p>
            </div>

            <div className="hr-stat-card">
              <div className="hr-stat-top">
                <span>
                  LOWONGAN AKTIF
                </span>

                <div className="hr-stat-icon">
                  AC
                </div>
              </div>

              <strong>
                {activeJobs}
              </strong>

              <p>
                Lowongan yang masih berjalan
              </p>
            </div>

            <div className="hr-stat-card">
              <div className="hr-stat-top">
                <span>
                  TOTAL PELAMAR
                </span>

                <div className="hr-stat-icon">
                  AP
                </div>
              </div>

              <strong>
                {totalApplicants}
              </strong>

              <p>
                Kandidat yang telah melamar
              </p>
            </div>

            <div className="hr-stat-card">
              <div className="hr-stat-top">
                <span>
                  HASIL PENCARIAN
                </span>

                <div className="hr-stat-icon">
                  SR
                </div>
              </div>

              <strong>
                {filteredJobs.length}
              </strong>

              <p>
                Lowongan sesuai filter
              </p>
            </div>

          </section>

          {/* ==================================================
              FILTER PANEL
          ================================================== */}

          <section className="hr-filter-panel">

            <div className="hr-filter-header">

              <div>
                <div className="hr-section-eyebrow">
                  MANAJEMEN LOWONGAN
                </div>

                <h2>
                  Cari dan kelola lowongan
                </h2>
              </div>

              {(search ||
                selectedDivision ||
                selectedRegion) && (
                <button
                  className="hr-reset-filter"
                  onClick={() => {
                    setSearch("");
                    setSelectedDivision("");
                    setSelectedRegion("");
                  }}
                >
                  Reset Filter
                </button>
              )}

            </div>

            <div className="hr-filter-grid">

              <div className="hr-search-wrapper">
                <span>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Cari posisi, divisi, atau region..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>

              <select
                value={selectedDivision}
                onChange={(e) =>
                  setSelectedDivision(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Semua Divisi
                </option>

                {divisions.map((division) => (
                  <option
                    key={
                      division.id ||
                      division.division_id
                    }
                    value={
                      division.id ||
                      division.division_id
                    }
                  >
                    {division.name ||
                      division.division_name ||
                      division.title}
                  </option>
                ))}
              </select>

              <select
                value={selectedRegion}
                onChange={(e) =>
                  setSelectedRegion(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Semua Region
                </option>

                {regions.map((region) => (
                  <option
                    key={
                      region.id ||
                      region.region_id
                    }
                    value={
                      region.id ||
                      region.region_id
                    }
                  >
                    {region.name ||
                      region.region_name ||
                      region.title}
                  </option>
                ))}
              </select>

            </div>

          </section>

          {/* ==================================================
              JOB SECTION
          ================================================== */}

          <section className="hr-jobs-section">

            <div className="hr-jobs-heading">

              <div>
                <div className="hr-section-eyebrow">
                  LOWONGAN
                </div>

                <h2>
                  Daftar Lowongan
                </h2>
              </div>

              <span className="hr-result-count">
                {filteredJobs.length} lowongan
              </span>

            </div>

            {filteredJobs.length === 0 ? (
              <div className="hr-empty-state">

                <div className="hr-empty-icon">
                  —
                </div>

                <h3>
                  Tidak ada lowongan ditemukan
                </h3>

                <p>
                  Coba ubah kata kunci atau filter
                  yang sedang digunakan.
                </p>

              </div>
            ) : (
              <div className="hr-job-list">

                {filteredJobs.map((job) => (

                  <article
                    key={job.id}
                    className="hr-job-card"
                  >

                    {/* LOGO */}

                    <div className="hr-job-logo">

                      {job.logo ? (
                        <img
                          src={job.logo}
                          alt={getJobTitle(job)}
                        />
                      ) : (
                        <div className="hr-job-logo-fallback">
                          BSU
                        </div>
                      )}

                    </div>

                    {/* MAIN INFO */}

                    <div className="hr-job-main">

                      <div className="hr-job-title-row">

                        <div>

                          <h3>
                            {getJobTitle(job)}
                          </h3>

                          <div className="hr-job-location">

                            <span>
                              {getDivisionName(job)}
                            </span>

                            <i>
                              •
                            </i>

                            <span>
                              {getRegionName(job)}
                            </span>

                          </div>

                        </div>

                        <span
                          className={`hr-status-badge ${getStatusClass(
                            job.status
                          )}`}
                        >
                          <span />
                          {getStatusLabel(
                            job.status
                          )}
                        </span>

                      </div>

                      <div className="hr-job-meta">

                        <div>
                          <span>
                            KUOTA
                          </span>

                          <strong>
                            {job.quota ?? "-"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            PELAMAR
                          </span>

                          <strong>
                            {
                              applications.filter(
                                (application) =>
                                  String(application.job) === String(job.id)
                              ).length
                            }
                          </strong>
                        </div>

                        <div>
                          <span>
                            DEADLINE
                          </span>

                          <strong>
                            {job.deadline || "-"}
                          </strong>
                        </div>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="hr-job-actions">

                      <button
                        className="hr-action-secondary"
                        onClick={() =>
                          navigate(`/hr/jobs/${job.id}`)
                        }
                      >
                        Detail
                      </button>

                      <button
                        className="hr-action-secondary"
                        onClick={() =>
                          navigate(
                            `/hr/jobs/${job.id}/edit`
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="hr-action-primary"
                        onClick={() =>
                          navigate(
                            `/hr/applications?job=${job.id}`
                          )
                        }
                      >
                        Pelamar
                      </button>

                    </div>

                  </article>

                ))}

              </div>
            )}

          </section>

        </div>
      </main>

      <DashboardStyles />
    </>
  );
}

// ==========================================================
// HR NAVBAR
// ==========================================================

function HRNavbar({ onLogout }) {
  return (
    <header className="hr-navbar">

      <div className="hr-navbar-inner">

        {/* LOGO */}

        <button
          type="button"
          className="hr-navbar-logo"
          onClick={() =>
            window.location.href = "/hr/dashboard"
          }
          aria-label="Dashboard HR"
        >
          <img
            src={logoBSU}
            alt="PT Bintang Sayap Utama"
          />
        </button>

        {/* ROLE */}

        <div className="hr-navbar-right">

          <div className="hr-navbar-role">
            <span className="hr-navbar-role-dot" />
            Portal HR
          </div>

          <button
            type="button"
            className="hr-navbar-logout"
            onClick={onLogout}
          >
            Keluar
          </button>

        </div>

      </div>

    </header>
  );
}

// ==========================================================
// STYLES
// ==========================================================

function DashboardStyles() {
  return (
    <style>
      {`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        /* =====================================================
           NAVBAR
        ===================================================== */

        .hr-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;

          height: 72px;

          background:
            rgba(7, 26, 61, 0.96);

          border-bottom:
            1px solid rgba(255,255,255,0.10);

          backdrop-filter:
            blur(16px);

          -webkit-backdrop-filter:
            blur(16px);
        }

        .hr-navbar-inner {
          width: 100%;
          height: 72px;

          padding:
            0 28px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;
        }

        .hr-navbar-logo {
          display: flex;
          align-items: center;

          padding: 0;

          border: 0;
          outline: none;

          background: transparent;

          cursor: pointer;
        }

        .hr-navbar-logo img {
          height: 44px;
          width: auto;

          object-fit: contain;

          display: block;
        }

        .hr-navbar-right {
          display: flex;
          align-items: center;

          gap: 16px;
        }

        .hr-navbar-role {
          display: flex;
          align-items: center;

          gap: 7px;

          color:
            rgba(255,255,255,0.65);

          font-size: 12px;
          font-weight: 700;
        }

        .hr-navbar-role-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #60a5fa;

          box-shadow:
            0 0 0 4px
            rgba(96,165,250,0.12);
        }

        .hr-navbar-logout {
          height: 40px;

          padding:
            0 18px;

          border-radius: 9px;

          border:
            1px solid
            rgba(255,255,255,0.20);

          background:
            rgba(255,255,255,0.06);

          color: #ffffff;

          font-size: 13px;
          font-weight: 800;

          cursor: pointer;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .hr-navbar-logout:hover {
          background:
            rgba(255,255,255,0.13);

          border-color:
            rgba(255,255,255,0.32);

          transform:
            translateY(-1px);
        }

        /* =====================================================
           PAGE
        ===================================================== */

        .hr-dashboard-page {
          min-height: 100vh;

          padding:
            110px 24px 70px;

          background: #f4f6f9;

          color: #071a3d;
        }

        .hr-dashboard-container {
          width: 100%;

          max-width: 1240px;

          margin: 0 auto;
        }

        /* =====================================================
           HERO
        ===================================================== */

        .hr-dashboard-hero {
          position: relative;

          overflow: hidden;

          min-height: 270px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 40px;

          padding:
            42px 46px;

          border-radius: 22px;

          background:
            linear-gradient(
              125deg,
              #061735 0%,
              #071a3d 55%,
              #0b4ea2 100%
            );

          box-shadow:
            0 22px 55px
            rgba(7,26,61,0.15);
        }

        .hr-hero-pattern {
          position: absolute;

          inset: 0;

          opacity: 0.45;

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

          background-size:
            46px 46px;

          pointer-events: none;
        }

        .hr-dashboard-hero::after {
          content: "";

          position: absolute;

          width: 380px;
          height: 380px;

          right: -160px;
          top: -210px;

          border:
            1px solid
            rgba(147,197,253,0.13);

          border-radius: 50%;

          box-shadow:
            0 0 0 60px
            rgba(147,197,253,0.025),
            0 0 0 120px
            rgba(147,197,253,0.018);

          pointer-events: none;
        }

        .hr-dashboard-hero-circle {
          position: absolute;

          width: 250px;
          height: 250px;

          right: 170px;
          bottom: -220px;

          border-radius: 50%;

          border:
            1px solid
            rgba(147,197,253,0.08);

          pointer-events: none;
        }

        .hr-hero-content {
          position: relative;

          z-index: 2;

          max-width: 700px;
        }

        .hr-eyebrow {
          margin-bottom: 14px;

          color: #93c5fd;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 2px;
        }

        .hr-hero-content h1 {
          margin: 0;

          color: #ffffff;

          font-size:
            clamp(32px, 4vw, 48px);

          line-height: 1.08;

          letter-spacing: -1.8px;

          font-weight: 900;
        }

        .hr-hero-content h1 span {
          color: #60a5fa;
        }

        .hr-hero-content p {
          max-width: 590px;

          margin:
            17px 0 0;

          color: #cbdcf2;

          font-size: 14px;

          line-height: 1.7;
        }

        .hr-hero-actions {
          position: relative;

          z-index: 3;

          display: flex;

          flex-direction: column;

          gap: 10px;

          min-width: 190px;
        }

        .hr-hero-primary,
        .hr-hero-secondary {
          height: 45px;

          padding:
            0 18px;

          border-radius: 9px;

          font-size: 12px;

          font-weight: 800;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .hr-hero-primary {
          border: none;

          background: #ffffff;

          color: #071a3d;
        }

        .hr-hero-secondary {
          display: flex;

          align-items: center;

          justify-content: space-between;

          border:
            1px solid
            rgba(255,255,255,0.20);

          background:
            rgba(255,255,255,0.07);

          color: #ffffff;
        }

        .hr-hero-primary:hover,
        .hr-hero-secondary:hover {
          transform:
            translateY(-1px);
        }

        .hr-hero-secondary:hover {
          background:
            rgba(255,255,255,0.13);
        }

        /* =====================================================
           STATISTICS
        ===================================================== */

        .hr-stat-grid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 14px;

          margin-top: 18px;
        }

        .hr-stat-card {
          padding: 20px;

          background: #ffffff;

          border:
            1px solid #e2e8f0;

          border-radius: 15px;

          box-shadow:
            0 8px 25px
            rgba(7,26,61,0.04);
        }

        .hr-stat-top {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 17px;
        }

        .hr-stat-top > span {
          color: #94a3b8;

          font-size: 9px;

          font-weight: 900;

          letter-spacing: 1.3px;
        }

        .hr-stat-icon {
          width: 34px;
          height: 34px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 9px;

          background: #edf4ff;

          color: #0b4ea2;

          font-size: 9px;

          font-weight: 900;
        }

        .hr-stat-card > strong {
          display: block;

          color: #071a3d;

          font-size: 29px;

          line-height: 1;

          font-weight: 900;

          letter-spacing: -1px;
        }

        .hr-stat-card > p {
          margin:
            8px 0 0;

          color: #94a3b8;

          font-size: 11px;
        }

        /* =====================================================
           FILTER
        ===================================================== */

        .hr-filter-panel {
          margin-top: 24px;

          padding: 24px;

          background: #ffffff;

          border:
            1px solid #e2e8f0;

          border-radius: 17px;

          box-shadow:
            0 8px 28px
            rgba(7,26,61,0.04);
        }

        .hr-filter-header {
          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 20px;

          margin-bottom: 18px;
        }

        .hr-section-eyebrow {
          margin-bottom: 6px;

          color: #0b4ea2;

          font-size: 9px;

          font-weight: 900;

          letter-spacing: 1.5px;
        }

        .hr-filter-header h2,
        .hr-jobs-heading h2 {
          margin: 0;

          color: #071a3d;

          font-size: 21px;

          font-weight: 850;

          letter-spacing: -0.5px;
        }

        .hr-reset-filter {
          border: none;

          background: transparent;

          color: #0b4ea2;

          font-size: 11px;

          font-weight: 800;

          cursor: pointer;
        }

        .hr-reset-filter:hover {
          color: #071a3d;
        }

        .hr-filter-grid {
          display: grid;

          grid-template-columns:
            2fr 1fr 1fr;

          gap: 10px;
        }

        .hr-search-wrapper {
          position: relative;
        }

        .hr-search-wrapper > span {
          position: absolute;

          left: 14px;
          top: 50%;

          transform:
            translateY(-50%);

          color: #94a3b8;

          font-size: 19px;
        }

        .hr-search-wrapper input,
        .hr-filter-grid select {
          width: 100%;

          height: 46px;

          border:
            1px solid #dbe2ea;

          border-radius: 9px;

          outline: none;

          background: #f8fafc;

          color: #334155;

          font-size: 12px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .hr-search-wrapper input {
          padding:
            0 14px 0 40px;
        }

        .hr-filter-grid select {
          padding:
            0 13px;
        }

        .hr-search-wrapper input:focus,
        .hr-filter-grid select:focus {
          border-color: #0b4ea2;

          background: #ffffff;

          box-shadow:
            0 0 0 3px
            rgba(11,78,162,0.07);
        }

        /* =====================================================
           JOB SECTION
        ===================================================== */

        .hr-jobs-section {
          margin-top: 32px;
        }

        .hr-jobs-heading {
          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 20px;

          margin-bottom: 15px;
        }

        .hr-result-count {
          color: #64748b;

          font-size: 11px;

          font-weight: 700;
        }

        .hr-job-list {
          display: flex;

          flex-direction: column;

          gap: 11px;
        }

        .hr-job-card {
          display: grid;

          grid-template-columns:
            64px minmax(0, 1fr) auto;

          align-items: center;

          gap: 18px;

          padding: 17px;

          background: #ffffff;

          border:
            1px solid #e2e8f0;

          border-radius: 15px;

          box-shadow:
            0 6px 22px
            rgba(7,26,61,0.035);

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .hr-job-card:hover {
          border-color: #cbdcf2;

          box-shadow:
            0 12px 30px
            rgba(7,26,61,0.07);

          transform:
            translateY(-1px);
        }

        .hr-job-logo {
          width: 64px;
          height: 64px;

          display: flex;

          align-items: center;
          justify-content: center;

          overflow: hidden;

          border:
            1px solid #e2e8f0;

          border-radius: 12px;

          background: #f8fafc;
        }

        .hr-job-logo img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .hr-job-logo-fallback {
          color: #0b4ea2;

          font-size: 12px;

          font-weight: 900;

          letter-spacing: 0.5px;
        }

        .hr-job-main {
          min-width: 0;
        }

        .hr-job-title-row {
          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 16px;
        }

        .hr-job-title-row h3 {
          margin: 0;

          color: #071a3d;

          font-size: 16px;

          line-height: 1.35;

          font-weight: 850;
        }

        .hr-job-location {
          display: flex;

          flex-wrap: wrap;

          align-items: center;

          gap: 7px;

          margin-top: 6px;

          color: #64748b;

          font-size: 11px;
        }

        .hr-job-location i {
          color: #cbd5e1;

          font-style: normal;
        }

        /* =====================================================
           STATUS
        ===================================================== */

        .hr-status-badge {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          flex-shrink: 0;

          padding:
            5px 9px;

          border-radius: 999px;

          font-size: 9px;

          font-weight: 800;
        }

        .hr-status-badge > span {
          width: 5px;
          height: 5px;

          border-radius: 50%;
        }

        .status-active {
          background: #ecfdf5;

          color: #047857;
        }

        .status-active > span {
          background: #10b981;
        }

        .status-closed {
          background: #f1f5f9;

          color: #64748b;
        }

        .status-closed > span {
          background: #94a3b8;
        }

        /* =====================================================
           JOB META
        ===================================================== */

        .hr-job-meta {
          display: flex;

          flex-wrap: wrap;

          gap: 24px;

          margin-top: 13px;
        }

        .hr-job-meta > div {
          display: flex;

          flex-direction: column;

          gap: 3px;
        }

        .hr-job-meta span {
          color: #94a3b8;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: 1px;
        }

        .hr-job-meta strong {
          color: #334155;

          font-size: 11px;

          font-weight: 750;
        }

        /* =====================================================
           ACTIONS
        ===================================================== */

        .hr-job-actions {
          display: flex;

          align-items: center;

          gap: 7px;

          flex-wrap: wrap;

          justify-content: flex-end;
        }

        .hr-action-primary,
        .hr-action-secondary {
          height: 35px;

          padding:
            0 12px;

          border-radius: 8px;

          font-size: 10px;

          font-weight: 800;

          cursor: pointer;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .hr-action-secondary {
          border:
            1px solid #dbe2ea;

          background: #ffffff;

          color: #334155;
        }

        .hr-action-primary {
          border:
            1px solid #0b4ea2;

          background: #0b4ea2;

          color: #ffffff;
        }

        .hr-action-secondary:hover {
          border-color: #b8c9dd;

          background: #f8fafc;
        }

        .hr-action-primary:hover {
          background: #093f85;

          transform:
            translateY(-1px);
        }

        /* =====================================================
           EMPTY
        ===================================================== */

        .hr-empty-state {
          padding:
            65px 30px;

          text-align: center;

          background: #ffffff;

          border:
            1px solid #e2e8f0;

          border-radius: 16px;
        }

        .hr-empty-icon {
          width: 42px;
          height: 42px;

          margin:
            0 auto 14px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 11px;

          background: #f1f5f9;

          color: #94a3b8;

          font-size: 20px;

          font-weight: 800;
        }

        .hr-empty-state h3 {
          margin:
            0 0 7px;

          color: #334155;

          font-size: 16px;
        }

        .hr-empty-state p {
          margin: 0;

          color: #94a3b8;

          font-size: 12px;
        }

        /* =====================================================
           LOADING
        ===================================================== */

        .hr-loading {
          max-width: 500px;

          margin:
            130px auto;

          text-align: center;
        }

        .hr-loading-spinner {
          width: 38px;
          height: 38px;

          margin:
            0 auto 20px;

          border:
            3px solid #dbeafe;

          border-top-color:
            #0b4ea2;

          border-radius: 50%;

          animation:
            hr-spin 0.8s linear infinite;
        }

        .hr-loading h2 {
          margin:
            0 0 8px;

          color: #071a3d;

          font-size: 22px;
        }

        .hr-loading p {
          margin: 0;

          color: #64748b;

          font-size: 14px;
        }

        @keyframes hr-spin {
          to {
            transform:
              rotate(360deg);
          }
        }

        /* =====================================================
           ERROR
        ===================================================== */

        .hr-error-card {
          max-width: 760px;

          margin:
            80px auto;

          padding: 32px;

          display: flex;

          align-items: flex-start;

          gap: 20px;

          background: #ffffff;

          border:
            1px solid #e2e8f0;

          border-radius: 18px;

          box-shadow:
            0 15px 40px
            rgba(7,26,61,0.07);
        }

        .hr-error-icon {
          width: 44px;
          height: 44px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background: #fef2f2;

          color: #dc2626;

          font-size: 20px;

          font-weight: 900;
        }

        .hr-error-label {
          margin-bottom: 7px;

          color: #dc2626;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 1.5px;
        }

        .hr-error-card h2 {
          margin:
            0 0 8px;

          color: #071a3d;

          font-size: 22px;
        }

        .hr-error-card p {
          margin:
            0 0 20px;

          color: #64748b;

          font-size: 14px;
        }

        .hr-primary-button {
          height: 42px;

          padding:
            0 18px;

          border: none;

          border-radius: 9px;

          background: #0b4ea2;

          color: #ffffff;

          font-size: 13px;

          font-weight: 800;

          cursor: pointer;
        }

        .hr-primary-button:hover {
          background: #093f85;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1050px) {

          .hr-stat-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .hr-job-card {
            grid-template-columns:
              64px minmax(0, 1fr);
          }

          .hr-job-actions {
            grid-column: 2;

            justify-content:
              flex-start;
          }

        }

        @media (max-width: 800px) {

          .hr-dashboard-page {
            padding:
              100px 16px 50px;
          }

          .hr-dashboard-hero {
            flex-direction: column;

            align-items: flex-start;

            padding:
              32px 28px;
          }

          .hr-hero-actions {
            width: 100%;

            flex-direction: row;
          }

          .hr-hero-primary,
          .hr-hero-secondary {
            flex: 1;
          }

          .hr-filter-grid {
            grid-template-columns: 1fr;
          }

          .hr-navbar-role {
            display: none;
          }

        }

        @media (max-width: 600px) {

          .hr-navbar-inner {
            padding:
              0 18px;
          }

          .hr-navbar-logo img {
            height: 40px;
          }

          .hr-stat-grid {
            grid-template-columns:
              1fr 1fr;

            gap: 9px;
          }

          .hr-stat-card {
            padding: 15px;
          }

          .hr-stat-top > span {
            font-size: 8px;
          }

          .hr-stat-card > strong {
            font-size: 24px;
          }

          .hr-stat-card > p {
            font-size: 9px;
          }

          .hr-filter-panel {
            padding: 18px;
          }

          .hr-filter-header {
            align-items: flex-start;
          }

          .hr-filter-header h2,
          .hr-jobs-heading h2 {
            font-size: 18px;
          }

          .hr-job-card {
            grid-template-columns:
              50px minmax(0, 1fr);

            gap: 13px;

            padding: 14px;
          }

          .hr-job-logo {
            width: 50px;
            height: 50px;
          }

          .hr-job-title-row {
            flex-direction: column;

            gap: 8px;
          }

          .hr-job-meta {
            gap: 15px;
          }

          .hr-job-actions {
            grid-column:
              1 / -1;

            padding-top: 5px;

            border-top:
              1px solid #edf0f5;
          }

          .hr-action-primary,
          .hr-action-secondary {
            flex: 1;
          }

        }

        @media (max-width: 450px) {

          .hr-stat-grid {
            grid-template-columns: 1fr;
          }

          .hr-hero-actions {
            flex-direction: column;
          }

          .hr-job-actions {
            flex-direction: column;
          }

          .hr-action-primary,
          .hr-action-secondary {
            width: 100%;
          }

          .hr-error-card {
            flex-direction: column;
          }

        }

      `}
    </style>
  );
}

export default HRDashboard;