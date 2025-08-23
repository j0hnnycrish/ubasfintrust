import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationTriggers } from '@/contexts/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  User,
  Shield,
  Bell,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Download,
  Smartphone,
  Mail,
  Calendar,
  Building,
  Globe,
  Key,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  History,
  FileText,
  Link,
  Unlink,
  RefreshCw,
  LogOut,
  UserX,
  Crown,
  Star
} from 'lucide-react';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profilePicture?: string;
  accountType: 'basic' | 'premium' | 'business';
  memberSince: string;
  lastLogin: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
}

interface SecuritySettings {
  passwordLastChanged: string;
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  loginNotifications: boolean;
  suspiciousActivityAlerts: boolean;
  sessionTimeout: number;
  trustedDevices: TrustedDevice[];
  securityQuestions: SecurityQuestion[];
}

interface TrustedDevice {
  id: string;
  name: string;
  deviceType: string;
  browser: string;
  location: string;
  lastAccess: string;
  isCurrentDevice: boolean;
}

interface SecurityQuestion {
  id: string;
  question: string;
  answer: string;
}

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
  transactionAlerts: boolean;
  securityAlerts: boolean;
  investmentUpdates: boolean;
  balanceAlerts: boolean;
  lowBalanceThreshold: number;
}

interface ConnectedAccount {
  id: string;
  provider: string;
  accountType: string;
  masked: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
}

interface AccountManagementProps {
  onBack: () => void;
}

