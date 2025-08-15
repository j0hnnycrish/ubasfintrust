import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';

export default function Investors() {
  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Investor Relations</h1>
          <p className="text-gray-600 mb-8">Financial performance, governance, disclosures, and shareholder information.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <a href="/investors/reports" className="p-6 border rounded-lg hover:shadow">Annual & Quarterly Reports</a>
            <a href="/investors/governance" className="p-6 border rounded-lg hover:shadow">Corporate Governance</a>
            <a href="/investors/announcements" className="p-6 border rounded-lg hover:shadow">Market Announcements</a>
            <a href="/investors/shareholder" className="p-6 border rounded-lg hover:shadow">Shareholder Services</a>
          </div>
        </div>
      </section>
    </div>
  );
}
