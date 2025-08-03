import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Settings, 
  Shield, 
  Database, 
  Mail,
  Bell,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Activity,
  Users,
  Lock,
  Eye,
  Server,
  HardDrive
} from 'lucide-react';

export function SystemSettings() {
  const { customers, transactions, refreshData } = useAdmin();
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    systemName: 'UBAS Financial Trust',
    systemEmail: 'admin@ubasfinancial.com',
    timezone: 'America/New_York',
    currency: 'USD',
    
    // Security Settings
    sessionTimeout: '30',
    passwordMinLength: '8',
    requireMFA: false,
    loginAttempts: '5',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    auditAlerts: true,
    
    // System Settings
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: '7',
    maintenanceMode: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
    { id: 'backup', label: 'Backup & Restore', icon: Download }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSuccess('');
    setError('');
  };

  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('ubas_system_settings', JSON.stringify(settings));
      
      setSuccess('Settings saved successfully');
    } catch (error) {
      setError('Failed to save settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportData = () => {
    const data = {
      customers,
      transactions,
      settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ubas-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setSuccess('Data exported successfully');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all customer and transaction data? This action cannot be undone.')) {
      localStorage.removeItem('ubas_customers');
      localStorage.removeItem('ubas_transactions');
      refreshData();
      setSuccess('All data cleared successfully');
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="systemName">System Name</Label>
          <Input
            id="systemName"
            value={settings.systemName}
            onChange={(e) => handleSettingChange('systemName', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="systemEmail">System Email</Label>
          <Input
            id="systemEmail"
            type="email"
            value={settings.systemEmail}
            onChange={(e) => handleSettingChange('systemEmail', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Default Currency</Label>
          <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="GBP">GBP - British Pound</SelectItem>
              <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
          <Input
            id="sessionTimeout"
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
          <Input
            id="passwordMinLength"
            type="number"
            value={settings.passwordMinLength}
            onChange={(e) => handleSettingChange('passwordMinLength', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="loginAttempts">Max Login Attempts</Label>
          <Input
            id="loginAttempts"
            type="number"
            value={settings.loginAttempts}
            onChange={(e) => handleSettingChange('loginAttempts', e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="requireMFA"
            checked={settings.requireMFA}
            onCheckedChange={(checked) => handleSettingChange('requireMFA', checked)}
          />
          <Label htmlFor="requireMFA">Require Multi-Factor Authentication</Label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="emailNotifications"
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
          />
          <Label htmlFor="emailNotifications">Email Notifications</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="smsNotifications"
            checked={settings.smsNotifications}
            onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
          />
          <Label htmlFor="smsNotifications">SMS Notifications</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="auditAlerts"
            checked={settings.auditAlerts}
            onCheckedChange={(checked) => handleSettingChange('auditAlerts', checked)}
          />
          <Label htmlFor="auditAlerts">Security Audit Alerts</Label>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-sm text-gray-500">Total records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-sm text-gray-500">Total records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <HardDrive className="h-5 w-5 mr-2" />
              Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4MB</div>
            <p className="text-sm text-gray-500">Used space</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="dataRetention">Data Retention (years)</Label>
          <Input
            id="dataRetention"
            type="number"
            value={settings.dataRetention}
            onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="autoBackup"
            checked={settings.autoBackup}
            onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
          />
          <Label htmlFor="autoBackup">Automatic Backups</Label>
        </div>
      </div>
    </div>
  );

  const renderMonitoringSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <p className="text-2xl font-bold text-green-600">Online</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold">99.9%</p>
              </div>
              <Server className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{customers.filter(c => c.status === 'active').length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security</p>
                <p className="text-2xl font-bold text-green-600">Secure</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export Data
            </CardTitle>
            <CardDescription>Download a complete backup of all system data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExportData} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Trash2 className="h-5 w-5 mr-2" />
              Clear Data
            </CardTitle>
            <CardDescription>Remove all customer and transaction data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleClearData} 
              variant="destructive" 
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="backupFrequency">Backup Frequency</Label>
        <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-200">
          <Activity className="h-3 w-3 mr-1" />
          System Online
        </Badge>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-none first:rounded-t-lg last:rounded-b-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>
                {sections.find(s => s.id === activeSection)?.label} Settings
              </CardTitle>
              <CardDescription>
                Configure {sections.find(s => s.id === activeSection)?.label.toLowerCase()} options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {activeSection === 'general' && renderGeneralSettings()}
              {activeSection === 'security' && renderSecuritySettings()}
              {activeSection === 'notifications' && renderNotificationSettings()}
              {activeSection === 'database' && renderDatabaseSettings()}
              {activeSection === 'monitoring' && renderMonitoringSettings()}
              {activeSection === 'backup' && renderBackupSettings()}

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {activeSection !== 'monitoring' && activeSection !== 'backup' && (
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
