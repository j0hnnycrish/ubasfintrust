import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Seo } from '@/components/seo/Seo';

export default function CSR() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Corporate Social Responsibility | UBAS Fintrust"
        description="Our impact initiatives across education, health, inclusion, and community development."
        canonical="https://www.ubasfintrust.com/csr"
        ogImage="https://www.ubasfintrust.com/placeholder.svg"
        ogSiteName="UBAS Financial Trust"
        twitterSite="@UBASFintrust"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Corporate Social Responsibility',
          url: 'https://www.ubasfintrust.com/csr',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ubasfintrust.com/' },
              { '@type': 'ListItem', position: 2, name: 'CSR', item: 'https://www.ubasfintrust.com/csr' },
            ],
          },
        }}
      />
      <ProfessionalNavigation />
      <SectionHero
        kicker="Corporate Social Responsibility"
        title="Inclusive growth. Real community impact."
        subtitle="Our commitments across education, health, financial inclusion, and sustainable development."
        cta={{ label: 'See Our Initiatives', href: '/csr/initiatives' }}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="/csr/initiatives" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">Initiatives</h3>
              <p className="text-sm text-gray-600 mt-2">Education, health, financial literacy, and community programs.</p>
            </a>
            <a href="/csr/reports" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">Reports</h3>
              <p className="text-sm text-gray-600 mt-2">Impact reports and performance against our CSR commitments.</p>
            </a>
            <a href="/csr/partnerships" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">Partnerships</h3>
              <p className="text-sm text-gray-600 mt-2">Collaborations with NGOs, communities, and institutions.</p>
            </a>
            <a href="/csr/volunteering" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">Volunteering</h3>
              <p className="text-sm text-gray-600 mt-2">Employee volunteering and ways to get involved.</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
