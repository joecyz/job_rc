import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLatestJobs } from "../../services/publicService";

function LatestJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getLatestJobs();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const activeJobs = data
        .filter((job) => {
          if (job.status !== "OPEN") return false;

          const deadline = new Date(`${job.deadline}T00:00:00`);
          deadline.setHours(0, 0, 0, 0);

          return deadline >= today;
        })
        .sort((a, b) => {
          const deadlineA = new Date(`${a.deadline}T00:00:00`);
          const deadlineB = new Date(`${b.deadline}T00:00:00`);

          return deadlineA - deadlineB;
        })
        .slice(0, 3);

      setJobs(activeJobs);
    } catch (error) {
      console.error("GET LATEST JOBS ERROR:", error);
    }
  };

  return (
    <section
      style={{
        padding: "82px 36px",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1180px",
          margin: "0 auto",
        }}
      >
        {/* SECTION HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "30px",
            marginBottom: "34px",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "9px",
                marginBottom: "13px",
                color: "#0b4ea2",
                fontSize: "12px",
                fontWeight: "800",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: "30px",
                  height: "2px",
                  background: "#0b4ea2",
                  display: "inline-block",
                }}
              />

              Career Opportunity
            </div>

            <h2
              style={{
                margin: "0 0 9px",
                color: "#071a3d",
                fontSize: "34px",
                lineHeight: "1.2",
                fontWeight: "800",
                letterSpacing: "-0.6px",
              }}
            >
              Lowongan Terbaru
            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "15px",
                lineHeight: "1.6",
              }}
            >
              Temukan peluang karier yang sesuai dengan kemampuan dan
              potensimu.
            </p>
          </div>

          <Link
            to="/jobs"
            style={{
              flexShrink: 0,
              color: "#0b4ea2",
              fontSize: "14px",
              fontWeight: "800",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Lihat Semua Lowongan →
          </Link>
        </div>

        {/* JOB CARDS */}
        {jobs.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {jobs.map((job) => (
              <article
                key={job.id}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "255px",
                  padding: "25px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow:
                    "0 8px 25px rgba(7, 26, 61, 0.055)",
                  boxSizing: "border-box",
                }}
              >
                {/* Top accent */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 24,
                    right: 24,
                    height: "3px",
                    borderRadius: "0 0 4px 4px",
                    background: "#0b4ea2",
                  }}
                />

                {/* Division */}
                <div
                  style={{
                    display: "inline-flex",
                    alignSelf: "flex-start",
                    alignItems: "center",
                    minHeight: "28px",
                    padding: "0 10px",
                    marginBottom: "16px",
                    borderRadius: "5px",
                    background: "#eef5fd",
                    color: "#0b4ea2",
                    fontSize: "11px",
                    fontWeight: "800",
                    letterSpacing: "0.3px",
                    textTransform: "uppercase",
                  }}
                >
                  {job.division_name}
                </div>

                {/* Position */}
                <h3
                  style={{
                    margin: "0 0 20px",
                    color: "#071a3d",
                    fontSize: "20px",
                    lineHeight: "1.35",
                    fontWeight: "800",
                  }}
                >
                  {job.position_name}
                </h3>

                {/* Information */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "22px",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 13px",
                      borderRadius: "8px",
                      background: "#f8fafc",
                      border: "1px solid #edf1f5",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: "4px",
                        color: "#94a3b8",
                        fontSize: "11px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                      }}
                    >
                      Kuota
                    </div>

                    <strong
                      style={{
                        color: "#071a3d",
                        fontSize: "14px",
                        fontWeight: "800",
                      }}
                    >
                      {job.quota}
                    </strong>
                  </div>

                  <div
                    style={{
                      padding: "12px 13px",
                      borderRadius: "8px",
                      background: "#f8fafc",
                      border: "1px solid #edf1f5",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: "4px",
                        color: "#94a3b8",
                        fontSize: "11px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                      }}
                    >
                      Deadline
                    </div>

                    <strong
                      style={{
                        color: "#071a3d",
                        fontSize: "14px",
                        fontWeight: "800",
                      }}
                    >
                      {job.deadline}
                    </strong>
                  </div>
                </div>

                {/* Detail */}
                <Link
                  to={`/jobs/${job.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "auto",
                    paddingTop: "15px",
                    borderTop: "1px solid #edf1f5",
                    color: "#0b4ea2",
                    fontSize: "14px",
                    fontWeight: "800",
                    textDecoration: "none",
                  }}
                >
                  <span>Lihat Detail</span>
                  <span
                    style={{
                      fontSize: "17px",
                      lineHeight: 1,
                    }}
                  >
                    →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "45px 25px",
              textAlign: "center",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              background: "#f8fafc",
            }}
          >
            <div
              style={{
                marginBottom: "8px",
                color: "#071a3d",
                fontSize: "16px",
                fontWeight: "800",
              }}
            >
              Belum Ada Lowongan
            </div>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Saat ini belum ada lowongan aktif yang tersedia.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default LatestJobs;