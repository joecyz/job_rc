import api from "../api/axios";

export const getLatestJobs = async () => {
  const response = await api.get("/jobs/");

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.data.results)) {
    return response.data.results;
  }

  return [];
};