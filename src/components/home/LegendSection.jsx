export default function LegendSection() {
  return (
    <section
      style={{
        padding: '120px 0',
        background: '#f7f3ec',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        <h2
          style={{
            fontSize: '2.4rem',
            marginBottom: 24,
            letterSpacing: '0.02em',
          }}
        >
          The Legend of Kamdhenu
        </h2>

        {/* Act 1 */}
        <div style={{ marginBottom: 80 }}>
          <img
            src="/images/samudra-manthan.jpg"
            alt="Samudra Manthan"
            style={{
              width: '100%',
              maxWidth: 520,
              margin: '0 auto 24px',
              display: 'block',
              filter: 'grayscale(100%) contrast(1.05)',
              opacity: 0.92,
            }}
          />
          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: 'var(--text-muted)',
            }}
          >
            From the great churning of the cosmic ocean — Samudra Manthan —
            emerged forces of chaos, creation, and divine balance.
          </p>
        </div>

        {/* Act 2 */}
        <div style={{ marginBottom: 80 }}>
          <img
            src="/images/kamdhenu-emergence.jpg"
            alt="Emergence of Kamdhenu"
            style={{
              width: '100%',
              maxWidth: 520,
              margin: '0 auto 24px',
              display: 'block',
              filter: 'grayscale(100%) contrast(1.05)',
              opacity: 0.92,
            }}
          />
          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: 'var(--text-muted)',
            }}
          >
            From this moment of cosmic balance arose Kamdhenu — the divine cow,
            symbol of nourishment, abundance, and selfless giving.
          </p>
        </div>

        {/* Act 3 */}
        <div>
          <img
            src="/images/kamdhenu-blessing.jpg"
            alt="Blessings of Kamdhenu"
            style={{
              width: '100%',
              maxWidth: 520,
              margin: '0 auto 24px',
              display: 'block',
              filter: 'grayscale(100%) contrast(1.05)',
              opacity: 0.92,
            }}
          />
          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: 'var(--text-muted)',
            }}
          >
            Kamdhenu’s blessings flow through care, sustenance, and purity —
            reminding us that true nourishment is both physical and spiritual.
          </p>
          <p
            style={{
                marginTop: 64,
                fontSize: '1rem',
                fontStyle: 'italic',
                color: 'var(--text-muted)',
            }}
            >
            Inspired by this timeless belief, Kamdhenu Dairy strives to honour
            nourishment not just as food — but as care, responsibility, and trust.
            </p>

        </div>
      </div>
    </section>
  );
}
