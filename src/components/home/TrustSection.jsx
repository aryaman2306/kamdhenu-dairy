export default function TrustSection() {
  return (
    <section
      style={{
        padding: '96px 0',
        background: 'linear-gradient(to bottom, #fffaf3, #fdf6ec)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: 820,
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        <h2
          style={{
            fontSize: '2.2rem',
            marginBottom: 20,
          }}
        >
          Our Promise of Purity
        </h2>

        <p
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: 'var(--text-muted)',
            marginBottom: 28,
          }}
        >
          At Kamdhenu Dairy, purity is not a claim — it is a daily practice.
          From the care of our cows to the handling of every drop of milk,
          we follow time-honoured methods that respect nature and nourishment.
        </p>

        <p
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: 'var(--text-muted)',
          }}
        >
          We believe good food begins with responsibility — towards animals,
          towards families, and towards the traditions that have sustained us
          for generations.
        </p>
      </div>
    </section>
  );
}
