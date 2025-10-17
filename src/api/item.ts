import api from "./axios";

import type { ItemRequest, UpdateRequest, ItemResponse } from "../types/item";

export const createItem = async (data: ItemRequest): Promise<ItemResponse> => {
  const response = await api.post("item/create", data);
  return response.data;
};

export const getItem = async (item_id: string): Promise<ItemResponse> => {
  const response = await api.get("item/get", {
    params: { item_id },
  });
  return response.data;
};

export const getAllItems = async (): Promise<ItemResponse[]> => {
  const response = await api.get("item/get-all");
  return response.data;
};

export const getItemsByCompany = async (
  company_name: string
): Promise<ItemResponse[]> => {
  const response = await api.get("item/get-by-company", {
    params: { company_name },
  });
  return response.data;
};

export const updateItem = async (data: ItemRequest & { id: string }) => {
  const response = await api.put("/item/update", data);
  return response.data;
};

export const deleteItem = async (item_id: string) => {
  const response = await api.delete("item/delete", {
    params: { id: item_id },
  });
  return response.data;
};