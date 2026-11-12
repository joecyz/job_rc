import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import api from "../../api/axios";

import {
  getManageEvents,
  getEventDetail,
  getEventCategories,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventPoster,
  deleteEventPoster,
} from "../../services/eventService";


function EventDashboard() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [modal, setModal] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    article: "",
    category: "",
    city: "",
    location: "", 
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
  });

  const [posterFile, setPosterFile] = useState(null);
  const [removePoster, setRemovePoster] = useState(false);

  // Dokumentasi event yang diupload setelah event selesai
  const [galleryFiles, setGalleryFiles] = useState([]);


  // ======================================================
  // FETCH EVENTS
  // ======================================================

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const firstData = await getManageEvents();

      let allEvents = [];

      if (Array.isArray(firstData)) {
        allEvents = firstData;
      } else {
        allEvents = firstData?.results || [];

        let nextUrl = firstData?.next;

        while (nextUrl) {
          const response = await fetch(nextUrl, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "access_token"
              )}`,
            },
          });

          if (!response.ok) {
            throw new Error(
              "Gagal mengambil halaman event berikutnya."
            );
          }

          const data = await response.json();

          allEvents = [
            ...allEvents,
            ...(data.results || []),
          ];

          nextUrl = data.next;
        }
      }

      setEvents(allEvents);
    } catch (error) {
      console.error(
        "EVENT DASHBOARD ERROR:",
        error?.response?.data || error
      );

      setError(
        error?.response?.data?.detail ||
          "Gagal mengambil data event."
      );
    } finally {
      setLoading(false);
    }
  };


  // ======================================================
  // FETCH CATEGORIES
  // ======================================================

  const fetchCategories = async () => {
    try {
      const data = await getEventCategories();

      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories(data?.results || []);
      }
    } catch (error) {
      console.error(
        "CATEGORY ERROR:",
        error?.response?.data || error
      );
    }
  };


  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);


  // ======================================================
  // EVENT STATUS
  // ======================================================

  const getEventStatus = (event) => {
    if (
      !event?.start_date ||
      !event?.end_date
    ) {
      return "UNKNOWN";
    }

    const now = new Date();

    const start = new Date(
      `${event.start_date}T${
        event.start_time || "00:00:00"
      }`
    );

    const end = new Date(
      `${event.end_date}T${
        event.end_time || "23:59:59"
      }`
    );

    if (start <= now && now <= end) {
      return "ONGOING";
    }

    if (start > now) {
      return "UPCOMING";
    }

    if (end < now) {
      return "PAST";
    }

    return "UNKNOWN";
  };


  // ======================================================
  // STATISTICS
  // ======================================================

  const statistics = useMemo(() => {
    let ongoing = 0;
    let upcoming = 0;
    let past = 0;

    events.forEach((event) => {
      const status = getEventStatus(event);

      if (status === "ONGOING") {
        ongoing += 1;
      }

      if (status === "UPCOMING") {
        upcoming += 1;
      }

      if (status === "PAST") {
        past += 1;
      }
    });

    return {
      total: events.length,
      ongoing,
      upcoming,
      past,
    };
  }, [events]);


  // ======================================================
  // GALLERY / DOKUMENTASI
  // ======================================================

  // Dokumentasi hanya tersedia ketika EDIT dan event sudah PAST.
  const isSelectedEventPast =
    modal === "edit" &&
    selectedEvent &&
    getEventStatus(selectedEvent) === "PAST";

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);

    const validFiles = files.filter((file) => {
      const isImage = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type);

      const maxSize = 5 * 1024 * 1024;

      if (!isImage) {
        alert(`File ${file.name} bukan gambar JPG, PNG, atau WEBP.`);
        return false;
      }

      if (file.size > maxSize) {
        alert(`File ${file.name} melebihi ukuran maksimal 5 MB.`);
        return false;
      }

      return true;
    });

    setGalleryFiles(validFiles);

    // Supaya file yang sama masih bisa dipilih kembali.
    e.target.value = "";
  };

const uploadGalleryFiles = async (eventId) => {
  if (!galleryFiles.length) {
    return;
  }

  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Session login tidak ditemukan.");
  }

  for (const file of galleryFiles) {
    const data = new FormData();

    data.append("image", file);

    const response = await fetch(
      `http://127.0.0.1:8000/api/events/manage/${eventId}/gallery/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }
    );

    if (!response.ok) {
      let errorData = null;

      try {
        errorData = await response.json();
      } catch {
        // Response bukan JSON
      }

      const error = new Error(
        errorData?.detail ||
          "Gagal mengupload dokumentasi event."
      );

      error.response = {
        data: errorData,
        status: response.status,
      };

      throw error;
    }
  }
};


