import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function CSRReports() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="CSR Reports | UBAS Fintrust"
        description="Annual CSR reports and impact assessments."
        canonical="https://www.ubasfintrust.com/csr/reports"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="CSR"
        title="CSR Reports"
        subtitle="Annual CSR reports and impact assessments."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-700">Annual CSR reports and impact assessments.</p>
        </div>
      </section>
    </div>
  );
}
