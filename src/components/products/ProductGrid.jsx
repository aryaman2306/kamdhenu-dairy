import { useCart } from '../../context/CartContext';

const PRODUCTS = [
  {
    id: 'cow-milk',
    name: 'Cow Milk',
    price_per_unit: 60,
    unit: 'litre',
    image: '/images/products/cow-milk.jpg',
  },
  {
    id: 'buffalo-milk',
    name: 'Buffalo Milk',
    price_per_unit: 75,
    unit: 'litre',
    image: '/images/products/buffalo-milk.jpg',
  },
  {
    id: 'paneer',
    name: 'Paneer',
    price_per_unit: 380,
    unit: 'kg',
    image: '/images/products/paneer.jpg',
  },
];

export default function ProductGrid() {
  const { items, setItemQuantity } = useCart();

  function qty(id) {
    const it = items.find((i) => i.productId === id);
    return it ? it.quantity : 0;
  }

  return (
    <section
      id="products-section"
      style={{ padding: '80px 20px', background: '#fff' }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 40 }}>
        Our Products
      </h2>

      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
        }}
      >
        {PRODUCTS.map((p) => {
          const q = qty(p.id);

          return (
            <div
              key={p.id}
              style={{
                border: '1px solid #eee',
                borderRadius: 16,
                padding: 16,
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{
                  width: '100%',
                  height: 160,
                  objectFit: 'cover',
                  borderRadius: 12,
                }}
              />

              <h4>{p.name}</h4>
              <p>
                ₹{p.price_per_unit} / {p.unit}
              </p>

              {q === 0 ? (
                <button onClick={() => setItemQuantity(p, 1)}>
                  Add
                </button>
              ) : (
                <div>
                  <button onClick={() => setItemQuantity(p, q - 1)}>
                    −
                  </button>
                  <strong style={{ margin: '0 12px' }}>{q}</strong>
                  <button onClick={() => setItemQuantity(p, q + 1)}>
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
