import { useEffect, useState } from "react";
import { createItem, getAllItems, updateItem, deleteItem } from "../../api/item";
import { getCompanies } from "../../api/company";
import type { ItemRequest, ItemResponse } from "../../types/item";
import type { Company } from "../../types/company";
import { FaEdit, FaSave, FaTimes, FaPlus, FaBoxOpen } from "react-icons/fa";

const ItemPage = () => {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingItem, setEditingItem] = useState<Record<string, Partial<ItemRequest>>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<ItemRequest>({
    name: "",
    description: "",
    hsn_code: "",
    IMEI_number: "",
    unit: "",
    purchase_price: "",
    sale_price: "",
    stock_quantity: "",
    gst_rate: "",
    company_id: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [itemData, companyData] = await Promise.all([getAllItems(), getCompanies()]);
    setItems(itemData);
    setCompanies(companyData);
  };

  const handleEdit = (item: ItemResponse) => {
    const key = item.id ?? item.item_id ?? "";
    if (!key) return;
    setEditingItem({ [key]: { ...item } });
  };

  const handleCancelEdit = (id: string) => {
    setEditingItem((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleFieldChange = (id: string, field: keyof ItemRequest, value: string) => {
    setEditingItem((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: ["purchase_price", "sale_price", "stock_quantity", "gst_rate"].includes(field)
          ? Number(value)
          : value,
      },
    }));
  };

  const handleSave = async (id: string) => {
    const updatedData = editingItem[id];
    if (!updatedData) return;

    const payload: ItemRequest & { id: string } = {
      id,
      name: updatedData.name || "",
      description: updatedData.description || "",
      hsn_code: updatedData.hsn_code || "",
      IMEI_number: updatedData.IMEI_number || "",
      unit: updatedData.unit || "",
      purchase_price: updatedData.purchase_price ?? 0,
      sale_price: updatedData.sale_price ?? 0,
      stock_quantity: updatedData.stock_quantity ?? 0,
      gst_rate: updatedData.gst_rate ?? 0,
      company_id: updatedData.company_id || "",
    };

    await updateItem(payload);
    handleCancelEdit(id);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await deleteItem(id);
    loadData();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["purchase_price", "sale_price", "stock_quantity", "gst_rate"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleCreateItem = async () => {
    await createItem(formData);
    setFormData({
      name: "",
      description: "",
      hsn_code: "",
      IMEI_number: "",
      unit: "",
      purchase_price: 0,
      sale_price: 0,
      stock_quantity: 0,
      gst_rate: 0,
      company_id: "",
    });
    setShowCreateModal(false);
    loadData();
  };

  const groupedItems = items.reduce((acc: Record<string, ItemResponse[]>, item) => {
    const company = item.company_name || "Unassigned";
    if (!acc[company]) acc[company] = [];
    acc[company].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-3 drop-shadow-md">
          <FaBoxOpen className="text-indigo-600" /> Item Management
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          <FaPlus /> Add Item
        </button>
      </div>

      {/* Company-wise Grouped Tables */}
      {Object.keys(groupedItems).length === 0 ? (
        <div className="p-6 bg-white rounded-xl shadow text-center text-gray-600">
          No items found.
        </div>
      ) : (
        Object.entries(groupedItems).map(([company, companyItems]) => (
          <div key={company} className="mb-10">
            {/* Company Header */}
            <h3 className="text-2xl font-semibold mb-3 text-indigo-700 border-b-2 border-indigo-300 pb-1">
              {company}
            </h3>

            {/* Company Table */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-indigo-100">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-100 to-blue-100 text-gray-700">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">HSN Code</th>
                    <th className="p-3 text-left">Stock</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companyItems.map((item) => {
                    const id = item.id ?? item.item_id ?? "";
                    if (!id) return null;

                    const isEditing = !!editingItem[id];
                    const currentData = editingItem[id] || item;

                    return (
                      <tr
                        key={id}
                        className="border-t hover:bg-indigo-50 transition-colors duration-150"
                      >
                        <td className="p-3">
                          {isEditing ? (
                            <input
                              value={currentData.name || ""}
                              onChange={(e) => handleFieldChange(id, "name", e.target.value)}
                              className="border border-indigo-200 rounded p-1 w-full bg-yellow-50 focus:outline-none focus:ring focus:ring-indigo-200"
                            />
                          ) : (
                            <span className="font-medium text-gray-800">{item.name}</span>
                          )}
                        </td>

                        <td className="p-3">
                          {isEditing ? (
                            <input
                              value={currentData.sale_price ?? 0}
                              onChange={(e) => handleFieldChange(id, "sale_price", e.target.value)}
                              className="border border-indigo-200 rounded p-1 w-full bg-yellow-50 focus:outline-none focus:ring focus:ring-indigo-200"
                            />
                          ) : (
                            <span className="text-gray-700">{item.sale_price}</span>
                          )}
                        </td>

                        <td className="p-3">{item.hsn_code}</td>
                        <td className="p-3">{item.stock_quantity}</td>
                        <td className="p-3 text-gray-700">{item.description}</td>

                        <td className="p-3 text-center">
                          {isEditing ? (
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => handleSave(id)}
                                className="text-green-600 hover:text-green-800 transition-transform hover:scale-110"
                                title="Save"
                              >
                                <FaSave size={18} />
                              </button>
                              <button
                                onClick={() => handleCancelEdit(id)}
                                className="text-gray-500 hover:text-gray-700 transition-transform hover:scale-110"
                                title="Cancel"
                              >
                                <FaTimes size={18} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-blue-600 hover:text-blue-800 transition-transform hover:scale-110"
                                title="Edit"
                              >
                                <FaEdit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(id)}
                                className="text-red-600 hover:text-red-800 transition-transform hover:scale-110"
                                title="Delete"
                              >
                                <FaTimes size={18} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {/* Create Item Modal */}
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
              <FaBoxOpen className="text-indigo-600" /> Create New Item
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(formData).map(([key, value]) =>
                key === "company_id" ? (
                  <select
                    key={key}
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    className="border border-indigo-200 rounded-lg p-2 bg-white focus:ring focus:ring-indigo-200"
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    key={key}
                    name={key}
                    placeholder={key.replace("_", " ").toUpperCase()}
                    value={value}
                    onChange={handleInputChange}
                    className="border border-indigo-200 rounded-lg p-2 focus:ring focus:ring-indigo-200"
                  />
                )
              )}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={handleCreateItem}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition transform hover:scale-105"
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemPage;
