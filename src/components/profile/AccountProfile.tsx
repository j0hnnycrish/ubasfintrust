import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Key, 
  Settings, 
  Save, 
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Clock,
  Camera
} from 'lucide-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface VerificationStats {
  score: number;
  verifiedItems: number;
  totalItems: number;
  lastVerified: string;
}

export default function AccountProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [verificationStats] = useState<VerificationStats>({
    score: 85,
    verifiedItems: 7,
    totalItems: 10,
    lastVerified: '2024-01-15'
  });

  const handleProfileUpdate = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Profile updated:', profileData);
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password changed');
      setShowPasswordDialog(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password change failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSecurityScoreLabel = (score: number) => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information and security settings</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={user?.twoFactorEnabled ? "default" : "secondary"} className="px-3 py-1">
            {user?.twoFactorEnabled ? (
              <>
                <Shield className="w-3 h-3 mr-1" />
                2FA Enabled
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 mr-1" />
                2FA Disabled
              </>
            )}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profileData.state}
                    onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={profileData.zipCode}
                    onChange={(e) => setProfileData(prev => ({ ...prev, zipCode: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleProfileUpdate} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Overview
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`text-sm font-medium ${getSecurityScoreColor(verificationStats.score)}`}>
                    {verificationStats.score}/100
                  </div>
                  <Badge variant={verificationStats.score >= 80 ? "default" : "secondary"}>
                    {getSecurityScoreLabel(verificationStats.score)}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Key className="w-5 h-5 mr-3 text-gray-600" />
                    <div>
                      <div className="font-medium">Password</div>
                      <div className="text-sm text-gray-600">Last changed 30 days ago</div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
                    Change Password
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 mr-3 text-gray-600" />
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-600">
                        {user?.twoFactorEnabled ? 'Enabled via SMS' : 'Not enabled'}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">
                    {user?.twoFactorEnabled ? 'Manage' : 'Enable'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Account Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-600">Receive account updates via email</div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">SMS Alerts</div>
                    <div className="text-sm text-gray-600">Transaction and security alerts</div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new secure password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handlePasswordChange} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
