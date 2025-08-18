import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { Award } from 'lucide-react';

export default function Awards() {
  const awards = [
    {
      year: 2024,
      title: 'Best Digital Bank',
      org: 'Global Finance Magazine',
      description: 'Recognized for our AI-driven mobile experience, security, and 24/7 client service.'
    },
    {
      year: 2023,
      title: 'Excellence in Customer Service',
      org: 'Euromoney Awards',
      description: 'Top satisfaction scores and fastest response times across retail and private banking.'
    },
    {
      year: 2022,
      title: 'Innovator of the Year – Payments',
      org: 'FinTech Breakthrough',
      description: 'Launched real-time cross-border transfers with industry-leading reliability.'
    },
    {
      year: 2021,
      title: 'Sustainable Finance Leader',
      org: 'The Banker',
      description: 'Awarded for green financing initiatives and transparent ESG reporting.'
    },
    {
      year: 2020,
      title: 'Banking Security Award',
      org: 'Cyber Defense Magazine',
      description: 'Honored for proactive fraud prevention and zero-trust architecture roll-out.'
    }
  ];
  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
      <section className="bg-red-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Awards & Recognition</h1>
          <p className="text-red-100 text-lg">A record of independent recognition for innovation, service, sustainability, and security.</p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {awards.map((a) => (
            <div key={`${a.year}-${a.title}`} className="border border-red-200 rounded-lg p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-red-700">{a.title} <span className="text-gray-500 font-normal">({a.year})</span></h2>
                <p className="text-red-600/80">{a.org}</p>
                <p className="text-gray-700 mt-1">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

