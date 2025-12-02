export interface InvoiceItemCreate {
  item_id: string;
  quantity: number;
  discount?: number;
}

export interface InvoiceCreate {
  party_id: string;
  shop_id: string;
  invoice_date: string;
  items: InvoiceItem[];
}

export interface InvoiceResponse {
  id: string;
  invoice_number: number;
  party_id: string;
  shop_id: string;
  total_amount: number;
  net_amount: number;
  status: string;
  items: InvoiceItem[];
}
