export default function QuantityControl({ quantity, onAdd, onRemove }) {
  if (quantity === 0) {
    return (
      <button
        onClick={onAdd}
        style={{
          padding: '10px 14px',
          borderRadius: 10,
          border: '1px solid var(--border-soft)',
          background: '#fef7ed',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Add
      </button>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <button onClick={onRemove}>−</button>
      <strong>{quantity}</strong>
      <button onClick={onAdd}>+</button>
    </div>
  );
}
