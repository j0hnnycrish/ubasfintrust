import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Shield, 
  Bell, 
  Lock, 
  Eye, 
  EyeOff,
  Smartphone,
  Mail,
  Globe,
  Download,
  Upload,
  Settings,
  User,
  DollarSign
} from 'lucide-react';

interface AccountManagementProps {
  onBack: () => void;
}

export function AccountManagement({ onBack }: AccountManagementProps) {
  const [showAccountNumbers, setShowAccountNumbers] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    marketing: false
  });
  const [limits, setLimits] = useState({
    dailyTransfer: 10000,
    monthlyTransfer: 50000,
    atmWithdrawal: 1000
  });
  const { toast } = useToast();

  const accounts = [
    {
      id: 'checking-001',
      name: 'Primary Checking',
      type: 'Checking',
      number: '****1234',
      fullNumber: '1234567890001234',
      balance: 5420.50,
      status: 'Active',
      openDate: '2020-03-15'
    },
    {
      id: 'savings-001',
      name: 'High Yield Savings',
      type: 'Savings',
      number: '****5678',
      fullNumber: '1234567890005678',
      balance: 15750.25,
      status: 'Active',
      openDate: '2020-03-15'
    },
    {
      id: 'credit-001',
      name: 'Platinum Credit Card',
      type: 'Credit Card',
      number: '****9012',
      fullNumber: '1234567890009012',
      balance: -1250.00,
      creditLimit: 15000,
      status: 'Active',
      openDate: '2021-06-10'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
    toast({
      title: 'Settings Updated',
      description: `${type} notifications ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleLimitChange = (type: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setLimits(prev => ({ ...prev, [type]: numValue }));
  };

  const saveLimits = () => {
    toast({
      title: 'Limits Updated',
      description: 'Your transaction limits have been updated successfully.',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
          <p className="text-gray-600">Manage your accounts, settings, and preferences</p>
        </div>

        <Tabs defaultValue="accounts" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="limits">Limits</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Accounts</h2>
              <div className="flex items-center space-x-2">
                <Label htmlFor="show-numbers">Show full account numbers</Label>
                <Switch
                  id="show-numbers"
                  checked={showAccountNumbers}
                  onCheckedChange={setShowAccountNumbers}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <Card key={account.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                      <Badge variant={account.status === 'Active' ? 'default' : 'secondary'}>
                        {account.status}
                      </Badge>
                    </div>
                    <CardDescription>{account.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="font-mono text-sm">
                        {showAccountNumbers ? account.fullNumber : account.number}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAccountNumbers(!showAccountNumbers)}
                      >
                        {showAccountNumbers ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">
                        {account.type === 'Credit Card' ? 'Current Balance' : 'Available Balance'}
                      </p>
                      <p className={`text-2xl font-bold ${
                        account.balance < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(Math.abs(account.balance))}
                      </p>
                      {account.creditLimit && (
                        <p className="text-sm text-gray-600">
                          Credit Limit: {formatCurrency(account.creditLimit)}
                        </p>
                      )}
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>Opened: {new Date(account.openDate).toLocaleDateString()}</p>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Statement
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your accounts and services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                    <CreditCard className="h-5 w-5 mb-1" />
                    <span className="text-sm">Open New Account</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                    <Upload className="h-5 w-5 mb-1" />
                    <span className="text-sm">Upload Documents</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                    <Download className="h-5 w-5 mb-1" />
                    <span className="text-sm">Download Forms</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">SMS Authentication</p>
                      <p className="text-sm text-gray-600">Receive codes via SMS</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Biometric Login</p>
                      <p className="text-sm text-gray-600">Use fingerprint or face recognition</p>
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full">Change Password</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Login Activity</CardTitle>
                <CardDescription>Recent login attempts and device management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { device: 'Chrome on Windows', location: 'New York, NY', time: '2 hours ago', status: 'success' },
                    { device: 'Mobile App on iPhone', location: 'New York, NY', time: '1 day ago', status: 'success' },
                    { device: 'Safari on macOS', location: 'Unknown', time: '3 days ago', status: 'blocked' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-medium">{activity.device}</p>
                          <p className="text-sm text-gray-600">{activity.location} • {activity.time}</p>
                        </div>
                      </div>
                      <Badge variant={activity.status === 'success' ? 'default' : 'destructive'}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(value) => handleNotificationChange('email', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(value) => handleNotificationChange('sms', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-600">Receive push notifications on mobile</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(value) => handleNotificationChange('push', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Marketing Communications</p>
                      <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(value) => handleNotificationChange('marketing', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Limits</CardTitle>
                <CardDescription>Set daily and monthly transaction limits for security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="daily-transfer">Daily Transfer Limit</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="daily-transfer"
                        type="number"
                        value={limits.dailyTransfer}
                        onChange={(e) => handleLimitChange('dailyTransfer', e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthly-transfer">Monthly Transfer Limit</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="monthly-transfer"
                        type="number"
                        value={limits.monthlyTransfer}
                        onChange={(e) => handleLimitChange('monthlyTransfer', e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="atm-withdrawal">ATM Withdrawal Limit</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="atm-withdrawal"
                        type="number"
                        value={limits.atmWithdrawal}
                        onChange={(e) => handleLimitChange('atmWithdrawal', e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={saveLimits} className="w-full">
                  Save Limits
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
