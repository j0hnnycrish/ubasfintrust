import { useState } from 'react';
import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Shield,
  CreditCard,
  Smartphone,
  Globe,
  FileText,
  Users
} from 'lucide-react';

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const contactMethods = [
    {
      icon: Phone,
      title: '24/7 Phone Support',
      description: 'Speak with our customer service representatives',
  contact: '+1 (800) 555-0199',
      availability: 'Available 24/7',
      color: 'bg-red-500'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help through our live chat',
      contact: 'Start Chat',
      availability: 'Mon-Sun: 6:00 AM - 12:00 AM',
      color: 'bg-green-500'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us your questions via email',
      contact: 'support@ubasfintrust.com',
      availability: 'Response within 24 hours',
      color: 'bg-purple-500'
    }
  ];

  const faqCategories = [
    {
      category: 'Account Management',
      icon: Users,
      faqs: [
        {
          id: '1',
          question: 'How do I open a new account?',
          answer: 'You can open a new account online through our website, visit any of our branches, or call our customer service. You\'ll need a valid ID, proof of address, and minimum opening deposit.'
        },
        {
          id: '2',
          question: 'How can I check my account balance?',
          answer: 'You can check your balance through our mobile app, online banking, ATMs, or by calling our automated phone system at +1 (800) 555-0199.'
        },
        {
          id: '3',
          question: 'What should I do if I forget my online banking password?',
          answer: 'Click on "Forgot Password" on the login page, enter your username or email, and follow the instructions sent to your registered email address.'
        }
      ]
    },
    {
      category: 'Cards & Payments',
      icon: CreditCard,
      faqs: [
        {
          id: '4',
          question: 'My card is lost or stolen. What should I do?',
          answer: 'Immediately call our 24/7 hotline at +1 (800) 555-0199 to block your card. You can also block it through our mobile app or online banking.'
        },
        {
          id: '5',
          question: 'How do I activate my new debit/credit card?',
          answer: 'You can activate your card by calling the activation number provided with your card, using our mobile app, or visiting any UBAS ATM.'
        },
        {
          id: '6',
          question: 'What are the daily transaction limits?',
          answer: 'Daily limits vary by account type and card type. Contact us to learn more or request an increase to your limits.'
        }
      ]
    },
    {
      category: 'Digital Banking',
      icon: Smartphone,
      faqs: [
        {
          id: '7',
          question: 'How do I download and set up the mobile app?',
          answer: 'Download the UBAS Mobile app from the Apple App Store or Google Play. Use your account number and phone number to register, then create a secure PIN.'
        },
        {
          id: '8',
          question: 'Is online banking secure?',
          answer: 'Yes, we use bank-grade encryption, multi-factor authentication, and continuous monitoring to protect your information and transactions.'
        },
        {
          id: '9',
          question: 'Can I transfer money to other banks?',
          answer: 'Yes, you can transfer to other banks instantly in supported regions using our online banking or mobile app. International transfers are also available.'
        }
      ]
    }
  ];

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
    // Reset form
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-banking-dark to-banking-gold py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Customer Support
            </h1>
            <p className="text-xl text-banking-light max-w-3xl mx-auto mb-8">
              We're here to help you with all your banking needs. Get support 24/7 through multiple channels.
            </p>
          </div>
        </div>
      </section>

      {/* Support Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="contact">Contact Us</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            {/* Contact Methods */}
            <TabsContent value="contact">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Methods */}
                <div>
                  <h2 className="text-2xl font-bold text-banking-dark mb-6">Get in Touch</h2>
                  <div className="space-y-4">
                    {contactMethods.map((method, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start">
                            <div className={`${method.color} p-3 rounded-lg mr-4`}>
                              <method.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-banking-dark mb-1">{method.title}</h3>
                              <p className="text-gray-600 mb-2">{method.description}</p>
                              <p className="font-medium text-banking-gold mb-1">{method.contact}</p>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {method.availability}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Send us a Message</CardTitle>
                      <CardDescription>
                        Fill out the form below and we'll get back to you within 24 hours.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                          <Input
                            placeholder="Your Name"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Input
                            type="email"
                            placeholder="Your Email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Subject"
                            value={contactForm.subject}
                            onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Textarea
                            placeholder="Your Message"
                            rows={5}
                            value={contactForm.message}
                            onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full bg-banking-gold hover:bg-banking-gold/90">
                          Send Message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* FAQ Section */}
            <TabsContent value="faq">
              <div className="space-y-6">
                {/* Search */}
                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Search frequently asked questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full"
                    />
                  </div>
                </div>

                {/* FAQ Categories */}
                <div className="space-y-6">
                  {filteredFaqs.map((category, categoryIndex) => (
                    <Card key={categoryIndex}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <category.icon className="h-6 w-6 mr-2 text-banking-gold" />
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {category.faqs.map((faq) => (
                            <div key={faq.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                              <button
                                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                className="flex items-center justify-between w-full text-left"
                              >
                                <span className="font-medium text-banking-dark">{faq.question}</span>
                                {expandedFaq === faq.id ? (
                                  <ChevronUp className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                              {expandedFaq === faq.id && (
                                <div className="mt-3 text-gray-600">
                                  {faq.answer}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Resources */}
            <TabsContent value="resources">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: FileText,
                    title: 'User Guides',
                    description: 'Step-by-step guides for all banking services',
                    link: '#'
                  },
                  {
                    icon: Shield,
                    title: 'Security Center',
                    description: 'Learn about our security measures and tips',
                    link: '#'
                  },
                  {
                    icon: Smartphone,
                    title: 'Mobile App Help',
                    description: 'Get help with our mobile banking app',
                    link: '#'
                  },
                  {
                    icon: Globe,
                    title: 'Online Banking Guide',
                    description: 'Master our online banking platform',
                    link: '#'
                  },
                  {
                    icon: CreditCard,
                    title: 'Card Services',
                    description: 'Everything about debit and credit cards',
                    link: '#'
                  },
                  {
                    icon: HelpCircle,
                    title: 'Video Tutorials',
                    description: 'Watch step-by-step video guides',
                    link: '#'
                  }
                ].map((resource, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <resource.icon className="h-12 w-12 text-banking-gold mx-auto mb-4" />
                      <h3 className="font-semibold text-banking-dark mb-2">{resource.title}</h3>
                      <p className="text-gray-600 mb-4">{resource.description}</p>
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
