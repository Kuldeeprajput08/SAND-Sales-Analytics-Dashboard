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

/* ── Display-only helpers (no data or logic changes) ──────── */

// Map numeric month → short month name, purely for XAxis display
const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// XAxis tick formatter: "Jan '24" style label
const formatMonthTick = (monthNum, data) => {
  if (!monthNum) return "";
  const name = MONTH_NAMES[monthNum] ?? monthNum;
  // Find matching year from data for multi-year context
  const entry = data?.find((d) => d.month === monthNum);
  if (entry?.year) return `${name} '${String(entry.year).slice(-2)}`;
  return name;
};

// Tooltip formatter: currency label
const currencyFormatter = (value) =>
  `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

/* ── Custom Tooltip (shared across charts) ────────────────── */
const SalesTooltip = ({ active, payload, label, labelFormatter }) => {
  if (!active || !payload?.length) return null;
  const displayLabel = labelFormatter ? labelFormatter(label) : label;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 8,
        padding: "10px 14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        fontFamily: "inherit",
        fontSize: 13,
      }}
    >
      <p style={{ color: "#172554", fontWeight: 700, marginBottom: 4 }}>
        {displayLabel}
      </p>
      <p style={{ color: "#2563EB", fontWeight: 600 }}>
        {currencyFormatter(payload[0].value)}
      </p>
    </div>
  );
};

function App() {
  // ── All state and hooks are UNCHANGED ──────────────────────
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

  // ── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <span>Loading dashboard…</span>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────
  if (error) {
    return (
      <div className="error-screen">
        <strong>Something went wrong</strong>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className="dashboard-header">
        <div className="logo-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <rect x="2" y="12" width="4" height="10" rx="1" />
            <rect x="9" y="7"  width="4" height="15" rx="1" />
            <rect x="16" y="3" width="4" height="19" rx="1" />
          </svg>
        </div>
        <div>
          <h1>SAND – Sales Analytics Dashboard</h1>
          <p className="header-subtitle">Real-time sales performance &amp; insights</p>
        </div>
      </header>

      {/* ── FILTER SECTION ─────────────────────────────────── */}
      {/* All onChange handlers and event logic are UNCHANGED */}
      <div className="filters">

        <div className="filter-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
        </div>

        <div className="filter-group">
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
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
        </div>

        <div className="filter-group">
          <label htmlFor="region">Region</label>
          <select
            id="region"
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
        </div>

        <div className="filter-group">
          <label htmlFor="product">Product</label>
          <select
            id="product"
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
        </div>

        {/* Apply Filters – onClick logic is UNCHANGED */}
        <button
          type="button"
          className="btn-apply"
          onClick={() => setAppliedFilters({ ...filters })}
        >
          Apply Filters
        </button>

      </div>

      {/* ── KPI CARDS ──────────────────────────────────────── */}
      {/* Values sourced from API exactly as before; only display formatting */}
      <div className="kpi-container">

        <div className="kpi-card">
          <h3>Total Sales</h3>
          <p className="kpi-value">
            ₹{summary.totalSales.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="kpi-card">
          <h3>Total Orders</h3>
          <p className="kpi-value">
            {summary.totalOrders.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="kpi-card">
          <h3>Total Quantity</h3>
          <p className="kpi-value">
            {summary.totalQuantity.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="kpi-card">
          <h3>Avg. Order Value</h3>
          <p className="kpi-value">
            ₹{summary.averageOrderValue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

      </div>

      {/* ── MONTHLY SALES TREND ────────────────────────────── */}
      {/* dataKey="month" and dataKey="totalSales" are UNCHANGED.
          Month numbers are formatted client-side via tickFormatter only. */}
      <div className="chart-card">
        <h2>Monthly Sales Trend</h2>

        {salesTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={salesTrend}
              margin={{ top: 4, right: 20, left: 10, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#E2E8F0"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickFormatter={(val) => formatMonthTick(val, salesTrend)}
                tick={{ fill: "#64748B", fontSize: 12, fontFamily: "Inter, sans-serif" }}
                axisLine={{ stroke: "#E2E8F0" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) =>
                  `₹${(v / 1000).toFixed(0)}k`
                }
                tick={{ fill: "#64748B", fontSize: 12, fontFamily: "Inter, sans-serif" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                content={
                  <SalesTooltip
                    labelFormatter={(val) => formatMonthTick(val, salesTrend)}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="totalSales"
                stroke="#2563EB"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#2563EB", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#2563EB", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">No sales data available for this selection.</div>
        )}
      </div>

      {/* ── CATEGORY-WISE SALES ────────────────────────────── */}
      <div className="chart-card">
        <h2>Category-wise Sales</h2>

        {categorySales.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={categorySales}
              margin={{ top: 4, right: 20, left: 10, bottom: 4 }}
              barCategoryGap="38%"
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#E2E8F0"
                vertical={false}
              />
              <XAxis
                dataKey="category"
                tick={{ fill: "#64748B", fontSize: 12, fontFamily: "Inter, sans-serif" }}
                axisLine={{ stroke: "#E2E8F0" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                tick={{ fill: "#64748B", fontSize: 12, fontFamily: "Inter, sans-serif" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<SalesTooltip />} />
              <Bar dataKey="totalSales" fill="#0F766E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">No category sales data available.</div>
        )}
      </div>

      {/* ── REGION-WISE SALES ──────────────────────────────── */}
      <div className="chart-card">
        <h2>Region-wise Sales</h2>

        {regionSales.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={regionSales}
              margin={{ top: 4, right: 20, left: 10, bottom: 4 }}
              barCategoryGap="38%"
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#E2E8F0"
                vertical={false}
              />
              <XAxis
                dataKey="region"
                tick={{ fill: "#64748B", fontSize: 12, fontFamily: "Inter, sans-serif" }}
                axisLine={{ stroke: "#E2E8F0" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                tick={{ fill: "#64748B", fontSize: 12, fontFamily: "Inter, sans-serif" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<SalesTooltip />} />
              <Bar dataKey="totalSales" fill="#D97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">No regional sales data available.</div>
        )}
      </div>

    </div>
  );
}

export default App;
