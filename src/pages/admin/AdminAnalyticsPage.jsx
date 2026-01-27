import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { supabase } from "../../supabaseClient";

const TABS = ["overview", "revenue", "orders", "products", "expenses"];

export default function AdminAnalyticsPage() {
  const { fromDate, toDate } = useOutletContext();
  const [activeTab, setActiveTab] = useState("overview");

  const [revenueData, setRevenueData] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [productData, setProductData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchAnalytics();
  }, [fromDate, toDate]);

  async function fetchAnalytics() {
    /* ---------- ORDERS ---------- */
    const { data: orders } = await supabase
      .from("orders")
      .select("id, total_amount, created_at")
      .gte("created_at", fromDate || "1970-01-01")
      .lte("created_at", toDate || "2999-12-31");

    const revenueByDate = {};
    let revenueSum = 0;

    orders?.forEach((o) => {
      const date = o.created_at.slice(0, 10);
      revenueByDate[date] = (revenueByDate[date] || 0) + o.total_amount;
      revenueSum += o.total_amount;
    });

    setRevenueData(
      Object.entries(revenueByDate).map(([date, value]) => ({
        date,
        value,
      }))
    );
    setOrderCount(orders?.length || 0);
    setTotalRevenue(revenueSum);

    /* ---------- EXPENSES ---------- */
    const { data: expenses } = await supabase
      .from("expenses")
      .select("amount, category")
      .gte("created_at", fromDate || "1970-01-01")
      .lte("created_at", toDate || "2999-12-31");

    let expenseSum = 0;
    const expenseByCategory = {};

    expenses?.forEach((e) => {
      expenseSum += e.amount;
      expenseByCategory[e.category] =
        (expenseByCategory[e.category] || 0) + e.amount;
    });

    setTotalExpenses(expenseSum);
    setExpenseData(
      Object.entries(expenseByCategory).map(([name, value]) => ({
        name,
        value,
      }))
    );

    /* ---------- PRODUCTS ---------- */
    const { data: items } = await supabase
      .from("order_items")
      .select("quantity, line_total, products(name)")
      .gte("created_at", fromDate || "1970-01-01")
      .lte("created_at", toDate || "2999-12-31");

    const productMap = {};
    items?.forEach((i) => {
      const name = i.products?.name;
      if (!name) return;
      productMap[name] = productMap[name] || { name, qty: 0, revenue: 0 };
      productMap[name].qty += i.quantity;
      productMap[name].revenue += i.line_total;
    });

    setProductData(Object.values(productMap));
  }

  const profit = totalRevenue - totalExpenses;
  const aov = orderCount ? Math.round(totalRevenue / orderCount) : 0;

  return (
    <div style={{ padding: 24 }}>
      <h2>Analytics</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              background: activeTab === tab ? "#2563eb" : "#fff",
              color: activeTab === tab ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <>
          <Metric title="Revenue" value={`₹${totalRevenue}`} />
          <Metric title="Orders" value={orderCount} />
          <Metric title="AOV" value={`₹${aov}`} />
          <Metric
            title="Profit"
            value={`₹${profit}`}
            color={profit >= 0 ? "green" : "red"}
          />
        </>
      )}

      {/* REVENUE */}
      {activeTab === "revenue" && (
        <ChartBlock title="Revenue Trend">
          <LineChart width={800} height={300} data={revenueData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#eee" />
            <Line dataKey="value" stroke="#2563eb" />
          </LineChart>
        </ChartBlock>
      )}

      {/* ORDERS */}
      {activeTab === "orders" && (
        <>
          <Metric title="Total Orders" value={orderCount} />
          <Metric title="Average Order Value" value={`₹${aov}`} />
        </>
      )}

      {/* PRODUCTS */}
      {activeTab === "products" && (
        <ChartBlock title="Top Products (Quantity Sold)">
          <BarChart width={800} height={300} data={productData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="qty" fill="#16a34a" />
          </BarChart>
        </ChartBlock>
      )}

      {/* EXPENSES */}
      {activeTab === "expenses" && (
        <ChartBlock title="Expenses Breakdown">
          <PieChart width={400} height={300}>
            <Pie
              data={expenseData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
            >
              {expenseData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartBlock>
      )}
    </div>
  );
}

/* ---------- Helpers ---------- */

function Metric({ title, value, color = "#000" }) {
  return (
    <div style={{ marginBottom: 12, fontSize: 18 }}>
      <strong>{title}:</strong>{" "}
      <span style={{ color }}>{value}</span>
    </div>
  );
}

function ChartBlock({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"];
