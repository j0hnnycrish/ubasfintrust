import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function ShareholderServices() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Shareholder Services | UBAS Fintrust"
        description="Registrar details, dividends, and FAQs for shareholders."
        canonical="https://www.ubasfintrust.com/investors/shareholder"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="Investor Relations"
        title="Shareholder Services"
        subtitle="Registrar details, dividends, and FAQs for shareholders."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <div className="p-4 border rounded">Registrar Contact</div>
            <div className="p-4 border rounded">Dividends</div>
            <div className="p-4 border rounded">FAQs</div>
          </div>
        </div>
      </section>
    </div>
  );
}
