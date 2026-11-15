import { useState } from "react";
import "./App.css";
import useSalesData from "./hooks/useSalesData";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function App() {
  // Get dashboard data from our custom hook
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    region: "",
    product: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const { summary, categorySales, regionSales, salesTrend, loading, error } =
    useSalesData(appliedFilters);

  // Show loading message while APIs are fetching data
  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  // Show error if API request fails
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="dashboard">
      <h1>SAND-Board</h1>
      {/* FILTER SECTION */}
      <div className="filters">
        <label>
          Start Date
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
        </label>

        <label>
          End Date
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
        </label>
        <select
          name="category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Accessories">Accessories</option>
          <option value="Furniture">Furniture</option>
          <option value="Appliances">Appliances</option>
        </select>
        <select
          name="region"
          value={filters.region}
          onChange={(e) => setFilters({ ...filters, region: e.target.value })}
        >
          <option value="">All Regions</option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="East">East</option>
          <option value="West">West</option>
        </select>
        {/* Product Filter */}
        <select
          name="product"
          value={filters.product}
          onChange={(e) => setFilters({ ...filters, product: e.target.value })}
        >
          <option value="">All Products</option>
          <option value="Laptop">Laptop</option>
          <option value="Smartphone">Smartphone</option>
          <option value="Monitor">Monitor</option>
          <option value="Keyboard">Keyboard</option>
          <option value="Desk">Desk</option>
          <option value="Office Chair">Office Chair</option>
          <option value="Toaster">Toaster</option>
          <option value="Coffee Machine">Coffee Machine</option>
          <option value="USB Cable">USB Cable</option>
          <option value="Headphones">Headphones</option>
        </select>

        <button type="button" onClick={() => setAppliedFilters({ ...filters })}>
          Apply Filters
        </button>
      </div>
      {/* KPI CARDS */}
      <div className="kpi-container">
        <div className="kpi-card">
          <h3>Total Sales</h3>
          <p>₹{summary.totalSales.toLocaleString("en-IN")}</p>
        </div>

        <div className="kpi-card">
          <h3>Total Orders</h3>
          <p>{summary.totalOrders}</p>
        </div>

        <div className="kpi-card">
          <h3>Total Quantity</h3>
          <p>{summary.totalQuantity}</p>
        </div>

        <div className="kpi-card">
          <h3>Average Order Value</h3>
          <p>₹{summary.averageOrderValue.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* MONTHLY SALES TREND */}
      <div className="chart-card">
        <h2>Monthly Sales Trend</h2>

        {salesTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalSales"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No sales data available for this selection.</p>
        )}
      </div>

      {/* CATEGORY-WISE SALES */}
      <div className="chart-card">
        <h2>Category-wise Sales</h2>

        {categorySales.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSales" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No category sales data available.</p>
        )}
      </div>

      {/* REGION-WISE SALES */}
      <div className="chart-card">
        <h2>Region-wise Sales</h2>

        {regionSales.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionSales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSales" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No regional sales data available.</p>
        )}
      </div>
    </div>
  );
}

export default App;
