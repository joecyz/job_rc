import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import { useToast } from "../components/Toast/ToastProvider";

import {
  getJobDetail,
  createJob,
  updateJob,
  getRegions,
  getDivisions,
  getPositions,
  getEducationLevels,
} from "../services/jobService";

function HRJobForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Kalau ada id berarti EDIT
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const { showToast } = useToast();

  const [regions, setRegions] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);

  const [formData, setFormData] = useState({
    division: "",
    position: "",
    region: "",
    education_level: "",
    description: "",
    requirements: "",
    quota: "",
    open_date: "",
    deadline: "",
    status: "OPEN",
  });

  // ======================================================
  // URUTAN JENJANG PENDIDIKAN
  // ======================================================

  const educationOrder = [
    "SMP",
    "SMA",
    "SMK",
    "D1",
    "D2",
    "D3",
    "D4",
    "S1",
    "S2",
    "S3",
  ];

  const getEducationRank = (levelName) => {
    const index = educationOrder.indexOf(
      String(levelName || "")
        .trim()
        .toUpperCase()
    );

    return index === -1 ? 999 : index;
  };

  const sortEducationLevels = (data) => {
    return [...data].sort((a, b) => {
      const rankA = getEducationRank(a.level_name);
      const rankB = getEducationRank(b.level_name);

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      return String(a.level_name || "").localeCompare(
        String(b.level_name || "")
      );
    });
  };

  // ======================================================
  // LOAD MASTER DATA
  // ======================================================

  const fetchMasterData = async () => {
    try {
      const [
        regionsData,
        divisionsData,
        positionsData,
        educationLevelsData,
      ] = await Promise.all([
        getRegions(),
        getDivisions(),
        getPositions(),
        getEducationLevels(),
      ]);

      setRegions(
        regionsData.results ||
          regionsData ||
          []
      );

      setDivisions(
        divisionsData.results ||
          divisionsData ||
          []
      );

      setPositions(
        positionsData.results ||
          positionsData ||
          []
      );

      const educationData =
        educationLevelsData.results ||
        educationLevelsData ||
        [];

      const sortedEducationLevels =
        sortEducationLevels(
          educationData
        );

      setEducationLevels(
        sortedEducationLevels
      );
    } catch (error) {
      console.error(
        "MASTER DATA ERROR:",
        error?.response?.data || error
      );

      showToast(
        error?.response?.data?.detail ||
          "Gagal mengambil data master.",
        "error"
      );
    }
  };

  // ======================================================
  // LOAD JOB SAAT EDIT
  // ======================================================

  const fetchJob = async () => {
    if (!isEditMode) {
      setLoadingData(false);
      return;
    }

    try {
      const data =
        await getJobDetail(id);

      setFormData({
        division:
          data.division || "",
        position:
          data.position || "",
        region:
          data.region || "",
        education_level:
          data.education_level || "",
        description:
          data.description || "",
        requirements:
          data.requirements || "",
        quota:
          data.quota ?? "",
        open_date:
          data.open_date || "",
        deadline:
          data.deadline || "",
        status:
          data.status || "OPEN",
      });
    } catch (error) {
      console.error(
        "GET JOB DETAIL ERROR:",
        error?.response?.data || error
      );

      showToast(
        error?.response?.data?.detail ||
          "Gagal mengambil detail lowongan.",
        "error"
      );

      navigate("/hr/dashboard");
    } finally {
      setLoadingData(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);

      await fetchMasterData();
      await fetchJob();
    };

    loadData();
  }, [id]);

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!isEditMode && !formData.division) {
      showToast(
        "Division wajib dipilih.",
        "warning"
      );
      return;
    }

    if (!isEditMode && !formData.position) {
      showToast(
        "Position wajib dipilih.",
        "warning"
      );
      return;
    }

    if (!isEditMode && !formData.region) {
      showToast(
        "Region wajib dipilih.",
        "warning"
      );
      return;
    }

    if (
      !isEditMode &&
      !formData.education_level
    ) {
      showToast(
        "Jenjang pendidikan wajib dipilih.",
        "warning"
      );
      return;
    }

    if (!formData.quota) {
      showToast(
        "Quota wajib diisi.",
        "warning"
      );
      return;
    }

    if (!formData.open_date) {
      showToast(
        "Open date wajib diisi.",
        "warning"
      );
      return;
    }

    if (!formData.deadline) {
      showToast(
        "Deadline wajib diisi.",
        "warning"
      );
      return;
    }

    if (
      new Date(formData.deadline) <
      new Date(formData.open_date)
    ) {
      showToast(
        "Deadline tidak boleh lebih awal dari open date.",
        "warning"
      );
      return;
    }

    if (Number(formData.quota) <= 0) {
      showToast(
        "Quota harus lebih dari 0.",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      // ==================================================
      // CREATE
      // ==================================================

      if (!isEditMode) {
        const payload = {
          division:
            Number(formData.division),
          position:
            Number(formData.position),
          region:
            Number(formData.region),
          education_level:
            Number(
              formData.education_level
            ),
          description:
            formData.description,
          requirements:
            formData.requirements,
          quota:
            Number(formData.quota),
          open_date:
            formData.open_date,
          deadline:
            formData.deadline,
          status:
            formData.status,
        };

        await createJob(payload);

        showToast(
          "Lowongan berhasil disimpan.",
          "success"
        );

        navigate("/hr/dashboard");
        return;
      }

      // ==================================================
      // UPDATE
      // ==================================================

      const payload = {
        quota:
          Number(formData.quota),
        open_date:
          formData.open_date,
        deadline:
          formData.deadline,
        status:
          formData.status,
      };

      await updateJob(
        id,
        payload
      );

      showToast(
        "Lowongan berhasil diperbarui.",
        "success"
      );

      navigate(
        `/hr/jobs/${id}`
      );
    } catch (error) {
      console.error(
        "SAVE JOB ERROR:",
        error?.response?.data || error
      );

      const errorData =
        error?.response?.data;

      if (errorData) {
        if (
          typeof errorData ===
          "object"
        ) {
          const messages =
            Object.entries(errorData)
              .map(
                ([field, message]) => {
                  return `${field}: ${
                    Array.isArray(message)
                      ? message.join(", ")
                      : message
                  }`;
                }
              )
              .join("\n");

          showToast(
            messages,
            "error"
          );
        } else {
          showToast(
            errorData,
            "error"
          );
        }
      } else {
        showToast(
          "Gagal menyimpan lowongan.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loadingData) {
    return (
      <MainLayout>
        <div style={styles.loadingPage}>
          <div style={styles.loadingBox}>
            <div style={styles.spinner}></div>

            <p style={styles.loadingText}>
              Memuat data lowongan...
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

          {/* ============================================
              BACK
          ============================================ */}

          <button
            type="button"
            onClick={() =>
              navigate(
                isEditMode
                  ? `/hr/jobs/${id}`
                  : "/hr/dashboard"
              )
            }
            style={styles.backButton}
          >
            <span style={styles.backArrow}>
              ←
            </span>

            {isEditMode
              ? "Kembali ke Detail"
              : "Kembali ke Dashboard"}
          </button>

          {/* ============================================
              HEADER
          ============================================ */}

          <div style={styles.header}>
            <div>
              <div style={styles.eyebrow}>
                MANAJEMEN LOWONGAN
              </div>

              <h1 style={styles.title}>
                {isEditMode
                  ? "Edit Lowongan"
                  : "Tambah Lowongan"}
              </h1>

              <p style={styles.subtitle}>
                {isEditMode
                  ? "Perbarui informasi yang diperbolehkan pada lowongan."
                  : "Buat lowongan pekerjaan baru untuk kebutuhan rekrutmen."}
              </p>
            </div>

            <div
              style={{
                ...styles.modeBadge,
                ...(isEditMode
                  ? styles.editBadge
                  : styles.createBadge),
              }}
            >
              <span style={styles.modeDot}></span>

              {isEditMode
                ? "EDIT MODE"
                : "CREATE MODE"}
            </div>
          </div>

          {/* ============================================
              FORM
          ============================================ */}

          <form onSubmit={handleSubmit}>

            {/* ==========================================
                INFORMASI LOWONGAN
            ========================================== */}

            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.cardEyebrow}>
                    INFORMASI
                  </div>

                  <h2 style={styles.cardTitle}>
                    Informasi Lowongan
                  </h2>

                  <p style={styles.cardSubtitle}>
                    Tentukan posisi dan kualifikasi
                    dasar yang dibutuhkan.
                  </p>
                </div>

                <div style={styles.cardNumber}>
                  01
                </div>
              </div>

              <div style={styles.formGrid}>

                {/* DIVISION */}

                <FormField
                  label="Division"
                  required={!isEditMode}
                  locked={isEditMode}
                  lockedText="Tidak dapat diubah saat edit"
                >
                  <select
                    name="division"
                    value={
                      formData.division
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      isEditMode
                    }
                    required={
                      !isEditMode
                    }
                    style={{
                      ...styles.input,
                      ...(isEditMode
                        ? styles.disabledInput
                        : {}),
                    }}
                  >
                    <option value="">
                      Pilih Division
                    </option>

                    {divisions.map(
                      (division) => (
                        <option
                          key={
                            division.id
                          }
                          value={
                            division.id
                          }
                        >
                          {
                            division.division_name
                          }
                        </option>
                      )
                    )}
                  </select>
                </FormField>

                {/* POSITION */}

                <FormField
                  label="Position"
                  required={!isEditMode}
                  locked={isEditMode}
                  lockedText="Tidak dapat diubah saat edit"
                >
                  <select
                    name="position"
                    value={
                      formData.position
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      isEditMode
                    }
                    required={
                      !isEditMode
                    }
                    style={{
                      ...styles.input,
                      ...(isEditMode
                        ? styles.disabledInput
                        : {}),
                    }}
                  >
                    <option value="">
                      Pilih Position
                    </option>

                    {positions.map(
                      (position) => (
                        <option
                          key={
                            position.id
                          }
                          value={
                            position.id
                          }
                        >
                          {
                            position.position_name
                          }
                        </option>
                      )
                    )}
                  </select>
                </FormField>

                {/* REGION */}

                <FormField
                  label="Region"
                  required={!isEditMode}
                  locked={isEditMode}
                  lockedText="Tidak dapat diubah saat edit"
                >
                  <select
                    name="region"
                    value={
                      formData.region
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      isEditMode
                    }
                    required={
                      !isEditMode
                    }
                    style={{
                      ...styles.input,
                      ...(isEditMode
                        ? styles.disabledInput
                        : {}),
                    }}
                  >
                    <option value="">
                      Pilih Region
                    </option>

                    {regions.map(
                      (region) => (
                        <option
                          key={
                            region.id
                          }
                          value={
                            region.id
                          }
                        >
                          {
                            region.region_name
                          }
                        </option>
                      )
                    )}
                  </select>
                </FormField>

                {/* EDUCATION */}

                <FormField
                  label="Jenjang Pendidikan"
                  required={!isEditMode}
                  locked={isEditMode}
                  lockedText="Jenjang pendidikan tidak dapat diubah"
                >
                  <select
                    name="education_level"
                    value={
                      formData.education_level
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      isEditMode
                    }
                    required={
                      !isEditMode
                    }
                    style={{
                      ...styles.input,
                      ...(isEditMode
                        ? styles.disabledInput
                        : {}),
                    }}
                  >
                    <option value="">
                      Pilih Jenjang Pendidikan
                    </option>

                    {educationLevels.map(
                      (level) => (
                        <option
                          key={
                            level.id
                          }
                          value={
                            level.id
                          }
                        >
                          {
                            level.level_name
                          }
                        </option>
                      )
                    )}
                  </select>
                </FormField>

              </div>
            </section>

            {/* ==========================================
                DESKRIPSI & REQUIREMENTS
            ========================================== */}

            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.cardEyebrow}>
                    DESKRIPSI & KUALIFIKASI
                  </div>

                  <h2 style={styles.cardTitle}>
                    Detail Pekerjaan
                  </h2>

                  <p style={styles.cardSubtitle}>
                    Jelaskan pekerjaan dan kualifikasi
                    yang dibutuhkan oleh kandidat.
                  </p>
                </div>

                <div style={styles.cardNumber}>
                  02
                </div>
              </div>

              {/* DESCRIPTION */}

              <FormField
                label="Description"
                required={!isEditMode}
                locked={isEditMode}
                lockedText="Tidak dapat diubah saat edit"
                fullWidth
              >
                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    isEditMode
                  }
                  required={
                    !isEditMode
                  }
                  rows={7}
                  placeholder="Jelaskan tanggung jawab dan gambaran pekerjaan..."
                  style={{
                    ...styles.textarea,
                    ...(isEditMode
                      ? styles.disabledInput
                      : {}),
                  }}
                />
              </FormField>

              {/* REQUIREMENTS */}

              <FormField
                label="Requirements"
                required={!isEditMode}
                locked={isEditMode}
                lockedText="Tidak dapat diubah saat edit"
                fullWidth
              >
                <textarea
                  name="requirements"
                  value={
                    formData.requirements
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    isEditMode
                  }
                  required={
                    !isEditMode
                  }
                  rows={8}
                  placeholder="Tuliskan persyaratan kandidat..."
                  style={{
                    ...styles.textarea,
                    ...(isEditMode
                      ? styles.disabledInput
                      : {}),
                  }}
                />
              </FormField>
            </section>

            {/* ==========================================
                PENGATURAN LOWONGAN
            ========================================== */}

            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.cardEyebrow}>
                    PENGATURAN
                  </div>

                  <h2 style={styles.cardTitle}>
                    Pengaturan Lowongan
                  </h2>

                  <p style={styles.cardSubtitle}>
                    Atur kuota, periode, dan status
                    lowongan.
                  </p>
                </div>

                <div style={styles.cardNumber}>
                  03
                </div>
              </div>

              <div style={styles.formGrid}>

                {/* QUOTA */}

                <FormField
                  label="Quota"
                  required
                  editable={isEditMode}
                  editableText="Field dapat diubah"
                >
                  <input
                    type="number"
                    name="quota"
                    value={
                      formData.quota
                    }
                    onChange={
                      handleChange
                    }
                    min="1"
                    required
                    placeholder="Masukkan jumlah quota"
                    style={
                      styles.input
                    }
                  />
                </FormField>

                {/* OPEN DATE */}

                <FormField
                  label="Open Date"
                  required
                  editable={isEditMode}
                  editableText="Field dapat diubah"
                >
                  <input
                    type="date"
                    name="open_date"
                    value={
                      formData.open_date
                    }
                    onChange={
                      handleChange
                    }
                    required
                    style={
                      styles.input
                    }
                  />
                </FormField>

                {/* DEADLINE */}

                <FormField
                  label="Close Date / Deadline"
                  required
                  editable={isEditMode}
                  editableText="Field dapat diubah"
                >
                  <input
                    type="date"
                    name="deadline"
                    value={
                      formData.deadline
                    }
                    onChange={
                      handleChange
                    }
                    required
                    style={
                      styles.input
                    }
                  />
                </FormField>

                {/* STATUS */}

                <FormField
                  label="Status"
                  required
                  editable={isEditMode}
                  editableText="Field dapat diubah"
                >
                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleChange
                    }
                    required
                    style={
                      styles.input
                    }
                  >
                    <option value="OPEN">
                      OPEN
                    </option>

                    <option value="CLOSED">
                      CLOSED
                    </option>
                  </select>
                </FormField>

              </div>
            </section>

            {/* ==========================================
                ACTIONS
            ========================================== */}

            <div style={styles.actionsWrapper}>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    isEditMode
                      ? `/hr/jobs/${id}`
                      : "/hr/dashboard"
                  )
                }
                disabled={loading}
                style={styles.cancelButton}
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  ...(loading
                    ? styles.submitDisabled
                    : {}),
                }}
              >
                {loading ? (
                  <>
                    <span
                      style={
                        styles.buttonSpinner
                      }
                    ></span>

                    Menyimpan...
                  </>
                ) : (
                  <>
                    <span>
                      {isEditMode
                        ? "✓"
                        : "+"}
                    </span>

                    {isEditMode
                      ? "Simpan Perubahan"
                      : "Buat Lowongan"}
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </MainLayout>
  );
}


