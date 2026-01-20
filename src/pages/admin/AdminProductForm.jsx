import { useState } from "react";
import { supabase } from "../../supabaseClient";

export default function AdminProductForm({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    price_per_unit: product.price_per_unit || "",
    unit: product.unit || "",
    image_url: product.image_url || "",
    is_active: product.is_active ?? true,
  });

  const isEdit = Boolean(product.id);

  async function save() {
    if (!form.name || !form.price_per_unit || !form.unit) {
      alert("Please fill required fields");
      return;
    }

    if (isEdit) {
      await supabase.from("products").update(form).eq("id", product.id);
    } else {
      await supabase.from("products").insert(form);
    }

    onSaved();
  }

  return (
    <Overlay>
      <div style={modal}>
        <h3>{isEdit ? "Edit Product" : "Add Product"}</h3>

        <Field label="Name" value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />

        <Field label="Description" textarea value={form.description}
          onChange={(v) => setForm({ ...form, description: v })}
        />

        <Field label="Price" type="number" value={form.price_per_unit}
          onChange={(v) => setForm({ ...form, price_per_unit: v })}
        />

        <Field label="Unit" value={form.unit}
          onChange={(v) => setForm({ ...form, unit: v })}
        />

        <Field label="Image URL" value={form.image_url}
          onChange={(v) => setForm({ ...form, image_url: v })}
        />

        <label style={{ marginTop: 12 }}>
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) =>
              setForm({ ...form, is_active: e.target.checked })
            }
          />{" "}
          Active
        </label>

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <button style={primaryBtn} onClick={save}>
            Save
          </button>
          <button style={secondaryBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ---------- UI ---------- */

function Overlay({ children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, value, onChange, textarea, type = "text" }) {
  const Input = textarea ? "textarea" : "input";
  return (
    <label style={field}>
      {label}
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

/* ---------- styles ---------- */

const modal = {
  background: "#fff",
  padding: 28,
  borderRadius: 16,
  width: "100%",
  maxWidth: 480,
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  marginTop: 12,
};

const primaryBtn = {
  padding: "10px 16px",
  background: "#0f172a",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "10px 16px",
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: 10,
  cursor: "pointer",
};
