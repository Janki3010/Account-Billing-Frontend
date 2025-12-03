// frontend/types/item.ts
export interface ItemRequest {
  name: string;
  description: string;
  hsn_code: string;
  IMEI_number?: string;
  unit: string;
  purchase_price: string;
  sale_price: string;
  stock_quantity: string;
  gst_rate: string;
  company_id: string;
}


export interface UpdateRequest {
  update_field: string;
}

export interface ItemResponse {
  id: string;
  name: string;
  description: string;
  hsn_code: string;
  unit: string;
  purchase_price: number;
  sale_price: number;
  stock_quantity: number;
  gst_rate: number;
  company_id: string;
  item_id?: string;
  company_name?: string;
}
