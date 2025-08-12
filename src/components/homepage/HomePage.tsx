import { useNavigate } from 'react-router-dom';
import { ProfessionalNavigation } from './ProfessionalNavigation';
import { HeroSection } from './HeroSection';
import { ServicesSection } from './ServicesSection';
import { ProductsSection } from './ProductsSection';
import { Footer as UBAFooter } from './UBAFooter';

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
      <HeroSection onGetStarted={handleGetStarted} />
      <ServicesSection onSelectService={handleSelectService} />
      <ProductsSection />
      <UBAFooter />
    </div>
  );
}