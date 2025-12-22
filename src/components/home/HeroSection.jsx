export default function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      <img
        src="/images/hero-bg.jpg"
        alt="Kamdhenu Dairy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />

      {/* VERY SUBTLE vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, rgba(0,0,0,0.15), rgba(0,0,0,0.45))',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 720,
          padding: '0 24px',
          marginLeft: '6vw',
          color: '#fff',
        }}
      >
        <h1 style={{ fontSize: '3.2rem', marginBottom: 14 }}>
          Pure Goodness of Nature
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            lineHeight: 1.6,
            marginBottom: 28,
            maxWidth: 520,
            color: '#f5f5f5',
          }}
        >
          Fresh milk and dairy products rooted in tradition, purity, and care —
          inspired by Kamdhenu, the divine symbol of nourishment.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <button
            onClick={() =>
              document
                .getElementById('products-section')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            style={{
              background: '#c56a1a',
              color: '#fff',
              padding: '14px 22px',
              borderRadius: 10,
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Order Now
          </button>

<a href="tel:+919812345678">
  <button
    style={{
      background: 'rgba(227, 127, 26, 0.85)', // warm brown
      color: '#fff',
      padding: '14px 22px',
      borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.25)',
      fontWeight: 600,
      cursor: 'pointer',
      backdropFilter: 'blur(2px)',
    }}
  >
    Call Us
  </button>
</a>
        </div>
      </div>
    </section>
  );
}
