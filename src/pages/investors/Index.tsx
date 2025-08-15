import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';

export default function Investors() {
  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
      <SectionHero
        kicker="Investor Relations"
        title="Transparent performance. Strong governance. Sustainable growth."
        subtitle="Access our latest financial reports, governance documents, market announcements, and shareholder services."
        cta={{ label: 'View Latest Reports', href: '/investors/reports' }}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="/investors/reports" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">Annual & Quarterly Reports</h3>
              <p className="text-sm text-gray-600 mt-2">Financial statements, investor presentations, and disclosures.</p>
            </a>
            <a href="/investors/governance" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">Corporate Governance</h3>
              <p className="text-sm text-gray-600 mt-2">Board charters, committee mandates, and governance policies.</p>
            </a>
            <a href="/investors/announcements" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">Market Announcements</h3>
              <p className="text-sm text-gray-600 mt-2">Regulatory announcements and market updates.</p>
            </a>
            <a href="/investors/shareholder" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">Shareholder Services</h3>
              <p className="text-sm text-gray-600 mt-2">Registrar details, dividends, and FAQs for shareholders.</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
