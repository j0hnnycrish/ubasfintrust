import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Seo } from '@/components/seo/Seo';

export default function Sustainability() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Sustainability | UBAS Fintrust"
        description="Our ESG strategy, policies, targets and progress toward sustainable banking."
        canonical="https://www.ubasfintrust.com/sustainability"
        ogImage="https://www.ubasfintrust.com/placeholder.svg"
        ogSiteName="UBAS Financial Trust"
        twitterSite="@UBASFintrust"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Sustainability',
          url: 'https://www.ubasfintrust.com/sustainability',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ubasfintrust.com/' },
              { '@type': 'ListItem', position: 2, name: 'Sustainability', item: 'https://www.ubasfintrust.com/sustainability' },
            ],
          },
        }}
      />
      <ProfessionalNavigation />
      <SectionHero
        kicker="Sustainability"
        title="Banking aligned with long-term environmental and social value."
        subtitle="Explore our ESG strategy, governance, policies, targets, and progress across our sustainability pillars."
        cta={{ label: 'Read ESG Strategy', href: '/sustainability/strategy' }}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="/sustainability/strategy" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">ESG Strategy</h3>
              <p className="text-sm text-gray-600 mt-2">Our priorities, roadmap, and targets for sustainable finance.</p>
            </a>
            <a href="/sustainability/policies" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">Policies</h3>
              <p className="text-sm text-gray-600 mt-2">Environmental and social risk policies guiding our decisions.</p>
            </a>
            <a href="/sustainability/reports" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">Reports & Disclosures</h3>
              <p className="text-sm text-gray-600 mt-2">Annual sustainability reports and key disclosures.</p>
            </a>
            <a href="/sustainability/impact" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">Impact Highlights</h3>
              <p className="text-sm text-gray-600 mt-2">Outcomes and case studies from our sustainability initiatives.</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
