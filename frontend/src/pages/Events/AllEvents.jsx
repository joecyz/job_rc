import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getEvents } from "../../services/eventService";

const COLORS = {
  navy: "#071a3d",
  blue: "#0b4ea2",
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
  upcomingSoft: "#eef4fb",
};

// =========================================================
// DATE HELPERS
// =========================================================

function getEventDateTime(date, time) {
  if (!date) return null;

  const dateTime = new Date(
    `${date}T${time || "00:00:00"}`
  );

  if (Number.isNaN(dateTime.getTime())) {
    return null;
  }

  return dateTime;
}

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(
    `${dateString}T00:00:00`
  );

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
// STATUS CONFIG
// =========================================================

const STATUS_CONFIG = {
  past: {
    label: "PAST",
    title: "Past Event",
    color: COLORS.past,
    background: COLORS.pastSoft,
  },

  ongoing: {
    label: "ONGOING",
    title: "Ongoing Event",
    color: COLORS.ongoing,
    background: COLORS.ongoingSoft,
  },

  upcoming: {
    label: "UPCOMING",
    title: "Upcoming Event",
    color: COLORS.upcoming,
    background: COLORS.upcomingSoft,
  },
};

// =========================================================
// EVENT CARD
// =========================================================

function EventCard({ event, type }) {
  const posterUrl = getPosterUrl(event.poster);

  const status =
    STATUS_CONFIG[type] ||
    STATUS_CONFIG.upcoming;

  return (
    <div
      className="all-event-card"
      style={{
        background: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "15px",
        overflow: "hidden",
        transition:
          "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
      }}
    >
      {/* ==================================================
          POSTER
      ================================================== */}

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "180px",
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
              fontSize: "38px",
            }}
          >
            📅
          </div>
        )}

        {/* STATUS */}

        <span
          style={{
            position: "absolute",
            top: "13px",
            left: "13px",
            padding: "6px 9px",
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

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div
        style={{
          padding: "18px",
        }}
      >
        {/* CATEGORY */}

        {event.category && (
          <span
            style={{
              display: "inline-flex",
              marginBottom: "8px",
              padding: "5px 8px",
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

        {/* TITLE */}

        <h3
          style={{
            margin: "0 0 8px",
            color: COLORS.navy,
            fontSize: "16px",
            lineHeight: 1.35,
            fontWeight: 800,
            minHeight: "43px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {event.title}
        </h3>

        {/* DESCRIPTION */}

        {event.description && (
          <p
            style={{
              margin: "0 0 13px",
              color: COLORS.muted,
              fontSize: "11px",
              lineHeight: 1.55,
              minHeight: "34px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.description}
          </p>
        )}

        {/* EVENT INFORMATION */}

        <div
          style={{
            display: "grid",
            gap: "7px",
            color: COLORS.muted,
            fontSize: "10px",
            lineHeight: 1.45,
          }}
        >
          <div>
            📅 {formatDate(event.start_date)}
            {event.start_time &&
              ` • ${formatTime(event.start_time)}`}
          </div>

          {event.location && (
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              📍 {event.location}
            </div>
          )}

          {event.city && (
            <div>
              🏙️ {event.city}
            </div>
          )}
        </div>

        {/* DETAIL BUTTON */}

        <Link
          to={`/events/${event.id}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "16px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: COLORS.navy,
            color: COLORS.white,
            textDecoration: "none",
            fontSize: "10px",
            fontWeight: 800,
          }}
        >
          <span>Lihat Detail</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

// =========================================================
// EMPTY STATE
// =========================================================

function EmptyState({
  title,
  description,
}) {
  return (
    <div
      style={{
        background: COLORS.white,
        border:
          `1px dashed ${COLORS.border}`,
        borderRadius: "15px",
        padding: "50px 25px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          margin: "0 auto 14px",
          borderRadius: "13px",
          background: COLORS.blueSoft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "21px",
        }}
      >
        📅
      </div>

      <h3
        style={{
          margin: "0 0 6px",
          color: COLORS.navy,
          fontSize: "16px",
          fontWeight: 800,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: COLORS.muted,
          fontSize: "12px",
        }}
      >
        {description}
      </p>
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
  color = COLORS.blue,
  background = COLORS.blueSoft,
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
            color,
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

      <span
        style={{
          display: "inline-flex",
          padding: "7px 11px",
          borderRadius: "7px",
          background,
          color,
          fontSize: "10px",
          fontWeight: 800,
        }}
      >
        {count} Event
      </span>
    </div>
  );
}

// =========================================================
// FILTER FUNCTION
// =========================================================

function filterEvents(
  events,
  search,
  cityFilter,
  categoryFilter
) {
  const keyword =
    search.trim().toLowerCase();

  return events.filter((event) => {
    const searchableText = [
      event.title,
      event.description,
      event.article,
      event.category,
      event.city,
      event.location,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !keyword ||
      searchableText.includes(keyword);

    const matchesCity =
      !cityFilter ||
      event.city === cityFilter;

    const matchesCategory =
      !categoryFilter ||
      event.category === categoryFilter;

    return (
      matchesSearch &&
      matchesCity &&
      matchesCategory
    );
  });
}

// =========================================================
// MAIN COMPONENT
// =========================================================

function AllEvents() {
  const [events, setEvents] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [cityFilter, setCityFilter] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("");

  const [searchParams] =
    useSearchParams();

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

        const data = await getEvents();

        if (Array.isArray(data)) {
          setEvents(data);
        } else if (
          Array.isArray(data?.results)
        ) {
          setEvents(data.results);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error(
          "Failed to fetch events:",
          err
        );

        setError(
          "Gagal memuat data event."
        );

        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // =======================================================
  // CURRENT TIME
  // =======================================================

  const now = useMemo(
    () => new Date(),
    []
  );

  // =======================================================
  // CLASSIFICATION
  // =======================================================

  const pastEvents = useMemo(() => {
    return events.filter((event) => {
      const endDateTime =
        getEventDateTime(
          event.end_date,
          event.end_time
        );

      if (!endDateTime) {
        return false;
      }

      return endDateTime < now;
    });
  }, [events, now]);

  const ongoingEvents = useMemo(() => {
    return events.filter((event) => {
      const startDateTime =
        getEventDateTime(
          event.start_date,
          event.start_time
        );

      const endDateTime =
        getEventDateTime(
          event.end_date,
          event.end_time
        );

      if (
        !startDateTime ||
        !endDateTime
      ) {
        return false;
      }

      return (
        startDateTime <= now &&
        endDateTime >= now
      );
    });
  }, [events, now]);

  const upcomingEvents = useMemo(() => {
    return events.filter((event) => {
      const startDateTime =
        getEventDateTime(
          event.start_date,
          event.start_time
        );

      if (!startDateTime) {
        return false;
      }

      return startDateTime > now;
    });
  }, [events, now]);

  // =======================================================
  // SORTING
  // =======================================================

  const sortedPast = useMemo(() => {
    return [...pastEvents].sort(
      (a, b) => {
        const dateA =
          getEventDateTime(
            a.end_date,
            a.end_time
          );

        const dateB =
          getEventDateTime(
            b.end_date,
            b.end_time
          );

        return dateB - dateA;
      }
    );
  }, [pastEvents]);

  const sortedOngoing = useMemo(() => {
    return [...ongoingEvents].sort(
      (a, b) => {
        const dateA =
          getEventDateTime(
            a.start_date,
            a.start_time
          );

        const dateB =
          getEventDateTime(
            b.start_date,
            b.start_time
          );

        return dateA - dateB;
      }
    );
  }, [ongoingEvents]);

  const sortedUpcoming = useMemo(() => {
    return [...upcomingEvents].sort(
      (a, b) => {
        const dateA =
          getEventDateTime(
            a.start_date,
            a.start_time
          );

        const dateB =
          getEventDateTime(
            b.start_date,
            b.start_time
          );

        return dateA - dateB;
      }
    );
  }, [upcomingEvents]);

  // =======================================================
  // CITY OPTIONS
  // =======================================================

  const cities = useMemo(() => {
    return [
      ...new Set(
        events
          .map((event) => event.city)
          .filter(Boolean)
      ),
    ].sort();
  }, [events]);

  // =======================================================
  // CATEGORY OPTIONS
  // =======================================================

  const categories = useMemo(() => {
    return [
      ...new Set(
        events
          .map((event) => event.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [events]);

  // =======================================================
  // FILTERED EVENTS
  // =======================================================

  const filteredPast = useMemo(() => {
    return filterEvents(
      sortedPast,
      search,
      cityFilter,
      categoryFilter
    );
  }, [
    sortedPast,
    search,
    cityFilter,
    categoryFilter,
  ]);

  const filteredOngoing = useMemo(() => {
    return filterEvents(
      sortedOngoing,
      search,
      cityFilter,
      categoryFilter
    );
  }, [
    sortedOngoing,
    search,
    cityFilter,
    categoryFilter,
  ]);

  const filteredUpcoming = useMemo(() => {
    return filterEvents(
      sortedUpcoming,
      search,
      cityFilter,
      categoryFilter
    );
  }, [
    sortedUpcoming,
    search,
    cityFilter,
    categoryFilter,
  ]);

  // =======================================================
  // SELECTED CATEGORY
  // =======================================================

  const categoryData = useMemo(() => {
    if (selectedCategory === "past") {
      return {
        title: "Past Event",
        eyebrow: "Past Events",
        description:
          "Kegiatan BSU yang telah selesai berlangsung.",
        events: filteredPast,
        type: "past",
        color: COLORS.past,
        background: COLORS.pastSoft,
      };
    }

    if (
      selectedCategory === "ongoing"
    ) {
      return {
        title: "Ongoing Event",
        eyebrow: "Ongoing Events",
        description:
          "Kegiatan BSU yang sedang berlangsung saat ini.",
        events: filteredOngoing,
        type: "ongoing",
        color: COLORS.ongoing,
        background: COLORS.ongoingSoft,
      };
    }

    if (
      selectedCategory === "upcoming"
    ) {
      return {
        title: "Upcoming Event",
        eyebrow: "Coming Soon",
        description:
          "Kegiatan BSU yang akan segera berlangsung.",
        events: filteredUpcoming,
        type: "upcoming",
        color: COLORS.upcoming,
        background: COLORS.upcomingSoft,
      };
    }

    return null;
  }, [
    selectedCategory,
    filteredPast,
    filteredOngoing,
    filteredUpcoming,
  ]);

  // =======================================================
  // TOTAL
  // =======================================================

  const totalFiltered = categoryData
  ? categoryData.events.length
  : filteredPast.length +
    filteredOngoing.length +
    filteredUpcoming.length;

  const hasActiveFilter =
    search.trim() !== "" ||
    cityFilter !== "" ||
    categoryFilter !== "";

  // =======================================================
  // RESET
  // =======================================================

  const clearFilters = () => {
    setSearch("");
    setCityFilter("");
    setCategoryFilter("");
  };

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <MainLayout>
        <div
          style={{
            minHeight: "100vh",
            background: COLORS.bg,
            padding: "80px 5%",
            textAlign: "center",
            color: COLORS.muted,
            fontSize: "14px",
          }}
        >
          Memuat semua event...
        </div>
      </MainLayout>
    );
  }

  // =======================================================
  // MAIN PAGE
  // =======================================================

  return (
    <MainLayout>
      <div
        className="all-events-page"
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
          className="all-events-hero"
          style={{
            position: "relative",
            overflow: "hidden",
            marginBottom: "32px",
            padding: "42px 48px",
            borderRadius: "22px",
            background:
              "linear-gradient(135deg, #071a3d 0%, #0b4ea2 100%)",
            boxShadow:
              "0 18px 45px rgba(7,26,61,0.14)",
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <Link
              to="/events"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                marginBottom: "18px",
                color:
                  "rgba(255,255,255,0.78)",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              ← Kembali ke Event
            </Link>

            <div
              style={{
                marginBottom: "8px",
                color:
                  "rgba(255,255,255,0.72)",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              All Events
            </div>

            <h1
              style={{
                margin: "0 0 12px",
                color: "#ffffff",
                fontSize:
                  "clamp(32px, 4vw, 46px)",
                lineHeight: 1.1,
                fontWeight: 900,
              }}
            >
              Semua Event
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: "650px",
                color:
                  "rgba(255,255,255,0.78)",
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              Lihat seluruh event perusahaan
              berdasarkan kategori Past,
              Ongoing, dan Upcoming.
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
              border:
                "1px solid #f3c5c5",
              color: "#a83232",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        {/* ==================================================
            FILTER
        ================================================== */}

        <section
          className="event-filter-panel"
          style={{
            marginBottom: "40px",
            padding: "18px",
            background: COLORS.white,
            border:
              `1px solid ${COLORS.border}`,
            borderRadius: "15px",
            boxShadow:
              "0 8px 25px rgba(7,26,61,0.04)",
          }}
        >
          <div
            className="event-filter-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 2fr) minmax(160px, 1fr) minmax(160px, 1fr) auto",
              gap: "11px",
              alignItems: "center",
            }}
          >
            {/* SEARCH */}

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Cari event..."
              style={{
                width: "100%",
                height: "40px",
                padding: "0 13px",
                border:
                  `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                outline: "none",
                color: COLORS.text,
                fontSize: "12px",
                boxSizing: "border-box",
              }}
            />

            {/* CITY */}

            <select
              value={cityFilter}
              onChange={(e) =>
                setCityFilter(e.target.value)
              }
              style={{
                width: "100%",
                height: "40px",
                padding: "0 11px",
                border:
                  `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                outline: "none",
                color: COLORS.text,
                fontSize: "12px",
                background: COLORS.white,
              }}
            >
              <option value="">
                Semua Kota
              </option>

              {cities.map((city) => (
                <option
                  key={city}
                  value={city}
                >
                  {city}
                </option>
              ))}
            </select>

            {/* CATEGORY */}

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                height: "40px",
                padding: "0 11px",
                border:
                  `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                outline: "none",
                color: COLORS.text,
                fontSize: "12px",
                background: COLORS.white,
              }}
            >
              <option value="">
                Semua Kategori
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>

            {/* RESET */}

            <button
              type="button"
              onClick={clearFilters}
              style={{
                height: "40px",
                padding: "0 15px",
                border:
                  `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                background: COLORS.white,
                color: COLORS.blue,
                fontSize: "11px",
                fontWeight: 800,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Reset
            </button>
          </div>

          <div
            style={{
              marginTop: "12px",
              color: COLORS.muted,
              fontSize: "11px",
            }}
          >
            Menampilkan{" "}
            <strong
              style={{
                color: COLORS.navy,
              }}
            >
              {totalFiltered}
            </strong>{" "}
            event
            {hasActiveFilter
              ? " sesuai filter."
              : "."}
          </div>
        </section>

        {/* ==================================================
            CATEGORY DETAIL MODE
        ================================================== */}

        {categoryData ? (
          <section>
            <SectionHeader
              eyebrow={
                categoryData.eyebrow
              }
              title={
                categoryData.title
              }
              description={
                categoryData.description
              }
              count={
                categoryData.events.length
              }
              color={
                categoryData.color
              }
              background={
                categoryData.background
              }
            />

            <Link
              to="/events/all"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                marginBottom: "22px",
                color: COLORS.blue,
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 800,
              }}
            >
              ← Lihat Semua Kategori
            </Link>

            {categoryData.events.length >
            0 ? (
              <div
                className="events-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, minmax(0, 1fr))",
                  gap: "18px",
                }}
              >
                {categoryData.events.map(
                  (event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      type={
                        categoryData.type
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyState
                title={
                  selectedCategory ===
                  "past"
                    ? "Belum ada event sebelumnya"
                    : selectedCategory ===
                      "ongoing"
                    ? "Tidak ada event yang sedang berlangsung"
                    : "Tidak ada event mendatang"
                }
                description={
                  hasActiveFilter
                    ? "Coba ubah keyword atau filter yang digunakan."
                    : "Belum ada event yang tersedia pada kategori ini."
                }
              />
            )}
          </section>
        ) : (
          <>
            {/* ==================================================
                PAST
            ================================================== */}

            <section
              style={{
                marginBottom: "48px",
              }}
            >
              <SectionHeader
                eyebrow="Past Events"
                title="Event Sebelumnya"
                description="Kegiatan BSU yang telah selesai berlangsung."
                count={
                  filteredPast.length
                }
                color={COLORS.past}
                background={
                  COLORS.pastSoft
                }
              />

              {filteredPast.length >
              0 ? (
                <div
                  className="events-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(3, minmax(0, 1fr))",
                    gap: "18px",
                  }}
                >
                  {filteredPast.map(
                    (event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        type="past"
                      />
                    )
                  )}
                </div>
              ) : (
                <EmptyState
                  title="Belum ada event sebelumnya"
                  description={
                    hasActiveFilter
                      ? "Coba ubah keyword atau filter yang digunakan."
                      : "Belum ada event yang telah selesai."
                  }
                />
              )}
            </section>

            {/* ==================================================
                ONGOING
            ================================================== */}

            <section
              style={{
                marginBottom: "48px",
              }}
            >
              <SectionHeader
                eyebrow="Ongoing Events"
                title="Event Sedang Berlangsung"
                description="Kegiatan BSU yang sedang berlangsung saat ini."
                count={
                  filteredOngoing.length
                }
                color={
                  COLORS.ongoing
                }
                background={
                  COLORS.ongoingSoft
                }
              />

              {filteredOngoing.length >
              0 ? (
                <div
                  className="events-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(3, minmax(0, 1fr))",
                    gap: "18px",
                  }}
                >
                  {filteredOngoing.map(
                    (event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        type="ongoing"
                      />
                    )
                  )}
                </div>
              ) : (
                <EmptyState
                  title="Tidak ada event yang sedang berlangsung"
                  description={
                    hasActiveFilter
                      ? "Coba ubah keyword atau filter yang digunakan."
                      : "Saat ini tidak ada event yang sedang berlangsung."
                  }
                />
              )}
            </section>

            {/* ==================================================
                UPCOMING
            ================================================== */}

            <section>
              <SectionHeader
                eyebrow="Coming Soon"
                title="Event Mendatang"
                description="Kegiatan yang akan segera berlangsung."
                count={
                  filteredUpcoming.length
                }
                color={
                  COLORS.upcoming
                }
                background={
                  COLORS.upcomingSoft
                }
              />

              {filteredUpcoming.length >
              0 ? (
                <div
                  className="events-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(3, minmax(0, 1fr))",
                    gap: "18px",
                  }}
                >
                  {filteredUpcoming.map(
                    (event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        type="upcoming"
                      />
                    )
                  )}
                </div>
              ) : (
                <EmptyState
                  title="Tidak ada event mendatang"
                  description={
                    hasActiveFilter
                      ? "Coba ubah keyword atau filter yang digunakan."
                      : "Belum ada event yang dijadwalkan."
                  }
                />
              )}
            </section>
          </>
        )}

        {/* ==================================================
            RESPONSIVE STYLE
        ================================================== */}

        <style>
          {`
            .all-event-card:hover {
              transform: translateY(-4px);
              border-color:
                #b9cbe2 !important;
              box-shadow:
                0 16px 32px rgba(7,26,61,0.10);
            }

            .all-event-card img {
              transition:
                transform 0.35s ease;
            }

            .all-event-card:hover img {
              transform: scale(1.025);
            }

            .event-filter-panel input:focus,
            .event-filter-panel select:focus {
              border-color:
                #8db0d9 !important;
              box-shadow:
                0 0 0 3px rgba(11,78,162,0.08);
            }

            @media (max-width: 900px) {
              .events-grid {
                grid-template-columns:
                  repeat(2, minmax(0, 1fr)) !important;
              }

              .event-filter-grid {
                grid-template-columns:
                  1fr 1fr !important;
              }
            }

            @media (max-width: 600px) {
              .all-events-page {
                padding:
                  20px 14px 55px !important;
              }

              .all-events-hero {
                padding:
                  32px 24px !important;
                border-radius:
                  18px !important;
              }

              .events-grid {
                grid-template-columns:
                  1fr !important;
              }

              .event-filter-grid {
                grid-template-columns:
                  1fr !important;
              }

              .event-filter-panel {
                padding:
                  15px !important;
              }

              .all-event-card > div:first-child {
                height:
                  190px !important;
              }
            }
          `}
        </style>
      </div>
    </MainLayout>
  );
}

export default AllEvents;