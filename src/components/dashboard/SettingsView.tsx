import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Settings,
  User,
  Shield,
  Bell,
  CreditCard,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Save
} from 'lucide-react';

export function SettingsView() {
  const { user } = useAuth();
  const { customers, updateCustomer } = useAdmin();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Get customer data
  const customer = customers.find(c => c.username === user?.username);

  const [profileData, setProfileData] = useState({
    fullName: customer?.fullName || '',
    email: customer?.email || '',
    phoneNumber: customer?.phoneNumber || '',
    address: customer?.address || '',
    dateOfBirth: customer?.dateOfBirth || '',
    occupation: customer?.occupation || ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: customer?.twoFactorEnabled || false,
    smsAlerts: customer?.smsAlerts || true,
    emailAlerts: customer?.emailAlerts || true,
    loginNotifications: customer?.loginNotifications || true,
    transactionAlerts: customer?.transactionAlerts || true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    accountAlerts: true,
    transactionNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    monthlyStatements: true,
    lowBalanceAlerts: true,
    largeTransactionAlerts: true
  });

  const settingsTabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'cards', label: 'Cards & Payments', icon: CreditCard },
    { id: 'mobile', label: 'Mobile Banking', icon: Smartphone }
  ];

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!customer) {
        throw new Error('Customer not found');
      }

      const result = await updateCustomer(customer.id, profileData);
      
      if (result.success) {
        setSuccess('Profile updated successfully');
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!customer) {
        throw new Error('Customer not found');
      }

      const result = await updateCustomer(customer.id, securitySettings);
      
      if (result.success) {
        setSuccess('Security settings updated successfully');
      } else {
        setError(result.error || 'Failed to update security settings');
      }
    } catch (error) {
      setError('Failed to update security settings');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={profileData.fullName}
            onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={profileData.phoneNumber}
            onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={profileData.dateOfBirth}
            onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            value={profileData.occupation}
            onChange={(e) => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
            placeholder="Enter your occupation"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={profileData.address}
            onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Enter your address"
          />
        </div>
      </div>

      <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
        {isLoading ? 'Saving...' : 'Save Profile'}
      </Button>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <Switch
            checked={securitySettings.twoFactorEnabled}
            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: checked }))}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">SMS Security Alerts</h4>
            <p className="text-sm text-gray-600">Receive SMS notifications for security events</p>
          </div>
          <Switch
            checked={securitySettings.smsAlerts}
            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, smsAlerts: checked }))}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Email Security Alerts</h4>
            <p className="text-sm text-gray-600">Receive email notifications for security events</p>
          </div>
          <Switch
            checked={securitySettings.emailAlerts}
            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, emailAlerts: checked }))}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Login Notifications</h4>
            <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
          </div>
          <Switch
            checked={securitySettings.loginNotifications}
            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, loginNotifications: checked }))}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Transaction Alerts</h4>
            <p className="text-sm text-gray-600">Receive alerts for all account transactions</p>
          </div>
          <Switch
            checked={securitySettings.transactionAlerts}
            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, transactionAlerts: checked }))}
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Password Security</h4>
            <p className="text-sm text-yellow-700 mt-1">
              For your security, password changes require additional verification. Contact support to update your password.
            </p>
          </div>
        </div>
      </div>

      <Button onClick={handleSaveSecurity} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
        {isLoading ? 'Saving...' : 'Save Security Settings'}
      </Button>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(notificationSettings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h4>
              <p className="text-sm text-gray-600">
                {getNotificationDescription(key)}
              </p>
            </div>
            <Switch
              checked={value}
              onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, [key]: checked }))}
            />
          </div>
        ))}
      </div>

      <Button className="bg-blue-600 hover:bg-blue-700">
        Save Notification Preferences
      </Button>
    </div>
  );

  const getNotificationDescription = (key: string) => {
    const descriptions: { [key: string]: string } = {
      accountAlerts: 'Important updates about your accounts',
      transactionNotifications: 'Notifications for all transactions',
      marketingEmails: 'Promotional offers and product updates',
      securityAlerts: 'Critical security notifications',
      monthlyStatements: 'Monthly account statements via email',
      lowBalanceAlerts: 'Alerts when account balance is low',
      largeTransactionAlerts: 'Notifications for large transactions'
    };
    return descriptions[key] || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Account Settings</h2>
          <p className="text-gray-600">Manage your account preferences and security settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1">
          <CardContent className="p-0">
            <nav className="space-y-1">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-none first:rounded-t-lg last:rounded-b-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {(() => {
                  const activeTabData = settingsTabs.find(tab => tab.id === activeTab);
                  if (activeTabData) {
                    const Icon = activeTabData.icon;
                    return <Icon className="mr-2 h-5 w-5" />;
                  }
                  return null;
                })()}
                {settingsTabs.find(tab => tab.id === activeTab)?.label}
              </CardTitle>
              <CardDescription>
                {activeTab === 'profile' && 'Update your personal information and contact details'}
                {activeTab === 'security' && 'Manage your account security and privacy settings'}
                {activeTab === 'notifications' && 'Control how and when you receive notifications'}
                {activeTab === 'cards' && 'Manage your payment cards and methods'}
                {activeTab === 'mobile' && 'Configure mobile banking preferences'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'security' && renderSecurityTab()}
              {activeTab === 'notifications' && renderNotificationsTab()}
              {activeTab === 'cards' && (
                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Card Management</h3>
                  <p className="text-gray-600 mb-6">Manage your debit and credit cards</p>
                  <Button variant="outline">Request New Card</Button>
                </div>
              )}
              {activeTab === 'mobile' && (
                <div className="text-center py-12">
                  <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Mobile Banking</h3>
                  <p className="text-gray-600 mb-6">Configure mobile app preferences</p>
                  <Button variant="outline">Download Mobile App</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
