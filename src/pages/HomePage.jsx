import HeroSection from '../components/home/HeroSection';
import PageLayout from '../components/home/PageLayout';
import '../styles/theme.css';

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <PageLayout>
        {/* Placeholder for upcoming sections */}
        <section style={{ padding: '64px 0' }}>
          <h2>Rooted in Purity</h2>
          <p style={{ maxWidth: 600, color: 'var(--text-muted)' }}>
            Our dairy stands on timeless values — care for our cows, respect for
            nature, and commitment to delivering pure, fresh nourishment every
            day.
          </p>
        </section>

        {/* Products will come here on Day 13 */}
        <section id="products-section" />
      </PageLayout>
    </>
  );
}
