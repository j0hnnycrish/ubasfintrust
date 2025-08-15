import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function CSRPartnerships() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="CSR Partnerships | UBAS Fintrust"
        description="NGO and community partnerships enabling greater impact."
        canonical="https://www.ubasfintrust.com/csr/partnerships"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="CSR"
        title="CSR Partnerships"
        subtitle="NGO and community partnerships enabling greater impact."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-700">NGO and community partnerships enabling greater impact.</p>
        </div>
      </section>
    </div>
  );
}
