export interface PaymentRequest {
  party_id: string;
  invoice_id: string;
  payment_mode: string
  amount: number;
  transaction_date: string;
}

export interface PaymentResponse extends PaymentRequest {
  id: string;
}
