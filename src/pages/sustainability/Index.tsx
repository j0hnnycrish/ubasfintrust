import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';

export default function Sustainability() {
  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sustainability</h1>
          <p className="text-gray-600 mb-8">Our ESG strategy, policies, targets and progress toward sustainable banking.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <a href="/sustainability/strategy" className="p-6 border rounded-lg hover:shadow">ESG Strategy</a>
            <a href="/sustainability/policies" className="p-6 border rounded-lg hover:shadow">Policies</a>
            <a href="/sustainability/reports" className="p-6 border rounded-lg hover:shadow">Reports & Disclosures</a>
            <a href="/sustainability/impact" className="p-6 border rounded-lg hover:shadow">Impact Highlights</a>
          </div>
        </div>
      </section>
    </div>
  );
}