const handleDeleteGallery = async (galleryId) => {
  const confirmed = window.confirm(
    "Apakah anda yakin ingin menghapus foto dokumentasi ini?"
  );

  if (!confirmed) return;

  try {
    setSaving(true);

    await api.delete(`/events/gallery/${galleryId}/delete/`);

    setSelectedEvent((prev) => ({
      ...prev,
      galleries: (prev.galleries || []).filter(
        (gallery) => gallery.id !== galleryId
      ),
    }));

    setEvents((prev) =>
      prev.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              galleries: (event.galleries || []).filter(
                (gallery) => gallery.id !== galleryId
              ),
            }
          : event
      )
    );

    alert("Dokumentasi berhasil dihapus.");
  } catch (error) {
    console.error(
      "DELETE GALLERY ERROR:",
      error?.response?.data || error
    );

    alert(
      error?.response?.data?.detail ||
        "Gagal menghapus dokumentasi."
    );
  } finally {
    setSaving(false);
  }
};



  // ======================================================
  // FILTER
  // ======================================================

  const filteredEvents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return events.filter((event) => {
      const status = getEventStatus(event);

      const matchesSearch =
        !keyword ||
        event.title
          ?.toLowerCase()
          .includes(keyword) ||
        event.description
          ?.toLowerCase()
          .includes(keyword) ||
        event.article
          ?.toLowerCase()
          .includes(keyword) ||
        event.city
          ?.toLowerCase()
          .includes(keyword) ||
        event.location
          ?.toLowerCase()
          .includes(keyword) ||
        event.category
          ?.toString()
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    events,
    search,
    statusFilter,
  ]);


  // ======================================================
  // FORM
  // ======================================================

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      article: "",
      category: "",
      city: "",
      location: "",
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
    });

    setPosterFile(null);
    setRemovePoster(false);
    setGalleryFiles([]);
  };


  const openCreateModal = () => {
    resetForm();

    setSelectedEvent(null);
    setModal("create");
  };


  const openEditModal = (event) => {
    setSelectedEvent(event);

    setFormData({
      title: event.title || "",
      description: event.description || "",
      article: event.article || "",
      category:
        event.category?.id ||
        event.category ||
        "",
      city: event.city || "",
      location: event.location || "",
      start_date: event.start_date || "",
      end_date: event.end_date || "",
      start_time: event.start_time
        ? event.start_time.slice(0, 5)
        : "",
      end_time: event.end_time
        ? event.end_time.slice(0, 5)
        : "",
    });

    setPosterFile(null);
    setRemovePoster(false);
    setGalleryFiles([]);

    setModal("edit");
  };


  const closeModal = () => {
    if (saving) {
      return;
    }

    setModal(null);
    setSelectedEvent(null);
    resetForm();
  };


  // ======================================================
  // INPUT
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ======================================================
  // SUBMIT CREATE / UPDATE
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Nama event wajib diisi.");
      return;
    }

    if (!formData.category) {
      alert("Kategori event wajib dipilih.");
      return;
    }

    if (!formData.city.trim()) {
      alert("Kota wajib diisi.");
      return;
    }

    if (!formData.location.trim()) {
      alert("Lokasi wajib diisi.");
      return;
    }

    if (!formData.start_date) {
      alert("Tanggal mulai wajib diisi.");
      return;
    }

    if (!formData.end_date) {
      alert("Tanggal selesai wajib diisi.");
      return;
    }

    if (!formData.start_time) {
      alert("Jam mulai wajib diisi.");
      return;
    }

    if (!formData.end_time) {
      alert("Jam selesai wajib diisi.");
      return;
    }

    const start = new Date(
      `${formData.start_date}T${formData.start_time}`
    );

    const end = new Date(
      `${formData.end_date}T${formData.end_time}`
    );

    if (end < start) {
      alert(
        "Tanggal dan waktu selesai tidak boleh lebih awal dari mulai."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        article: formData.article,
        category: Number(formData.category),
        city: formData.city,
        location: formData.location,
        start_date: formData.start_date,
        end_date: formData.end_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
      };


      // ==================================================
      // CREATE
      // ==================================================

      if (modal === "create") {
        const createdEvent = await createEvent(
          payload
        );

        if (posterFile) {
          await uploadEventPoster(
            createdEvent.id,
            posterFile
          );
        }

        alert(
          "Event berhasil dibuat."
        );
      }


      // ==================================================
      // UPDATE
      // ==================================================

      if (modal === "edit") {
        await updateEvent(
          selectedEvent.id,
          payload
        );

        if (posterFile) {
          await uploadEventPoster(
            selectedEvent.id,
            posterFile
          );
        }

        if (
          removePoster &&
          !posterFile &&
          selectedEvent.poster
        ) {
          await deleteEventPoster(
            selectedEvent.id
          );
        }

        // Dokumentasi hanya dapat ditambahkan untuk event yang sudah lewat.
        if (
          getEventStatus(selectedEvent) === "PAST" &&
          galleryFiles.length > 0
        ) {
          await uploadGalleryFiles(
            selectedEvent.id
          );
        }

        alert(
          "Event berhasil diperbarui."
        );
      }

      closeModal();

      await fetchEvents();
    } catch (error) {
      console.error(
        "SAVE EVENT ERROR:",
        error?.response?.data || error
      );

      const backendError =
        error?.response?.data;

      if (
        backendError &&
        typeof backendError === "object"
      ) {
        const messages = Object.entries(
          backendError
        )
          .map(([field, value]) => {
            const message = Array.isArray(value)
              ? value.join(", ")
              : String(value);

            return `${field}: ${message}`;
          })
          .join("\n");

        alert(messages);
      } else {
        alert(
          "Gagal menyimpan event."
        );
      }
    } finally {
      setSaving(false);
    }
  };


  // ======================================================
  // DELETE
  // ======================================================

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setSaving(true);

      await deleteEvent(
        deleteTarget.id
      );

      alert(
        "Event berhasil dihapus."
      );

      setDeleteTarget(null);

      await fetchEvents();
    } catch (error) {
      console.error(
        "DELETE EVENT ERROR:",
        error?.response?.data || error
      );

      alert(
        error?.response?.data?.detail ||
          "Gagal menghapus event."
      );
    } finally {
      setSaving(false);
    }
  };


  // ======================================================
  // FORMAT
  // ======================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };


  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    return time.slice(0, 5);
  };


  // ======================================================
  // STATUS
  // ======================================================

  const getStatusLabel = (status) => {
    if (status === "ONGOING") {
      return "Berjalan";
    }

    if (status === "UPCOMING") {
      return "Mendatang";
    }

    if (status === "PAST") {
      return "Selesai";
    }

    return "Tidak Diketahui";
  };


  const getStatusStyle = (status) => {
    if (status === "ONGOING") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (status === "UPCOMING") {
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (status === "PAST") {
      return {
        background: "#eef2f7",
        color: "#64748b",
      };
    }

    return {
      background: "#fef3c7",
      color: "#92400e",
    };
  };


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <MainLayout>
        <div style={styles.page}>
          <div style={styles.loading}>
            <div style={styles.spinner} />

            <h2>
              Memuat Event Dashboard...
            </h2>

            <p>
              Sedang mengambil data event.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }


  // ======================================================
  // RENDER
  // ======================================================

  return (
    <MainLayout>
      <div style={styles.page}>
        <div style={styles.container}>

          {/* ==================================================
              HERO
          ================================================== */}

          <section style={styles.hero}>
            <div style={styles.heroGlow} />

            <div style={styles.heroContent}>
              <span style={styles.heroBadge}>
                TEAM EVENT
              </span>

              <h1 style={styles.heroTitle}>
                Event Management
              </h1>

              <p style={styles.heroSubtitle}>
                Kelola seluruh event Bintang
                Sayap Utama dalam satu
                dashboard.
              </p>

              <div style={styles.heroMeta}>
                <span>
                  <b>{statistics.ongoing}</b>{" "}
                  event sedang berjalan
                </span>

                <span>
                  <b>{statistics.upcoming}</b>{" "}
                  event mendatang
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchEvents}
              style={styles.refreshButton}
            >
              ↻ Refresh Data
            </button>
          </section>


          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div style={styles.errorBox}>
              <div>
                <strong>
                  Gagal memuat event
                </strong>

                <p>
                  {error}
                </p>
              </div>

              <button
                onClick={fetchEvents}
                style={styles.retryButton}
              >
                Coba Lagi
              </button>
            </div>
          )}


          {/* ==================================================
              STATISTICS
          ================================================== */}

          <section style={styles.statsGrid}>

            <StatCard
              icon="▦"
              label="Total Event"
              number={statistics.total}
              description="Seluruh event"
              accent="#0b4ea2"
            />

            <StatCard
              icon="●"
              label="Event Berjalan"
              number={statistics.ongoing}
              description="Sedang berlangsung"
              accent="#16a34a"
            />

            <StatCard
              icon="→"
              label="Event Mendatang"
              number={statistics.upcoming}
              description="Menunggu pelaksanaan"
              accent="#e2a600"
            />

            <StatCard
              icon="✓"
              label="Event Selesai"
              number={statistics.past}
              description="Telah selesai"
              accent="#64748b"
            />

          </section>


          {/* ==================================================
              MANAGEMENT
          ================================================== */}

          <section style={styles.managementCard}>

            <div style={styles.managementHeader}>
              <div>
                <span style={styles.sectionEyebrow}>
                  EVENT MANAGEMENT
                </span>

                <h2 style={styles.sectionTitle}>
                  Daftar Event
                </h2>

                <p style={styles.sectionSubtitle}>
                  {filteredEvents.length} event
                  ditampilkan berdasarkan filter.
                </p>
              </div>

              <div style={styles.headerActions}>

                <Link
                  to="/events/all"
                  style={styles.publicButton}
                >
                  Lihat Public Events →
                </Link>

                <button
                  type="button"
                  onClick={openCreateModal}
                  style={styles.createButton}
                >
                  + Tambah Event
                </button>

              </div>
            </div>


            {/* ==================================================
                FILTER
            ================================================== */}

            <div style={styles.filterArea}>

              <div style={styles.searchBox}>
                <span style={styles.searchIcon}>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Cari nama, kategori, kota, atau lokasi event..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  style={styles.searchInput}
                />
              </div>


              <div style={styles.statusTabs}>

                {[
                  ["ALL", "Semua"],
                  ["ONGOING", "Ongoing"],
                  ["UPCOMING", "Upcoming"],
                  ["PAST", "Past"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setStatusFilter(value)
                    }
                    style={{
                      ...styles.statusTab,
                      ...(statusFilter === value
                        ? styles.statusTabActive
                        : {}),
                    }}
                  >
                    {label}

                    {value !== "ALL" && (
                      <span
                        style={
                          styles.tabCount
                        }
                      >
                        {value === "ONGOING"
                          ? statistics.ongoing
                          : value === "UPCOMING"
                          ? statistics.upcoming
                          : statistics.past}
                      </span>
                    )}
                  </button>
                ))}

              </div>

            </div>


            {/* ==================================================
                TABLE
            ================================================== */}

            {filteredEvents.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  ◌
                </div>

                <h3>
                  Tidak ada event
                </h3>

                <p>
                  Tidak ada event yang sesuai
                  dengan pencarian atau filter.
                </p>

                <button
                  type="button"
                  onClick={openCreateModal}
                  style={styles.emptyButton}
                >
                  + Tambah Event
                </button>
              </div>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>

                  <thead>
                    <tr>
                      <th style={styles.th}>
                        Event
                      </th>

                      <th style={styles.th}>
                        Kategori
                      </th>

                      <th style={styles.th}>
                        Lokasi
                      </th>

                      <th style={styles.th}>
                        Jadwal
                      </th>

                      <th style={styles.th}>
                        Status
                      </th>

                      <th
                        style={{
                          ...styles.th,
                          textAlign: "center",
                        }}
                      >
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEvents.map(
                      (event) => {
                        const status =
                          getEventStatus(event);

                        return (
                          <tr
                            key={event.id}
                            style={styles.tr}
                          >

                            {/* EVENT */}

                            <td style={styles.td}>
                              <div
                                style={
                                  styles.eventCell
                                }
                              >
                                <div
                                  style={
                                    styles.posterThumb
                                  }
                                >
                                  {event.poster ? (
                                    <img
                                      src={
                                        event.poster
                                      }
                                      alt={
                                        event.title
                                      }
                                      style={
                                        styles.posterImage
                                      }
                                    />
                                  ) : (
                                    <span>
                                      ★
                                    </span>
                                  )}
                                </div>

                                <div
                                  style={
                                    styles.eventInfo
                                  }
                                >
                                  <strong
                                    style={
                                      styles.eventTitle
                                    }
                                  >
                                    {event.title}
                                  </strong>

                                  <span
                                    style={
                                      styles.eventCity
                                    }
                                  >
                                    {event.city ||
                                      "-"}
                                  </span>
                                </div>
                              </div>
                            </td>


                            {/* CATEGORY */}

                            <td style={styles.td}>
                              <span
                                style={
                                  styles.categoryBadge
                                }
                              >
                                {event.category ||
                                  "-"}
                              </span>
                            </td>


                            {/* LOCATION */}

                            <td style={styles.td}>
                              <div
                                style={
                                  styles.location
                                }
                              >
                                <span>
                                  ✦
                                </span>

                                {event.location ||
                                  "-"}
                              </div>
                            </td>


                            {/* SCHEDULE */}

                            <td style={styles.td}>
                              <strong
                                style={
                                  styles.scheduleDate
                                }
                              >
                                {formatDate(
                                  event.start_date
                                )}
                              </strong>

                              <span
                                style={
                                  styles.scheduleTime
                                }
                              >
                                {formatTime(
                                  event.start_time
                                )}

                                {" — "}

                                {formatDate(
                                  event.end_date
                                )}

                                {" "}

                                {formatTime(
                                  event.end_time
                                )}
                              </span>
                            </td>


                            {/* STATUS */}

                            <td style={styles.td}>
                              <span
                                style={{
                                  ...styles.statusBadge,
                                  ...getStatusStyle(
                                    status
                                  ),
                                }}
                              >
                                <span>
                                  ●
                                </span>

                                {getStatusLabel(
                                  status
                                )}
                              </span>
                            </td>


                          {/* ACTION */}

                            <td
                              style={{
                                ...styles.td,
                                textAlign: "center",
                              }}
                            >
                              <div style={styles.actionGroup}>

                                <Link
                                  to={`/events/${event.id}`}
                                  style={styles.viewAction}
                                >
                                  Lihat
                                </Link>

                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditModal(event)
                                  }
                                  style={styles.editAction}
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteTarget(event)
                                  }
                                  style={styles.deleteAction}
                                >
                                  Hapus
                                </button>

                              </div>
                            </td>

                          </tr>
                        );
                      }
                    )}
                  </tbody>

                </table>
              </div>
            )}

          </section>

        </div>
      </div>


      {/* ======================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {modal && (
        <div
          style={styles.modalOverlay}
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div style={styles.modal}>

            <div style={styles.modalHeader}>
              <div>
                <span
                  style={
                    styles.modalEyebrow
                  }
                >
                  TEAM EVENT
                </span>

                <h2 style={styles.modalTitle}>
                  {modal === "create"
                    ? "Tambah Event"
                    : "Edit Event"}
                </h2>

                <p
                  style={
                    styles.modalSubtitle
                  }
                >
                  {modal === "create"
                    ? "Buat event baru untuk BSU Career."
                    : "Perbarui informasi event."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>


            <form
              onSubmit={handleSubmit}
              style={styles.form}
            >

              <div style={styles.formGrid}>

                {/* LEFT */}

                <div>

                  <FormField
                    label="Nama Event"
                    required
                  >
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Masukkan nama event"
                      style={styles.input}
                    />
                  </FormField>


                  <FormField
                    label="Jenis Event"
                    required
                  >
                    <select
                      name="category"
                      value={
                        formData.category
                      }
                      onChange={handleChange}
                      style={styles.input}
                    >
                      <option value="">
                        Pilih jenis event
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={category.id}
                            value={category.id}
                          >
                            {category.category_name}
                          </option>
                        )
                      )}
                    </select>
                  </FormField>


                  <div
                    style={
                      styles.twoColumns
                    }
                  >
                    <FormField
                      label="Kota"
                      required
                    >
                      <input
                        name="city"
                        value={
                          formData.city
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Contoh: Malang"
                        style={
                          styles.input
                        }
                      />
                    </FormField>

                    <FormField
                      label="Lokasi"
                      required
                    >
                      <input
                        name="location"
                        value={
                          formData.location
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Contoh: Aula BSU"
                        style={
                          styles.input
                        }
                      />
                    </FormField>
                  </div>


                  <div
                    style={
                      styles.twoColumns
                    }
                  >

                    <FormField
                      label="Tanggal Mulai"
                      required
                    >
                      <input
                        type="date"
                        name="start_date"
                        value={
                          formData.start_date
                        }
                        onChange={
                          handleChange
                        }
                        style={
                          styles.input
                        }
                      />
                    </FormField>

                    <FormField
                      label="Tanggal Selesai"
                      required
                    >
                      <input
                        type="date"
                        name="end_date"
                        value={
                          formData.end_date
                        }
                        onChange={
                          handleChange
                        }
                        style={
                          styles.input
                        }
                      />
                    </FormField>

                  </div>


                  <div
                    style={
                      styles.twoColumns
                    }
                  >

                    <FormField
                      label="Jam Mulai"
                      required
                    >
                      <input
                        type="time"
                        name="start_time"
                        value={
                          formData.start_time
                        }
                        onChange={
                          handleChange
                        }
                        style={
                          styles.input
                        }
                      />
                    </FormField>

                    <FormField
                      label="Jam Selesai"
                      required
                    >
                      <input
                        type="time"
                        name="end_time"
                        value={
                          formData.end_time
                        }
                        onChange={
                          handleChange
                        }
                        style={
                          styles.input
                        }
                      />
                    </FormField>

                  </div>

                </div>


                {/* RIGHT */}

                <div>

                  <FormField label="Poster">
                    <label
                      style={
                        styles.uploadBox
                      }
                    >

                      {posterFile ? (
                        <div>
                          <strong>
                            {posterFile.name}
                          </strong>

                          <span>
                            Klik untuk mengganti
                          </span>
                        </div>
                      ) : selectedEvent?.poster &&
                        !removePoster ? (
                        <div
                          style={
                            styles.currentPoster
                          }
                        >
                          <img
                            src={
                              selectedEvent.poster
                            }
                            alt={
                              selectedEvent.title
                            }
                            style={
                              styles.modalPoster
                            }
                          />

                          <span>
                            Klik untuk
                            mengganti poster
                          </span>
                        </div>
                      ) : (
                        <div>
                          <strong>
                            + Upload Poster
                          </strong>

                          <span>
                            PNG, JPG
                          </span>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={(e) =>
                          setPosterFile(
                            e.target.files?.[0] ||
                              null
                          )
                        }
                        style={
                          styles.fileInput
                        }
                      />

                    </label>
                  </FormField>


                  {selectedEvent?.poster &&
                    !posterFile && (
                      <button
                        type="button"
                        onClick={() =>
                          setRemovePoster(
                            (prev) => !prev
                          )
                        }
                        style={{
                          ...styles.removePosterButton,
                          ...(removePoster
                            ? styles.removePosterActive
                            : {}),
                        }}
                      >
                        {removePoster
                          ? "Poster akan dihapus"
                          : "Hapus poster"}
                      </button>
                    )}


                  {/* ==============================================
                      DOKUMENTASI EVENT
                      Hanya muncul saat EDIT dan event sudah PAST
                  ============================================== */}

                  {isSelectedEventPast && (
                    <section style={styles.galleryUploadSection}>
                      <div style={styles.galleryUploadHeader}>
                        <div>
                          <span style={styles.galleryUploadEyebrow}>
                            EVENT SELESAI
                          </span>

                          <h3 style={styles.galleryUploadTitle}>
                            Dokumentasi Event
                          </h3>

                          <p style={styles.galleryUploadDescription}>
                            Upload foto dokumentasi setelah event selesai.
                            Foto akan ditampilkan pada halaman detail event.
                          </p>
                        </div>
                      </div>

                      <label style={styles.galleryUploadBox}>
                        <div style={styles.galleryUploadIcon}>
                          +
                        </div>

                        <strong>
                          Upload Dokumentasi
                        </strong>

                        <span>
                          Pilih foto untuk di upload
                        </span>

                        <small>
                          JPG
                        </small>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={handleGalleryChange}
                          style={styles.fileInput}
                        />
                      </label>

                      {galleryFiles.length > 0 && (
                        <div style={styles.selectedGalleryFiles}>
                          <strong>
                            {galleryFiles.length} foto dipilih
                          </strong>

                          {galleryFiles.map((file, index) => (
                            <div
                              key={`${file.name}-${file.lastModified}-${index}`}
                              style={styles.selectedGalleryFile}
                            >
                              <span>
                                {file.name}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  setGalleryFiles((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                                style={styles.removeGalleryFileButton}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  )}


                  <FormField label="Deskripsi">
                    <textarea
                      name="description"
                      value={
                        formData.description
                      }
                      onChange={handleChange}
                      placeholder="Jelaskan tentang event ini..."
                      rows={7}
                      style={
                        styles.textarea
                      }
                    />
                  </FormField>


                  <FormField label="Artikel">
                    <textarea
                      name="article"
                      value={
                        formData.article
                      }
                      onChange={handleChange}
                      placeholder="Artikel / informasi tambahan event..."
                      rows={5}
                      style={
                        styles.textarea
                      }
                    />
                  </FormField>

                </div>

              </div>


              {/* ACTION */}

              <div style={styles.modalFooter}>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  style={
                    styles.cancelButton
                  }
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={
                    styles.saveButton
                  }
                >
                  {saving
                    ? "Menyimpan..."
                    : modal === "create"
                    ? "Simpan Event"
                    : "Simpan Perubahan"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}


      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      {deleteTarget && (
        <div style={styles.modalOverlay}>

          <div
            style={
              styles.deleteModal
            }
          >

            <div
              style={
                styles.deleteIcon
              }
            >
              ♲
            </div>

            <h2
              style={
                styles.deleteTitle
              }
            >
              Hapus Event?
            </h2>

            <p
              style={
                styles.deleteText
              }
            >
              Apakah lu yakin ingin
              menghapus event
              <strong>
                {" "}
                "{deleteTarget.title}"
              </strong>
              ?
            </p>

            <span
              style={
                styles.deleteWarning
              }
            >
              Event yang dihapus tidak
              dapat dikembalikan.
            </span>

            <div
              style={
                styles.deleteActions
              }
            >

              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                disabled={saving}
                style={
                  styles.cancelButton
                }
              >
                Batal
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={saving}
                style={
                  styles.confirmDeleteButton
                }
              >
                {saving
                  ? "Menghapus..."
                  : "Hapus Event"}
              </button>

            </div>

          </div>

        </div>
      )}

    </MainLayout>
  );
}


// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  icon,
  label,
  number,
  description,
  accent,
}) {
  return (
    <div
      style={{
        ...styles.statCard,
        borderTop: `3px solid ${accent}`,
      }}
    >
      <div
        style={{
          ...styles.statIcon,
          color: accent,
        }}
      >
        {icon}
      </div>

      <div>
        <span style={styles.statLabel}>
          {label}
        </span>

        <strong style={styles.statNumber}>
          {number}
        </strong>

        <span style={styles.statDescription}>
          {description}
        </span>
      </div>
    </div>
  );
}


// ======================================================
// FORM FIELD
// ======================================================

function FormField({
  label,
  required,
  children,
}) {
  return (
    <div style={styles.formField}>
      <label style={styles.formLabel}>
        {label}

        {required && (
          <span style={styles.required}>
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}


// ======================================================
// STYLES
// ======================================================

const styles = {
  page: {
    minHeight: "calc(100vh - 72px)",
    background: "#f4f6f9",
    padding: "32px 24px 72px",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: "1280px",
    margin: "0 auto",
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    minHeight: "220px",
    borderRadius: "20px",
    padding: "34px 36px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "24px",
    background: "linear-gradient(135deg, #071a3d 0%, #0b4ea2 100%)",
    color: "#fff",
    marginBottom: "20px",
    boxShadow: "0 12px 32px rgba(7,26,61,0.14)",
  },

  heroGlow: {
    position: "absolute",
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    right: "-150px",
    top: "-220px",
    border: "1px solid rgba(255,255,255,0.13)",
    boxShadow: "0 0 0 70px rgba(255,255,255,0.025)",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "720px",
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.16)",
    color: "#bfdbfe",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.4px",
  },

  heroTitle: {
    margin: "17px 0 8px",
    fontSize: "36px",
    lineHeight: 1.08,
    fontWeight: "800",
    letterSpacing: "-0.6px",
    color: "#fff",
  },

  heroSubtitle: {
    margin: 0,
    color: "rgba(255,255,255,0.78)",
    fontSize: "14px",
    maxWidth: "600px",
    lineHeight: 1.65,
  },

  heroMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    marginTop: "22px",
    fontSize: "12px",
    color: "rgba(255,255,255,0.82)",
  },

  refreshButton: {
    position: "relative",
    zIndex: 2,
    flexShrink: 0,
    minHeight: "40px",
    border: "1px solid rgba(255,255,255,0.20)",
    background: "rgba(255,255,255,0.07)",
    color: "#fff",
    borderRadius: "9px",
    padding: "0 15px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  },

  errorBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    background: "#fff5f5",
    border: "1px solid #fecaca",
    borderRadius: "14px",
    padding: "16px 18px",
    marginBottom: "20px",
    color: "#991b1b",
  },

  retryButton: {
    flexShrink: 0,
    border: "none",
    borderRadius: "8px",
    padding: "9px 14px",
    background: "#991b1b",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "14px",
    marginBottom: "20px",
  },

  statCard: {
    position: "relative",
    minWidth: 0,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow: "0 6px 20px rgba(7,26,61,0.045)",
  },

  statIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "11px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: "800",
    flexShrink: 0,
  },

  statLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "700",
    marginBottom: "5px",
  },

  statNumber: {
    display: "block",
    color: "#071a3d",
    fontSize: "28px",
    lineHeight: 1,
    fontWeight: "800",
  },

  statDescription: {
    display: "block",
    color: "#94a3b8",
    fontSize: "10px",
    marginTop: "6px",
  },

  managementCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "17px",
    overflow: "hidden",
    boxShadow: "0 7px 24px rgba(7,26,61,0.045)",
  },

  managementHeader: {
    padding: "24px 24px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    borderBottom: "1px solid #edf1f6",
  },

  sectionEyebrow: {
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    color: "#0b4ea2",
  },

  sectionTitle: {
    margin: "5px 0 4px",
    color: "#071a3d",
    fontSize: "24px",
    fontWeight: "800",
    letterSpacing: "-0.3px",
  },

  sectionSubtitle: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "12px",
  },

  headerActions: {
    display: "flex",
    gap: "9px",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  publicButton: {
    textDecoration: "none",
    minHeight: "40px",
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    padding: "0 13px",
    borderRadius: "9px",
    border: "1px solid #d9e3ef",
    background: "#fff",
    color: "#071a3d",
    fontWeight: "700",
    fontSize: "12px",
  },

  createButton: {
    minHeight: "40px",
    border: "none",
    borderRadius: "9px",
    padding: "0 15px",
    background: "#0b4ea2",
    color: "#fff",
    fontWeight: "800",
    fontSize: "12px",
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(11,78,162,0.18)",
  },

  filterArea: {
    padding: "16px 24px",
    borderBottom: "1px solid #edf1f6",
  },

  searchBox: {
    position: "relative",
    width: "100%",
  },

  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
    pointerEvents: "none",
  },

  searchInput: {
    width: "100%",
    height: "42px",
    boxSizing: "border-box",
    border: "1px solid #dce4ee",
    borderRadius: "9px",
    padding: "0 14px 0 38px",
    fontSize: "13px",
    outline: "none",
    color: "#0f172a",
    background: "#fff",
  },

  statusTabs: {
    display: "flex",
    gap: "7px",
    marginTop: "12px",
    flexWrap: "wrap",
  },

  statusTab: {
    border: "1px solid #e1e7ef",
    background: "#fff",
    color: "#64748b",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  statusTabActive: {
    background: "#071a3d",
    color: "#fff",
    borderColor: "#071a3d",
  },

  tabCount: {
    marginLeft: "6px",
    opacity: 0.7,
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1050px",
  },

  th: {
    padding: "13px 18px",
    textAlign: "left",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "10px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    borderBottom: "1px solid #e5eaf1",
    whiteSpace: "nowrap",
  },

  tr: {
    borderBottom: "1px solid #edf1f6",
  },

  td: {
    padding: "14px 18px",
    color: "#334155",
    fontSize: "12px",
    verticalAlign: "middle",
  },

  eventCell: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    minWidth: "250px",
  },

  posterThumb: {
    width: "50px",
    height: "44px",
    borderRadius: "8px",
    overflow: "hidden",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#0b4ea2",
    fontWeight: "900",
    flexShrink: 0,
  },

  posterImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  eventInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    minWidth: 0,
  },

  eventTitle: {
    color: "#071a3d",
    fontSize: "13px",
    fontWeight: "800",
  },

  eventCity: {
    color: "#94a3b8",
    fontSize: "11px",
  },

  categoryBadge: {
    display: "inline-flex",
    background: "#edf4ff",
    color: "#0b4ea2",
    padding: "5px 9px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: "800",
  },

  location: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
    color: "#475569",
    maxWidth: "180px",
  },

  scheduleDate: {
    display: "block",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "800",
  },

  scheduleTime: {
    display: "block",
    color: "#94a3b8",
    fontSize: "10px",
    marginTop: "4px",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    borderRadius: "999px",
    padding: "6px 9px",
    fontSize: "10px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  actionGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    flexWrap: "nowrap",
    whiteSpace: "nowrap",
  },

  viewAction: {
    minWidth: "72px",
    height: "36px",
    padding: "0 12px",
    borderRadius: "8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    textDecoration: "none",
    background: "#071a3d",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "700",
    lineHeight: "1",
    whiteSpace: "nowrap",
    cursor: "pointer",
  },

  editAction: {
  minWidth: "64px",
    height: "36px",
    padding: "0 12px",
    borderRadius: "8px",
    border: "1px solid #dbe4ef",
    background: "#fff",
    color: "#0b4ea2",
    fontSize: "13px",
    fontWeight: "700",
    lineHeight: "1",
    whiteSpace: "nowrap",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  deleteAction: {
    minWidth: "72px",
    height: "36px",
    padding: "0 12px",
    borderRadius: "8px",
    border: "1px solid #fecdd3",
    background: "#fff5f5",
    color: "#dc2626",
    fontSize: "13px",
    fontWeight: "700",
    lineHeight: "1",
    whiteSpace: "nowrap",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  emptyState: {
    padding: "70px 20px",
    textAlign: "center",
  },

  emptyIcon: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    margin: "0 auto 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f1f5f9",
    color: "#0b4ea2",
    fontSize: "25px",
  },

  emptyButton: {
    marginTop: "15px",
    border: "none",
    borderRadius: "8px",
    padding: "10px 14px",
    background: "#0b4ea2",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "rgba(7,26,61,0.66)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
  },

  modal: {
    width: "100%",
    maxWidth: "920px",
    maxHeight: "92vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 25px 70px rgba(0,0,0,0.25)",
  },

  modalHeader: {
    padding: "22px 24px",
    borderBottom: "1px solid #edf1f6",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },

  modalEyebrow: {
    color: "#0b4ea2",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.3px",
  },

  modalTitle: {
    margin: "5px 0 4px",
    color: "#071a3d",
    fontSize: "24px",
    fontWeight: "800",
  },

  modalSubtitle: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "12px",
  },

  closeButton: {
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    color: "#334155",
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    fontSize: "23px",
    cursor: "pointer",
    flexShrink: 0,
  },

  form: {
    padding: "24px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "22px",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },

  formField: {
    marginBottom: "16px",
  },

  formLabel: {
    display: "block",
    marginBottom: "7px",
    color: "#071a3d",
    fontSize: "12px",
    fontWeight: "800",
  },

  required: {
    color: "#dc2626",
    marginLeft: "3px",
  },

  input: {
    width: "100%",
    height: "42px",
    boxSizing: "border-box",
    padding: "0 12px",
    border: "1px solid #d9e2ed",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
    color: "#0f172a",
    background: "#fff",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px solid #d9e2ed",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
    color: "#0f172a",
    resize: "vertical",
    fontFamily: "inherit",
    background: "#fff",
  },

  uploadBox: {
    minHeight: "180px",
    border: "2px dashed #d7e1ed",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "15px",
    boxSizing: "border-box",
    cursor: "pointer",
    color: "#0b4ea2",
    background: "#f8fbff",
  },

  uploadBoxText: {
    display: "flex",
    flexDirection: "column",
  },

  fileInput: {
    display: "none",
  },

  currentPoster: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },

  modalPoster: {
    width: "140px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  removePosterButton: {
    border: "1px solid #fecdd3",
    background: "#fff5f5",
    color: "#dc2626",
    borderRadius: "7px",
    padding: "8px 10px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "15px",
  },

  removePosterActive: {
    background: "#dc2626",
    color: "#fff",
  },

  galleryUploadSection: {
    marginBottom: "18px",
    padding: "16px",
    border: "1px solid #dbe7f5",
    borderRadius: "12px",
    background: "#f8fbff",
  },

  galleryUploadHeader: {
    marginBottom: "12px",
  },

  galleryUploadEyebrow: {
    display: "block",
    marginBottom: "5px",
    color: "#0b4ea2",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "0.12em",
  },

  galleryUploadTitle: {
    margin: 0,
    color: "#071a3d",
    fontSize: "16px",
    fontWeight: "800",
  },

  galleryUploadDescription: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "11px",
    lineHeight: 1.5,
  },

  galleryUploadBox: {
    minHeight: "125px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    padding: "18px",
    border: "1.5px dashed #9bbce0",
    borderRadius: "10px",
    background: "#fff",
    color: "#0b4ea2",
    cursor: "pointer",
    textAlign: "center",
  },

  galleryUploadIcon: {
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#e8f1fb",
    color: "#0b4ea2",
    fontSize: "22px",
    lineHeight: 1,
    fontWeight: "400",
  },

  selectedGalleryFiles: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  selectedGalleryFile: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    padding: "7px 9px",
    borderRadius: "7px",
    background: "#fff",
    border: "1px solid #e5eaf1",
    color: "#475569",
    fontSize: "10px",
  },

  removeGalleryFileButton: {
    flexShrink: 0,
    width: "22px",
    height: "22px",
    border: "none",
    borderRadius: "5px",
    background: "#fff1f2",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "15px",
    lineHeight: 1,
  },

  modalFooter: {
    marginTop: "8px",
    paddingTop: "18px",
    borderTop: "1px solid #edf1f6",
    display: "flex",
    justifyContent: "flex-end",
    gap: "9px",
  },

  cancelButton: {
    minHeight: "40px",
    border: "1px solid #d9e2ed",
    background: "#fff",
    color: "#475569",
    borderRadius: "8px",
    padding: "0 15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  saveButton: {
    minHeight: "40px",
    border: "none",
    background: "#0b4ea2",
    color: "#fff",
    borderRadius: "8px",
    padding: "0 18px",
    fontWeight: "800",
    cursor: "pointer",
  },

  deleteModal: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    borderRadius: "17px",
    padding: "28px",
    boxSizing: "border-box",
    textAlign: "center",
  },

  deleteIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    background: "#fff1f2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "24px",
  },

  deleteTitle: {
    margin: 0,
    color: "#071a3d",
  },

  deleteText: {
    color: "#475569",
    lineHeight: 1.6,
    fontSize: "13px",
    margin: "10px 0 5px",
  },

  deleteWarning: {
    color: "#94a3b8",
    fontSize: "11px",
  },

  deleteActions: {
    display: "flex",
    justifyContent: "center",
    gap: "9px",
    marginTop: "22px",
  },

  confirmDeleteButton: {
    border: "none",
    background: "#dc2626",
    color: "#fff",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: "800",
    cursor: "pointer",
  },

  loading: {
    minHeight: "65vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#071a3d",
  },

  spinner: {
    width: "35px",
    height: "35px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #0b4ea2",
    borderRadius: "50%",
    marginBottom: "15px",
  },
};

export default EventDashboard;
