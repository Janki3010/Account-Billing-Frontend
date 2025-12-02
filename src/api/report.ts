import api from "./axios";

export interface DashboardResponse {
  daily_sales: number;
  monthly_sales: number;
  yearly_sales: number;
  yearly_summary: any[];
  low_stock: any[];
}

export const getDashboardData = async (): Promise<DashboardResponse> => {
  const response = await api.get("/report/dashboard");
  return response.data;
};
