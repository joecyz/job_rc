import api from "../api/axios";

export const applyJob = async (jobId) => {
  const token = localStorage.getItem("access_token");

  const response = await api.post(
    "/applications/create/",
    {
      job: jobId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getMyApplications = async () => {
  const token = localStorage.getItem("access_token");

  const response = await api.get("/applications/my/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getHRApplications = async () => {
  const token = localStorage.getItem("access_token");

  const response = await api.get(
    "/applications/hr/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getHRDashboardStats = async () => {
  const token = localStorage.getItem("access_token");

  const response = await api.get(
    "/applications/hr/stats/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const token = localStorage.getItem("access_token");

  const response = await api.patch(
    `/applications/hr/${id}/`,
    {
      status: status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};