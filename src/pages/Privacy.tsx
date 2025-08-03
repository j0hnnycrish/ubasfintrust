import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, Lock, Users, Globe, AlertTriangle } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600">
              Last updated: January 1, 2025
            </p>
          </div>
        </div>

        {/* Privacy Commitment */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Lock className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-green-800 mb-2">Our Privacy Commitment</h3>
                <p className="text-green-700 text-sm">
                  At UBAS Financial Trust, protecting your privacy and personal information is fundamental to everything we do. 
                  This policy explains how we collect, use, and safeguard your information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-6 w-6 text-blue-600 mr-3" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We collect information to provide you with excellent banking services and to comply with legal requirements. 
                The types of information we collect include:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Name, address, phone number, email address</li>
                    <li>Date of birth and Social Security number</li>
                    <li>Employment information and income details</li>
                    <li>Government-issued identification documents</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Financial Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Account balances and transaction history</li>
                    <li>Credit history and credit scores</li>
                    <li>Investment preferences and risk tolerance</li>
                    <li>Payment and transfer information</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Technical Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Device information and IP addresses</li>
                    <li>Browser type and operating system</li>
                    <li>Login times and usage patterns</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We use your information for legitimate business purposes, including:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Service Delivery</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>Processing transactions and maintaining accounts</li>
                    <li>Providing customer support</li>
                    <li>Sending account statements and notifications</li>
                    <li>Offering personalized financial products</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Security & Compliance</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>Preventing fraud and unauthorized access</li>
                    <li>Complying with legal and regulatory requirements</li>
                    <li>Conducting risk assessments</li>
                    <li>Monitoring for suspicious activities</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Business Operations</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>Improving our services and technology</li>
                    <li>Conducting market research</li>
                    <li>Training our staff</li>
                    <li>Managing business relationships</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Communication</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>Sending important account updates</li>
                    <li>Marketing relevant financial products</li>
                    <li>Responding to your inquiries</li>
                    <li>Providing educational content</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-6 w-6 text-blue-600 mr-3" />
                Information Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">With Your Consent</h4>
                  <p className="text-gray-700 text-sm">
                    We will share your information when you explicitly authorize us to do so, such as when you request 
                    us to share information with third-party financial advisors or accountants.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Service Providers</h4>
                  <p className="text-gray-700 text-sm">
                    We work with trusted third-party service providers who help us deliver our services, such as 
                    payment processors, technology vendors, and customer support providers. These partners are 
                    contractually required to protect your information.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                  <p className="text-gray-700 text-sm">
                    We may disclose your information when required by law, regulation, legal process, or government request, 
                    including to prevent fraud, protect our rights, or ensure the safety of our customers and employees.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Business Transfers</h4>
                  <p className="text-gray-700 text-sm">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                    as part of the transaction, subject to the same privacy protections.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-6 w-6 text-blue-600 mr-3" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We implement comprehensive security measures to protect your information:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Technical Safeguards</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>256-bit SSL encryption for data transmission</li>
                    <li>Advanced firewall protection</li>
                    <li>Multi-factor authentication</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Encrypted data storage</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Operational Safeguards</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>Employee background checks and training</li>
                    <li>Access controls and monitoring</li>
                    <li>Incident response procedures</li>
                    <li>Regular security awareness training</li>
                    <li>Vendor security assessments</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-blue-800 text-sm">
                  <strong>Important:</strong> While we implement robust security measures, no system is 100% secure. 
                  We encourage you to protect your account by using strong passwords, enabling two-factor authentication, 
                  and monitoring your accounts regularly.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-6 w-6 text-blue-600 mr-3" />
                Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                You have several rights regarding your personal information:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Access and Portability</h4>
                    <p className="text-gray-700 text-sm">Request a copy of the personal information we have about you.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Correction</h4>
                    <p className="text-gray-700 text-sm">Request correction of inaccurate or incomplete information.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Deletion</h4>
                    <p className="text-gray-700 text-sm">Request deletion of your personal information, subject to legal and regulatory requirements.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-xs font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Opt-out</h4>
                    <p className="text-gray-700 text-sm">Opt out of marketing communications and certain data processing activities.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-gray-700 text-sm">
                  To exercise these rights, contact us at <strong>privacy@ubasfintrust.com</strong> or call 
                  <strong> +1-800-UBAS-FIN</strong>. We will respond to your request within 30 days.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-blue-600 mr-3" />
                Cookies and Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We use cookies and similar technologies to enhance your experience and provide our services:
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Essential Cookies</h4>
                  <p className="text-gray-700 text-sm">Required for basic website functionality and security.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Performance Cookies</h4>
                  <p className="text-gray-700 text-sm">Help us understand how you use our website to improve performance.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Functional Cookies</h4>
                  <p className="text-gray-700 text-sm">Remember your preferences and provide personalized features.</p>
                </div>
              </div>

              <p className="text-gray-700 text-sm">
                You can manage cookie preferences through your browser settings, but disabling certain cookies may affect website functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-6 w-6 text-blue-600 mr-3" />
                International Transfers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                As a global financial institution, we may transfer your information internationally. We ensure appropriate 
                safeguards are in place, including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Adequacy decisions by relevant authorities</li>
                <li>Standard contractual clauses</li>
                <li>Binding corporate rules</li>
                <li>Certification schemes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                If you have questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-gray-700"><strong>Privacy Officer:</strong> privacy@ubasfintrust.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +1-800-UBAS-FIN (8227-346)</p>
                <p className="text-gray-700"><strong>Mail:</strong> Privacy Officer, UBAS Financial Trust, 123 Wall Street, NY 10005</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold text-green-900">Your Privacy Matters</h3>
              </div>
              <p className="text-green-700 text-sm">
                We are committed to protecting your privacy and maintaining the confidentiality of your personal information. 
                This policy may be updated periodically, and we will notify you of any material changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
