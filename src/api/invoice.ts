import api from "./axios";

import type { InvoiceCreate, InvoiceResponse } from "../types/invoice";

export const createInvoice = async (invoice: InvoiceCreate) => {
  const res = await api.post("invoice/create", invoice);
  return res.data;
};

export const getInvoices = async (): Promise<InvoiceResponse[]> => {
  const res = await api.get("invoice/get-all");
  return res.data;
};

export const getInvoiceById = async (id: string): Promise<InvoiceResponse> => {
  const res = await api.get("invoice/get", { params: { invoice_id: id } });
  return res.data;
};


export const getUnpaidInvoices = async () => {
  const res = await api.get("invoice/get-all-unpaid");
  return res.data;
};

export const deleteInvoice = async (id: string) => {
  const res = await api.delete("invoice/delete", { params: { id } });
  return res.data;
};

export const downloadInvoicePdf = async (invoiceId: string, invoiceNumber: string) => {
  try {
    const response = await api.get("/invoice/get-invoice-pdf", {
      params: { invoice_id: invoiceId },
      responseType: "blob", // important to receive as binary
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Invoice_${invoiceNumber}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error downloading PDF:", error);
    alert("Failed to download PDF");
  }
};