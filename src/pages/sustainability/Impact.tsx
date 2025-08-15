import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function Impact() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Impact Highlights | UBAS Fintrust"
        description="Outcomes and case studies from our sustainability initiatives."
        canonical="https://www.ubasfintrust.com/sustainability/impact"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="Sustainability"
        title="Impact Highlights"
        subtitle="Outcomes and case studies from our sustainability initiatives."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-700">Key metrics and stories from our sustainability work.</p>
        </div>
      </section>
    </div>
  );
}
