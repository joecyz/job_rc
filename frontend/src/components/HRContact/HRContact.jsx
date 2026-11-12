
import { useEffect, useState } from "react";
import api from "../../api/axios";

function HRContact() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch HR Contacts from Django API
  useEffect(() => {
    const fetchHRContacts = async () => {
      try {
        const response = await api.get("/contacts/");

        // Handle Django REST Framework pagination
        const contacts = response.data.results ?? response.data;

        setData(Array.isArray(contacts) ? contacts : []);
      } catch (err) {
        console.error("Failed to fetch HR Contacts:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHRContacts();
  }, []);

  return (
    <section
      style={{
        padding: "90px 24px",
        background: "#071a3d",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative shapes */}

      <div
        style={{
          position: "absolute",
          width: "340px",
          height: "340px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.07)",
          top: "-180px",
          right: "-110px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.05)",
          bottom: "-140px",
          left: "-100px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background: "rgba(20,87,166,0.18)",
          top: "45%",
          right: "8%",
          filter: "blur(2px)",
        }}
      />

      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "30px",
            marginBottom: "40px",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "7px 13px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#bfdbfe",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "15px",
              }}
            >
              Human Resources
            </div>

            <h2
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "clamp(30px, 4vw, 42px)",
                lineHeight: 1.15,
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              Contact HR
            </h2>

            <p
              style={{
                margin: "14px 0 0",
                maxWidth: "620px",
                color: "#bfdbfe",
                fontSize: "15px",
                lineHeight: 1.75,
              }}
            >
              Punya pertanyaan seputar proses recruitment?
              Hubungi tim HR sesuai dengan wilayah recruitment
              yang kamu pilih.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              color: "#dbeafe",
              fontSize: "13px",
              fontWeight: 700,
              whiteSpace: "nowrap",
              paddingBottom: "5px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#60a5fa",
                boxShadow: "0 0 0 5px rgba(96,165,250,0.12)",
              }}
            />

            Recruitment Support
          </div>
        </div>

        {/* LOADING STATE */}

        {loading && (
          <p
            style={{
              color: "#bfdbfe",
              textAlign: "center",
              padding: "30px",
            }}
          >
            Loading HR Contacts...
          </p>
        )}

        {/* ERROR STATE */}

        {error && (
          <p
            style={{
              color: "#fca5a5",
              textAlign: "center",
              padding: "30px",
            }}
          >
            Gagal memuat kontak HR. Silakan coba lagi.
          </p>
        )}

        {/* EMPTY STATE */}

        {!loading && !error && data.length === 0 && (
          <p
            style={{
              color: "#bfdbfe",
              textAlign: "center",
              padding: "30px",
            }}
          >
            Belum ada kontak HR yang tersedia.
          </p>
        )}

        {/* CONTACT GRID */}

        {!loading && !error && data.length > 0 && (
          <div
            className="hr-contact-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "16px",
            }}
          >
            {data.map((item, index) => (
              <div
                key={item.id}
                className="hr-contact-card"
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  padding: "24px",
                  minHeight: "185px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow:
                    "0 18px 45px rgba(0,0,0,0.14)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "22px",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "11px",
                        background: "#eaf2ff",
                        color: "#0b4ea2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 800,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <span
                      style={{
                        color: "#cbd5e1",
                        fontSize: "18px",
                        fontWeight: 700,
                      }}
                    >
                      →
                    </span>
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      color: "#071a3d",
                      fontSize: "18px",
                      fontWeight: 800,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.region}
                  </h3>

                  <p
                    style={{
                      margin: "7px 0 0",
                      color: "#64748b",
                      fontSize: "13px",
                    }}
                  >
                    {item.department}
                  </p>
                </div>

                <div
                  style={{
                    paddingTop: "16px",
                    marginTop: "18px",
                    borderTop: "1px solid #e2e8f0",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#334155",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {item.phone}
                  </p>

                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#94a3b8",
                      fontSize: "11px",
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM NOTE */}

        <div
          style={{
            marginTop: "24px",
            padding: "17px 20px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.055)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#bfdbfe",
            fontSize: "13px",
            lineHeight: 1.65,
          }}
        >
          Pastikan kamu menghubungi kontak HR sesuai wilayah
          recruitment yang tersedia untuk mendapatkan informasi
          yang tepat.
        </div>
      </div>

      {/* RESPONSIVE */}

      <style>
        {`
          .hr-contact-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 22px 50px rgba(0,0,0,0.20) !important;
          }

          @media (max-width: 900px) {
            .hr-contact-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 600px) {
            .hr-contact-grid {
              grid-template-columns: 1fr !important;
            }

            .hr-contact-card {
              min-height: 165px !important;
            }
          }

          @media (max-width: 700px) {
            .hr-contact-grid {
              gap: 12px !important;
            }
          }
        `}
      </style>
    </section>
  );
}

export default HRContact;