import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function Policies() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Sustainability Policies | UBAS Fintrust"
        description="Environmental and social risk policies guiding our decisions."
        canonical="https://www.ubasfintrust.com/sustainability/policies"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="Sustainability"
        title="Sustainability Policies"
        subtitle="Environmental and social risk policies guiding our decisions."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-700">ESG policies guiding our products and operations.</p>
        </div>
      </section>
    </div>
  );
}
