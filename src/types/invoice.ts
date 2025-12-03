// Item used when creating invoice
export interface InvoiceItemCreate {
  item_id: string;
  quantity: number;
  discount?: number;
}

// Item returned from backend (usually includes name, price, etc.)
export interface InvoiceItemResponse {
  id: string;
  item_id: string;
  quantity: number;
  discount: number;
  price: number;
  total: number;
}

export interface InvoiceCreate {
  party_id: string;
  shop_id: string;
  invoice_date: string;
  items: InvoiceItemCreate[];   // ✅ FIXED
}

export interface InvoiceResponse {
  id: string;
  invoice_number: number;
  party_id: string;
  shop_id: string;
  total_amount: number;
  net_amount: number;
  status: string;
  items: InvoiceItemResponse[];  // ✔ Should be response type
}
