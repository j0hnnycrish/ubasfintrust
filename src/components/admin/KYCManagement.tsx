import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  Search,
  Filter,
  User,
  MapPin,
  Briefcase,
  Upload,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface KYCApplication {
  id: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  accountType: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;
    nationality: string;
    idType: string;
    idNumber: string;
  };
  addressInfo: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    residencyStatus: string;
  };
  employmentInfo: {
    employmentStatus: string;
    employerName?: string;
    jobTitle?: string;
    monthlyIncome: string;
    sourceOfFunds: string;
  };
  documents: {
    primaryId?: string;
    secondaryId?: string;
    addressProof?: string;
    incomeProof?: string;
    selfie?: string;
  };
}

export function KYCManagement() {
  const [applications, setApplications] = useState<KYCApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<KYCApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockApplications: KYCApplication[] = [
      {
        id: 'kyc_001',
        userId: 'user_001',
        customerName: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+234-801-234-5678',
        accountType: 'personal',
        status: 'pending',
        submittedAt: '2024-01-15T10:30:00Z',
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          middleName: 'Michael',
          dateOfBirth: '1990-05-15',
          nationality: 'Nigerian',
          idType: 'nin',
          idNumber: '12345678901'
        },
        addressInfo: {
          street: '123 Lagos Street',
          city: 'Lagos',
          state: 'Lagos State',
          zipCode: '100001',
          country: 'Nigeria',
          residencyStatus: 'owner'
        },
        employmentInfo: {
          employmentStatus: 'employed',
          employerName: 'Tech Corp Ltd',
          jobTitle: 'Software Engineer',
          monthlyIncome: '500000',
          sourceOfFunds: 'salary'
        },
        documents: {
          primaryId: 'nin_document.pdf',
          addressProof: 'utility_bill.pdf',
          incomeProof: 'salary_slip.pdf',
          selfie: 'selfie.jpg'
        }
      },
      {
        id: 'kyc_002',
        userId: 'user_002',
        customerName: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+234-802-345-6789',
        accountType: 'business',
        status: 'in_review',
        submittedAt: '2024-01-14T14:20:00Z',
        personalInfo: {
          firstName: 'Jane',
          lastName: 'Smith',
          dateOfBirth: '1985-08-22',
          nationality: 'Nigerian',
          idType: 'passport',
          idNumber: 'A12345678'
        },
        addressInfo: {
          street: '456 Abuja Avenue',
          city: 'Abuja',
          state: 'FCT',
          zipCode: '900001',
          country: 'Nigeria',
          residencyStatus: 'tenant'
        },
        employmentInfo: {
          employmentStatus: 'self_employed',
          monthlyIncome: '800000',
          sourceOfFunds: 'business'
        },
        documents: {
          primaryId: 'passport.pdf',
          addressProof: 'bank_statement.pdf',
          selfie: 'selfie.jpg'
        }
      }
    ];

    setTimeout(() => {
      setApplications(mockApplications);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (applicationId: string, newStatus: 'approved' | 'rejected', reason?: string) => {
    try {
      // In real implementation, this would call the API
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              status: newStatus, 
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'Admin User',
              rejectionReason: reason 
            }
          : app
      ));

      toast({
        title: `Application ${newStatus}`,
        description: `KYC application has been ${newStatus} successfully.`,
      });

      setSelectedApplication(null);
      setRejectionReason('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update application status.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'in_review':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Eye className="h-3 w-3 mr-1" />In Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderApplicationDetails = (app: KYCApplication) => (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Full Name:</strong> {`${app.personalInfo.firstName} ${app.personalInfo.middleName || ''} ${app.personalInfo.lastName}`.trim()}</div>
            <div><strong>Date of Birth:</strong> {new Date(app.personalInfo.dateOfBirth).toLocaleDateString()}</div>
            <div><strong>Nationality:</strong> {app.personalInfo.nationality}</div>
            <div><strong>ID Type:</strong> {app.personalInfo.idType.toUpperCase()}</div>
            <div className="col-span-2"><strong>ID Number:</strong> {app.personalInfo.idNumber}</div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Address Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="col-span-2"><strong>Street:</strong> {app.addressInfo.street}</div>
            <div><strong>City:</strong> {app.addressInfo.city}</div>
            <div><strong>State:</strong> {app.addressInfo.state}</div>
            <div><strong>ZIP Code:</strong> {app.addressInfo.zipCode}</div>
            <div><strong>Country:</strong> {app.addressInfo.country}</div>
            <div className="col-span-2"><strong>Residency Status:</strong> {app.addressInfo.residencyStatus}</div>
          </div>
        </CardContent>
      </Card>

      {/* Employment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5" />
            <span>Employment & Income</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Employment Status:</strong> {app.employmentInfo.employmentStatus}</div>
            <div><strong>Monthly Income:</strong> ₦{parseInt(app.employmentInfo.monthlyIncome).toLocaleString()}</div>
            {app.employmentInfo.employerName && (
              <div><strong>Employer:</strong> {app.employmentInfo.employerName}</div>
            )}
            {app.employmentInfo.jobTitle && (
              <div><strong>Job Title:</strong> {app.employmentInfo.jobTitle}</div>
            )}
            <div className="col-span-2"><strong>Source of Funds:</strong> {app.employmentInfo.sourceOfFunds}</div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Uploaded Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(app.documents).map(([key, filename]) => 
              filename && (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {app.status === 'pending' || app.status === 'in_review' ? (
        <div className="flex space-x-4">
          <Button 
            onClick={() => handleStatusUpdate(app.id, 'approved')}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve Application
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Reject Application
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject KYC Application</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejecting this application.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter rejection reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleStatusUpdate(app.id, 'rejected', rejectionReason)}
                    disabled={!rejectionReason.trim()}
                  >
                    Reject Application
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <AlertTriangle className="h-4 w-4" />
            <span>
              Application {app.status} on {app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString() : 'N/A'}
              {app.reviewedBy && ` by ${app.reviewedBy}`}
            </span>
          </div>
          {app.rejectionReason && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <strong>Rejection Reason:</strong> {app.rejectionReason}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">KYC Management</h2>
          <p className="text-gray-600">Review and manage customer verification applications</p>
        </div>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>KYC Applications ({filteredApplications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading applications...</div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No applications found</div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedApplication?.id === app.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedApplication(app)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{app.customerName}</h4>
                        <p className="text-sm text-gray-600">{app.email}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Account: {app.accountType}</span>
                      <span>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Details */}
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedApplication ? (
              renderApplicationDetails(selectedApplication)
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select an application to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
