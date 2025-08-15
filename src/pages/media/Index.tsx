import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Seo } from '@/components/seo/Seo';

export default function Media() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Media Center | UBAS Fintrust"
        description="Press releases, news, brand assets, and media contacts."
        canonical="https://www.ubasfintrust.com/media"
        ogImage="https://www.ubasfintrust.com/placeholder.svg"
        ogSiteName="UBAS Financial Trust"
        twitterSite="@UBASFintrust"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Media Center',
          url: 'https://www.ubasfintrust.com/media',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ubasfintrust.com/' },
              { '@type': 'ListItem', position: 2, name: 'Media', item: 'https://www.ubasfintrust.com/media' },
            ],
          },
        }}
      />
      <ProfessionalNavigation />
      <SectionHero
        kicker="Media Center"
        title="News, press materials, and brand resources."
        subtitle="Find our latest press releases, newsroom updates, brand guidelines, and media contact information."
        cta={{ label: 'Explore Press Releases', href: '/media/press' }}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="/media/press" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">Press Releases</h3>
              <p className="text-sm text-gray-600 mt-2">Official announcements and statements from UBAS Fintrust.</p>
            </a>
            <a href="/media/news" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">News & Updates</h3>
              <p className="text-sm text-gray-600 mt-2">Coverage, stories, and highlights from our newsroom.</p>
            </a>
            <a href="/media/brand" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">Brand Assets</h3>
              <p className="text-sm text-gray-600 mt-2">Logos, colors, and usage guidelines for partners and press.</p>
            </a>
            <a href="/media/contacts" className="p-6 border rounded-lg hover:shadow group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-700">Media Contacts</h3>
              <p className="text-sm text-gray-600 mt-2">Reach our communications team for press inquiries.</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
