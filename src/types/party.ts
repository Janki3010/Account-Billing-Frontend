export type PartyType = "customer" | "supplier" | "both";

export interface Party {
  id?: string;
  name: string;
  type: PartyType;
  email?: string;
  phone?: string;
  address: string;
  gst_number: string;
}
