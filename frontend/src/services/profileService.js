import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("access_token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ==========================
// PROFILE
// ==========================

export const getProfile = async () => {
  const response = await api.get(
    "/auth/profile/",
    getAuthConfig()
  );

  return response.data;
};

export const createProfile = async (data) => {
  const response = await api.post(
    "/auth/profile/",
    data,
    {
      headers: {
        ...getAuthConfig().headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put(
    "/auth/profile/",
    data,
    {
      headers: {
        ...getAuthConfig().headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ==========================
// EDUCATION
// ==========================

export const getEducation = async () => {
  const response = await api.get(
    "/auth/education/",
    getAuthConfig()
  );

  return response.data;
};

export const createEducation = async (data) => {
  const response = await api.post(
    "/auth/education/",
    data,
    getAuthConfig()
  );

  return response.data;
};

export const updateEducation = async (data) => {
  const response = await api.put(
    "/auth/education/",
    data,
    getAuthConfig()
  );

  return response.data;
};

// ==========================
// DOCUMENT
// ==========================

export const getDocument = async () => {
  const response = await api.get(
    "/auth/document/",
    getAuthConfig()
  );

  return response.data;
};

export const createDocument = async (formData) => {
  const response = await api.post(
    "/auth/document/",
    formData,
    {
      ...getAuthConfig(),
      headers: {
        ...getAuthConfig().headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const updateDocument = async (formData) => {
  const response = await api.put(
    "/auth/document/",
    formData,
    {
      ...getAuthConfig(),
      headers: {
        ...getAuthConfig().headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ==========================
// PROFILE COMPLETION CHECK
// ==========================

export const checkProfileCompletion = async () => {
  const result = {
    profile: false,
    education: false,
    document: false,
    isComplete: false,
  };

  // ==========================
  // PROFILE
  // ==========================

  try {
    const profile = await getProfile();

    result.profile =
      Boolean(profile) &&
      Boolean(profile.full_name?.trim()) &&
      Boolean(profile.birth_place?.trim()) &&
      Boolean(profile.birth_date) &&
      Boolean(profile.gender) &&
      Boolean(profile.phone?.trim()) &&
      Boolean(profile.nik?.trim());
  } catch (error) {
    result.profile = false;
  }

  // ==========================
  // EDUCATION
  // ==========================

  try {
    const education = await getEducation();

    result.education =
      Boolean(education) &&
      Boolean(education.education_level) &&
      Boolean(education.school_name?.trim()) &&
      Boolean(education.major?.trim()) &&
      Boolean(education.entry_year) &&
      Boolean(education.graduation_year);
  } catch (error) {
    result.education = false;
  }

  // ==========================
  // DOCUMENT
  // ==========================

  try {
    const document = await getDocument();

    result.document =
      Boolean(document) &&
      Boolean(document.cv_file) &&
      Boolean(document.ktp_file) &&
      Boolean(document.kk_file);
  } catch (error) {
    result.document = false;
  }

  result.isComplete =
    result.profile &&
    result.education &&
    result.document;

  return result;
};