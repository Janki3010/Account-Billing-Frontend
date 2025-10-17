import api from "./axios";

import type { ShopProfile, ShopProfileReq } from "../types/shop_profile";

export const createShopProfile = async (data: ShopProfileReq): Promise<ShopProfile> => {
  const res = await api.post("shop-profile/create", data);
  return res.data;
};

export const getAllShopProfiles = async (): Promise<ShopProfile[]> => {
  const res = await api.get("shop-profile/get-all");
  return res.data;
};

export const getShopProfileById = async (shop_id: string): Promise<ShopProfile> => {
  const res = await api.get("shop-profile/get-by-id", {
    params: { shop_id },
  });
  return res.data;
};

export const updateShopProfile = async (data: ShopProfile): Promise<ShopProfile> => {
  const res = await api.patch("shop-profile/update", data);
  return res.data;
};
