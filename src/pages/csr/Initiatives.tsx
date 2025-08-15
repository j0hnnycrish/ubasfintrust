import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function CSRInitiatives() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="CSR Initiatives | UBAS Fintrust"
        description="Education, health, financial inclusion, and community programs."
        canonical="https://www.ubasfintrust.com/csr/initiatives"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="CSR"
        title="CSR Initiatives"
        subtitle="Education, health, financial inclusion, and community programs."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-700">Education, health, financial inclusion, and community programs.</p>
        </div>
      </section>
    </div>
  );
}
