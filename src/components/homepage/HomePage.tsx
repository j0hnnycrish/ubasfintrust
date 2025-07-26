import { Navigation } from './Navigation';
import { ForexTicker } from './ForexTicker';
import { HeroSection } from './HeroSection';
import { ServicesSection } from './ServicesSection';
import { ProductsSection } from './ProductsSection';
import { Footer } from './Footer';

interface HomePageProps {
  onAccountLogin: (accountType: string) => void;
}

export function HomePage({ onAccountLogin }: HomePageProps) {
  const handleGetStarted = () => {
    // Default to personal banking for generic "get started" action
    onAccountLogin('personal');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation onAccountLogin={onAccountLogin} />
      <ForexTicker />
      <HeroSection onGetStarted={handleGetStarted} />
      <ServicesSection onSelectService={onAccountLogin} />
      <ProductsSection />
      <Footer />
    </div>
  );
}