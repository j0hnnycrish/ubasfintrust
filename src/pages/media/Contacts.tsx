import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { SectionHero } from '@/components/corporate/SectionHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Seo } from '@/components/seo/Seo';

export default function MediaContacts() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Media Contacts | UBAS Fintrust"
        description="Reach our communications team for press inquiries."
        canonical="https://www.ubasfintrust.com/media/contacts"
      />
      <ProfessionalNavigation />
      <Breadcrumbs />
      <SectionHero
        kicker="Media Center"
        title="Media Contacts"
        subtitle="Reach our communications team for press inquiries."
      />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-700">Reach our communications team at media@ubasfintrust.com</p>
        </div>
      </section>
    </div>
  );
}
