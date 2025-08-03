import { useNavigate } from 'react-router-dom';
import { ProfessionalNavigation } from './ProfessionalNavigation';
import { ForexTicker } from './ForexTicker';
import { HeroSection } from './HeroSection';
import { ServicesSection } from './ServicesSection';
import { ProductsSection } from './ProductsSection';
import { Footer } from './Footer';

export function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to open account page for generic "get started" action
    navigate('/open-account');
  };

  const handleSelectService = (accountType: string) => {
    // Navigate to the specific banking section
    navigate(`/${accountType}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
      <ForexTicker />
      <HeroSection onGetStarted={handleGetStarted} />
      <ServicesSection onSelectService={handleSelectService} />
      <ProductsSection />
      <Footer />
    </div>
  );
}