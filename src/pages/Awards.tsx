import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { Award } from 'lucide-react';

export default function Awards() {
  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
      <section className="bg-red-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Awards & Recognition</h1>
          <p className="text-red-100 text-lg">Celebrating excellence with 15+ industry awards for innovation, service, and trust.</p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border border-red-200 rounded-lg p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-red-700">Industry Award {i + 1}</h2>
                <p className="text-red-600/80">Recognized for outstanding performance, customer experience, and innovation.</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

