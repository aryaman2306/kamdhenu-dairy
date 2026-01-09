export default function PartnershipSection() {
  return (
    <section
      style={{
        padding: '80px 0',
        background: '#fff',
        borderTop: '1px solid var(--border-soft)',
      }}
    >
      <div
        style={{
          maxWidth: 820,
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        <h3
          style={{
            fontSize: '1.8rem',
            marginBottom: 16,
          }}
        >
          Trusted Partnership
        </h3>

        <p
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: 'var(--text-muted)',
          }}
        >
          Kamdhenu Dairy operates in association with established dairy networks
          such as Mother Dairy, ensuring adherence to recognised quality
          standards, hygienic handling, and responsible distribution practices.
        </p>

        <p
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: 'var(--text-muted)',
            marginTop: 16,
          }}
        >
          This collaboration allows us to combine the reliability of a trusted
          institution with the care and accountability of a local dairy.
        </p>
      </div>
    </section>
  );
}
