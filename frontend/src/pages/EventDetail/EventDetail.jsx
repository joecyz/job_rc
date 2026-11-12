import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import { getEventDetail } from "../../services/eventService";

function EventDetail() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEventDetail(id);

      setEvent(data);
    } catch (error) {
      console.error(
        "EVENT DETAIL ERROR:",
        error?.response?.data || error
      );

      setError("Gagal mengambil detail event.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HELPERS
  // =========================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatTime = (time) => {
    if (!time) return "-";

    return time.slice(0, 5);
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `http://127.0.0.1:8000${image}`;
  };

  const isPastEvent = () => {
    if (!event?.end_date) return false;

    const endDateTime = new Date(
      `${event.end_date}T${event.end_time || "23:59:59"}`
    );

    return endDateTime < new Date();
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <MainLayout>
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            background: "#f8fafc",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              padding: "55px 30px",
              textAlign: "center",
              boxShadow: "0 12px 30px rgba(7, 26, 61, 0.06)",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                border: "4px solid #e2e8f0",
                borderTopColor: "#0b4ea2",
                borderRadius: "50%",
                margin: "0 auto 20px",
                animation: "eventDetailSpin 0.8s linear infinite",
              }}
            />

            <h1
              style={{
                margin: "0 0 8px",
                color: "#071a3d",
                fontSize: "24px",
                fontWeight: "800",
              }}
            >
              Event Detail
            </h1>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Memuat informasi event...
            </p>
          </div>

          <style>
            {`
              @keyframes eventDetailSpin {
                from {
                  transform: rotate(0deg);
                }

                to {
                  transform: rotate(360deg);
                }
              }
            `}
          </style>
        </div>
      </MainLayout>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <MainLayout>
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            background: "#f8fafc",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              background: "#ffffff",
              border: "1px solid #fecaca",
              borderRadius: "20px",
              padding: "50px 30px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                background: "#fef2f2",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                fontSize: "24px",
                fontWeight: "800",
              }}
            >
              !
            </div>

            <h1
              style={{
                margin: "0 0 10px",
                color: "#071a3d",
                fontSize: "25px",
                fontWeight: "800",
              }}
            >
              Event Tidak Dapat Dimuat
            </h1>

            <p
              style={{
                margin: "0 0 25px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              {error}
            </p>

            <Link
              to="/events"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 20px",
                borderRadius: "10px",
                background: "#071a3d",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              ← Kembali ke Events
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // =========================
  // NOT FOUND
  // =========================

  if (!event) {
    return (
      <MainLayout>
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            background: "#f8fafc",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              padding: "50px 30px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                marginBottom: "16px",
              }}
            >
              📅
            </div>

            <h1
              style={{
                margin: "0 0 10px",
                color: "#071a3d",
                fontSize: "25px",
                fontWeight: "800",
              }}
            >
              Event Tidak Ditemukan
            </h1>

            <p
              style={{
                margin: "0 0 25px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Event yang kamu cari tidak tersedia.
            </p>

            <Link
              to="/events"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 20px",
                borderRadius: "10px",
                background: "#071a3d",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              ← Kembali ke Events
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const pastEvent = isPastEvent();
  const posterUrl = getImageUrl(event.poster);

  return (
    <MainLayout>
      <div
        className="event-detail-page"
        style={{
          background: "#f8fafc",
          minHeight: "100vh",
          padding: "32px 20px 80px",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
          }}
        >
          {/* BACK */}

          <div style={{ marginBottom: "18px" }}>
            <Link
              to="/events"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                color: "#475569",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: "700",
                padding: "9px 13px",
                borderRadius: "9px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                transition: "all 0.2s ease",
              }}
            >
              ← Kembali ke Events
            </Link>
          </div>

          {/* HERO */}

          <section
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "22px",
              background:
                "linear-gradient(135deg, #071a3d 0%, #0b4ea2 100%)",
              padding: "42px",
              marginBottom: "26px",
              color: "#ffffff",
              boxShadow:
                "0 18px 45px rgba(7, 26, 61, 0.15)",
            }}
          >
            {/* decorative shapes */}

            <div
              style={{
                position: "absolute",
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.045)",
                right: "-100px",
                top: "-130px",
              }}
            />

            <div
              style={{
                position: "absolute",
                width: "130px",
                height: "130px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.035)",
                right: "160px",
                bottom: "-80px",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
                maxWidth: "850px",
              }}
            >
              {/* badges */}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "18px",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "7px 12px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.12)",
                    border:
                      "1px solid rgba(255,255,255,0.18)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                  }}
                >
                  {event.category || "Event BSU"}
                </span>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "7px 12px",
                    borderRadius: "999px",
                    background: pastEvent
                      ? "rgba(255,255,255,0.10)"
                      : "rgba(37, 99, 235, 0.35)",
                    border:
                      "1px solid rgba(255,255,255,0.14)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "800",
                  }}
                >
                  {pastEvent
                    ? "Event Selesai"
                    : "Event Mendatang"}
                </span>
              </div>

              <h1
                style={{
                  margin: "0 0 12px",
                  fontSize: "clamp(30px, 5vw, 46px)",
                  lineHeight: "1.15",
                  fontWeight: "800",
                  letterSpacing: "-0.8px",
                }}
              >
                {event.title}
              </h1>

              <p
                style={{
                  margin: 0,
                  maxWidth: "760px",
                  color: "rgba(255,255,255,0.78)",
                  fontSize: "14px",
                  lineHeight: "1.8",
                }}
              >
                Informasi lengkap mengenai kegiatan dan
                event PT Bintang Sayap Utama.
              </p>
            </div>
          </section>

          {/* MAIN GRID */}

          <div
            className="event-detail-layout"
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1.65fr) minmax(290px, 0.75fr)",
              gap: "24px",
              alignItems: "start",
            }}
          >
            {/* LEFT */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "22px",
              }}
            >
              {/* POSTER */}

              {posterUrl && (
                <section
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "12px",
                    boxShadow:
                      "0 8px 25px rgba(7,26,61,0.05)",
                  }}
                >
                  <img
                    src={posterUrl}
                    alt={event.title}
                    style={{
                      width: "100%",
                      maxHeight: "560px",
                      objectFit: "cover",
                      display: "block",
                      borderRadius: "12px",
                    }}
                  />
                </section>
              )}

              {/* DESCRIPTION */}

              <section
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "28px",
                  boxShadow:
                    "0 8px 25px rgba(7,26,61,0.045)",
                }}
              >
                <SectionTitle title="Description" />

                <p
                  style={{
                    margin: 0,
                    color: "#475569",
                    fontSize: "15px",
                    lineHeight: "1.85",
                    whiteSpace: "pre-line",
                  }}
                >
                  {event.description || "-"}
                </p>
              </section>

              {/* ARTICLE */}

              {event.article && (
                <section
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "28px",
                    boxShadow:
                      "0 8px 25px rgba(7,26,61,0.045)",
                  }}
                >
                  <SectionTitle title="Article" />

                  <p
                    style={{
                      margin: 0,
                      color: "#475569",
                      fontSize: "15px",
                      lineHeight: "1.85",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {event.article}
                  </p>
                </section>
              )}

              {/* GALLERY */}

              {pastEvent && (
                <section
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "28px",
                    boxShadow:
                      "0 8px 25px rgba(7,26,61,0.045)",
                  }}
                >
                  <SectionTitle title="Dokumentasi" />

                  {Array.isArray(event.gallery) &&
                  event.gallery.length > 0 ? (
                    <div
                      className="event-gallery"
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(2, minmax(0, 1fr))",
                        gap: "14px",
                      }}
                    >
                      {event.gallery.map((photo, index) => {
                        const image =
                          typeof photo === "string"
                            ? photo
                            : photo?.image ||
                              photo?.photo ||
                              photo?.url;

                        const imageUrl =
                          getImageUrl(image);

                        return (
                          <div
                            key={photo?.id || index}
                            style={{
                              overflow: "hidden",
                              borderRadius: "14px",
                              border:
                                "1px solid #e2e8f0",
                              background: "#f8fafc",
                            }}
                          >
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={`Dokumentasi ${
                                  event.title
                                } ${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "260px",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  height: "260px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#64748b",
                                  fontSize: "13px",
                                }}
                              >
                                Image tidak tersedia
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      style={{
                        background: "#f8fafc",
                        border:
                          "1px dashed #cbd5e1",
                        borderRadius: "14px",
                        padding: "32px 20px",
                        textAlign: "center",
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    >
                      Belum ada dokumentasi untuk event
                      ini.
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* SIDEBAR */}

            <aside
              className="event-detail-sidebar"
              style={{
                position: "sticky",
                top: "92px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "25px",
                boxShadow:
                  "0 10px 30px rgba(7,26,61,0.06)",
              }}
            >
              <div
                style={{
                  color: "#64748b",
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "7px",
                }}
              >
                Informasi Event
              </div>

              <h2
                style={{
                  margin: "0 0 20px",
                  color: "#071a3d",
                  fontSize: "21px",
                  fontWeight: "800",
                }}
              >
                Detail Kegiatan
              </h2>

              <div
                style={{
                  height: "1px",
                  background: "#e2e8f0",
                  marginBottom: "4px",
                }}
              />

              <InfoItem
                label="Category"
                value={event.category || "-"}
              />

              <InfoItem
                label="Location"
                value={event.location || "-"}
              />

              <InfoItem
                label="City"
                value={event.city || "-"}
              />

              <InfoItem
                label="Start"
                value={
                  <>
                    {formatDate(event.start_date)}
                    <br />
                    <span
                      style={{
                        color: "#0b4ea2",
                        fontWeight: "800",
                      }}
                    >
                      {formatTime(event.start_time)}
                    </span>
                  </>
                }
              />

              <InfoItem
                label="End"
                value={
                  <>
                    {formatDate(event.end_date)}
                    <br />
                    <span
                      style={{
                        color: "#0b4ea2",
                        fontWeight: "800",
                      }}
                    >
                      {formatTime(event.end_time)}
                    </span>
                  </>
                }
              />

              {/* STATUS */}

              <div
                style={{
                  marginTop: "18px",
                  padding: "15px",
                  borderRadius: "12px",
                  background: pastEvent
                    ? "#f8fafc"
                    : "#eff6ff",
                  border: pastEvent
                    ? "1px solid #e2e8f0"
                    : "1px solid #bfdbfe",
                }}
              >
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "10px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "0.7px",
                    marginBottom: "5px",
                  }}
                >
                  Status
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: pastEvent
                      ? "#64748b"
                      : "#0b4ea2",
                    fontSize: "14px",
                    fontWeight: "800",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: pastEvent
                        ? "#94a3b8"
                        : "#2563eb",
                    }}
                  />

                  {pastEvent
                    ? "Event Selesai"
                    : "Event Aktif"}
                </div>
              </div>

              <Link
                to="/events"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "18px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  background: "#071a3d",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: "700",
                  transition: "all 0.2s ease",
                }}
              >
                ← Kembali ke Events
              </Link>
            </aside>
          </div>
        </div>

        {/* RESPONSIVE */}

        <style>
          {`
            .event-detail-page a:hover {
              transform: translateY(-1px);
            }

            @media (max-width: 900px) {
              .event-detail-layout {
                grid-template-columns: 1fr !important;
              }

              .event-detail-sidebar {
                position: static !important;
              }
            }

            @media (max-width: 600px) {
              .event-detail-page {
                padding: 24px 14px 60px !important;
              }

              .event-detail-page section {
                border-radius: 15px !important;
              }

              .event-gallery {
                grid-template-columns: 1fr !important;
              }

              .event-gallery img {
                height: 230px !important;
              }
            }
          `}
        </style>
      </div>
    </MainLayout>
  );
}

/* =========================
   SECTION TITLE
========================= */

function SectionTitle({ title }) {
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
          height: "26px",
          borderRadius: "999px",
          background:
            "linear-gradient(180deg, #0b4ea2, #1457a6)",
        }}
      />

      <h2
        style={{
          margin: 0,
          color: "#071a3d",
          fontSize: "21px",
          fontWeight: "800",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

/* =========================
   INFO ITEM
========================= */

function InfoItem({ label, value }) {
  return (
    <div
      style={{
        padding: "15px 0",
        borderBottom: "1px solid #edf1f5",
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: "10px",
          fontWeight: "800",
          marginBottom: "6px",
          textTransform: "uppercase",
          letterSpacing: "0.6px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#071a3d",
          fontSize: "14px",
          fontWeight: "700",
          lineHeight: "1.55",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default EventDetail;