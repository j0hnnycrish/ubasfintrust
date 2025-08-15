import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function News() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="News & Updates | UBAS Fintrust"
        description="Coverage, stories, and highlights from our newsroom."
        canonical="https://www.ubasfintrust.com/media/news"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="Media Center"
        title="News & Updates"
        subtitle="Coverage, stories, and highlights from our newsroom."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="grid md:grid-cols-2 gap-6">
            <li className="p-6 border rounded-lg hover:shadow">Industry recognition awards</li>
            <li className="p-6 border rounded-lg hover:shadow">New product launches</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
