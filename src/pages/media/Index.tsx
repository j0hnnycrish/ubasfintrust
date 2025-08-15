import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';

export default function Media() {
  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Media Center</h1>
          <p className="text-gray-600 mb-8">Press releases, news, brand assets and media contacts.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <a href="/media/press" className="p-6 border rounded-lg hover:shadow">Press Releases</a>
            <a href="/media/news" className="p-6 border rounded-lg hover:shadow">News & Updates</a>
            <a href="/media/brand" className="p-6 border rounded-lg hover:shadow">Brand Assets</a>
            <a href="/media/contacts" className="p-6 border rounded-lg hover:shadow">Media Contacts</a>
          </div>
        </div>
      </section>
    </div>
  );
}
