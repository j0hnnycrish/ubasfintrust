import React, { useState } from 'react';
import api from '@/lib/api';
import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Building,
  HeadphonesIcon,
  MessageCircle,
  Globe,
  Shield,
  AlertCircle
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const contactMethods = [
    {
      icon: Phone,
      title: '24/7 Phone Support',
      description: 'Speak with our banking specialists',
      contact: '+1-800-UBAS-FIN',
      availability: 'Available 24/7'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get detailed assistance via email',
      contact: 'support@ubasfi.com',
      availability: 'Response within 2 hours'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Instant support through our website',
      contact: 'Available on all pages',
      availability: 'Available 24/7'
    },
    {
      icon: Building,
      title: 'Branch Locations',
      description: 'Visit us at any of our 500+ branches',
      contact: 'Find nearest branch',
      availability: 'Mon-Fri 9AM-5PM'
    }
  ];

  const offices = [
    {
      city: 'New York',
      address: '123 Wall Street, New York, NY 10005',
      phone: '+1 (212) 555-0123',
      type: 'Global Headquarters'
    },
    {
      city: 'London',
      address: '45 Canary Wharf, London E14 5AB, UK',
      phone: '+44 20 7946 0958',
      type: 'European Operations'
    },
    {
      city: 'Singapore',
      address: '1 Marina Bay, Singapore 018989',
      phone: '+65 6123 4567',
      type: 'Asia Pacific Hub'
    },
    {
      city: 'Dubai',
      address: 'DIFC, Dubai, UAE',
      phone: '+971 4 123 4567',
      type: 'Middle East Operations'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const resp = await api.post('/support/contact', formData);
      if (resp.data?.success) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          category: '',
          message: ''
        });
      } else {
        setError('Failed to send message. Please try again later.');
      }
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-700 via-red-800 to-red-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-red-100 max-w-3xl mx-auto">
            We're here to help with all your banking needs. Reach out to our expert team
            for personalized assistance and support.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600">Choose the method that works best for you</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-red-600" />
                  </div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-red-600 mb-2">{method.contact}</p>
                    <p className="text-sm text-gray-500">{method.availability}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Locations */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <Alert className="mb-6">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Thank you for your message! We'll get back to you within 24 hours.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => handleInputChange('category', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="account">Account Support</SelectItem>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="complaint">Complaint</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Brief subject of your message"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <textarea
                      id="message"
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Please describe your inquiry in detail..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Sending Message...'
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Office Locations */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Global Offices</h2>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{office.city}</CardTitle>
                          <CardDescription className="text-red-600 font-medium">{office.type}</CardDescription>
                        </div>
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-gray-600">{office.address}</p>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{office.phone}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Emergency Contact */}
              <Card className="mt-6 border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Emergency Banking Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700 mb-2">For urgent banking issues outside business hours:</p>
                  <p className="font-semibold text-red-800">+1-800-UBAS-911</p>
                  <p className="text-sm text-red-600">Available 24/7 for account security and fraud reporting</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
