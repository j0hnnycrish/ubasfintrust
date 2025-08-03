import { useState } from 'react';
import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  MapPin,
  Clock,
  Phone,
  Search,
  Navigation,
  Building,
  CreditCard,
  Banknote
} from 'lucide-react';

export default function Locations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const locations = [
    {
      id: '1',
      name: 'UBAS Financial Trust - Victoria Island',
      address: '1 Tiamiyu Savage Street, Victoria Island, Lagos',
      phone: '+234 1 234 5678',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 2:00 PM',
      services: ['Full Banking Services', 'Private Banking', 'Business Banking', 'ATM'],
      type: 'branch'
    },
    {
      id: '2',
      name: 'UBAS Financial Trust - Ikoyi',
      address: '23 Awolowo Road, Ikoyi, Lagos',
      phone: '+234 1 234 5679',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 2:00 PM',
      services: ['Full Banking Services', 'Wealth Management', 'ATM'],
      type: 'branch'
    },
    {
      id: '3',
      name: 'UBAS Financial Trust - Abuja',
      address: '45 Ademola Adetokunbo Crescent, Wuse II, Abuja',
      phone: '+234 9 234 5678',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 2:00 PM',
      services: ['Full Banking Services', 'Corporate Banking', 'ATM'],
      type: 'branch'
    },
    {
      id: '4',
      name: 'ATM - Shoprite Ikeja',
      address: 'Shoprite Mall, Obafemi Awolowo Way, Ikeja, Lagos',
      phone: 'N/A',
      hours: '24/7',
      services: ['ATM', 'Cash Deposit'],
      type: 'atm'
    },
    {
      id: '5',
      name: 'ATM - Palms Shopping Mall',
      address: 'The Palms Shopping Mall, Lekki, Lagos',
      phone: 'N/A',
      hours: '24/7',
      services: ['ATM', 'Cash Deposit'],
      type: 'atm'
    }
  ];

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-banking-dark to-banking-gold py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find UBAS Locations
            </h1>
            <p className="text-xl text-banking-light max-w-3xl mx-auto mb-8">
              Locate our branches and ATMs across Nigeria. We're here to serve you with convenient banking solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by location or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <Card key={location.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-banking-dark">
                        {location.name}
                      </CardTitle>
                      <div className="flex items-center mt-2">
                        {location.type === 'branch' ? (
                          <Building className="h-4 w-4 text-banking-gold mr-2" />
                        ) : (
                          <CreditCard className="h-4 w-4 text-banking-gold mr-2" />
                        )}
                        <span className="text-sm text-gray-600 capitalize">
                          {location.type === 'branch' ? 'Full Service Branch' : 'ATM Location'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{location.address}</span>
                  </div>
                  
                  {location.phone !== 'N/A' && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{location.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{location.hours}</span>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-banking-dark mb-2">Services Available:</h4>
                    <div className="flex flex-wrap gap-1">
                      {location.services.map((service, index) => (
                        <span
                          key={index}
                          className="inline-block bg-banking-gold/10 text-banking-dark text-xs px-2 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-banking-dark py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help Finding Us?
          </h2>
          <p className="text-xl text-banking-light mb-8">
            Our customer service team is ready to help you locate the nearest UBAS branch or ATM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-banking-gold hover:bg-banking-gold/90 text-banking-dark">
              <Phone className="h-5 w-5 mr-2" />
              Call Customer Service
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-banking-dark">
              Live Chat Support
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
