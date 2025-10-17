import { useState } from "react";
import { uploadFile } from "../../api/upload"; // your file upload endpoint
import { createShopProfile } from "../../api/shopProfile"; // your backend API

const ShopProfilePage = () => {
  const [formData, setFormData] = useState({
    shop_name: "",
    address: "",
    phone: "",
    qr_code_url: "",
    authorized_signatory: "",
  });

  const [qrFile, setQrFile] = useState<File | null>(null);
  const [signatoryFile, setSignatoryFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (file: File, field: string) => {
    const form = new FormData();
    form.append("file", file);

    // Upload to your backend /upload endpoint
    const res = await uploadFile(form);
    if (res?.url) {
      setFormData((prev) => ({ ...prev, [field]: res.url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Upload files first
    if (qrFile) await handleFileUpload(qrFile, "qr_code_url");
    if (signatoryFile) await handleFileUpload(signatoryFile, "authorized_signatory");

    // Send all data to backend
    await createShopProfile(formData);
    setLoading(false);
    alert("Shop Profile created successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-8">
      <h1 className="text-2xl font-bold mb-6">Shop Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="shop_name"
          placeholder="Shop Name"
          value={formData.shop_name}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        />

        <div>
          <label className="block text-gray-700 mb-2">QR Code</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setQrFile(e.target.files?.[0] || null)}
            className="w-full border p-2 rounded-md"
          />
          {formData.qr_code_url && (
            <img
              src={formData.qr_code_url}
              alt="QR Code"
              className="h-20 mt-2 rounded-md border"
            />
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Authorized Signatory</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSignatoryFile(e.target.files?.[0] || null)}
            className="w-full border p-2 rounded-md"
          />
          {formData.authorized_signatory && (
            <img
              src={formData.authorized_signatory}
              alt="Signatory"
              className="h-20 mt-2 rounded-md border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default ShopProfilePage;
