import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getLandingEvent } from "../../services/eventService";

const COLORS = {
  navy: "#071a3d",
  blue: "#0b4ea2",
  blue2: "#1457a6",
  blueSoft: "#eef4fb",
  white: "#ffffff",
  bg: "#f4f6f9",
  border: "#e2e8f0",
  text: "#334155",
  muted: "#64748b",
  past: "#64748b",
  pastSoft: "#f1f5f9",
  ongoing: "#2e7d32",
  ongoingSoft: "#e8f5e9",
  upcoming: "#0b4ea2",
  upcomingSoft: "#eef5fd",
};

// =========================================================
// DATE FORMAT
// =========================================================

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timeString) {
  if (!timeString) return "";

  return timeString.slice(0, 5);
}

// =========================================================
// POSTER URL
// =========================================================

function getPosterUrl(poster) {
  if (!poster) return null;

  if (
    poster.startsWith("http://") ||
    poster.startsWith("https://")
  ) {
    return poster;
  }

  return `http://127.0.0.1:8000${poster}`;
}

// =========================================================
// DATE HELPERS
// =========================================================

function getStartDate(event) {
  return new Date(
    `${event.start_date}T${event.start_time || "00:00:00"}`
  );
}

function getEndDate(event) {
  return new Date(
    `${event.end_date}T${event.end_time || "00:00:00"}`
  );
}

// =========================================================
// STATUS CONFIG
// =========================================================

const STATUS_CONFIG = {
  past: {
    label: "PAST",
    title: "Past Event",
    description: "Event yang telah selesai diselenggarakan.",
    color: COLORS.past,
    background: COLORS.pastSoft,
  },

  ongoing: {
    label: "ONGOING",
    title: "Ongoing Event",
    description: "Event yang sedang berlangsung saat ini.",
    color: COLORS.ongoing,
    background: COLORS.ongoingSoft,
  },

  upcoming: {
    label: "UPCOMING",
    title: "Upcoming Event",
    description: "Event yang akan datang.",
    color: COLORS.upcoming,
    background: COLORS.upcomingSoft,
  },
};

// =========================================================
// EVENT CARD
// =========================================================

