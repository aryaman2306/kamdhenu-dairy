import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext";
import "../styles/catalog.css";

export default function CatalogPage() {
  const [productsBySlug, setProductsBySlug] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        unit,
        price_per_unit,
        categories:categories!inner ( slug )
      `)
      .eq("is_active", true);

    if (error) {
      console.error(error);
      return;
    }

    const grouped = {};
    data.forEach((item) => {
      const slug = item.categories?.slug;
      if (!slug) return;
      if (!grouped[slug]) grouped[slug] = [];
      grouped[slug].push(item);
    });

    setProductsBySlug(grouped);
  }

  const milkRange = [
    ...(productsBySlug["md-milk"] || []),
    ...(productsBySlug["fresh-milk"] || []),
  ];

  const dairyEssentials = [
    ...(productsBySlug["md-curd"] || []),
    ...(productsBySlug["fresh-curd"] || []),
    ...(productsBySlug["md-other"] || []),
    ...(productsBySlug["fresh-other"] || []),
  ];

  const iceCreamRange = productsBySlug["md-icecream"] || [];

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <h1>Our Products</h1>
        <p>Pure dairy, thoughtfully curated for everyday living.</p>
      </section>

      <CatalogSection
        title="Milk Range"
        subtitle="Fresh Kamdhenu milk and trusted Mother Dairy packs"
        products={milkRange}
        addToCart={addToCart}
      />

      <CatalogSection
        title="Dairy Essentials"
        subtitle="Paneer, curd and everyday dairy staples"
        products={dairyEssentials}
        addToCart={addToCart}
      />

      <CatalogSection
        title="Mother Dairy Ice Cream"
        subtitle="Indulgent flavours made with trusted dairy"
        products={iceCreamRange}
        addToCart={addToCart}
      />

      <section className="catalog-section coming-soon-section">
        <h2>Pooja Materials</h2>
        <p className="coming-soon-text">
          Sacred offerings will be available soon.
        </p>
      </section>
    </main>
  );
}

function CatalogSection({ title, subtitle, products, addToCart }) {
  return (
    <section className="catalog-section">
      <h2>{title}</h2>
      <p className="section-subtitle">{subtitle}</p>

      <div className="product-grid">
        {products.map((item) => (
          <div className="product-card compact" key={item.id}>
            <div className="product-info">
              <h3>{item.name}</h3>
              <p className="unit">{item.unit}</p>
              <span className="price">₹{item.price_per_unit}</span>
              <button onClick={() => addToCart(item)}>
                Add to Cart
              </button>
            </div>

            <div className="product-thumb-slot" />
          </div>
        ))}
      </div>
    </section>
  );
}
