export interface InvoiceItemCreate {
  item_id: string;
  quantity: number;
  discount?: number;
}

export interface InvoiceCreate {
  party_id: string;
  invoice_date: string; // ISO date string
  items: InvoiceItemCreate[];
}

export interface InvoiceResponse {
  id: string;
  invoice_number: string;
  total_amount: number;
  tax_amount?: number;
  net_amount?: number;
  status: string;
}
