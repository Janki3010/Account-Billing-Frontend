import { useEffect, useState } from "react";
import {
  createCompany,
  getCompanies,
  updateCompany,
  deleteCompany,
} from "../../api/company";
import { FaBuilding, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

interface Company {
  id: string;
  name: string;
}

const CompanyPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch companies
  const loadCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  // Create
  const handleCreate = async () => {
    if (!newName.trim()) return;
    await createCompany(newName);
    setNewName("");
    setShowModal(false);
    loadCompanies();
  };

  // Update
  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    await updateCompany(id, editingName);
    setEditingId(null);
    setEditingName("");
    loadCompanies();
  };

  // Delete
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteCompany(id);
      loadCompanies();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-3 drop-shadow-md">
          <FaBuilding className="text-indigo-600" /> Company Management
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          <FaPlus /> New Company
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-indigo-100">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-100 to-blue-100 text-gray-700">
              <th className="p-3 text-left">Company Name</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-6 text-center text-gray-500">
                  No companies found.
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr
                  key={company.id}
                  className="border-t hover:bg-indigo-50 transition-colors duration-150"
                >
                  <td className="p-3">
                    {editingId === company.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="border border-indigo-200 rounded p-1 w-full bg-yellow-50 focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                    ) : (
                      <span className="font-medium text-gray-800">
                        {company.name}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {editingId === company.id ? (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleUpdate(company.id)}
                          className="text-green-600 hover:text-green-800 transition-transform hover:scale-110"
                          title="Save"
                        >
                          <FaSave size={18} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-500 hover:text-gray-700 transition-transform hover:scale-110"
                          title="Cancel"
                        >
                          <FaTimes size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setEditingId(company.id);
                            setEditingName(company.name);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-transform hover:scale-110"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(company.id, company.name)
                          }
                          className="text-red-500 hover:text-red-700 transition-transform hover:scale-110"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl w-[500px] relative border border-indigo-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <FaBuilding className="text-indigo-600" /> Add New Company
            </h2>

            <input
              type="text"
              placeholder="Enter company name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border border-indigo-200 rounded-lg p-3 w-full focus:ring focus:ring-indigo-200"
            />

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md transition transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition transform hover:scale-105"
              >
                Add Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPage;
