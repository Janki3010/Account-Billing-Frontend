import { useEffect, useState } from "react";
import { createParty, getParties, updateParty, deleteParty } from "../../api/party";
import { FaUsers, FaPlus, FaEdit, FaSave, FaTimes, FaTrash } from "react-icons/fa";

interface Party {
  id?: string;
  name: string;
  type: string;
  email?: string;
  phone?: string;
  address: string;
  gst_number: string;
}

const PartyPage = () => {
  const [parties, setParties] = useState<Party[]>([]);
  const [editingParty, setEditingParty] = useState<Record<string, Party>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newParty, setNewParty] = useState<Party>({
    name: "",
    type: "customer",
    email: "",
    phone: "",
    address: "",
    gst_number: "",
  });

  // Load all parties
  const loadParties = async () => {
    const data = await getParties();
    setParties(data);
  };

  useEffect(() => {
    loadParties();
  }, []);

  // Handle field change while editing
  const handleFieldChange = (id: string, field: keyof Party, value: string) => {
    setEditingParty((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // Start editing
  const handleEdit = (party: Party) => {
    if (!party.id) return;
    setEditingParty((prev) => ({ ...prev, [party.id!]: { ...party } }));
  };

  // Cancel editing
  const handleCancelEdit = (id: string) => {
    setEditingParty((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // Save updates
  const handleSave = async (id: string) => {
    const updated = editingParty[id];
    await updateParty(id, updated);
    handleCancelEdit(id);
    loadParties();
  };

  // Create new party
  const handleCreate = async () => {
    if (!newParty.name.trim()) return;
    await createParty(newParty);
    setNewParty({
      name: "",
      type: "customer",
      email: "",
      phone: "",
      address: "",
      gst_number: "",
    });
    setShowCreateModal(false);
    loadParties();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-3 drop-shadow-md">
          <FaUsers className="text-indigo-600" /> Party Management
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          <FaPlus /> Add Party
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-indigo-100">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-100 to-blue-100 text-gray-700">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">GST No</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parties.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No parties found.
                </td>
              </tr>
            ) : (
              parties.map((party) => {
                const id = party.id!;
                const isEditing = !!editingParty[id];
                const current = editingParty[id] || party;

                return (
                  <tr key={id} className="border-t hover:bg-indigo-50 transition-colors duration-150">
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          value={current.name}
                          onChange={(e) => handleFieldChange(id, "name", e.target.value)}
                          className="border border-indigo-200 rounded p-1 w-full bg-yellow-50 focus:ring focus:ring-indigo-200"
                        />
                      ) : (
                        <span className="font-medium text-gray-800">{party.name}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <select
                          value={current.type}
                          onChange={(e) => handleFieldChange(id, "type", e.target.value)}
                          className="border border-indigo-200 rounded p-1 w-full bg-yellow-50 focus:ring focus:ring-indigo-200"
                        >
                          <option value="customer">Customer</option>
                          <option value="supplier">Supplier</option>
                          <option value="both">Both</option>
                        </select>
                      ) : (
                        <span className="text-gray-700">{party.type}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="email"
                          value={current.email || ""}
                          onChange={(e) => handleFieldChange(id, "email", e.target.value)}
                          className="border border-indigo-200 rounded p-1 w-full bg-yellow-50 focus:ring focus:ring-indigo-200"
                        />
                      ) : (
                        <span className="text-gray-700">{party.email}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={current.phone || ""}
                          onChange={(e) => handleFieldChange(id, "phone", e.target.value)}
                          className="border border-indigo-200 rounded p-1 w-full bg-yellow-50 focus:ring focus:ring-indigo-200"
                        />
                      ) : (
                        <span className="text-gray-700">{party.phone}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          value={current.address || ""}
                          onChange={(e) => handleFieldChange(id, "address", e.target.value)}
                          className="border border-indigo-200 rounded p-1 w-full bg-yellow-50 focus:ring focus:ring-indigo-200"
                        />
                      ) : (
                        <span className="text-gray-700">{party.address}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          value={current.gst_number || ""}
                          onChange={(e) => handleFieldChange(id, "gst_number", e.target.value)}
                          className="border border-indigo-200 rounded p-1 w-full bg-yellow-50 focus:ring focus:ring-indigo-200"
                        />
                      ) : (
                        <span className="text-gray-700">{party.gst_number}</span>
                      )}
                    </td>
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
                            onClick={() => handleEdit(party)}
                            className="text-blue-600 hover:text-blue-800 transition-transform hover:scale-110"
                            title="Edit"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete party "${party.name}"?`)) {
                                await deleteParty(id);
                                loadParties();
                              }
                            }}
                            className="text-red-600 hover:text-red-800 transition-transform hover:scale-110"
                            title="Delete"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
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
              <FaUsers className="text-indigo-600" /> Create New Party
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Party Name"
                value={newParty.name}
                onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                className="border border-indigo-200 rounded-lg p-2 focus:ring focus:ring-indigo-200"
              />
              <select
                value={newParty.type}
                onChange={(e) => setNewParty({ ...newParty, type: e.target.value })}
                className="border border-indigo-200 rounded-lg p-2 bg-white focus:ring focus:ring-indigo-200"
              >
                <option value="customer">Customer</option>
                <option value="supplier">Supplier</option>
                <option value="both">Both</option>
              </select>
              <input
                type="email"
                placeholder="Email"
                value={newParty.email}
                onChange={(e) => setNewParty({ ...newParty, email: e.target.value })}
                className="border border-indigo-200 rounded-lg p-2 focus:ring focus:ring-indigo-200"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newParty.phone}
                onChange={(e) => setNewParty({ ...newParty, phone: e.target.value })}
                className="border border-indigo-200 rounded-lg p-2 focus:ring focus:ring-indigo-200"
              />
              <input
                type="text"
                placeholder="Address"
                value={newParty.address}
                onChange={(e) => setNewParty({ ...newParty, address: e.target.value })}
                className="border border-indigo-200 rounded-lg p-2 focus:ring focus:ring-indigo-200"
              />
              <input
                type="text"
                placeholder="GST Number"
                value={newParty.gst_number}
                onChange={(e) => setNewParty({ ...newParty, gst_number: e.target.value })}
                className="border border-indigo-200 rounded-lg p-2 focus:ring focus:ring-indigo-200"
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleCreate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition transform hover:scale-105"
              >
                Add Party
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartyPage;
