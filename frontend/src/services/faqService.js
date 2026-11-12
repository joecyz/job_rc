import api from "../api/axios";

export const getFAQs = async (search = "") => {
  const response = await api.get("/faq/", {
    params: search ? { search } : {},
  });

  return response.data;
};