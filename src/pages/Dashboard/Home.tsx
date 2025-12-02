import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding, FaFileInvoice, FaUsers, FaMoneyBillWave,
  FaBoxOpen, FaStore, FaChartLine,
} from "react-icons/fa";
import { getDashboardData } from "../../api/report";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const modules = [
    { name: "Company", icon: <FaBuilding size={40} className="text-blue-500" />, link: "/company" },
    { name: "Invoice", icon: <FaFileInvoice size={40} className="text-green-500" />, link: "/invoice" },
    { name: "Party", icon: <FaUsers size={40} className="text-purple-500" />, link: "/party" },
    { name: "Payment", icon: <FaMoneyBillWave size={40} className="text-yellow-500" />, link: "/payment" },
    { name: "Item", icon: <FaBoxOpen size={40} className="text-indigo-600" />, link: "/item" },
    { name: "Shop Profile", icon: <FaStore size={40} className="text-indigo-500" />, link: "/shop-profile" },
  ];

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getDashboardData();
        setReport(data);
      } catch (error) {
        console.error("Error fetching dashboard report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  if (!report) return <div className="p-8 text-red-600">Failed to load dashboard data.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8 space-y-8">
      <h1 className="text-4xl font-bold text-gray-800 drop-shadow-md">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <SummaryCard title="Today's Sales" value={report.daily_sales} color="text-blue-500" />
        <SummaryCard title="This Month" value={report.monthly_sales} color="text-green-500" />
        <SummaryCard title="This Year" value={report.yearly_sales} color="text-purple-500" />
      </div>

      {/* Sales Trend */}
      <ChartSection
        title="Sales Trend (Last 30 Days)"
        data={report.sales_trend}
        dataKey="total"
        color="#4f46e5"
      />

      {/* Yearly Summary */}
      {report.yearly_summary && report.yearly_summary.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Yearly Sales Summary</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={report.yearly_summary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total_sales" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>

          {/* Yearly Summary Table */}
          <div className="mt-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Yearly Summary (₹)</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Year</th>
                  <th className="py-2">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {report.yearly_summary.map((y: any, idx: number) => (
                  <tr key={idx} className="border-b hover:bg-indigo-50 transition">
                    <td className="py-2 font-medium text-gray-800">{y.year}</td>
                    <td className="py-2 text-green-600 font-semibold">₹{y.total_sales.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Customers, Products, Low Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ListSection title="Top Customers" data={report.top_customers} valueKey="total_spent" valuePrefix="₹" color="text-green-600" />
        <ListSection title="Top Products" data={report.top_products} valueKey="total_sold" color="text-blue-600" />
        <ListSection title="Low Stock Products" data={report.low_stock} valueKey="stock" color="text-red-500" />
      </div>

      {/* Modules */}
      <h2 className="text-3xl font-bold text-gray-800">Modules</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div
            key={module.name}
            onClick={() => navigate(module.link)}
            className="cursor-pointer bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-2xl transition transform hover:scale-105"
          >
            {module.icon}
            <h2 className="text-xl font-semibold mt-4 text-gray-800">{module.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🧩 Reusable Components
const SummaryCard = ({ title, value, color }: any) => (
  <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-center transition transform hover:scale-105">
    <FaChartLine className={`${color} mb-3`} size={36} />
    <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
    <p className="text-3xl font-bold text-green-600">₹{value || 0}</p>
  </div>
);

const ChartSection = ({ title, data, dataKey, color }: any) => (
  <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const ListSection = ({ title, data, valueKey, valuePrefix = "", color }: any) => (
  <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
    <ul className="space-y-2">
      {data?.map((d: any, idx: number) => (
        <li key={idx} className="flex justify-between border-b pb-1 hover:bg-indigo-50 rounded transition">
          <span>{d.name}</span>
          <span className={`font-semibold ${color}`}>
            {valuePrefix}{d[valueKey]}
          </span>
        </li>
      ))}
      {data?.length === 0 && (
        <li className="text-center text-gray-500 py-2">No data available</li>
      )}
    </ul>
  </div>
);

export default Dashboard;
