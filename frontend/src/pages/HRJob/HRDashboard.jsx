import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getJobs,
  deleteJob,
} from "../services/jobService";

export default function HRDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);

      const data = await getJobs();

      const jobList = Array.isArray(data)
        ? data
        : data?.results || [];

      setJobs(jobList);
    } catch (error) {
      console.error("GET JOBS ERROR:", error);

      showToast(
        error?.response?.data?.detail ||
        "Gagal mengambil data lowongan.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (job) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus lowongan "${job.position_name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteJob(job.id);

      showToast("Lowongan berhasil dihapus.", "success");

      await loadJobs();
    } catch (error) {
      console.error("DELETE JOB ERROR:", error);

      showToast(
        error?.response?.data?.detail ||
        "Gagal menghapus lowongan.",
        "error"
      );
    }
  };

  const divisions = useMemo(() => {
    return [
      ...new Set(
        jobs
          .map((job) => job.division_name)
          .filter(Boolean)
      ),
    ];
  }, [jobs]);

  const regions = useMemo(() => {
    return [
      ...new Set(
        jobs
          .map((job) => job.region_name)
          .filter(Boolean)
      ),
    ];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        job.position_name
          ?.toLowerCase()
          .includes(searchText) ||
        job.division_name
          ?.toLowerCase()
          .includes(searchText) ||
        job.region_name
          ?.toLowerCase()
          .includes(searchText) ||
        job.description
          ?.toLowerCase()
          .includes(searchText);

      const matchesDivision =
        !divisionFilter ||
        job.division_name === divisionFilter;

      const matchesRegion =
        !regionFilter ||
        job.region_name === regionFilter;

      return (
        matchesSearch &&
        matchesDivision &&
        matchesRegion
      );
    });
  }, [
    jobs,
    search,
    divisionFilter,
    regionFilter,
  ]);

  const totalApplicants = jobs.reduce(
    (total, job) => {
      if (job.is_full) {
        return total + Number(job.quota || 0);
      }

      return total;
    },
    0
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.header}>

          <div>
            <h1 style={styles.title}>
              HR Dashboard
            </h1>

            <p style={styles.subtitle}>
              Kelola lowongan dan pantau kebutuhan rekrutmen.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/hr/jobs/create")
            }
            style={styles.addButton}
          >
            + Tambah Lowongan
          </button>

        </div>

        <div style={styles.stats}>

          <div style={styles.statCard}>
            <div style={styles.statTitle}>
              Total Lowongan
            </div>

            <div style={styles.statNumber}>
              {jobs.length}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTitle}>
              Total Pelamar
            </div>

            <div style={styles.statNumber}>
              {totalApplicants}
            </div>
          </div>

        </div>

        <div style={styles.filters}>

          <input
            type="text"
            placeholder="Cari lowongan..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={styles.searchInput}
          />

          <select
            value={divisionFilter}
            onChange={(e) =>
              setDivisionFilter(e.target.value)
            }
            style={styles.select}
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
            value={regionFilter}
            onChange={(e) =>
              setRegionFilter(e.target.value)
            }
            style={styles.select}
          >
            <option value="">
              Semua Region
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

        </div>

        <h2 style={styles.sectionTitle}>
          Daftar Lowongan
        </h2>

        {loading ? (
          <p>Loading lowongan...</p>
        ) : filteredJobs.length === 0 ? (
          <div style={styles.empty}>
            Tidak ada lowongan ditemukan.
          </div>
        ) : (
          <div>

            {filteredJobs.map((job) => (

              <div
                key={job.id}
                style={styles.jobCard}
              >

                <div style={styles.logoBox}>
                  No Logo
                </div>

                <div style={styles.jobInfo}>

                  <h3 style={styles.jobPosition}>
                    {job.position_name}
                  </h3>

                  <p style={styles.jobDivision}>
                    {job.division_name}
                  </p>

                  <p style={styles.jobRegion}>
                    {job.region_name}
                  </p>

                  <div style={styles.jobMeta}>

                    <span>
                      Status:{" "}
                      <strong>
                        {job.status}
                      </strong>
                    </span>

                    <span>
                      Quota:{" "}
                      <strong>
                        {job.quota}
                      </strong>
                    </span>

                    <span>
                      Deadline:{" "}
                      <strong>
                        {job.deadline}
                      </strong>
                    </span>

                  </div>

                </div>

                <div style={styles.actions}>

                  <button
                    onClick={() =>
                      navigate(
                        `/hr/jobs/${job.id}`
                      )
                    }
                    style={styles.button}
                  >
                    Lihat Detail
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/hr/jobs/${job.id}/edit`
                      )
                    }
                    style={styles.button}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/hr/applications?job=${job.id}`
                      )
                    }
                    style={styles.button}
                  >
                    Applicants
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(job)
                    }
                    style={styles.deleteButton}
                  >
                    Hapus
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#15161c",
    color: "#fff",
    padding: "50px 20px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "35px",
  },

  title: {
    fontSize: "46px",
    margin: 0,
  },

  subtitle: {
    marginTop: "5px",
    color: "#777",
  },

  addButton: {
    padding: "13px 20px",
    border: "none",
    borderRadius: "6px",
    background: "#777",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginBottom: "25px",
  },

  statCard: {
    border: "1px solid #aaa",
    borderRadius: "10px",
    padding: "25px",
    textAlign: "center",
  },

  statTitle: {
    color: "#777",
    marginBottom: "10px",
  },

  statNumber: {
    fontSize: "24px",
    fontWeight: "bold",
  },

  filters: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: "12px",
    marginBottom: "30px",
  },

  searchInput: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #aaa",
    background: "#333",
    color: "#fff",
  },

  select: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #aaa",
    background: "#333",
    color: "#fff",
  },

  sectionTitle: {
    textAlign: "center",
    marginBottom: "20px",
  },

  jobCard: {
    display: "grid",
    gridTemplateColumns: "80px 1fr auto",
    alignItems: "center",
    gap: "20px",
    border: "1px solid #aaa",
    borderRadius: "10px",
    padding: "18px",
    marginBottom: "14px",
  },

  logoBox: {
    width: "58px",
    height: "58px",
    border: "1px solid #aaa",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    color: "#888",
  },

  jobInfo: {
    minWidth: 0,
  },

  jobPosition: {
    margin: "0 0 5px",
    fontSize: "20px",
  },

  jobDivision: {
    margin: "3px 0",
    color: "#aaa",
  },

  jobRegion: {
    margin: "3px 0",
    color: "#aaa",
  },

  jobMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginTop: "10px",
    color: "#888",
    fontSize: "13px",
  },

  actions: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: "8px",
  },

  button: {
    padding: "9px 12px",
    border: "none",
    borderRadius: "5px",
    background: "#777",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "12px",
  },

  deleteButton: {
    padding: "9px 12px",
    border: "none",
    borderRadius: "5px",
    background: "#a83232",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "12px",
  },

  empty: {
    border: "1px solid #aaa",
    borderRadius: "10px",
    padding: "40px",
    textAlign: "center",
    color: "#888",
  },
};