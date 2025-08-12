import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, AlertTriangle } from 'lucide-react';

export default function Terms() {
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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-600">
              Last updated: January 1, 2025
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                <p className="text-yellow-700 text-sm">
                  Please read these Terms of Service carefully before using UBAS Financial Trust services. 
                  By accessing or using our services, you agree to be bound by these terms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm mr-3">1</span>
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                By accessing and using UBAS Financial Trust services, you accept and agree to be bound by the terms and provision of this agreement. 
                These Terms of Service apply to all users of the service, including without limitation users who are browsers, vendors, customers, 
                merchants, and/or contributors of content.
              </p>
              <p className="text-gray-700">
                If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm mr-3">2</span>
                Account Registration and Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                To access certain features of our services, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="text-gray-700">
                You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm mr-3">3</span>
                Banking Services and Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                UBAS Financial Trust provides various banking services including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Deposit accounts (checking, savings, certificates of deposit)</li>
                <li>Loan services (personal, business, mortgage)</li>
                <li>Investment services and wealth management</li>
                <li>Electronic banking services</li>
                <li>International banking and foreign exchange</li>
              </ul>
              <p className="text-gray-700">
                All transactions are subject to applicable laws, regulations, and our internal policies. 
                We reserve the right to refuse or reverse any transaction that violates these terms or applicable law.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm mr-3">4</span>
                Fees and Charges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                You agree to pay all applicable fees and charges as disclosed in our Fee Schedule, which may be updated from time to time. 
                Current fees include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Account maintenance fees (where applicable)</li>
                <li>Transaction fees for certain services</li>
                <li>Wire transfer fees</li>
                <li>International transaction fees</li>
                <li>Overdraft and insufficient funds fees</li>
              </ul>
              <p className="text-gray-700">
                We will provide 30 days' notice before implementing any fee increases.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm mr-3">5</span>
                Privacy and Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. 
                By using our services, you consent to the collection and use of information in accordance with our Privacy Policy.
              </p>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal and financial information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>256-bit SSL encryption for all data transmission</li>
                <li>Multi-factor authentication</li>
                <li>Regular security audits and monitoring</li>
                <li>Compliance with applicable data protection regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm mr-3">6</span>
                Prohibited Uses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                You may not use our services for any unlawful purpose or to solicit others to perform unlawful acts. 
                Prohibited uses include but are not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Money laundering or terrorist financing</li>
                <li>Fraud or identity theft</li>
                <li>Violation of any applicable laws or regulations</li>
                <li>Unauthorized access to our systems or other users' accounts</li>
                <li>Transmission of viruses or malicious code</li>
                <li>Harassment or abuse of other users or our staff</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm mr-3">7</span>
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                UBAS Financial Trust shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
              <p className="text-gray-700">
                Our liability is limited to the maximum extent permitted by applicable law. In jurisdictions that do not allow the exclusion 
                of certain warranties or the limitation of liability for consequential damages, our liability is limited to the fullest extent permitted by law.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm mr-3">8</span>
                Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, 
                under our sole discretion, for any reason whatsoever including but not limited to a breach of the Terms.
              </p>
              <p className="text-gray-700">
                You may terminate your account at any time by contacting customer service. Upon termination, your right to use the service 
                will cease immediately, and any outstanding balances will be handled according to applicable banking regulations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm mr-3">9</span>
                Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="text-gray-700">
                What constitutes a material change will be determined at our sole discretion. By continuing to access or use our service 
                after any revisions become effective, you agree to be bound by the revised terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm mr-3">10</span>
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-gray-700"><strong>Email:</strong> legal@ubasfintrust.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +1-800-UBAS-FIN (8227-346)</p>
                <p className="text-gray-700"><strong>Address:</strong> 123 Wall Street, Financial District, NY 10005</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-red-600" />
                <h3 className="font-semibold text-red-900">FDIC Insured</h3>
              </div>
              <p className="text-red-700 text-sm">
                UBAS Financial Trust is a member of the Federal Deposit Insurance Corporation (FDIC). 
                Your deposits are insured up to $250,000 per depositor, per insured bank, for each account ownership category.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
