import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function PressReleases() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Press Releases | UBAS Fintrust"
        description="Official announcements and statements from UBAS Fintrust."
        canonical="https://www.ubasfintrust.com/media/press"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="Media Center"
        title="Press Releases"
        subtitle="Official announcements and statements from UBAS Fintrust."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <article className="p-6 border rounded-lg hover:shadow">
              <h3 className="font-semibold">UBAS announces Q2 results</h3>
              <p className="text-sm text-gray-600 mt-1">Highlights and performance update for the quarter.</p>
            </article>
            <article className="p-6 border rounded-lg hover:shadow">
              <h3 className="font-semibold">New sustainability commitments</h3>
              <p className="text-sm text-gray-600 mt-1">Expanded ESG roadmap and targets for the next 3 years.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
