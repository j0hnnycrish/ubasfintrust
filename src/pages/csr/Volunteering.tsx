import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function CSRVolunteering() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Volunteering | UBAS Fintrust"
        description="Employee volunteering programs and opportunities."
        canonical="https://www.ubasfintrust.com/csr/volunteering"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="CSR"
        title="Volunteering"
        subtitle="Employee volunteering programs and opportunities."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-700">Employee volunteering programs and opportunities.</p>
        </div>
      </section>
    </div>
  );
}
