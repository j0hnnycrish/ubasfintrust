import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function InvestorReports() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Investor Reports | UBAS Fintrust"
        description="Financial statements, MD&A, and performance summaries."
        canonical="https://www.ubasfintrust.com/investors/reports"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="Investor Relations"
        title="Annual & Quarterly Reports"
        subtitle="Download financial statements, MD&A, and performance summaries."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="space-y-3">
            <li className="p-4 border rounded">2025 Q2 Financial Results (PDF)</li>
            <li className="p-4 border rounded">2024 Annual Report (PDF)</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
