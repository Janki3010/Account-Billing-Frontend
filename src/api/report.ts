import api from "./axios";

export const getDashboardReport = async () => {
  const response = await api.get("/report/dashboard");
  return response.data;
};
