import api from "./axios";
import type { PaymentRequest, PaymentResponse } from "../types/payment";

// Create
export const createPayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
  const response = await api.post("payment/create", data);
  return response.data;
};

// Get all
export const getPayments = async () => {
  const response = await api.get("payment/get-all");
  return response.data;
};

// Delete
export const deletePayment = async (id: string) => {
  const response = await api.delete("payment/delete", {
    params: { id },
  });
  return response.data;
};
