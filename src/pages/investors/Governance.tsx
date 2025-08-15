import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function Governance() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Corporate Governance | UBAS Fintrust"
        description="Board charters, committee mandates, and governance policies."
        canonical="https://www.ubasfintrust.com/investors/governance"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="Investor Relations"
        title="Corporate Governance"
        subtitle="Board charters, committee mandates, and governance policies."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded">Board & Leadership</div>
            <div className="p-4 border rounded">Policies & Codes</div>
          </div>
        </div>
      </section>
    </div>
  );
}
