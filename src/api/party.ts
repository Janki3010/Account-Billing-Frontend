import api from "./axios";

// Create
export const createParty = async (party: any) => {
  const response = await api.post("party/create", party);
  return response.data;
};

// Get all
export const getParties = async () => {
  const response = await api.get("party/get-all");
  return response.data;
};

// Get by ID
export const getParty = async (party_id: string) => {
  const response = await api.get("party/get", {
    params: { party_id },
  });
  return response.data;
};

// Get by type
export const getPartiesByType = async (type: string) => {
  const response = await api.get("party/get-by-type", {
    params: { type },
  });
  return response.data;
};

// Update
export const updateParty = async (party_id: string, update_request: any) => {
  const response = await api.patch("party/update", update_request, {
    params: { party_id },
  });
  return response.data;
};

// Delete
export const deleteParty = async (party_id: string) => {
  const response = await api.delete("party/delete", {
    params: { id: party_id },
  });
  return response.data;
};

