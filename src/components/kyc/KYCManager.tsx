import React, { useState } from 'react';
import { KYCStatus } from './KYCStatus';
import { KYCVerificationFlow } from './KYCVerificationFlow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';

interface KYCManagerProps {
  onBack?: () => void;
}

export function KYCManager({ onBack }: KYCManagerProps) {
  const [showVerificationFlow, setShowVerificationFlow] = useState(false);

  const handleStartKYC = () => {
    setShowVerificationFlow(true);
  };

  const handleKYCComplete = () => {
    setShowVerificationFlow(false);
    // Optionally refresh the status or show a success message
  };

  const handleCancelKYC = () => {
    setShowVerificationFlow(false);
  };

  if (showVerificationFlow) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleCancelKYC}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Status
          </Button>
        </div>
        
        <KYCVerificationFlow
          onComplete={handleKYCComplete}
          onCancel={handleCancelKYC}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        )}
        
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Identity Verification</h1>
            <p className="text-gray-600">Complete your KYC verification to access all banking features</p>
          </div>
        </div>
      </div>

      <KYCStatus onStartKYC={handleStartKYC} />
      
      {/* Information Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Why Verify Your Identity?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Security & Compliance</h4>
              <p className="text-sm text-gray-600">
                Identity verification helps us maintain the highest security standards and comply with
                financial regulations to protect your account and funds.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Enhanced Features</h4>
              <p className="text-sm text-gray-600">
                Once verified, you'll have access to higher transaction limits, international transfers,
                investment products, and premium banking services.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Quick Process</h4>
              <p className="text-sm text-gray-600">
                Our streamlined verification process typically takes just 5-10 minutes to complete,
                with most applications reviewed within 24 hours.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Data Protection</h4>
              <p className="text-sm text-gray-600">
                Your personal information is encrypted and stored securely. We never share your data
                with third parties without your explicit consent.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
