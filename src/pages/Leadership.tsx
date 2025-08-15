import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import BackgroundCarousel from '@/components/hero/BackgroundCarousel';

export default function Leadership() {
  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
      {/* Hero below navbar with carousel background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <BackgroundCarousel heightVh={40} />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold mb-4">Leadership</h1>
          <p className="text-white/90 text-lg">Meet the team guiding UBAS Financial Trust with vision, integrity, and excellence.</p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {[
            { name: 'Sarah Johnson', role: 'Chief Executive Officer', img: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=320&q=60' },
            { name: 'Michael Chen', role: 'Chief Technology Officer', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=320&q=60' },
            { name: 'Elena Rodriguez', role: 'Chief Risk Officer', img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=320&q=60' },
            { name: 'David Thompson', role: 'Chief Operating Officer', img: 'https://images.unsplash.com/photo-1548946526-f69e2424cf45?auto=format&fit=crop&w=320&q=60' },
          ].map((p) => (
            <div key={p.name} className="border border-red-200 rounded-lg p-6 flex items-center gap-4">
              <img src={p.img} alt={p.name} className="w-20 h-20 rounded-full object-cover" loading="lazy" />
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

