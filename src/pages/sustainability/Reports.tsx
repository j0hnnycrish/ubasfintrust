import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function SustainabilityReports() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Sustainability Reports & Disclosures | UBAS Fintrust"
        description="Annual sustainability reports and key disclosures."
        canonical="https://www.ubasfintrust.com/sustainability/reports"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="Sustainability"
        title="Sustainability Reports & Disclosures"
        subtitle="Annual sustainability reports and key disclosures."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-700">ESG disclosures and impact reports.</p>
        </div>
      </section>
    </div>
  );
}
