import api from "../api/axios";


export const getJobs = async () => {
  const token = localStorage.getItem("access_token");

  const config = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await api.get(
    "/jobs/",
    config
  );

  return response.data;
};


export const getJobDetail = async (id) => {
  const token = localStorage.getItem("access_token");

  const config = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await api.get(
    `/jobs/${id}/`,
    config
  );

  return response.data;
};


export const createJob = async (data) => {
  const token = localStorage.getItem("access_token");

  const response = await api.post(
    "/jobs/",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const updateJob = async (id, data) => {
  const token = localStorage.getItem("access_token");

  const response = await api.patch(
    `/jobs/${id}/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const deleteJob = async (id) => {
  const token = localStorage.getItem("access_token");

  const response = await api.delete(
    `/jobs/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const getRegions = async () => {
  const token = localStorage.getItem("access_token");

  const response = await api.get(
    "/jobs/regions/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const getDivisions = async () => {
  const token = localStorage.getItem("access_token");

  const response = await api.get(
    "/jobs/divisions/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const getPositions = async () => {
  const token = localStorage.getItem("access_token");

  const response = await api.get(
    "/jobs/positions/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const getEducationLevels = async () => {
  const token = localStorage.getItem("access_token");

  const response = await api.get(
    "/jobs/education-levels/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};