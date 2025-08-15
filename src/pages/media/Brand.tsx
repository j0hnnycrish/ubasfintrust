import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function BrandAssets() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Brand Assets | UBAS Fintrust"
        description="Download UBAS Fintrust logos and brand usage guidelines."
        canonical="https://www.ubasfintrust.com/media/brand"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="Media Center"
        title="Brand Assets"
        subtitle="Download logos and usage guidelines for partners and press."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-700">Download logos and usage guidelines.</p>
        </div>
      </section>
    </div>
  );
}