/* =========================================================
   FORM FIELD COMPONENT
========================================================= */

function FormField({
  label,
  required = false,
  children,
  locked = false,
  lockedText = "",
  editable = false,
  editableText = "",
  fullWidth = false,
}) {
  return (
    <div
      style={{
        ...styles.formGroup,
        ...(fullWidth
          ? styles.fullWidth
          : {}),
      }}
    >
      <label style={styles.label}>
        <span>
          {label}
        </span>

        {required && (
          <span style={styles.required}>
            *
          </span>
        )}
      </label>

      {children}

      {locked && (
        <small style={styles.lockedText}>
{lockedText}
        </small>
      )}

      {!locked && editable && (
        <small style={styles.editableText}>
          ✓ {editableText}
        </small>
      )}
    </div>
  );
}


/* =========================================================
   STYLES
========================================================= */

const styles = {
  page: {
    minHeight:
      "calc(100vh - 60px)",
    background:
      "#f5f7fb",
    color:
      "#071a3d",
    padding:
      "34px 24px 70px",
    boxSizing:
      "border-box",
  },

  container: {
    width:
      "100%",
    maxWidth:
      "1080px",
    margin:
      "0 auto",
  },

  /* BACK */

  backButton: {
    display:
      "inline-flex",
    alignItems:
      "center",
    gap:
      "8px",
    padding:
      "7px 0",
    marginBottom:
      "25px",
    border:
      "none",
    background:
      "transparent",
    color:
      "#68768c",
    cursor:
      "pointer",
    fontSize:
      "14px",
    fontWeight:
      "700",
  },

  backArrow: {
    fontSize:
      "20px",
    lineHeight:
      1,
  },

  /* HEADER */

  header: {
    display:
      "flex",
    justifyContent:
      "space-between",
    alignItems:
      "flex-start",
    gap:
      "20px",
    marginBottom:
      "25px",
  },

  eyebrow: {
    fontSize:
      "11px",
    fontWeight:
      "800",
    letterSpacing:
      "1.5px",
    color:
      "#0b4ea2",
    marginBottom:
      "8px",
  },

  title: {
    margin:
      0,
    color:
      "#071a3d",
    fontSize:
      "32px",
    fontWeight:
      "800",
    lineHeight:
      1.2,
  },

  subtitle: {
    margin:
      "9px 0 0",
    color:
      "#68768c",
    fontSize:
      "14px",
    lineHeight:
      1.6,
  },

  modeBadge: {
    display:
      "inline-flex",
    alignItems:
      "center",
    gap:
      "7px",
    padding:
      "9px 13px",
    borderRadius:
      "999px",
    fontSize:
      "11px",
    fontWeight:
      "800",
    letterSpacing:
      "0.6px",
    flexShrink:
      0,
    marginTop:
      "5px",
  },

  createBadge: {
    background:
      "#eaf2ff",
    color:
      "#0b4ea2",
  },

  editBadge: {
    background:
      "#eef4fb",
    color:
      "#0b4ea2",
  },

  modeDot: {
    width:
      "7px",
    height:
      "7px",
    borderRadius:
      "50%",
    background:
      "currentColor",
  },

  /* CARD */

  card: {
    background:
      "#ffffff",
    border:
      "1px solid #e3e8f0",
    borderRadius:
      "16px",
    padding:
      "26px",
    marginBottom:
      "20px",
    boxSizing:
      "border-box",
    boxShadow:
      "0 5px 18px rgba(7, 26, 61, 0.05)",
  },

  cardHeader: {
    display:
      "flex",
    justifyContent:
      "space-between",
    alignItems:
      "flex-start",
    gap:
      "20px",
    marginBottom:
      "23px",
  },

  cardEyebrow: {
    color:
      "#0b4ea2",
    fontSize:
      "10px",
    fontWeight:
      "800",
    letterSpacing:
      "1.3px",
    marginBottom:
      "5px",
  },

  cardTitle: {
    margin:
      0,
    color:
      "#071a3d",
    fontSize:
      "19px",
    fontWeight:
      "800",
  },

  cardSubtitle: {
    margin:
      "5px 0 0",
    color:
      "#8792a5",
    fontSize:
      "12px",
    lineHeight:
      1.5,
  },

  cardNumber: {
    width:
      "34px",
    height:
      "34px",
    borderRadius:
      "9px",
    background:
      "#eef4fb",
    color:
      "#0b4ea2",
    display:
      "flex",
    alignItems:
      "center",
    justifyContent:
      "center",
    fontSize:
      "11px",
    fontWeight:
      "900",
    flexShrink:
      0,
  },

  /* FORM */

  formGrid: {
    display:
      "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap:
      "20px",
  },

  formGroup: {
    minWidth:
      0,
    marginBottom:
      "21px",
  },

  fullWidth: {
    gridColumn:
      "1 / -1",
  },

  label: {
    display:
      "flex",
    alignItems:
      "center",
    gap:
      "3px",
    marginBottom:
      "8px",
    color:
      "#26364f",
    fontSize:
      "13px",
    fontWeight:
      "800",
  },

  required: {
    color:
      "#d92d20",
    fontSize:
      "14px",
  },

  input: {
    width:
      "100%",
    minHeight:
      "44px",
    padding:
      "11px 13px",
    border:
      "1px solid #d7deea",
    borderRadius:
      "9px",
    background:
      "#ffffff",
    color:
      "#172944",
    fontSize:
      "13px",
    outline:
      "none",
    boxSizing:
      "border-box",
    fontFamily:
      "inherit",
  },

  textarea: {
    width:
      "100%",
    padding:
      "12px 13px",
    border:
      "1px solid #d7deea",
    borderRadius:
      "9px",
    background:
      "#ffffff",
    color:
      "#172944",
    fontSize:
      "13px",
    outline:
      "none",
    resize:
      "vertical",
    lineHeight:
      1.7,
    boxSizing:
      "border-box",
    fontFamily:
      "inherit",
  },

  disabledInput: {
    background:
      "#eef1f5",
    color:
      "#94a3b8",
    border:
      "1px solid #dfe5ec",
    cursor:
      "not-allowed",
    opacity:
      1,
  },

  lockedText: {
    display:
      "block",
    marginTop:
      "7px",
    color:
      "#94a3b8",
    fontSize:
      "11px",
  },

  editableText: {
    display:
      "block",
    marginTop:
      "7px",
    color:
      "#27834a",
    fontSize:
      "11px",
    fontWeight:
      "600",
  },

  /* ACTIONS */

  actionsWrapper: {
    display:
      "flex",
    justifyContent:
      "flex-end",
    alignItems:
      "center",
    gap:
      "10px",
    marginTop:
      "5px",
  },

  cancelButton: {
    minHeight:
      "44px",
    padding:
      "0 20px",
    border:
      "1px solid #d6deea",
    borderRadius:
      "9px",
    background:
      "#ffffff",
    color:
      "#52627a",
    cursor:
      "pointer",
    fontSize:
      "13px",
    fontWeight:
      "800",
  },

  submitButton: {
    minHeight:
      "44px",
    display:
      "inline-flex",
    alignItems:
      "center",
    justifyContent:
      "center",
    gap:
      "8px",
    padding:
      "0 22px",
    border:
      "none",
    borderRadius:
      "9px",
    background:
      "#0b4ea2",
    color:
      "#ffffff",
    cursor:
      "pointer",
    fontSize:
      "13px",
    fontWeight:
      "800",
    boxShadow:
      "0 5px 14px rgba(11, 78, 162, 0.2)",
  },

  submitDisabled: {
    opacity:
      0.65,
    cursor:
      "not-allowed",
  },

  buttonSpinner: {
    width:
      "13px",
    height:
      "13px",
    border:
      "2px solid rgba(255,255,255,0.4)",
    borderTopColor:
      "#ffffff",
    borderRadius:
      "50%",
    animation:
      "bsu-spin 0.8s linear infinite",
  },

  /* LOADING */

  loadingPage: {
    minHeight:
      "calc(100vh - 60px)",
    background:
      "#f5f7fb",
    display:
      "flex",
    justifyContent:
      "center",
    alignItems:
      "center",
  },

  loadingBox: {
    textAlign:
      "center",
    color:
      "#68768c",
  },

  spinner: {
    width:
      "32px",
    height:
      "32px",
    border:
      "3px solid #dce5f1",
    borderTopColor:
      "#0b4ea2",
    borderRadius:
      "50%",
    margin:
      "0 auto 14px",
    animation:
      "bsu-spin 0.8s linear infinite",
  },

  loadingText: {
    margin:
      0,
    fontSize:
      "13px",
    fontWeight:
      "600",
  },
};

export default HRJobForm;