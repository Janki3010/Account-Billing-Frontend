export interface ShopProfileReq {
  shop_name: string;
  gstin: string;
  address: string;
  phone: string;
  email: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  qr_code_url: string;
  authorized_signatory: string;
}

export interface ShopProfile extends ShopProfileReq {
  id: string;
}
