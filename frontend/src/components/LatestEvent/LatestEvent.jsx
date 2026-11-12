import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLandingEvent } from "../../services/eventService";

function LatestEvent() {
  const [events, setEvents] = useState({
    ongoing: [],
    upcoming: [],
    past: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const data = await getLandingEvent();

      console.log("LANDING EVENTS DATA:", data);

      setEvents({
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
    } catch (error) {
      console.error(
        "LANDING EVENTS ERROR:",
        error.response?.data || error
      );

      setEvents({
        ongoing: [],
        upcoming: [],
        past: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // SORTING
  // ==================================================

  // Upcoming:
  // event yang mulai paling dekat ditampilkan pertama
  const sortedUpcoming = [...events.upcoming].sort(
    (a, b) => {
      const dateA = new Date(
        `${a.start_date}T${a.start_time || "00:00:00"}`
      );

      const dateB = new Date(
        `${b.start_date}T${b.start_time || "00:00:00"}`
      );

      return dateA - dateB;
    }
  );

  // Ongoing:
  // event yang mulai lebih dulu ditampilkan pertama
  const sortedOngoing = [...events.ongoing].sort(
    (a, b) => {
      const dateA = new Date(
        `${a.start_date}T${a.start_time || "00:00:00"}`
      );

      const dateB = new Date(
        `${b.start_date}T${b.start_time || "00:00:00"}`
      );

      return dateA - dateB;
    }
  );

  // Past:
  // event yang paling baru selesai ditampilkan pertama
  const sortedPast = [...events.past].sort(
    (a, b) => {
      const dateA = new Date(
        `${a.end_date}T${a.end_time || "00:00:00"}`
      );

      const dateB = new Date(
        `${b.end_date}T${b.end_time || "00:00:00"}`
      );

      return dateB - dateA;
    }
  );

  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==================================================
  // EVENT ITEM
  // ==================================================

  const EventItem = ({
    event,
    type,
  }) => {
    if (!event) return null;

    const statusConfig = {
      past: {
        label: "PAST",
        background: "#f1f5f9",
        color: "#64748b",
      },

      ongoing: {
        label: "ONGOING",
        background: "#e8f5e9",
        color: "#2e7d32",
      },

      upcoming: {
        label: "UPCOMING",
        background: "#eef5fd",
        color: "#0b4ea2",
      },
    };

    const status = statusConfig[type];

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "230px minmax(0, 1fr)",
          gap: "24px",
          alignItems: "stretch",
        }}
      >
        {/* ==============================
            POSTER
        ============================== */}

        <div
          style={{
            height: "170px",
            borderRadius: "10px",
            overflow: "hidden",
            background: "#e9eef5",
            position: "relative",
          }}
        >
          {event.poster ? (
            <img
              src={`http://127.0.0.1:8000${event.poster}`}
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
                color: "#fff",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              No Poster
            </div>
          )}

          {/* STATUS BADGE */}

          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              padding: "6px 9px",
              borderRadius: "5px",
              background: status.background,
              color: status.color,
              fontSize: "10px",
              fontWeight: "800",
              letterSpacing: "0.5px",
            }}
          >
            {status.label}
          </div>
        </div>

        {/* ==============================
            EVENT INFO
        ============================== */}

        <div
          style={{
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h3
            style={{
              margin: "0 0 8px",
              color: "#071a3d",
              fontSize: "21px",
              lineHeight: "1.3",
              fontWeight: "800",
            }}
          >
            {event.title}
          </h3>

          <p
            style={{
              margin: "0 0 14px",
              color: "#64748b",
              fontSize: "13px",
            }}
          >
            {event.city || "Lokasi belum tersedia"}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "18px",
              marginBottom: "17px",
            }}
          >
            <div>
              <div
                style={{
                  marginBottom: "3px",
                  color: "#94a3b8",
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                }}
              >
                Mulai
              </div>

              <div
                style={{
                  color: "#071a3d",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {formatDate(event.start_date)}
              </div>
            </div>

            <div>
              <div
                style={{
                  marginBottom: "3px",
                  color: "#94a3b8",
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                }}
              >
                Berakhir
              </div>

              <div
                style={{
                  color: "#071a3d",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {formatDate(event.end_date)}
              </div>
            </div>

            {event.category && (
              <div>
                <div
                  style={{
                    marginBottom: "3px",
                    color: "#94a3b8",
                    fontSize: "10px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                  }}
                >
                  Kategori
                </div>

                <div
                  style={{
                    color: "#071a3d",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  {event.category}
                </div>
              </div>
            )}
          </div>

          <Link
            to={`/events/${event.id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "fit-content",
              padding: "9px 14px",
              borderRadius: "6px",
              background: "#071a3d",
              color: "#fff",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: "800",
            }}
          >
            Lihat Detail Event →
          </Link>
        </div>
      </div>
    );
  };

  // ==================================================
  // EMPTY STATE
  // ==================================================

  const EmptyEvent = ({ message }) => {
    return (
      <div
        style={{
          minHeight: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #d8e0ea",
          borderRadius: "9px",
          background: "#fafbfd",
          color: "#94a3b8",
          fontSize: "13px",
          textAlign: "center",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        {message}
      </div>
    );
  };

  // ==================================================
  // CATEGORY ROW
  // ==================================================

  const CategoryRow = ({
    type,
    title,
    description,
    eventList,
    emptyMessage,
  }) => {
    const latestEvent = eventList[0];

    return (
      <div
        style={{
          padding: "26px 0",
        }}
      >
        {/* CATEGORY HEADER */}

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "15px",
            marginBottom: "18px",
          }}
        >
          {/* CATEGORY INDICATOR */}

          <div
            style={{
              width: "4px",
              minHeight: "42px",
              borderRadius: "4px",
              background:
                type === "past"
                  ? "#94a3b8"
                  : type === "ongoing"
                  ? "#2e7d32"
                  : "#0b4ea2",
              flexShrink: 0,
            }}
          />

          <div>
            {/* TITLE + TOTAL */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#071a3d",
                  fontSize: "18px",
                  fontWeight: "800",
                }}
              >
                {title}
              </h3>

              {/* TOTAL EVENT */}

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "28px",
                  height: "24px",
                  padding: "0 8px",
                  borderRadius: "999px",
                  background:
                    type === "past"
                      ? "#f1f5f9"
                      : type === "ongoing"
                      ? "#e8f5e9"
                      : "#eef5fd",
                  color:
                    type === "past"
                      ? "#64748b"
                      : type === "ongoing"
                      ? "#2e7d32"
                      : "#0b4ea2",
                  fontSize: "11px",
                  fontWeight: "800",
                  boxSizing: "border-box",
                }}
              >
                {eventList.length}
              </span>
            </div>

            <p
              style={{
                margin: "4px 0 0",
                color: "#64748b",
                fontSize: "12px",
              }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* EVENT */}

        {latestEvent ? (
          <EventItem
            event={latestEvent}
            type={type}
          />
        ) : (
          <EmptyEvent
            message={emptyMessage}
          />
        )}
      </div>
    );
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <section
        style={{
          padding: "70px 36px",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            textAlign: "center",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Memuat event...
        </div>
      </section>
    );
  }

  // ==================================================
  // MAIN RENDER
  // ==================================================

  return (
    <section
      style={{
        padding: "70px 36px",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
        }}
      >
        {/* ==============================
            MAIN EVENT CARD
        ============================== */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            padding: "8px 34px",
            boxShadow:
              "0 12px 35px rgba(7, 26, 61, 0.07)",
          }}
        >
          {/* CARD HEADER */}

          <div
            style={{
              padding: "30px 0 26px",
              borderBottom:
                "1px solid #edf1f5",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  width: "28px",
                  height: "2px",
                  background: "#0b4ea2",
                }}
              />

              <span
                style={{
                  color: "#0b4ea2",
                  fontSize: "11px",
                  fontWeight: "800",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Company Events
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#071a3d",
                    fontSize: "30px",
                    lineHeight: "1.2",
                    fontWeight: "800",
                  }}
                >
                  Event
                </h2>

                <p
                  style={{
                    margin: "7px 0 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Temukan informasi event perusahaan
                  terbaru dan sebelumnya.
                </p>
              </div>

              <Link
                to="/events"
                style={{
                  color: "#0b4ea2",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: "800",
                  whiteSpace: "nowrap",
                }}
              >
                Lihat Semua →
              </Link>
            </div>
          </div>

          {/* ==============================
              PAST
          ============================== */}

          <CategoryRow
            type="past"
            title="Past Event"
            description="Event yang telah selesai diselenggarakan."
            eventList={sortedPast}
            emptyMessage="Belum ada event yang telah selesai."
          />

          <div
            style={{
              height: "1px",
              background: "#edf1f5",
            }}
          />

          {/* ==============================
              ONGOING
          ============================== */}

          <CategoryRow
            type="ongoing"
            title="Ongoing Event"
            description="Event yang sedang berlangsung saat ini."
            eventList={sortedOngoing}
            emptyMessage="Tidak ada event yang sedang berlangsung."
          />

          <div
            style={{
              height: "1px",
              background: "#edf1f5",
            }}
          />

          {/* ==============================
              UPCOMING
          ============================== */}

          <CategoryRow
            type="upcoming"
            title="Upcoming Event"
            description="Event yang akan datang."
            eventList={sortedUpcoming}
            emptyMessage="Belum ada event yang akan datang."
          />

          {/* CARD BOTTOM */}

          <div
            style={{
              padding: "18px 0 25px",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "11px",
            }}
          >
            Informasi event diperbarui secara berkala.
          </div>
        </div>
      </div>

      {/* ==============================
          RESPONSIVE
      ============================== */}

      <style>
        {`
          @media (max-width: 800px) {
            section {
              padding: 45px 20px !important;
            }

            section > div {
              width: 100% !important;
            }

            section article {
              grid-template-columns: 1fr !important;
            }

            section article > div:first-child {
              height: 220px !important;
              min-height: 220px !important;
            }
          }

          @media (max-width: 550px) {
            section > div > div {
              padding-left: 20px !important;
              padding-right: 20px !important;
            }

            section article {
              gap: 18px !important;
            }

            section article > div:first-child {
              height: 190px !important;
              min-height: 190px !important;
            }

            section h2 {
              font-size: 25px !important;
            }

            section h3 {
              font-size: 17px !important;
            }
          }
        `}
      </style>
    </section>
  );
}

export default LatestEvent;