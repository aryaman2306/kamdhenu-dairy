import QuantityControl from './QuantityControl';

export default function ProductCard({ product, quantity, onAdd, onRemove }) {
  return (
    <div
      style={{
        border: '1px solid var(--border-soft)',
        borderRadius: 16,
        padding: 16,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: '100%',
          height: 160,
          objectFit: 'cover',
          borderRadius: 12,
        }}
      />

      <div>
        <h4 style={{ margin: 0 }}>{product.name}</h4>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
          {product.description}
        </p>
      </div>

      <div style={{ fontWeight: 700 }}>
        ₹{product.price} / {product.unit}
      </div>

      <QuantityControl
        quantity={quantity}
        onAdd={onAdd}
        onRemove={onRemove}
      />
    </div>
  );
}
