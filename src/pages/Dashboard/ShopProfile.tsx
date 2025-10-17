import { useEffect, useState } from "react";
import {
  createShopProfile,
  getAllShopProfiles,
  updateShopProfile,
} from "../../api/shop_profile";
import type { ShopProfile, ShopProfileReq } from "../../types/shop_profile";
import { FaPlus, FaEdit, FaTimes, FaStore } from "react-icons/fa";

const defaultProfile: ShopProfileReq = {
  shop_name: "",
  gstin: "",
  address: "",
  phone: "",
  email: "",
  bank_name: "",
  account_number: "",
  ifsc_code: "",
  qr_code_url: "",
  authorized_signatory: "",
};

const ShopProfilePage = () => {
  const [profiles, setProfiles] = useState<ShopProfile[]>([]);
  const [formData, setFormData] = useState<ShopProfileReq>({ ...defaultProfile });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const data = await getAllShopProfiles();
      setProfiles(data);
    } catch (error) {
      console.error("Error fetching shop profiles:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateShopProfile({ id: editingId, ...formData });
        alert("Shop profile updated successfully!");
      } else {
        await createShopProfile(formData);
        alert("Shop profile created successfully!");
      }
      setFormData({ ...defaultProfile });
      setEditingId(null);
      setShowModal(false);
      fetchProfiles();
    } catch (error) {
      console.error("Error saving shop profile:", error);
    }
  };

  const handleEdit = (profile: ShopProfile) => {
    setFormData(profile);
    setEditingId(profile.id);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3 drop-shadow-md">
          <FaStore className="text-indigo-500" /> Shop Profile Management
        </h1>
        <button
          onClick={() => {
            setFormData({ ...defaultProfile });
            setEditingId(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          <FaPlus /> Add Shop
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-indigo-100">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-100 to-blue-100 text-gray-700">
              <th className="p-3 text-left">Shop Name</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">GSTIN</th>
              <th className="p-3 text-left">Bank Name</th>
              <th className="p-3 text-left">Account Number</th>
              <th className="p-3 text-left">IFSC code</th>
              <th className="p-3 text-left text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-indigo-50 transition-colors">
                  <td className="p-3 border-b">{profile.shop_name}</td>
                  <td className="p-3 border-b">{profile.address}</td>
                  <td className="p-3 border-b">{profile.phone}</td>
                  <td className="p-3 border-b">{profile.email}</td>
                  <td className="p-3 border-b">{profile.gstin}</td>
                  <td className="p-3 border-b">{profile.bank_name}</td>
                  <td className="p-3 border-b">{profile.account_number}</td>
                  <td className="p-3 border-b">{profile.ifsc_code}</td>
                  <td className="p-3 border-b text-center">
                    <button
                      onClick={() => handleEdit(profile)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <FaEdit size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500">
                  No shop profiles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative border border-indigo-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
               <FaStore className="text-indigo-500" /> {editingId ? "Edit Shop Profile" : "Add Shop Profile"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(defaultProfile).map((key) => (
                <input
                  key={key}
                  type="text"
                  placeholder={key.replaceAll("_", " ").toUpperCase()}
                  value={(formData as any)[key] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="border border-indigo-200 rounded-lg p-2 bg-white focus:ring focus:ring-indigo-200 w-full"
                />
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopProfilePage;
