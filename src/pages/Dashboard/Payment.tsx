import { useEffect, useState } from "react";
import { createPayment, getPayments, deletePayment } from "../../api/payment";
import { getParties } from "../../api/party";
import { getUnpaidInvoices, getInvoices } from "../../api/invoice";
import type { Party } from "../../types/party";
import type { PaymentRequest, PaymentResponse } from "../../types/payment";
import type { InvoiceResponse } from "../../types/invoice";
import { FaTrash, FaPlus, FaTimes, FaMoneyBillWave } from "react-icons/fa";

const defaultPayment: PaymentRequest = {
  invoice_id: "",
  party_id: "",
  payment_mode: "cash",
  amount: 0,
  transaction_date: new Date().toISOString(),
};

const PaymentDashboard = () => {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [formData, setFormData] = useState<PaymentRequest>({ ...defaultPayment });
  const [parties, setParties] = useState<Party[]>([]);
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [allInvoices, setAllInvoices] = useState<InvoiceResponse[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPayments();
    fetchParties();
    fetchInvoices();
    fetchAllInvoices();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const data = await getUnpaidInvoices();
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const fetchAllInvoices = async () => {
    try {
      const data = await getInvoices();
      setAllInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const fetchParties = async () => {
    try {
      const data = await getParties();
      setParties(data);
    } catch (error) {
      console.error("Error fetching parties:", error);
    }
  };

  const handleAddPayment = async () => {
    if (!formData.invoice_id || formData.amount <= 0) {
      alert("Please select invoice and enter valid amount");
      return;
    }
    try {
      await createPayment(formData);
      alert("Payment created successfully!");
      setFormData({ ...defaultPayment });
      setShowModal(false);
      fetchPayments();
      fetchInvoices();
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      await deletePayment(id);
      alert("Payment deleted successfully!");
      fetchPayments();
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-3 drop-shadow-md">
           <FaMoneyBillWave className="text-yellow-500" /> Payment Management
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          <FaPlus /> Add Payment
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-indigo-100">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-100 to-blue-100 text-gray-700">
              <th className="p-3 text-left">Invoice #</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Payment Mode</th>
              <th className="p-3 text-left text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => {
                const invoice = allInvoices.find((inv) => inv.id === p.invoice_id);
                return (
                  <tr key={p.id} className="hover:bg-indigo-50 transition-colors">
                    <td className="p-3">{invoice?.invoice_number || p.invoice_id}</td>
                    <td className="p-3">{p.amount}</td>
                    <td className="p-3">{new Date(p.transaction_date).toLocaleDateString()}</td>
                    <td className="p-3 capitalize">{p.payment_mode}</td>
                    <td className="p-3 text-center flex justify-center gap-3">
                      <button
                        onClick={() => handleDeletePayment(p.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl w-full max-w-lg relative border border-indigo-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <FaMoneyBillWave className="text-yellow-500" /> Add Payment
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={formData.invoice_id}
                onChange={(e) => setFormData({ ...formData, invoice_id: e.target.value })}
                className="border border-indigo-200 rounded-lg p-2 bg-white focus:ring focus:ring-indigo-200 w-full"
              >
                <option value="">Select Invoice</option>
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoice_number} (Net: {inv.net_amount}, Status: {inv.status})
                  </option>
                ))}
              </select>

              <select
                value={formData.party_id || ""}
                onChange={(e) => setFormData({ ...formData, party_id: e.target.value })}
                className="border border-indigo-200 rounded-lg p-2 bg-white focus:ring focus:ring-indigo-200 w-full"
              >
                <option value="">Select Party</option>
                {parties.map((party) => (
                  <option key={party.id} value={party.id}>
                    {party.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="border border-indigo-200 rounded-lg p-2 bg-white focus:ring focus:ring-indigo-200 w-full"
              />

              <input
                type="date"
                value={formData.transaction_date.split("T")[0]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transaction_date: new Date(e.target.value).toISOString(),
                  })
                }
                className="border border-indigo-200 rounded-lg p-2 bg-white focus:ring focus:ring-indigo-200 w-full"
              />

              <select
                value={formData.payment_mode}
                onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
                className="border border-indigo-200 rounded-lg p-2 bg-white focus:ring focus:ring-indigo-200 w-full"
              >
                <option value="cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={handleAddPayment}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Save Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDashboard;
