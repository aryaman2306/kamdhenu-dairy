import HeroSection from '../components/home/HeroSection';
import TrustSection from '../components/home/TrustSection';
import PartnershipSection from '../components/home/PartnershipSection';
import PageLayout from '../components/home/PageLayout';
import LegendSection from '../components/home/LegendSection';

import '../styles/theme.css';

export default function HomePage() {
  return (
    <>
      {/* HERO MUST BE FIRST */}
      <HeroSection />

      <TrustSection />

      <PartnershipSection />
      
      <LegendSection />

      <PageLayout>
        <section id="products-section" />
      </PageLayout>
    </>
  );
}
