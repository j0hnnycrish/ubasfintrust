import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function InvestorAnnouncements() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Market Announcements | UBAS Fintrust"
        description="Regulatory announcements and market updates."
        canonical="https://www.ubasfintrust.com/investors/announcements"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="Investor Relations"
        title="Market Announcements"
        subtitle="Regulatory announcements and market updates."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="space-y-3">
            <li className="p-4 border rounded">Share buyback program update</li>
            <li className="p-4 border rounded">Dividend declaration</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
