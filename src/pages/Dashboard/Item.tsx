import { useEffect, useState } from "react";
import { createItem, getAllItems, updateItem, deleteItem } from "../../api/item";
import { getCompanies } from "../../api/company";
import type { ItemRequest, ItemResponse } from "../../types/item";
import type { Company } from "../../types/company";
import { FaEdit, FaSave, FaTimes, FaPlus, FaBoxOpen } from "react-icons/fa";

const ItemPage = () => {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingItem, setEditingItem] = useState<Record<string, Partial<ItemResponse>>>({});
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

      setEditingItem({
        [key]: {
          ...item,
          // convert numbers to strings for UI fields
          purchase_price: String(item.purchase_price),
          sale_price: String(item.sale_price),
          stock_quantity: String(item.stock_quantity),
          gst_rate: String(item.gst_rate),
        }
      });
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
          [field]: value,   // always string for input fields
        },
      }));
    };



  const handleSave = async (id: string) => {
      const updatedData = editingItem[id];
      if (!updatedData) return;

      const payload = {
        id,
        name: updatedData.name || "",
        description: updatedData.description || "",
        hsn_code: updatedData.hsn_code || "",
        IMEI_number: updatedData.IMEI_number || "",
        unit: updatedData.unit || "",
        purchase_price: Number(updatedData.purchase_price),
        sale_price: Number(updatedData.sale_price),
        stock_quantity: Number(updatedData.stock_quantity),
        gst_rate: Number(updatedData.gst_rate),
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

  const handleCreateItem = async () => {
      const payload = {
        ...formData,
        purchase_price: Number(formData.purchase_price || 0),
        sale_price: Number(formData.sale_price || 0),
        stock_quantity: Number(formData.stock_quantity || 0),
        gst_rate: Number(formData.gst_rate || 0),
      };

      await createItem(payload as unknown as ItemRequest);


      setFormData({
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

      {/* Grouped tables by company */}
      {Object.keys(groupedItems).length === 0 ? (
        <div className="p-6 bg-white rounded-xl shadow text-center text-gray-600">
          No items found.
        </div>
      ) : (
        Object.entries(groupedItems).map(([company, companyItems]) => (
          <div key={company} className="mb-10">
            <h3 className="text-2xl font-semibold mb-3 text-indigo-700 border-b-2 border-indigo-300 pb-1">
              {company}
            </h3>

            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-indigo-100 text-gray-700">
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
                    const isEditing = !!editingItem[id];
                    const current = editingItem[id] || item;

                    return (
                      <tr key={id} className="border-t hover:bg-indigo-50">
                        <td className="p-3">
                          {isEditing ? (
                            <input
                              value={current.name}
                              onChange={(e) => handleFieldChange(id, "name", e.target.value)}
                              className="border rounded p-1 w-full bg-yellow-50"
                            />
                          ) : (
                            item.name
                          )}
                        </td>

                        <td className="p-3">
                          {isEditing ? (
                            <input
                              value={current.sale_price}
                              onChange={(e) =>
                                handleFieldChange(id, "sale_price", e.target.value)
                              }
                              className="border rounded p-1 w-full bg-yellow-50"
                            />
                          ) : (
                            item.sale_price
                          )}
                        </td>

                        <td className="p-3">{item.hsn_code}</td>
                        <td className="p-3">{item.stock_quantity}</td>
                        <td className="p-3">{item.description}</td>

                        <td className="p-3 text-center">
                          {isEditing ? (
                            <div className="flex justify-center gap-3">
                              <FaSave
                                className="text-green-600 cursor-pointer"
                                onClick={() => handleSave(id)}
                              />
                              <FaTimes
                                className="text-gray-600 cursor-pointer"
                                onClick={() => handleCancelEdit(id)}
                              />
                            </div>
                          ) : (
                            <div className="flex justify-center gap-3">
                              <FaEdit
                                className="text-blue-600 cursor-pointer"
                                onClick={() => handleEdit(item)}
                              />
                              <FaTimes
                                className="text-red-600 cursor-pointer"
                                onClick={() => handleDelete(id)}
                              />
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

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-[600px] relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-3 right-3 text-gray-600"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-semibold mb-4">
              <FaBoxOpen className="text-indigo-600 inline-block" /> Create New Item
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="border rounded p-2" />

              <input name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="border rounded p-2" />

              <input name="hsn_code" placeholder="HSN Code" value={formData.hsn_code} onChange={handleInputChange} className="border rounded p-2" />

              <input name="IMEI_number" placeholder="IMEI" value={formData.IMEI_number} onChange={handleInputChange} className="border rounded p-2" />

              <input name="unit" placeholder="Unit" value={formData.unit} onChange={handleInputChange} className="border rounded p-2" />

              <input name="purchase_price" type="number" placeholder="Purchase Price" value={formData.purchase_price} onChange={handleInputChange} className="border rounded p-2" />

              <input name="sale_price" type="number" placeholder="Sale Price" value={formData.sale_price} onChange={handleInputChange} className="border rounded p-2" />

              <input name="stock_quantity" type="number" placeholder="Stock Quantity" value={formData.stock_quantity} onChange={handleInputChange} className="border rounded p-2" />

              <input name="gst_rate" type="number" placeholder="GST (%)" value={formData.gst_rate} onChange={handleInputChange} className="border rounded p-2" />

              <select name="company_id" value={formData.company_id} onChange={handleInputChange} className="border rounded p-2 col-span-2">
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={handleCreateItem}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
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
