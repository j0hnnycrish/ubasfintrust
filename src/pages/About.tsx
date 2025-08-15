import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import BackgroundCarousel from '@/components/hero/BackgroundCarousel';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/navigation/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Award,
  Users,
  User,
  Globe,
  Shield,
  TrendingUp,
  Building,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Target,
  Heart
} from 'lucide-react';

export default function About() {
  const navigate = useNavigate();
  const milestones = [
    { year: '1995', title: 'Founded', description: 'UBAS Financial Trust established with a vision for global banking excellence' },
    { year: '2000', title: 'International Expansion', description: 'Opened first international offices in London and Singapore' },
    { year: '2010', title: 'Digital Innovation', description: 'Launched award-winning mobile banking platform' },
    { year: '2015', title: 'Global Recognition', description: 'Named "Bank of the Year" by Financial Times' },
    { year: '2020', title: 'Sustainable Banking', description: 'Committed to carbon-neutral operations by 2030' },
    { year: '2024', title: 'AI-Powered Banking', description: 'Leading the industry with AI-driven financial solutions' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your financial security is our top priority with bank-grade encryption and fraud protection.'
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Every decision we make is centered around delivering exceptional customer experiences.'
    },
    {
      icon: Globe,
      title: 'Global Excellence',
      description: 'Providing world-class banking services across 150+ countries with local expertise.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Continuously evolving our technology and services to meet changing financial needs.'
    },
    {
      icon: Heart,
      title: 'Community Impact',
      description: 'Supporting communities through financial inclusion and sustainable banking practices.'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'Maintaining the highest standards in everything we do, from service to compliance.'
    }
  ];

  const leadership = [
    {
      name: 'Sarah Johnson',
      position: 'Chief Executive Officer',
      experience: '25+ years in global banking',
      education: 'MBA Harvard Business School'
    },
    {
      name: 'Michael Chen',
      position: 'Chief Technology Officer',
      experience: '20+ years in fintech innovation',
      education: 'PhD Computer Science, Stanford'
    },
    {
      name: 'Elena Rodriguez',
      position: 'Chief Risk Officer',
      experience: '22+ years in risk management',
      education: 'CFA, MSc Finance, London School of Economics'
    },
    {
      name: 'David Thompson',
      position: 'Chief Operating Officer',
      experience: '18+ years in banking operations',
      education: 'MBA Wharton, CPA'
    }
  ];

  const stats = [
    { icon: Users, value: '2.5M+', label: 'Global Customers' },
    { icon: Globe, value: '30+', label: 'Countries Served' },
    { icon: Building, value: '500+', label: 'Branch Locations' },
    { icon: Award, value: '15+', label: 'Industry Awards' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
  <PageHeader title="About UBAS" subtitle="Back or return home anytime" />
      
      {/* Hero Section (below navbar) */}
      <section className="relative overflow-hidden">
        {/* Background carousel fills the hero section */}
        <div className="absolute inset-0">
          <BackgroundCarousel heightVh={50} />
        </div>
        
        {/* Foreground content overlay */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[50vh] flex items-center">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-6 py-2 text-yellow-400 mb-6">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">Trusted Since 1995</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow">
              About UBAS
              <span className="block text-yellow-400">Financial Trust</span>
            </h1>
            
            <p className="text-xl text-gray-100 max-w-3xl mx-auto mb-8">
              For nearly three decades, we've been pioneering the future of banking with innovative solutions, 
              unwavering security, and a commitment to global financial excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/open-account')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg font-semibold"
              >
                Join Our Family
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-900 px-8 py-3 text-lg">
                Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape our commitment to excellence in banking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones that have shaped UBAS Financial Trust into the global banking leader we are today.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-red-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="text-2xl font-bold text-red-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow-md"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the experienced professionals leading UBAS Financial Trust into the future.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-lg">{leader.name}</CardTitle>
                  <CardDescription className="text-red-600 font-medium">{leader.position}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>{leader.experience}</p>
                    <p>{leader.education}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

            {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-red-900 to-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Experience Banking Excellence?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join millions of customers who trust UBAS Financial Trust for their banking needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/open-account')}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold"
            >
              Open Account Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-900 px-8 py-3 text-lg">
              Contact Us
            </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
