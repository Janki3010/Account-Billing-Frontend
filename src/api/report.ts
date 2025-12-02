import api from "./axios";

export const getDashboardData = async () => {
  const response = await api.get("/report/dashboard");
  return response.data;
};
