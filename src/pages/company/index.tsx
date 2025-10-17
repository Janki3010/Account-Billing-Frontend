import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8005"; // adjust backend URL

const Company = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/company/get-all`)
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Companies</h2>
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company: any) => (
            <tr key={company.id}>
              <td className="px-4 py-2 border">{company.id}</td>
              <td className="px-4 py-2 border">{company.name}</td>
              <td className="px-4 py-2 border">
                <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Company;
