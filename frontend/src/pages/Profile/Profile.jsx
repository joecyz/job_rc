import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "./Profile.css";

import {
  getProfile,
  createProfile,
  updateProfile,
  getEducation,
  createEducation,
  updateEducation,
  getDocument,
  createDocument,
  updateDocument,
} from "../../services/profileService";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState(null);
  const [document, setDocument] = useState(null);

  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    birth_place: "",
    birth_date: "",
    gender: "",
    phone: "",
    nik: "",
    profile_photo: null,
  });

  const [educationForm, setEducationForm] = useState({
    education_level: "",
    school_name: "",
    major: "",
    entry_year: "",
    graduation_year: "",
  });

  const [documentForm, setDocumentForm] = useState({
    cv_file: null,
    ktp_file: null,
    kk_file: null,
  });

  // ==========================
  // FETCH DATA
  // ==========================

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const profileData = await getProfile();

      console.log("PROFILE:", profileData);

      setProfile(profileData);

      setProfileForm({
        full_name: profileData.full_name || "",
        birth_place: profileData.birth_place || "",
        birth_date: profileData.birth_date || "",
        gender: profileData.gender || "",
        phone: profileData.phone || "",
        nik: profileData.nik || "",
        profile_photo: null,
      });
    } catch (error) {
      console.log(
        "PROFILE ERROR:",
        error.response?.data || error
      );
    }

    try {
      const educationData = await getEducation();

      console.log("EDUCATION:", educationData);

      setEducation(educationData);

      setEducationForm({
        education_level:
          educationData.education_level || "",
        school_name:
          educationData.school_name || "",
        major: educationData.major || "",
        entry_year:
          educationData.entry_year || "",
        graduation_year:
          educationData.graduation_year || "",
      });
    } catch (error) {
      console.log(
        "EDUCATION ERROR:",
        error.response?.data || error
      );
    }

    try {
      const documentData = await getDocument();

      console.log("DOCUMENT:", documentData);

      setDocument(documentData);
    } catch (error) {
      console.log(
        "DOCUMENT ERROR:",
        error.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // LOGOUT
  // ==========================

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin logout?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("redirect_after_login");

    navigate("/login");
  };

  // ==========================
  // PROFILE
  // ==========================

  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("full_name", profileForm.full_name);
      data.append("birth_place", profileForm.birth_place);
      data.append("birth_date", profileForm.birth_date);
      data.append("gender", profileForm.gender);
      data.append("phone", profileForm.phone);
      data.append("nik", profileForm.nik);

      if (profileForm.profile_photo) {
        data.append(
          "profile_photo",
          profileForm.profile_photo
        );
      }

      let result;

      if (profile) {
        result = await updateProfile(data);
      } else {
        result = await createProfile(data);
      }

      setProfile(result);

      alert("Profile berhasil disimpan.");

      fetchProfileData();
    } catch (error) {
      console.error(
        "PROFILE SAVE ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.detail ||
          "Gagal menyimpan profile."
      );
    }
  };

  // ==========================
  // EDUCATION
  // ==========================

  const handleEducationChange = (e) => {
    const { name, value } = e.target;

    setEducationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;

      if (education) {
        result = await updateEducation(
          educationForm
        );
      } else {
        result = await createEducation(
          educationForm
        );
      }

      setEducation(result);

      alert("Education berhasil disimpan.");

      fetchProfileData();
    } catch (error) {
      console.error(
        "EDUCATION SAVE ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.detail ||
          "Gagal menyimpan education."
      );
    }
  };

  // ==========================
  // DOCUMENT
  // ==========================

  const handleDocumentChange = (e) => {
    const { name, files } = e.target;

    setDocumentForm((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      if (documentForm.cv_file) {
        formData.append(
          "cv_file",
          documentForm.cv_file
        );
      }

      if (documentForm.ktp_file) {
        formData.append(
          "ktp_file",
          documentForm.ktp_file
        );
      }

      if (documentForm.kk_file) {
        formData.append(
          "kk_file",
          documentForm.kk_file
        );
      }

      let result;

      if (document) {
        result = await updateDocument(formData);
      } else {
        result = await createDocument(formData);
      }

      setDocument(result);

      alert("Documents berhasil disimpan.");

      fetchProfileData();
    } catch (error) {
      console.error(
        "DOCUMENT SAVE ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.detail ||
          "Gagal menyimpan documents."
      );
    }
  };

  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <MainLayout>
        <div className="profile-loading">
          <div className="profile-loading-spinner" />

          <h3>Loading Profile</h3>

          <p>
            Sedang mengambil data profile kamu...
          </p>
        </div>
      </MainLayout>
    );
  }

  // ==========================
  // DOCUMENT STATUS
  // ==========================

  const hasCV = Boolean(document?.cv_file);
  const hasKTP = Boolean(document?.ktp_file);
  const hasKK = Boolean(document?.kk_file);

  const uploadedDocuments = [
    hasCV,
    hasKTP,
    hasKK,
  ].filter(Boolean).length;

  const profileCompleted =
    Boolean(profile?.full_name) &&
    Boolean(profile?.phone) &&
    Boolean(profile?.nik);

  const educationCompleted =
    Boolean(education?.education_level) &&
    Boolean(education?.school_name);

  return (
    <MainLayout>
      <div className="profile-page">

        {/* ==========================
            HERO / PROFILE SUMMARY
        ========================== */}

        <section className="profile-hero">

          <div className="profile-hero-content">

            <div className="profile-hero-copy">

              <div className="profile-eyebrow">
                BSU CAREER
              </div>

              <h1>
                My Profile
              </h1>

              <p>
                Lengkapi data diri, pendidikan,
                dan dokumen untuk mendukung
                proses rekrutmen kamu di
                Bintang Sayap Utama.
              </p>

              <div className="profile-hero-actions">
                <span className="profile-status-pill">
                  <span className="status-dot" />
                  Applicant Account
                </span>
              </div>

            </div>

            <div className="profile-hero-user">

              <div className="hero-photo">

                {profile?.profile_photo ? (
                  <img
                    src={profile.profile_photo}
                    alt="Profile"
                  />
                ) : (
                  <span>👤</span>
                )}

              </div>

              <div>
                <strong>
                  {profile?.full_name ||
                    "Applicant"}
                </strong>

                <span>
                  {education?.school_name ||
                    "Lengkapi profile kamu"}
                </span>
              </div>

            </div>

          </div>

          <div className="profile-progress">

            <div className="progress-info">

              <div>
                <strong>
                  Profile Completion
                </strong>

                <span>
                  {profileCompleted &&
                  educationCompleted &&
                  uploadedDocuments === 3
                    ? "Profile lengkap"
                    : "Lengkapi data untuk proses apply"}
                </span>
              </div>

              <strong className="progress-number">
                {Math.round(
                  (
                    [
                      profileCompleted,
                      educationCompleted,
                      uploadedDocuments === 3,
                    ].filter(Boolean).length / 3
                  ) * 100
                )}
                %
              </strong>

            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    Math.round(
                      (
                        [
                          profileCompleted,
                          educationCompleted,
                          uploadedDocuments === 3,
                        ].filter(Boolean).length / 3
                      ) * 100
                    )
                  }%`,
                }}
              />
            </div>

          </div>

        </section>

        {/* ==========================
            PERSONAL + EDUCATION
        ========================== */}

        <div className="profile-grid">

          {/* ==========================
              PERSONAL INFORMATION
          ========================== */}

          <section className="profile-card">

            <div className="card-heading">

              <div className="card-icon blue-icon">
                👤
              </div>

              <div>
                <h2>
                  Personal Information
                </h2>

                <p>
                  Informasi dasar tentang diri kamu
                </p>
              </div>

            </div>

            <form onSubmit={handleProfileSubmit}>

              <div className="profile-field">
                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={profileForm.full_name}
                  onChange={handleProfileChange}
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div className="profile-field">
                <label>
                  Birth Place
                </label>

                <input
                  type="text"
                  name="birth_place"
                  value={profileForm.birth_place}
                  onChange={handleProfileChange}
                  placeholder="Masukkan tempat lahir"
                />
              </div>

              <div className="profile-row">

                <div className="profile-field">
                  <label>
                    Birth Date
                  </label>

                  <input
                    type="date"
                    name="birth_date"
                    value={profileForm.birth_date}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="profile-field">
                  <label>
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={profileForm.gender}
                    onChange={handleProfileChange}
                  >
                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>
                  </select>
                </div>

              </div>

              <div className="profile-field">
                <label>
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  placeholder="Contoh: +628123456789"
                />
              </div>

              <div className="profile-field">
                <label>
                  NIK
                </label>

                <input
                  type="text"
                  name="nik"
                  value={profileForm.nik}
                  onChange={handleProfileChange}
                  placeholder="Masukkan NIK"
                />
              </div>

              {/* PHOTO */}

              <div className="photo-upload-area">

                <div className="photo-upload-content">

                  <div>
                    <label>
                      Profile Photo
                    </label>

                    <p>
                      Gunakan foto yang jelas
                      dan profesional.
                    </p>
                  </div>

                  <label className="file-select-button">
                    Pilih Foto
                    <input
                      type="file"
                      name="profile_photo"
                      accept="image/*"
                      onChange={handleProfileChange}
                    />
                  </label>

                </div>

                <div className="photo-preview-wrapper">

                  {profile?.profile_photo ? (
                    <img
                      src={profile.profile_photo}
                      alt="Profile"
                      className="profile-photo-preview"
                    />
                  ) : (
                    <div className="profile-photo-placeholder">
                      👤
                    </div>
                  )}

                </div>

              </div>

              {profileForm.profile_photo && (
                <div className="selected-file">
                  File baru:{" "}
                  <strong>
                    {profileForm.profile_photo.name}
                  </strong>
                </div>
              )}

              <button
                type="submit"
                className="profile-button profile-button-primary"
              >
                {profile
                  ? "Update Profile"
                  : "Create Profile"}

                <span>→</span>
              </button>

            </form>

          </section>

          {/* ==========================
              EDUCATION
          ========================== */}

          <section className="profile-card">

            <div className="card-heading">

              <div className="card-icon blue-icon">
                🎓
              </div>

              <div>
                <h2>
                  Education
                </h2>

                <p>
                  Riwayat pendidikan terakhir
                </p>
              </div>

            </div>

            <form onSubmit={handleEducationSubmit}>

              <div className="profile-field">
                <label>
                  Education Level
                </label>

                <select
                  name="education_level"
                  value={
                    educationForm.education_level
                  }
                  onChange={handleEducationChange}
                >
                  <option value="">
                    Select Education
                  </option>

                  <option value="SD">
                    SD
                  </option>

                  <option value="SMP">
                    SMP
                  </option>

                  <option value="SMA/SMK">
                    SMA/SMK
                  </option>

                  <option value="D1">
                    D1
                  </option>

                  <option value="D2">
                    D2
                  </option>

                  <option value="D3">
                    D3
                  </option>

                  <option value="D4">
                    D4
                  </option>

                  <option value="S1">
                    S1
                  </option>

                  <option value="S2">
                    S2
                  </option>

                  <option value="S3">
                    S3
                  </option>

                </select>
              </div>

              <div className="profile-field">
                <label>
                  School / University
                </label>

                <input
                  type="text"
                  name="school_name"
                  value={
                    educationForm.school_name
                  }
                  onChange={handleEducationChange}
                  placeholder="Nama sekolah / universitas"
                />
              </div>

              <div className="profile-field">
                <label>
                  Major
                </label>

                <input
                  type="text"
                  name="major"
                  value={educationForm.major}
                  onChange={handleEducationChange}
                  placeholder="Jurusan"
                />
              </div>

              <div className="profile-row">

                <div className="profile-field">
                  <label>
                    Entry Year
                  </label>

                  <input
                    type="text"
                    name="entry_year"
                    value={
                      educationForm.entry_year
                    }
                    onChange={handleEducationChange}
                    placeholder="Contoh: 2020"
                  />
                </div>

                <div className="profile-field">
                  <label>
                    Graduation Year
                  </label>

                  <input
                    type="text"
                    name="graduation_year"
                    value={
                      educationForm.graduation_year
                    }
                    onChange={handleEducationChange}
                    placeholder="Contoh: 2024"
                  />
                </div>

              </div>

              <div className="education-tip">
                <span>i</span>

                <p>
                  Pastikan data pendidikan
                  sesuai dengan dokumen yang
                  kamu upload.
                </p>
              </div>

              <button
                type="submit"
                className="profile-button profile-button-primary"
              >
                {education
                  ? "Update Education"
                  : "Create Education"}

                <span>→</span>
              </button>

            </form>

          </section>

        </div>

        {/* ==========================
            DOCUMENTS
        ========================== */}

        <section className="profile-card documents-card">

          <div className="documents-header-row">

            <div className="card-heading">

              <div className="card-icon blue-icon">
                📄
              </div>

              <div>
                <h2>
                  Recruitment Documents
                </h2>

                <p>
                  Upload dokumen yang diperlukan
                  untuk proses rekrutmen.
                </p>
              </div>

            </div>

            <div className="documents-count">

              <strong>
                {uploadedDocuments}/3
              </strong>

              <span>
                Uploaded
              </span>

            </div>

          </div>

          {/* DOCUMENT STATUS */}

          <div className="document-status-grid">

            <DocumentStatus
              title="CV"
              uploaded={hasCV}
              file={document?.cv_file}
              icon="CV"
            />

            <DocumentStatus
              title="KTP"
              uploaded={hasKTP}
              file={document?.ktp_file}
              icon="ID"
            />

            <DocumentStatus
              title="Kartu Keluarga"
              uploaded={hasKK}
              file={document?.kk_file}
              icon="KK"
            />

          </div>

          {/* UPLOAD FORM */}

          <form
            onSubmit={handleDocumentSubmit}
            className="documents-form"
          >

            <div className="document-upload-grid">

              <DocumentUploadField
                name="cv_file"
                title="CV"
                description="PDF / DOC / DOCX"
                value={documentForm.cv_file}
                onChange={handleDocumentChange}
              />

              <DocumentUploadField
                name="ktp_file"
                title="KTP"
                description="Image / PDF"
                value={documentForm.ktp_file}
                onChange={handleDocumentChange}
              />

              <DocumentUploadField
                name="kk_file"
                title="Kartu Keluarga"
                description="Image / PDF"
                value={documentForm.kk_file}
                onChange={handleDocumentChange}
              />

            </div>

            <div className="documents-submit-row">

              <p>
                Pastikan dokumen yang diupload
                dapat dibaca dengan jelas.
              </p>

              <button
                type="submit"
                className="profile-button profile-button-primary"
              >
                {document
                  ? "Update Documents"
                  : "Upload Documents"}

                <span>→</span>
              </button>

            </div>

          </form>

        </section>

        {/* ==========================
            BOTTOM ACTION
        ========================== */}

        <section className="profile-footer-card">

          <div>
            <strong>
              Selesai menggunakan akun?
            </strong>

            <span>
              Pastikan semua perubahan sudah
              tersimpan sebelum logout.
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="profile-logout"
          >
            Logout
          </button>

        </section>

      </div>
    </MainLayout>
  );
}

// ========================================
// DOCUMENT STATUS COMPONENT
// ========================================

function DocumentStatus({
  title,
  uploaded,
  file,
  icon,
}) {
  return (
    <div
      className={`document-status ${
        uploaded
          ? "uploaded"
          : "not-uploaded"
      }`}
    >

      <div className="document-status-icon">
        {icon}
      </div>

      <div className="document-status-info">

        <strong>
          {title}
        </strong>

        <span>
          {uploaded
            ? "Document uploaded"
            : "Belum diupload"}
        </span>

      </div>

      {uploaded && file ? (
        <a
          href={file}
          target="_blank"
          rel="noreferrer"
          className="document-view"
        >
          Lihat →
        </a>
      ) : (
        <span className="document-status-badge">
          Belum
        </span>
      )}

    </div>
  );
}

// ========================================
// DOCUMENT UPLOAD COMPONENT
// ========================================

function DocumentUploadField({
  name,
  title,
  description,
  value,
  onChange,
}) {
  return (
    <div className="document-upload-field">

      <div className="document-upload-top">

        <div className="document-upload-icon">
          ↑
        </div>

        <div>
          <strong>
            {title}
          </strong>

          <small>
            {description}
          </small>
        </div>

      </div>

      <label className="document-file-button">

        <span>
          {value
            ? "Ganti File"
            : "Pilih File"}
        </span>

        <input
          type="file"
          name={name}
          onChange={onChange}
        />

      </label>

      {value && (
        <div className="document-selected-file">
          {value.name}
        </div>
      )}

    </div>
  );
}

export default Profile;