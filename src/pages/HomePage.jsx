import HeroSection from '../components/home/HeroSection';
import TrustSection from '../components/home/TrustSection';
import PartnershipSection from '../components/home/PartnershipSection';
import LegendSection from '../components/home/LegendSection';
import ProductGrid from '../components/products/ProductGrid';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <PartnershipSection />
      <LegendSection />
      <ProductGrid />
    </>
  );
}
