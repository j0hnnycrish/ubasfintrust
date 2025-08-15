import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function ESGStrategy() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="ESG Strategy | UBAS Fintrust"
        description="Our priorities, roadmap, and targets for sustainable finance."
        canonical="https://www.ubasfintrust.com/sustainability/strategy"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="Sustainability"
        title="ESG Strategy"
        subtitle="Our priorities, roadmap, and targets for sustainable finance."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-700">Sustainability goals aligned with global standards.</p>
        </div>
      </section>
    </div>
  );
}
