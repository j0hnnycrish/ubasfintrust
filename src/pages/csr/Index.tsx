import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';

export default function CSR() {
  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Corporate Social Responsibility</h1>
          <p className="text-gray-600 mb-8">Our impact initiatives across education, health, inclusion, and community development.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <a href="/csr/initiatives" className="p-6 border rounded-lg hover:shadow">Initiatives</a>
            <a href="/csr/reports" className="p-6 border rounded-lg hover:shadow">Reports</a>
            <a href="/csr/partnerships" className="p-6 border rounded-lg hover:shadow">Partnerships</a>
            <a href="/csr/volunteering" className="p-6 border rounded-lg hover:shadow">Volunteering</a>
          </div>
        </div>
      </section>
    </div>
  );
}
