import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';

export default function Leadership() {
  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
      <section className="bg-red-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Leadership</h1>
          <p className="text-red-100 text-lg">Meet the team guiding UBAS Financial Trust with vision, integrity, and excellence.</p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-700">Executive {i}</h2>
              <p className="text-red-600/80">Brief bio and responsibilities. Demonstrating our commitment to responsible banking and customer-first service.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

