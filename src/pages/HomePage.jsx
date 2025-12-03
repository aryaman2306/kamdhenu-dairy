export default function HomePage() {
  return (
    <div>
      <header style={{ padding: '1.5rem', textAlign: 'center' }}>
        <h1>Kamdhenu Dairy 🐄</h1>
        <p>Fresh milk & dairy products from our family shop.</p>
      </header>

      <main style={{ padding: '1rem' }}>
        <section style={{ marginBottom: '2rem' }}>
          <h2>Welcome!</h2>
          <p>
            This will become our interactive Kamdhenu cow welcome section. For now, it&apos;s just a dummy.
          </p>
        </section>

        <section>
          <h2>Products (coming soon)</h2>
          <p>We&apos;ll show the live product list from Supabase here.</p>
        </section>
      </main>
    </div>
  );
}
