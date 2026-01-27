import HeroSection from '../components/home/HeroSection';
import TrustSection from '../components/home/TrustSection';
import PartnershipSection from '../components/home/PartnershipSection';
import LegendSection from '../components/home/LegendSection';
import ProductGrid from '../components/products/ProductGrid';
import SectionDivider from '../components/home/SectionDivider';
import SacredWisdom from '../components/home/SacredWisdom';
import OurProductsSection from '../components/home/OurProductsSection';
import Footer from "../components/layout/Footer";


export default function HomePage() {
  return (
    <div className="pt-20 md:pt-24">
      <HeroSection />
      <OurProductsSection/>
      <PartnershipSection />
      <TrustSection />
      <SacredWisdom/>
      <Footer />

    </div>
  );
}
