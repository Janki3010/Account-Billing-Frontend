import { useEffect, useState } from "react";
import { getDashboardData } from "../../api/report"; // your backend API call
import { FaRupeeSign, FaUserFriends, FaBoxOpen, FaArrowUp, FaArrowDown } from "react-icons/fa";

interface YearlySummary {
  year: number;
  total_sales: number;
  top_customers: { name: string; total_spent: number }[];
  top_products: { name: string; total_sold: number }[];
}

const DashboardPage = () => {
  const [report, setReport] = useState<any>(null);
  const [yearlySummary, setYearlySummary] = useState<YearlySummary[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardData();
        setReport(res);
        if (res.yearly_summary) setYearlySummary(res.yearly_summary);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">📊 Dashboard Summary</h1>

      {/* Overall Sales Cards */}
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-medium">Daily Sales</h3>
            <p className="text-2xl font-bold mt-2">₹{report.daily_sales.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-medium">Monthly Sales</h3>
            <p className="text-2xl font-bold mt-2">₹{report.monthly_sales.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-medium">Yearly Sales</h3>
            <p className="text-2xl font-bold mt-2">₹{report.yearly_sales.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Yearly Summary */}
      {yearlySummary.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📅 Yearly Summary</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 border-b font-semibold text-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left">Year</th>
                  <th className="px-4 py-2 text-right">Total Sales (₹)</th>
                  <th className="px-4 py-2 text-left">Top Customers</th>
                  <th className="px-4 py-2 text-left">Top Products</th>
                </tr>
              </thead>
              <tbody>
                {yearlySummary.map((y, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-indigo-50 transition"
                  >
                    <td className="px-4 py-2 font-semibold">{y.year}</td>
                    <td className="px-4 py-2 text-right font-medium text-green-600">
                      ₹{y.total_sales.toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <ul>
                        {y.top_customers.map((c, i) => (
                          <li key={i} className="flex justify-between">
                            <span>{c.name}</span>
                            <span className="text-gray-500">
                              ₹{c.total_spent.toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2">
                      <ul>
                        {y.top_products.map((p, i) => (
                          <li key={i} className="flex justify-between">
                            <span>{p.name}</span>
                            <span className="text-gray-500">{p.total_sold}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Low Stock Products */}
      {report?.low_stock && report.low_stock.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">⚠️ Low Stock Products</h2>
          <ul className="space-y-2">
            {report.low_stock.map((p: any, idx: number) => (
              <li key={idx} className="flex justify-between border-b pb-1 hover:bg-red-50 rounded transition">
                <span>{p.name}</span>
                <span className="font-semibold text-red-600">{p.stock}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
