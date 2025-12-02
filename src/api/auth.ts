import api from "./axios";

// ---------------------------
// LOGIN
// ---------------------------
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("auth/login", { email, password });
    return response.data; // usually contains token
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// ---------------------------
// REGISTER
// ---------------------------
export const register = async (name: string, email: string, password: string, confirm_password: string) => {
  try {
    const response = await api.post("auth/register", { name, email, password, confirm_password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// ---------------------------
// FORGOT PASSWORD
// ---------------------------
export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post("auth/forgot-password", { email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// ---------------------------
// RESET PASSWORD
// ---------------------------
export const resetPassword = async (token: string, new_password: string, confirm_password: string) => {
  try {
    const response = await api.post(`auth/reset-password/${token}`, {
      new_password,
      confirm_password
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
