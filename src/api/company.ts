import api from "./axios";

export const createCompany = async (name: string) => {
  const response = await api.post("company/create", null, {
    params: { name },
  });
  return response.data;
};

export const getCompanies = async () => {
  const response = await api.get("company/get-all");
  return response.data;
};

export const updateCompany = async (com_id: string, name: string) => {
  const response = await api.patch("company/update", null, {
    params: { com_id, name },
  });
  return response.data;
};

export const deleteCompany = async (company_id: string) => {
  const response = await api.delete("company/delete", {
    params: { id: company_id },
  });
  return response.data;
};
