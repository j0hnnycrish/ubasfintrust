import { useState } from 'react';
import { ProfessionalNavigation } from '@/components/homepage/ProfessionalNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Filter,
  Users,
  TrendingUp,
  Globe,
  Award,
  Heart,
  Shield,
  GraduationCap,
  Building
} from 'lucide-react';

export default function Careers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const jobOpenings = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Technology',
      location: 'Lagos, Nigeria',
      type: 'Full-time',
      experience: '5+ years',
      salary: '₦8,000,000 - ₦12,000,000',
      description: 'Join our fintech team to build next-generation banking solutions.',
      requirements: ['React/Node.js', 'Cloud platforms', 'Banking domain knowledge'],
      posted: '2 days ago'
    },
    {
      id: '2',
      title: 'Investment Banking Analyst',
      department: 'Investment Banking',
      location: 'Abuja, Nigeria',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '₦6,000,000 - ₦9,000,000',
      description: 'Analyze investment opportunities and support client transactions.',
      requirements: ['Finance degree', 'Financial modeling', 'CFA preferred'],
      posted: '1 week ago'
    },
    {
      id: '3',
      title: 'Customer Experience Manager',
      department: 'Customer Service',
      location: 'Lagos, Nigeria',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₦4,500,000 - ₦6,500,000',
      description: 'Lead customer experience initiatives and service improvements.',
      requirements: ['Customer service experience', 'Team leadership', 'Process improvement'],
      posted: '3 days ago'
    },
    {
      id: '4',
      title: 'Risk Management Specialist',
      department: 'Risk Management',
      location: 'Lagos, Nigeria',
      type: 'Full-time',
      experience: '4-6 years',
      salary: '₦7,000,000 - ₦10,000,000',
      description: 'Assess and mitigate financial risks across banking operations.',
      requirements: ['Risk management certification', 'Banking experience', 'Analytical skills'],
      posted: '5 days ago'
    },
    {
      id: '5',
      title: 'Digital Marketing Specialist',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '₦3,500,000 - ₦5,500,000',
      description: 'Drive digital marketing campaigns and brand awareness.',
      requirements: ['Digital marketing experience', 'Social media expertise', 'Analytics tools'],
      posted: '1 week ago'
    },
    {
      id: '6',
      title: 'Compliance Officer',
      department: 'Compliance',
      location: 'Abuja, Nigeria',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₦5,000,000 - ₦7,500,000',
      description: 'Ensure regulatory compliance across all banking operations.',
      requirements: ['Law/Finance degree', 'Regulatory knowledge', 'Attention to detail'],
      posted: '4 days ago'
    }
  ];

  const departments = ['all', 'Technology', 'Investment Banking', 'Customer Service', 'Risk Management', 'Marketing', 'Compliance'];
  const locations = ['all', 'Lagos, Nigeria', 'Abuja, Nigeria', 'Remote'];

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, wellness programs, and mental health support'
    },
    {
      icon: GraduationCap,
      title: 'Learning & Development',
      description: 'Professional development programs, certifications, and continuous learning opportunities'
    },
    {
      icon: DollarSign,
      title: 'Competitive Compensation',
      description: 'Market-competitive salaries, performance bonuses, and equity participation'
    },
    {
      icon: Clock,
      title: 'Work-Life Balance',
      description: 'Flexible working hours, remote work options, and generous vacation policy'
    },
    {
      icon: Shield,
      title: 'Financial Security',
      description: 'Retirement savings plan, life insurance, and financial planning assistance'
    },
    {
      icon: Users,
      title: 'Inclusive Culture',
      description: 'Diverse and inclusive workplace with employee resource groups and mentorship'
    }
  ];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-banking-dark to-banking-gold py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join Our Team
            </h1>
            <p className="text-xl text-banking-light max-w-3xl mx-auto mb-8">
              Build your career with UBAS Financial Trust. We're looking for talented individuals who share our passion for excellence in banking and financial services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-banking-dark hover:bg-banking-light">
                <Briefcase className="h-5 w-5 mr-2" />
                View Open Positions
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-banking-dark">
                Learn About Our Culture
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Job Search & Filters */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search jobs by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-banking-gold focus:border-transparent"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-banking-gold focus:border-transparent"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-banking-dark mb-2">
              Open Positions ({filteredJobs.length})
            </h2>
            <p className="text-gray-600">
              Discover exciting career opportunities at UBAS Financial Trust
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold text-banking-dark">
                        {job.title}
                      </CardTitle>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {job.department}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">{job.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{job.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.experience}
                    </div>
                    <div className="flex items-center text-banking-gold font-semibold">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {job.salary}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-banking-dark mb-2">Key Requirements:</h4>
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-sm text-gray-500">Posted {job.posted}</span>
                    <Button className="bg-banking-gold hover:bg-banking-gold/90">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-banking-dark mb-4">
              Why Work With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive benefits and a supportive work environment that helps you thrive both professionally and personally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <benefit.icon className="h-12 w-12 text-banking-gold mx-auto mb-4" />
                  <h3 className="font-semibold text-banking-dark mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-banking-dark py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-banking-light mb-8">
            Join a team that's shaping the future of banking in Nigeria and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-banking-gold hover:bg-banking-gold/90 text-banking-dark">
              <Briefcase className="h-5 w-5 mr-2" />
              Browse All Jobs
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-banking-dark">
              Submit Your Resume
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
