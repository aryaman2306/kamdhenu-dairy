import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useOutletContext } from "react-router-dom";

export default function AdminExpensesPage() {
  const { fromDate, toDate } = useOutletContext();

  const [expenses, setExpenses] = useState([]);
  const [expenseTypes, setExpenseTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showTypeForm, setShowTypeForm] = useState(false);

  const [form, setForm] = useState({
    expense_type_id: "",
    amount: "",
    description: "",
    expense_date: "",
  });

  const [newType, setNewType] = useState("");

  /* ---------- FETCH ---------- */

  useEffect(() => {
    fetchExpenseTypes();
  }, []);

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  async function fetchExpenseTypes() {
    const { data } = await supabase
      .from("expense_types")
      .select("id, name")
      .eq("is_active", true)
      .order("name");

    setExpenseTypes(data || []);
  }

  async function fetchExpenses() {
    setLoading(true);

    let query = supabase
      .from("expenses")
      .select(
        `
        id,
        amount,
        description,
        expense_date,
        expense_types ( name )
      `
      )
      .order("expense_date", { ascending: false });

    if (fromDate && toDate) {
      query = query
        .gte("expense_date", fromDate)
        .lte("expense_date", toDate);
    }

    const { data } = await query;
    setExpenses(data || []);
    setLoading(false);
  }

  /* ---------- ACTIONS ---------- */

  async function addExpense(e) {
    e.preventDefault();

    const { error } = await supabase.from("expenses").insert({
      expense_type_id: form.expense_type_id,
      amount: form.amount,
      description: form.description,
      expense_date: form.expense_date,
    });

    if (!error) {
      setShowExpenseForm(false);
      setForm({
        expense_type_id: "",
        amount: "",
        description: "",
        expense_date: "",
      });
      fetchExpenses();
    } else {
      alert("Failed to add expense");
    }
  }

  async function addExpenseType(e) {
    e.preventDefault();

    const { error } = await supabase.from("expense_types").insert({
      name: newType,
    });

    if (!error) {
      setNewType("");
      setShowTypeForm(false);
      fetchExpenseTypes();
    } else {
      alert("Expense type already exists or failed");
    }
  }

  function exportCSV() {
    const headers = ["Date", "Type", "Description", "Amount"];

    const rows = expenses.map((e) => [
      e.expense_date,
      e.expense_types?.name,
      e.description || "",
      e.amount,
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "expenses.csv";
    link.click();
  }

  const total = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  if (loading) {
    return <PageWrap>Loading expenses…</PageWrap>;
  }

  return (
    <PageWrap>
      {/* HEADER */}
      <div style={header}>
        <h2>Expenses</h2>

        <div style={{ display: "flex", gap: 10 }}>
          <button style={secondaryBtn} onClick={exportCSV}>
            Export CSV
          </button>
          <button
            style={secondaryBtn}
            onClick={() => setShowTypeForm(true)}
          >
            + Add Expense Type
          </button>
          <button
            style={primaryBtn}
            onClick={() => setShowExpenseForm(true)}
          >
            + Add Expense
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div style={card}>
        <table style={table}>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th>Description</Th>
              <Th style={{ textAlign: "right" }}>Amount</Th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} style={row}>
                <Td>
                  {new Date(e.expense_date).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </Td>
                <Td>{e.expense_types?.name}</Td>
                <Td>{e.description || "-"}</Td>
                <Td style={{ textAlign: "right", fontWeight: 600 }}>
                  ₹{e.amount}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTAL */}
      <div style={totalBox}>
        Total Expense:{" "}
        <span style={{ color: "#991b1b" }}>₹{total}</span>
      </div>

      {/* ADD EXPENSE MODAL */}
      {showExpenseForm && (
        <Modal onClose={() => setShowExpenseForm(false)}>
          <h3>Add Expense</h3>

          <form onSubmit={addExpense} style={formGrid}>
            <select
              required
              value={form.expense_type_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  expense_type_id: e.target.value,
                })
              }
              style={input}
            >
              <option value="">Select Expense Type</option>
              {expenseTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              required
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              style={input}
            />

            <input
              type="date"
              required
              value={form.expense_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  expense_date: e.target.value,
                })
              }
              style={input}
            />

            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              style={{ ...input, height: 80 }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" style={primaryBtn}>
                Save
              </button>
              <button
                type="button"
                style={secondaryBtn}
                onClick={() => setShowExpenseForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ADD EXPENSE TYPE MODAL */}
      {showTypeForm && (
        <Modal onClose={() => setShowTypeForm(false)}>
          <h3>Add Expense Type</h3>

          <form onSubmit={addExpenseType} style={formGrid}>
            <input
              required
              placeholder="Expense Type Name"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              style={input}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" style={primaryBtn}>
                Save
              </button>
              <button
                type="button"
                style={secondaryBtn}
                onClick={() => setShowTypeForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </PageWrap>
  );
}

/* ---------- UI ---------- */

function PageWrap({ children }) {
  return (
    <div
      style={{
        padding: 32,
        minHeight: "100vh",
        background: "#f9fafb",
      }}
    >
      {children}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div style={overlay}>
      <div style={modal}>
        {children}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 12, right: 12 }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};

const card = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
};

const table = { width: "100%", borderCollapse: "collapse" };

const Th = ({ children, ...props }) => (
  <th
    {...props}
    style={{
      padding: "14px 16px",
      fontSize: 13,
      color: "#6b7280",
      textAlign: "left",
      borderBottom: "1px solid #e5e7eb",
    }}
  >
    {children}
  </th>
);

const Td = ({ children, ...props }) => (
  <td
    {...props}
    style={{ padding: "14px 16px", fontSize: 14 }}
  >
    {children}
  </td>
);

const row = { borderBottom: "1px solid #f1f5f9" };

const totalBox = {
  marginTop: 16,
  fontSize: 16,
  fontWeight: 700,
  textAlign: "right",
};

const primaryBtn = {
  padding: "8px 14px",
  borderRadius: 10,
  border: "none",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "8px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
};

const input = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14,
};

const formGrid = {
  display: "grid",
  gap: 12,
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  position: "relative",
  background: "#fff",
  padding: 24,
  borderRadius: 16,
  width: 360,
};