function EventCard({ event, type }) {
  const posterUrl = getPosterUrl(event.poster);
  const status = STATUS_CONFIG[type];

  return (
    <div
      className="event-list-card"
      style={{
        background: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "15px",
        overflow: "hidden",
        transition:
          "transform 0.22s ease, box-shadow 0.22s ease",
      }}
    >
      {/* POSTER */}

      <div
        style={{
          position: "relative",
          height: "190px",
          overflow: "hidden",
          background: COLORS.navy,
        }}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={event.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #071a3d, #0b4ea2)",
              color: "#ffffff",
              fontSize: "42px",
            }}
          >
            📅
          </div>
        )}

        {/* STATUS */}

        <span
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            padding: "7px 10px",
            borderRadius: "999px",
            background: status.background,
            color: status.color,
            fontSize: "9px",
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
        >
          {status.label}
        </span>
      </div>

      {/* CONTENT */}

      <div
        style={{
          padding: "20px",
        }}
      >
        {event.category && (
          <span
            style={{
              display: "inline-flex",
              marginBottom: "9px",
              padding: "5px 9px",
              borderRadius: "6px",
              background: COLORS.blueSoft,
              color: COLORS.blue,
              fontSize: "9px",
              fontWeight: 800,
            }}
          >
            {event.category}
          </span>
        )}

        <h3
          style={{
            margin: "0 0 10px",
            color: COLORS.navy,
            fontSize: "17px",
            lineHeight: 1.35,
            fontWeight: 800,
          }}
        >
          {event.title}
        </h3>

        {event.description && (
          <p
            style={{
              margin: "0 0 15px",
              color: COLORS.muted,
              fontSize: "12px",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.description}
          </p>
        )}

        <div
          style={{
            display: "grid",
            gap: "7px",
            color: COLORS.muted,
            fontSize: "11px",
            lineHeight: 1.5,
          }}
        >
          <div>
            📅 {formatDate(event.start_date)}
            {event.start_time &&
              ` • ${formatTime(event.start_time)}`}
          </div>

          {event.location && (
            <div>
              📍 {event.location}
            </div>
          )}

          {event.city && (
            <div>
              🏙️ {event.city}
            </div>
          )}
        </div>

        <Link
          to={`/events/${event.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            marginTop: "17px",
            color: COLORS.blue,
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 800,
          }}
        >
          Lihat Detail
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

// =========================================================
// CATEGORY SUMMARY CARD
// =========================================================

function CategorySummaryCard({
  type,
  count,
}) {
  const status = STATUS_CONFIG[type];

  return (
    <div
      className="category-summary-card"
      style={{
        flex: "1 1 0",
        minWidth: 0,
        padding: "25px",
        borderRadius: "15px",
        background: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "225px",
        boxSizing: "border-box",
      }}
    >
      {/* DECORATION */}

      <div
        style={{
          position: "absolute",
          width: "150px",
          height: "150px",
          right: "-75px",
          top: "-75px",
          borderRadius: "50%",
          background: status.background,
          opacity: 0.8,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ICON */}

        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: status.background,
            color: status.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "21px",
            marginBottom: "17px",
          }}
        >
          📅
        </div>

        {/* TITLE */}

        <h3
          style={{
            margin: "0 0 6px",
            color: COLORS.navy,
            fontSize: "19px",
            fontWeight: 850,
          }}
        >
          {status.title}
        </h3>

        {/* TOTAL */}

        <div
          style={{
            color: status.color,
            fontSize: "28px",
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: "9px",
          }}
        >
          {count}
        </div>

        <p
          style={{
            margin: 0,
            color: COLORS.muted,
            fontSize: "11px",
            lineHeight: 1.5,
          }}
        >
          {status.description}
        </p>
      </div>

      {/* DETAIL BUTTON */}

      <Link
        to={`/events/all?category=${type}`}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "20px",
          padding: "11px 13px",
          borderRadius: "8px",
          background: status.background,
          color: status.color,
          textDecoration: "none",
          fontSize: "11px",
          fontWeight: 800,
        }}
      >
        <span>
          Lihat Detail {status.title}
        </span>

        <span>→</span>
      </Link>
    </div>
  );
}

// =========================================================
// SECTION HEADER
// =========================================================

function SectionHeader({
  eyebrow,
  title,
  description,
  count,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "20px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <div
          style={{
            marginBottom: "6px",
            color: COLORS.blue,
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>

        <h2
          style={{
            margin: "0 0 6px",
            color: COLORS.navy,
            fontSize: "25px",
            lineHeight: 1.2,
            fontWeight: 850,
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: 0,
            color: COLORS.muted,
            fontSize: "13px",
          }}
        >
          {description}
        </p>
      </div>

      {count !== undefined && (
        <span
          style={{
            display: "inline-flex",
            padding: "7px 11px",
            borderRadius: "7px",
            background: COLORS.blueSoft,
            color: COLORS.blue,
            fontSize: "10px",
            fontWeight: 800,
          }}
        >
          {count} Event
        </span>
      )}
    </div>
  );
}

// =========================================================
// MAIN PAGE
// =========================================================

function Events() {
  const [eventData, setEventData] = useState({
    ongoing: [],
    upcoming: [],
    past: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  const selectedCategory =
    searchParams.get("category");

  // =======================================================
  // FETCH EVENTS
  // =======================================================

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getLandingEvent();

        setEventData({
          ongoing: Array.isArray(data?.ongoing)
            ? data.ongoing
            : [],

          upcoming: Array.isArray(data?.upcoming)
            ? data.upcoming
            : [],

          past: Array.isArray(data?.past)
            ? data.past
            : [],
        });
      } catch (err) {
        console.error(
          "Failed to fetch events:",
          err
        );

        setError(
          "Gagal memuat data event."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // =======================================================
  // SORTING
  // =======================================================

  const sortedPast = useMemo(() => {
    return [...eventData.past].sort(
      (a, b) =>
        getEndDate(b) - getEndDate(a)
    );
  }, [eventData.past]);

  const sortedOngoing = useMemo(() => {
    return [...eventData.ongoing].sort(
      (a, b) =>
        getStartDate(a) - getStartDate(b)
    );
  }, [eventData.ongoing]);

  const sortedUpcoming = useMemo(() => {
    return [...eventData.upcoming].sort(
      (a, b) =>
        getStartDate(a) - getStartDate(b)
    );
  }, [eventData.upcoming]);

  // =======================================================
  // SELECTED CATEGORY
  // =======================================================

  const selectedEvents = useMemo(() => {
    if (selectedCategory === "past") {
      return sortedPast;
    }

    if (selectedCategory === "ongoing") {
      return sortedOngoing;
    }

    if (selectedCategory === "upcoming") {
      return sortedUpcoming;
    }

    return [];
  }, [
    selectedCategory,
    sortedPast,
    sortedOngoing,
    sortedUpcoming,
  ]);

  const selectedConfig =
    selectedCategory &&
    STATUS_CONFIG[selectedCategory]
      ? STATUS_CONFIG[selectedCategory]
      : null;

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <MainLayout>
        <section
          style={{
            minHeight: "100vh",
            padding: "70px 36px",
            background: COLORS.bg,
          }}
        >
          <div
            style={{
              maxWidth: "1180px",
              margin: "0 auto",
              textAlign: "center",
              color: COLORS.muted,
              fontSize: "14px",
            }}
          >
            Memuat event...
          </div>
        </section>
      </MainLayout>
    );
  }

  // =======================================================
  // CATEGORY DETAIL
  // =======================================================

  if (selectedConfig) {
    return (
      <MainLayout>
        <div
          className="events-page"
          style={{
            minHeight: "100vh",
            background: COLORS.bg,
            padding: "28px 5% 70px",
          }}
        >
          <SectionHeader
            eyebrow={selectedConfig.label}
            title={selectedConfig.title}
            description={selectedConfig.description}
            count={selectedEvents.length}
          />

          <Link
            to="/events"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              marginBottom: "25px",
              color: COLORS.blue,
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 800,
            }}
          >
            ← Kembali ke Event
          </Link>

          {selectedEvents.length > 0 ? (
            <div
              className="events-grid"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              {selectedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  type={selectedCategory}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                background: COLORS.white,
                border:
                  `1px dashed ${COLORS.border}`,
                borderRadius: "15px",
                padding: "50px 25px",
                textAlign: "center",
                color: COLORS.muted,
                fontSize: "13px",
              }}
            >
              {selectedCategory === "past"
                ? "Belum ada event yang telah selesai."
                : selectedCategory === "ongoing"
                ? "Tidak ada event yang sedang berlangsung."
                : "Belum ada event yang akan datang."}
            </div>
          )}

          <style>
            {`
              .event-list-card:hover {
                transform: translateY(-4px);
                box-shadow:
                  0 16px 32px rgba(7,26,61,0.10);
                border-color: #b9cbe2 !important;
              }

              .event-list-card img {
                transition:
                  transform 0.35s ease;
              }

              .event-list-card:hover img {
                transform: scale(1.025);
              }

              @media (max-width: 950px) {
                .events-grid {
                  grid-template-columns:
                    repeat(2, minmax(0, 1fr)) !important;
                }
              }

              @media (max-width: 650px) {
                .events-page {
                  padding:
                    20px 14px 55px !important;
                }

                .events-grid {
                  grid-template-columns:
                    1fr !important;
                }
              }
            `}
          </style>
        </div>
      </MainLayout>
    );
  }

  // =======================================================
  // MAIN EVENT PAGE
  // =======================================================

  return (
    <MainLayout>
      <div
        className="events-page"
        style={{
          minHeight: "100vh",
          background: COLORS.bg,
          padding: "28px 5% 70px",
        }}
      >
        {/* ==================================================
            HERO
        ================================================== */}

        <section
          className="events-hero"
          style={{
            position: "relative",
            overflow: "hidden",
            marginBottom: "40px",
            padding: "48px",
            borderRadius: "22px",
            background:
              "linear-gradient(135deg, #071a3d 0%, #0b4ea2 100%)",
            boxShadow:
              "0 18px 45px rgba(7,26,61,0.14)",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "330px",
              height: "330px",
              right: "-130px",
              top: "-160px",
              borderRadius: "50%",
              border:
                "55px solid rgba(255,255,255,0.06)",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "190px",
              height: "190px",
              right: "160px",
              bottom: "-130px",
              borderRadius: "50%",
              background:
                "rgba(255,255,255,0.05)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "700px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginBottom: "16px",
                padding: "7px 12px",
                borderRadius: "999px",
                background:
                  "rgba(255,255,255,0.11)",
                border:
                  "1px solid rgba(255,255,255,0.14)",
                color: "#ffffff",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.08em",
              }}
            >
              BSU Events
            </div>

            <h1
              style={{
                margin: "0 0 13px",
                color: "#ffffff",
                fontSize:
                  "clamp(34px, 4.5vw, 50px)",
                lineHeight: 1.08,
                fontWeight: 900,
                letterSpacing: "-1px",
              }}
            >
              Events & Activities
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: "630px",
                color:
                  "rgba(255,255,255,0.78)",
                fontSize: "14px",
                lineHeight: 1.75,
              }}
            >
              Temukan berbagai kegiatan dan
              event PT Bintang Sayap Utama,
              mulai dari event yang telah selesai,
              sedang berlangsung, hingga event
              yang akan datang.
            </p>
          </div>
        </section>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            style={{
              padding: "14px 17px",
              marginBottom: "25px",
              borderRadius: "11px",
              background: "#fff1f1",
              border: "1px solid #f3c5c5",
              color: "#a83232",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        {/* ==================================================
            CATEGORY SUMMARY
        ================================================== */}

        <section
          style={{
            marginBottom: "35px",
          }}
        >
          <SectionHeader
            title="Event"
          />

          {/* ONE HORIZONTAL CARD */}

          <div
            className="category-container"
            style={{
              display: "flex",
              gap: "0",
              padding: "18px",
              background: COLORS.white,
              border:
                `1px solid ${COLORS.border}`,
              borderRadius: "18px",
              boxShadow:
                "0 12px 35px rgba(7,26,61,0.07)",
            }}
          >
            {/* PAST */}

            <CategorySummaryCard
              type="past"
              count={eventData.past.length}
            />

            <div
              className="category-divider"
              style={{
                width: "1px",
                margin: "25px 0",
                background: COLORS.border,
              }}
            />

            {/* ONGOING */}

            <CategorySummaryCard
              type="ongoing"
              count={eventData.ongoing.length}
            />

            <div
              className="category-divider"
              style={{
                width: "1px",
                margin: "25px 0",
                background: COLORS.border,
              }}
            />

            {/* UPCOMING */}

            <CategorySummaryCard
              type="upcoming"
              count={eventData.upcoming.length}
            />
          </div>
        </section>

        {/* ==================================================
            ALL EVENTS LINK
        ================================================== */}

        <section
          style={{
            marginTop: "10px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              padding: "24px 28px",
              background: COLORS.white,
              border:
                `1px solid ${COLORS.border}`,
              borderRadius: "16px",
              boxShadow:
                "0 8px 25px rgba(7,26,61,0.05)",
            }}
          >
            <div>
              <div
                style={{
                  marginBottom: "5px",
                  color: COLORS.blue,
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                All Events
              </div>

              <h2
                style={{
                  margin: "0 0 5px",
                  color: COLORS.navy,
                  fontSize: "21px",
                  fontWeight: 850,
                }}
              >
                Lihat Event Lainnya
              </h2>

              <p
                style={{
                  margin: 0,
                  color: COLORS.muted,
                  fontSize: "12px",
                }}
              >
                Lihat seluruh event berdasarkan
                kategori Past, Ongoing, dan Upcoming.
              </p>
            </div>

            <Link
              to="/events/all"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                flexShrink: 0,
                padding: "11px 16px",
                borderRadius: "8px",
                background: COLORS.navy,
                color: COLORS.white,
                textDecoration: "none",
                fontSize: "11px",
                fontWeight: 800,
                whiteSpace: "nowrap",
              }}
            >
              Lihat Semua Event
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* ==================================================
            STYLE
        ================================================== */}

        <style>
          {`
            .category-summary-card {
              transition:
                transform 0.22s ease,
                box-shadow 0.22s ease,
                border-color 0.22s ease;
            }

            .category-summary-card:hover {
              transform: translateY(-3px);
              box-shadow:
                0 14px 30px rgba(7,26,61,0.09);
              border-color:
                #b9cbe2 !important;
            }

            @media (max-width: 950px) {
              .category-container {
                flex-wrap: wrap !important;
              }

              .category-divider {
                display: none !important;
              }

              .category-summary-card {
                flex:
                  1 1 calc(50% - 10px) !important;
              }
            }

            @media (max-width: 650px) {
              .events-page {
                padding:
                  20px 14px 55px !important;
              }

              .events-hero {
                padding:
                  32px 24px !important;
                border-radius:
                  18px !important;
                margin-bottom:
                  32px !important;
              }

              .category-container {
                flex-direction:
                  column !important;
                padding:
                  12px !important;
                gap:
                  12px !important;
              }

              .category-summary-card {
                flex:
                  1 1 auto !important;
                width:
                  100% !important;
              }

              .category-divider {
                display: none !important;
              }

              .events-page section:last-of-type > div {
                flex-direction:
                  column !important;
                align-items:
                  flex-start !important;
              }

              .events-page section:last-of-type a {
                width:
                  100% !important;
              }
            }
          `}
        </style>
      </div>
    </MainLayout>
  );
}

export default Events;