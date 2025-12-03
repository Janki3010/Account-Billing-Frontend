import { useEffect, useState } from "react";
import {
  createInvoice,
  getInvoices,
  downloadInvoicePdf,
} from "../../api/invoice";
import { getParties } from "../../api/party";
import { getAllShopProfiles } from "../../api/shop_profile";
import { getAllItems } from "../../api/item";

import type { InvoiceCreate, InvoiceResponse } from "../../types/invoice";
import type { Party } from "../../types/party";
import type { ShopProfile } from "../../types/shop_profile";
import type { ItemResponse } from "../../types/item";

import {
  FaPlus,
  FaTimes,
  FaFilePdf,
  FaBoxOpen,
  FaFileInvoice,
} from "react-icons/fa";

const defaultInvoice: InvoiceCreate = {
  party_id: "",
  shop_id: "",
  invoice_date: new Date().toISOString(),
  items: [{ item_id: "", quantity: 1, discount: 0 }],
};

const InvoiceDashboard = () => {
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [formData, setFormData] = useState<InvoiceCreate>({ ...defaultInvoice });
  const [parties, setParties] = useState<Party[]>([]);
  const [shopProfiles, setShopProfiles] = useState<ShopProfile[]>([]);
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchInvoices();
    fetchParties();
    fetchShopProfiles();
    fetchItems();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
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

  const fetchShopProfiles = async () => {
    try {
      const data = await getAllShopProfiles();
      setShopProfiles(data);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const data = await getAllItems();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handlePartyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, party_id: e.target.value }));
  };

  const handleShopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, shop_id: e.target.value }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    (newItems[index] as any)[field] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleAddInvoice = async () => {
    try {
      await createInvoice(formData);
      alert("Invoice created successfully!");

      setFormData({ ...defaultInvoice });
      setShowCreateModal(false);
      fetchInvoices();
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-3 drop-shadow-md">
          <FaFileInvoice className="text-green-600" /> Invoice Management
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          <FaPlus /> Add Invoice
        </button>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl w-[600px] relative border border-indigo-200">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <FaBoxOpen className="text-indigo-600" /> Create New Invoice
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={formData.party_id}
                onChange={handlePartyChange}
                className="border border-indigo-200 rounded-lg p-2 bg-white"
              >
                <option value="">Select Party</option>
                {parties.map((party) => (
                  <option key={party.id} value={party.id}>
                    {party.name}
                  </option>
                ))}
              </select>

              <select
                value={formData.shop_id}
                onChange={handleShopChange}
                className="border border-indigo-200 rounded-lg p-2 bg-white"
              >
                <option value="">Select Shop</option>
                {shopProfiles.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.shop_name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={formData.invoice_date.split("T")[0]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    invoice_date: new Date(e.target.value).toISOString(),
                  }))
                }
                className="border border-indigo-200 rounded-lg p-2 bg-white"
              />
            </div>

            {/* Items */}
            <h3 className="text-lg font-semibold mt-4">Items</h3>

            {formData.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 my-2">
                <select
                  value={item.item_id}
                  onChange={(e) => handleItemChange(idx, "item_id", e.target.value)}
                  className="border border-indigo-200 rounded-lg p-2 bg-white"
                >
                  <option value="">Select Item</option>
                  {items.map((i) => (
                    <option key={i.item_id} value={i.item_id}>
                      {i.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(idx, "quantity", Number(e.target.value))
                  }
                  className="border border-indigo-200 rounded-lg p-2 bg-white"
                />

                <input
                  type="number"
                  value={item.discount}
                  onChange={(e) =>
                    handleItemChange(idx, "discount", Number(e.target.value))
                  }
                  className="border border-indigo-200 rounded-lg p-2 bg-white"
                />
              </div>
            ))}

            <button
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  items: [...prev.items, { item_id: "", quantity: 1, discount: 0 }],
                }))
              }
              className="mt-2 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
            >
              Add Item
            </button>

            <button
              onClick={handleAddInvoice}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md flex items-center gap-2"
            >
              <FaPlus /> Save Invoice
            </button>
          </div>
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-indigo-100 mt-6">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-100 to-blue-100 text-gray-700">
              <th className="p-3 text-left">Invoice #</th>
              <th className="p-3 text-left">Party Name</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Net</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => {
              const party = parties.find((p) => p.id === inv.party_id);

              return (
                <tr key={inv.id} className="hover:bg-indigo-50">
                  <td className="p-3">{inv.invoice_number}</td>
                  <td className="p-3">{party?.name || "-"}</td>
                  <td className="p-3">{party?.address || "-"}</td>
                  <td className="p-3">{party?.phone || "-"}</td>
                  <td className="p-3">{inv.total_amount}</td>
                  <td className="p-3">{inv.net_amount}</td>
                  <td className="p-3">{inv.status}</td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        downloadInvoicePdf(String(inv.id), String(inv.invoice_number))
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaFilePdf size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default InvoiceDashboard;