export function AccountManagement({ onBack }: AccountManagementProps) {
  const { user } = useAuth();
  const { notifySecurityEvent, notifySystem } = useNotificationTriggers();
  const { toast } = useToast();

  // Data states
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);

  // UI states
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPasswords: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    setLoading(true);
    try {
      // Mock data - in real app, this would come from API
  const mockProfile: UserProfile = {
    id: user?.id || '1',
  firstName: 'John',
  lastName: 'Doe',
    email: (user?.username ? `${user.username}@example.com` : 'john.doe@example.com'),
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1985-06-15',
        address: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
        },
        accountType: 'premium',
        memberSince: '2020-01-15',
        lastLogin: new Date().toISOString(),
        emailVerified: true,
        phoneVerified: true,
        twoFactorEnabled: true,
      };

      const mockSecuritySettings: SecuritySettings = {
        passwordLastChanged: '2024-01-01T00:00:00Z',
        twoFactorEnabled: true,
        biometricEnabled: false,
        loginNotifications: true,
        suspiciousActivityAlerts: true,
        sessionTimeout: 30,
        trustedDevices: [
          {
            id: '1',
            name: 'MacBook Pro',
            deviceType: 'Desktop',
            browser: 'Chrome 120',
            location: 'New York, NY',
            lastAccess: new Date().toISOString(),
            isCurrentDevice: true,
          },
          {
            id: '2',
            name: 'iPhone 15',
            deviceType: 'Mobile',
            browser: 'Safari',
            location: 'New York, NY',
            lastAccess: '2024-01-14T10:30:00Z',
            isCurrentDevice: false,
          },
        ],
        securityQuestions: [
          {
            id: '1',
            question: 'What was the name of your first pet?',
            answer: '****', // Masked
          },
          {
            id: '2',
            question: 'What city were you born in?',
            answer: '****', // Masked
          },
        ],
      };

      const mockNotificationPrefs: NotificationPreferences = {
        email: true,
        sms: true,
        push: true,
        marketing: false,
        transactionAlerts: true,
        securityAlerts: true,
        investmentUpdates: true,
        balanceAlerts: true,
        lowBalanceThreshold: 1000,
      };

      const mockConnectedAccounts: ConnectedAccount[] = [
        {
          id: '1',
          provider: 'Venmo',
          accountType: 'Payment',
          masked: '****1234',
          status: 'connected',
          lastSync: '2024-01-15T08:30:00Z',
        },
        {
          id: '2',
          provider: 'PayPal',
          accountType: 'Payment',
          masked: '****5678',
          status: 'connected',
          lastSync: '2024-01-15T08:25:00Z',
        },
      ];

      setProfile(mockProfile);
      setEditedProfile(mockProfile);
      setSecuritySettings(mockSecuritySettings);
      setNotificationPrefs(mockNotificationPrefs);
      setConnectedAccounts(mockConnectedAccounts);
    } catch (error) {
      toast({
        title: 'Error Loading Data',
        description: 'Failed to load account information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!editedProfile) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setProfile(editedProfile);
      setIsEditing(false);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been successfully updated.',
      });

      notifySystem('Profile Updated', 'Your account profile has been updated successfully.');
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Passwords Don\'t Match',
        description: 'Please make sure both password fields match.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showPasswords: false,
      });
      setShowPasswordDialog(false);

      toast({
        title: 'Password Changed',
        description: 'Your password has been successfully updated.',
      });

      notifySecurityEvent('Password changed successfully', 'low');
    } catch (error) {
      toast({
        title: 'Password Change Failed',
        description: 'Failed to change password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTwoFactor = async () => {
    if (!securitySettings) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newSettings = {
        ...securitySettings,
        twoFactorEnabled: !securitySettings.twoFactorEnabled,
      };
      setSecuritySettings(newSettings);

      toast({
        title: securitySettings.twoFactorEnabled ? '2FA Disabled' : '2FA Enabled',
        description: `Two-factor authentication has been ${securitySettings.twoFactorEnabled ? 'disabled' : 'enabled'}.`,
      });

      notifySecurityEvent(
        `Two-factor authentication ${securitySettings.twoFactorEnabled ? 'disabled' : 'enabled'}`,
        'high'
      );
    } catch (error) {
      toast({
        title: 'Security Update Failed',
        description: 'Failed to update security settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeTrustedDevice = async (deviceId: string) => {
    if (!securitySettings) return;

    try {
      const newDevices = securitySettings.trustedDevices.filter(d => d.id !== deviceId);
      setSecuritySettings({
        ...securitySettings,
        trustedDevices: newDevices,
      });

      toast({
        title: 'Device Removed',
        description: 'The trusted device has been removed from your account.',
      });

      notifySecurityEvent('Trusted device removed from account', 'high');
    } catch (error) {
      toast({
        title: 'Remove Failed',
        description: 'Failed to remove device. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updateNotificationPrefs = async (newPrefs: Partial<NotificationPreferences>) => {
    if (!notificationPrefs) return;

    try {
      const updated = { ...notificationPrefs, ...newPrefs };
      setNotificationPrefs(updated);

      toast({
        title: 'Preferences Updated',
        description: 'Your notification preferences have been saved.',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update preferences. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const connectAccount = async (provider: string) => {
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newAccount: ConnectedAccount = {
        id: Date.now().toString(),
        provider,
        accountType: 'Payment',
        masked: '****' + Math.floor(Math.random() * 9999),
        status: 'connected',
        lastSync: new Date().toISOString(),
      };

      setConnectedAccounts(prev => [...prev, newAccount]);

      toast({
        title: 'Account Connected',
        description: `Your ${provider} account has been successfully connected.`,
      });
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: `Failed to connect ${provider} account. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const disconnectAccount = async (accountId: string) => {
    try {
      setConnectedAccounts(prev => prev.filter(acc => acc.id !== accountId));

      toast({
        title: 'Account Disconnected',
        description: 'The external account has been disconnected.',
      });
    } catch (error) {
      toast({
        title: 'Disconnect Failed',
        description: 'Failed to disconnect account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'basic': return <User className="h-5 w-5 text-gray-600" />;
      case 'premium': return <Crown className="h-5 w-5 text-yellow-600" />;
      case 'business': return <Building className="h-5 w-5 text-blue-600" />;
      default: return <User className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAccountTypeBadge = (type: string) => {
    switch (type) {
      case 'basic': return <Badge variant="outline">Basic</Badge>;
      case 'premium': return <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>;
      case 'business': return <Badge className="bg-blue-100 text-blue-800">Business</Badge>;
      default: return <Badge variant="outline">Basic</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account data...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="text-center p-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Account Data Unavailable</h3>
            <p className="text-gray-600 mb-4">We couldn't load your account information.</p>
            <Button onClick={loadAccountData}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
              <p className="text-gray-600">Manage your profile, security, and preferences</p>
            </div>
            <div className="flex items-center space-x-3">
              {getAccountTypeIcon(profile.accountType)}
              {getAccountTypeBadge(profile.accountType)}
            </div>
          </div>
        </div>

        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Account Status</p>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Active & Verified</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Security Score</p>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Excellent (95%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Member Since</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(profile.memberSince).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="connected">Connected Accounts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => {
                      if (isEditing) {
                        setEditedProfile(profile);
                      }
                      setIsEditing(!isEditing);
                    }}
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>First Name</Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile?.firstName || ''}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{profile.firstName}</p>
                    )}
                  </div>

                  <div>
                    <Label>Last Name</Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile?.lastName || ''}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{profile.lastName}</p>
                    )}
                  </div>

                  <div>
                    <Label>Username</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-sm text-gray-900">{user?.username || 'user'}</p>
                    </div>
                  </div>

                  <div>
                    <Label>Phone Number</Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile?.phone || ''}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm text-gray-900">{profile.phone}</p>
                        {profile.phoneVerified && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editedProfile?.dateOfBirth || ''}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, dateOfBirth: e.target.value } : null)}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                    )}
                  </div>

                  <div>
                    <Label>Account Type</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getAccountTypeIcon(profile.accountType)}
                      {getAccountTypeBadge(profile.accountType)}
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label>Street Address</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile?.address.street || ''}
                          onChange={(e) => setEditedProfile(prev => prev ? {
                            ...prev,
                            address: { ...prev.address, street: e.target.value }
                          } : null)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profile.address.street}</p>
                      )}
                    </div>

                    <div>
                      <Label>City</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile?.address.city || ''}
                          onChange={(e) => setEditedProfile(prev => prev ? {
                            ...prev,
                            address: { ...prev.address, city: e.target.value }
                          } : null)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profile.address.city}</p>
                      )}
                    </div>

                    <div>
                      <Label>State</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile?.address.state || ''}
                          onChange={(e) => setEditedProfile(prev => prev ? {
                            ...prev,
                            address: { ...prev.address, state: e.target.value }
                          } : null)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profile.address.state}</p>
                      )}
                    </div>

                    <div>
                      <Label>ZIP Code</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile?.address.zipCode || ''}
                          onChange={(e) => setEditedProfile(prev => prev ? {
                            ...prev,
                            address: { ...prev.address, zipCode: e.target.value }
                          } : null)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profile.address.zipCode}</p>
                      )}
                    </div>

                    <div>
                      <Label>Country</Label>
                      {isEditing ? (
                        <Select
                          value={editedProfile?.address.country || ''}
                          onValueChange={(value) => setEditedProfile(prev => prev ? {
                            ...prev,
                            address: { ...prev.address, country: value }
                          } : null)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profile.address.country}</p>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => {
                      setEditedProfile(profile);
                      setIsEditing(false);
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={saveProfile} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings?.twoFactorEnabled || false}
                      onCheckedChange={toggleTwoFactor}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Biometric Authentication</p>
                      <p className="text-sm text-gray-600">
                        Use fingerprint or face recognition
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings?.biometricEnabled || false}
                      onCheckedChange={(checked) => {
                        if (securitySettings) {
                          setSecuritySettings({
                            ...securitySettings,
                            biometricEnabled: checked,
                          });
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Login Notifications</p>
                      <p className="text-sm text-gray-600">
                        Get notified of new login attempts
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings?.loginNotifications || false}
                      onCheckedChange={(checked) => {
                        if (securitySettings) {
                          setSecuritySettings({
                            ...securitySettings,
                            loginNotifications: checked,
                          });
                        }
                      }}
                    />
                  </div>

                  <Button onClick={() => setShowPasswordDialog(true)} className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </CardContent>
              </Card>

              {/* Trusted Devices */}
              <Card>
                <CardHeader>
                  <CardTitle>Trusted Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securitySettings?.trustedDevices.map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-full">
                            {device.deviceType === 'Mobile' ? (
                              <Smartphone className="h-4 w-4" />
                            ) : (
                              <Globe className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{device.name}</p>
                              {device.isCurrentDevice && (
                                <Badge variant="outline" className="text-xs">Current</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">
                              {device.browser} • {device.location}
                            </p>
                            <p className="text-xs text-gray-500">
                              Last access: {new Date(device.lastAccess).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {!device.isCurrentDevice && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTrustedDevice(device.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                {notificationPrefs && (
                  <div className="space-y-6">
                    {/* Delivery Methods */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Delivery Methods</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Email</span>
                          </div>
                          <Switch
                            checked={notificationPrefs.email}
                            onCheckedChange={(checked) => updateNotificationPrefs({ email: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            {/* MessageSquare icon removed */}
                            <span>SMS</span>
                          </div>
                          <Switch
                            checked={notificationPrefs.sms}
                            onCheckedChange={(checked) => updateNotificationPrefs({ sms: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Bell className="h-4 w-4" />
                            <span>Push</span>
                          </div>
                          <Switch
                            checked={notificationPrefs.push}
                            onCheckedChange={(checked) => updateNotificationPrefs({ push: checked })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notification Types */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Transaction Alerts</p>
                            <p className="text-sm text-gray-600">Payment confirmations and transfers</p>
                          </div>
                          <Switch
                            checked={notificationPrefs.transactionAlerts}
                            onCheckedChange={(checked) => updateNotificationPrefs({ transactionAlerts: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Security Alerts</p>
                            <p className="text-sm text-gray-600">Login attempts and security events</p>
                          </div>
                          <Switch
                            checked={notificationPrefs.securityAlerts}
                            onCheckedChange={(checked) => updateNotificationPrefs({ securityAlerts: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Investment Updates</p>
                            <p className="text-sm text-gray-600">Portfolio changes and market alerts</p>
                          </div>
                          <Switch
                            checked={notificationPrefs.investmentUpdates}
                            onCheckedChange={(checked) => updateNotificationPrefs({ investmentUpdates: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Balance Alerts</p>
                            <p className="text-sm text-gray-600">Low balance warnings</p>
                          </div>
                          <Switch
                            checked={notificationPrefs.balanceAlerts}
                            onCheckedChange={(checked) => updateNotificationPrefs({ balanceAlerts: checked })}
                          />
                        </div>

                        {notificationPrefs.balanceAlerts && (
                          <div className="ml-6">
                            <Label>Low Balance Threshold</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                              <Input
                                type="number"
                                value={notificationPrefs.lowBalanceThreshold}
                                onChange={(e) => updateNotificationPrefs({ 
                                  lowBalanceThreshold: parseFloat(e.target.value) || 0 
                                })}
                                className="w-32"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Marketing Communications</p>
                            <p className="text-sm text-gray-600">Product updates and offers</p>
                          </div>
                          <Switch
                            checked={notificationPrefs.marketing}
                            onCheckedChange={(checked) => updateNotificationPrefs({ marketing: checked })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connected Accounts Tab */}
          <TabsContent value="connected" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connectedAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <Link className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{account.provider}</p>
                            <Badge variant={account.status === 'connected' ? 'default' : 'destructive'}>
                              {account.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {account.accountType} • {account.masked}
                          </p>
                          <p className="text-xs text-gray-500">
                            Last sync: {new Date(account.lastSync).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => disconnectAccount(account.id)}
                        >
                          <Unlink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {['Plaid', 'Stripe', 'Square'].map((provider) => (
                      <Button
                        key={provider}
                        variant="outline"
                        className="h-16"
                        onClick={() => connectAccount(provider)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Connect {provider}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download Account Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Transaction History
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <History className="h-4 w-4 mr-2" />
                    Account Activity Log
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out All Devices
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support & Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    {/* MessageSquare icon removed */}
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Terms of Service
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Report an Issue
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Password Change Dialog */}
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
                <Label>Current Password</Label>
                <div className="relative">
                  <Input
                    type={passwordForm.showPasswords ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setPasswordForm(prev => ({ ...prev, showPasswords: !prev.showPasswords }))}
                  >
                    {/* TODO: Import EyeOff and Eye or replace with a default icon */}
                  </Button>
                </div>
              </div>

              <div>
                <Label>New Password</Label>
                <Input
                  type={passwordForm.showPasswords ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>

              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type={passwordForm.showPasswords ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={changePassword} disabled={isSubmitting}>
                  {isSubmitting ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Account</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove all your data.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <p className="font-medium text-red-800">Warning</p>
                </div>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  <li>All your account data will be permanently deleted</li>
                  <li>You will lose access to all connected services</li>
                  <li>This action cannot be reversed</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive">
                  Delete Account
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
