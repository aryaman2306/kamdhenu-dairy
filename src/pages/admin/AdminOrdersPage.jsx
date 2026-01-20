import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function AdminOrdersPage() {
  const { fromDate, toDate } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingRow, setSavingRow] = useState(null);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  async function fetchOrders() {
    setLoading(true);

    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (fromDate && toDate) {
      query = query
        .gte("created_at", `${fromDate}T00:00:00`)
        .lte("created_at", `${toDate}T23:59:59`);
    }

    const { data } = await query;
    setOrders(data || []);
    setLoading(false);
  }

  async function commitChange(orderId, field, value) {
    setSavingRow(orderId);

    const { error } = await supabase
      .from("orders")
      .update({ [field]: value })
      .eq("id", orderId);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, [field]: value } : o
        )
      );
    } else {
      alert("Update failed");
    }

    setSavingRow(null);
    setEditing(null);
  }

  if (loading) {
    return <PageWrap>Loading orders…</PageWrap>;
  }

  return (
    <PageWrap>
      <h2 style={{ marginBottom: 16 }}>Orders</h2>

      <div style={card}>
        <table style={table}>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Customer</Th>
              <Th>Phone</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Payment</Th>
              <Th>WhatsApp</Th>
              <Th></Th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                style={{
                  ...row,
                  opacity: savingRow === o.id ? 0.6 : 1,
                }}
              >
                <Td>
                  {new Date(o.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Td>
                <Td>{o.customer_name}</Td>
                <Td>{o.customer_phone}</Td>
                <Td>₹{o.total_amount}</Td>

                <Td
                  onDoubleClick={() =>
                    setEditing({ orderId: o.id, field: "order_status" })
                  }
                >
                  {editing?.orderId === o.id &&
                  editing?.field === "order_status" ? (
                    <select
                      autoFocus
                      defaultValue={o.order_status}
                      onBlur={(e) =>
                        commitChange(o.id, "order_status", e.target.value)
                      }
                      style={select}
                    >
                      <option>PENDING</option>
                      <option>ACCEPTED</option>
                      <option>DELIVERING</option>
                      <option>DELIVERED</option>
                      <option>CANCELLED</option>
                    </select>
                  ) : (
                    <Badge type="status" value={o.order_status} />
                  )}
                </Td>

                <Td
                  onDoubleClick={() =>
                    setEditing({ orderId: o.id, field: "payment_status" })
                  }
                >
                  {editing?.orderId === o.id &&
                  editing?.field === "payment_status" ? (
                    <select
                      autoFocus
                      defaultValue={o.payment_status || "UNPAID"}
                      onBlur={(e) =>
                        commitChange(
                          o.id,
                          "payment_status",
                          e.target.value
                        )
                      }
                      style={select}
                    >
                      <option>UNPAID</option>
                      <option>PAID</option>
                    </select>
                  ) : (
                    <Badge
                      type="payment"
                      value={o.payment_status || "UNPAID"}
                    />
                  )}
                </Td>

                <Td>
                  <button style={whatsappBtn} disabled>
                    WA
                  </button>
                </Td>

                <Td>
                  <button
                    style={viewBtn}
                    onClick={() => navigate(`/admin/orders/${o.id}`)}
                  >
                    View
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

function Badge({ value, type }) {
  const colors =
    type === "payment"
      ? value === "PAID"
        ? ["#dcfce7", "#065f46"]
        : ["#fee2e2", "#991b1b"]
      : value === "DELIVERED"
      ? ["#dbeafe", "#1e3a8a"]
      : value === "CANCELLED"
      ? ["#fee2e2", "#991b1b"]
      : ["#fef9c3", "#854d0e"];

  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: colors[0],
        color: colors[1],
      }}
    >
      {value}
    </span>
  );
}

const card = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
};

const table = { width: "100%", borderCollapse: "collapse" };

const Th = ({ children }) => (
  <th style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>
    {children}
  </th>
);

const Td = ({ children }) => (
  <td style={{ padding: "14px 16px", fontSize: 14 }}>{children}</td>
);

const row = { borderBottom: "1px solid #f1f5f9" };

const viewBtn = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  background: "#fff",
};

const whatsappBtn = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #22c55e",
  background: "#ecfdf5",
  color: "#166534",
  fontSize: 12,
  cursor: "not-allowed",
};

const select = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
};
