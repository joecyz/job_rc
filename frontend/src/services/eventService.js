import api from "../api/axios";

// ======================================================
// PUBLIC EVENTS
// ======================================================

export const getLandingEvent = async () => {
  const response = await api.get("/events/");
  return response.data;
};

export const getEvents = async () => {
  const response = await api.get("/events/all/");
  return response.data;
};

export const getEventDetail = async (id) => {
  const response = await api.get(`/events/${id}/`);
  return response.data;
};


// ======================================================
// TEAM EVENT - AUTH CONFIG
// ======================================================

const getAuthConfig = () => {
  const token = localStorage.getItem("access_token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


// ======================================================
// TEAM EVENT - CATEGORY
// ======================================================

export const getEventCategories = async () => {
  const response = await api.get(
    "/events/categories/",
    getAuthConfig()
  );

  return response.data;
};


// ======================================================
// TEAM EVENT - LIST
// ======================================================

export const getManageEvents = async () => {
  const response = await api.get(
    "/events/manage/list/",
    getAuthConfig()
  );

  return response.data;
};


// ======================================================
// TEAM EVENT - DETAIL
// ======================================================

export const getManageEventDetail = async (id) => {
  const response = await api.get(
    `/events/${id}/`,
    getAuthConfig()
  );

  return response.data;
};


// ======================================================
// TEAM EVENT - CREATE
// ======================================================

export const createEvent = async (data) => {
  const response = await api.post(
    "/events/manage/",
    data,
    getAuthConfig()
  );

  return response.data;
};


// ======================================================
// TEAM EVENT - UPDATE
// ======================================================

export const updateEvent = async (id, data) => {
  const response = await api.patch(
    `/events/manage/${id}/`,
    data,
    getAuthConfig()
  );

  return response.data;
};


// ======================================================
// TEAM EVENT - DELETE
// ======================================================

export const deleteEvent = async (id) => {
  const response = await api.delete(
    `/events/manage/${id}/delete/`,
    getAuthConfig()
  );

  return response.data;
};


// ======================================================
// TEAM EVENT - UPLOAD POSTER
// ======================================================

export const uploadEventPoster = async (id, file) => {
  const formData = new FormData();

  formData.append("poster", file);

  const response = await api.patch(
    `/events/manage/${id}/poster/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          "access_token"
        )}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


// ======================================================
// TEAM EVENT - DELETE POSTER
// ======================================================

export const deleteEventPoster = async (id) => {
  const response = await api.delete(
    `/events/manage/${id}/poster/`,
    getAuthConfig()
  );

  return response.data;
};