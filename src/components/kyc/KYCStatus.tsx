import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { kycAPI } from '@/lib/api';
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
  Upload,
  RefreshCw,
  User,
  MapPin,
  Briefcase,
  Camera
} from 'lucide-react';

interface KYCStatusProps {
  onStartKYC?: () => void;
}

interface KYCStatusData {
  status: string;
  id?: string;
  submitted_at?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  documents?: Array<{
    type: string;
    status: string;
    uploadedAt: string;
  }>;
}

const statusConfig = {
  not_started: {
    label: 'Not Started',
    color: 'bg-gray-100 text-gray-800',
    icon: FileText,
    description: 'KYC verification not yet started'
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800',
    icon: Clock,
    description: 'Your documents are being processed'
  },
  pending_review: {
    label: 'Pending Review',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    description: 'Your application is under review'
  },
  approved: {
    label: 'Verified',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    description: 'Your identity has been verified'
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    description: 'Additional documents required'
  },
  additional_info_required: {
    label: 'Additional Info Required',
    color: 'bg-orange-100 text-orange-800',
    icon: AlertTriangle,
    description: 'Please provide additional information'
  }
};

const documentTypeLabels = {
  primaryId: 'Primary ID Document',
  proofOfAddress: 'Proof of Address',
  incomeProof: 'Income Proof',
  bankStatement: 'Bank Statement',
  selfie: 'Selfie Verification'
};

const documentIcons = {
  primaryId: User,
  proofOfAddress: MapPin,
  incomeProof: Briefcase,
  bankStatement: FileText,
  selfie: Camera
};

export function KYCStatus({ onStartKYC }: KYCStatusProps) {
  const [statusData, setStatusData] = useState<KYCStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchKYCStatus = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true);
      
      const response = await kycAPI.getStatus();
      
      if (response.success && response.data) {
        setStatusData(response.data);
        
        if (showRefreshToast) {
          toast({
            title: 'Status Updated',
            description: 'Your KYC status has been refreshed.',
          });
        }
      } else {
        // If no KYC found, user hasn't started
        setStatusData({ status: 'not_started' });
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
      setStatusData({ status: 'not_started' });
      
      if (showRefreshToast) {
        toast({
          title: 'Error',
          description: 'Failed to refresh KYC status. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const handleRefresh = () => {
    fetchKYCStatus(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading KYC status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const status = statusData?.status || 'not_started';
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;
  const StatusIcon = config.icon;

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <StatusIcon className="h-5 w-5" />
              <span>KYC Verification Status</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Badge className={config.color}>
                  {config.label}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">{config.description}</p>
              </div>
              
              {status === 'not_started' && onStartKYC && (
                <Button onClick={onStartKYC} className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Start Verification
                </Button>
              )}
            </div>

            {/* Application Details */}
            {statusData?.id && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-medium text-gray-500">Application ID</p>
                  <p className="text-sm text-gray-900">{statusData.id}</p>
                </div>
                {statusData.submitted_at && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Submitted</p>
                    <p className="text-sm text-gray-900">
                      {new Date(statusData.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {statusData.reviewed_at && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reviewed</p>
                    <p className="text-sm text-gray-900">
                      {new Date(statusData.reviewed_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Rejection Reason */}
            {status === 'rejected' && statusData?.rejection_reason && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Rejection Reason:</strong> {statusData.rejection_reason}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Status */}
      {statusData?.documents && statusData.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Document Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusData.documents.map((doc, index) => {
                const DocumentIcon = documentIcons[doc.type as keyof typeof documentIcons] || FileText;
                const docLabel = documentTypeLabels[doc.type as keyof typeof documentTypeLabels] || doc.type;
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DocumentIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{docLabel}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        doc.status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : doc.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {doc.status === 'verified' ? 'Verified' : 
                       doc.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {status !== 'approved' && (
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {status === 'not_started' && (
                <p className="text-sm text-gray-600">
                  Complete your KYC verification to unlock all banking features. You'll need:
                </p>
              )}
              
              {status === 'in_progress' && (
                <p className="text-sm text-gray-600">
                  We're reviewing your documents. This typically takes 1-2 business days.
                </p>
              )}
              
              {status === 'rejected' && (
                <p className="text-sm text-gray-600">
                  Please review the rejection reason above and resubmit with correct documents.
                </p>
              )}

              {status === 'not_started' && (
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Government-issued photo ID (passport, driver's license, or national ID)</li>
                  <li>Proof of address (utility bill, bank statement, or government mail)</li>
                  <li>Clear selfie holding your ID document</li>
                  <li>Proof of income (optional but recommended)</li>
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
