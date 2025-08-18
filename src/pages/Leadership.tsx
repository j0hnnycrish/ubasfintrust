import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import BackgroundCarousel from '@/components/hero/BackgroundCarousel';
import PageHeader from '@/components/navigation/PageHeader';

export default function Leadership() {
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
  <PageHeader title="Leadership" subtitle="Meet our executive team" />
      {/* Hero below navbar with carousel background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <BackgroundCarousel heightVh={40} />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[40vh] flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4 text-white drop-shadow">Leadership</h1>
          <p className="text-white/90 text-lg max-w-3xl">Meet the team guiding UBAS Financial Trust with vision, integrity, and excellence.</p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {[
            { name: 'Sarah Johnson', role: 'Chief Executive Officer' },
            { name: 'Michael Chen', role: 'Chief Technology Officer' },
            { name: 'Elena Rodriguez', role: 'Chief Risk Officer' },
            { name: 'David Thompson', role: 'Chief Operating Officer' },
          ].map((p) => (
            <div key={p.name} className="border border-red-200 rounded-lg p-6 flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xl font-semibold">
                {getInitials(p.name)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-red-700">{p.name}</h2>
                <p className="text-red-600/80">{p.role}</p>
                <p className="text-gray-600 text-sm">Brief bio and responsibilities. Demonstrating our commitment to responsible banking and customer-first service.</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

