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

  function renderEditableCell(order, field, type = "text") {
    const isEditing =
      editing?.orderId === order.id &&
      editing?.field === field;

    if (isEditing) {
      if (type === "select-status") {
        return (
          <select
            autoFocus
            defaultValue={order[field]}
            onBlur={(e) =>
              commitChange(order.id, field, e.target.value)
            }
            style={select}
          >
            <option>PENDING</option>
            <option>ACCEPTED</option>
            <option>DELIVERING</option>
            <option>DELIVERED</option>
            <option>CANCELLED</option>
          </select>
        );
      }

      if (type === "select-payment") {
        return (
          <select
            autoFocus
            defaultValue={order[field] || "UNPAID"}
            onBlur={(e) =>
              commitChange(order.id, field, e.target.value)
            }
            style={select}
          >
            <option>UNPAID</option>
            <option>PAID</option>
          </select>
        );
      }

      return (
        <input
          autoFocus
          defaultValue={order[field]}
          onBlur={(e) =>
            commitChange(order.id, field, e.target.value)
          }
          style={input}
        />
      );
    }

    return (
      <span
        onDoubleClick={() =>
          setEditing({ orderId: order.id, field })
        }
        style={{ cursor: "pointer" }}
      >
        {order[field]}
      </span>
    );
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
            {orders.map((o) => {
              const isEditingRow =
                editing?.orderId === o.id;

              return (
                <tr
                  key={o.id}
                  style={{
                    ...row,
                    opacity:
                      savingRow === o.id || isEditingRow
                        ? 0.6
                        : 1,
                  }}
                >
                  <Td>
                    {new Date(o.created_at).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </Td>

                  <Td>
                    {renderEditableCell(
                      o,
                      "customer_name"
                    )}
                  </Td>

                  <Td>
                    {renderEditableCell(
                      o,
                      "customer_phone"
                    )}
                  </Td>

                  <Td>₹{o.total_amount}</Td>

                  <Td>
                    {renderEditableCell(
                      o,
                      "order_status",
                      "select-status"
                    )}
                  </Td>

                  <Td>
                    {renderEditableCell(
                      o,
                      "payment_status",
                      "select-payment"
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
                      onClick={() =>
                        navigate(`/admin/orders/${o.id}`)
                      }
                    >
                      View
                    </button>
                  </Td>
                </tr>
              );
            })}
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
  <td style={{ padding: "14px 16px", fontSize: 14 }}>
    {children}
  </td>
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

const input = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  width: "100%",
};
