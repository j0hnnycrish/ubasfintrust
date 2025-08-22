import { useState, useEffect } from 'react';
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
  Sun,
  Moon,
  Monitor,
  CheckCircle,
  AlertCircle,
  DollarSign,
  BarChart3,
  FileText,
  Filter,
  Save,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';

interface AccountSettings {
  general: {
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    numberFormat: string;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    colorScheme: string;
    fontSize: string;
    compactMode: boolean;
    animations: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    activityTracking: boolean;
    dataSharing: boolean;
    cookiePreferences: boolean;
    marketingEmails: boolean;
  };
  financial: {
    defaultAccount: string;
    budgetAlerts: boolean;
    spendingCategories: string[];
    savingsGoals: SavingsGoal[];
    autoSave: {
      enabled: boolean;
      percentage: number;
      roundUp: boolean;
    };
  };
  dashboard: {
    layout: 'grid' | 'list' | 'compact';
    widgets: DashboardWidget[];
    refreshInterval: number;
    defaultView: string;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    voiceControl: boolean;
  };
}

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
}

interface DashboardWidget {
  id: string;
  name: string;
  enabled: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
}

interface AccountSettingsProps {
  onSettingsChange?: (settings: AccountSettings) => void;
}

export function AccountSettings({ onSettingsChange }: AccountSettingsProps) {
  const { notifySystem } = useNotificationTriggers();
  const { toast } = useToast();

  const [settings, setSettings] = useState<AccountSettings | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Mock settings data - in real app, this would come from API
      const mockSettings: AccountSettings = {
        general: {
          language: 'en-US',
          timezone: 'America/New_York',
          dateFormat: 'MM/dd/yyyy',
          currency: 'USD',
          numberFormat: 'en-US',
        },
        appearance: {
          theme: 'system',
          colorScheme: 'blue',
          fontSize: 'medium',
          compactMode: false,
          animations: true,
        },
        privacy: {
          profileVisibility: 'private',
          activityTracking: false,
          dataSharing: false,
          cookiePreferences: true,
          marketingEmails: false,
        },
        financial: {
          defaultAccount: 'checking',
          budgetAlerts: true,
          spendingCategories: ['Food', 'Transportation', 'Entertainment', 'Shopping'],
          savingsGoals: [
            {
              id: '1',
              name: 'Emergency Fund',
              targetAmount: 10000,
              currentAmount: 3500,
              deadline: '2024-12-31',
              priority: 'high',
            },
            {
              id: '2',
              name: 'Vacation',
              targetAmount: 5000,
              currentAmount: 1200,
              deadline: '2024-08-15',
              priority: 'medium',
            },
          ],
          autoSave: {
            enabled: true,
            percentage: 10,
            roundUp: true,
          },
        },
        dashboard: {
          layout: 'grid',
          widgets: [
            { id: 'balance', name: 'Account Balance', enabled: true, position: 1, size: 'large' },
            { id: 'transactions', name: 'Recent Transactions', enabled: true, position: 2, size: 'medium' },
            { id: 'investments', name: 'Investment Portfolio', enabled: true, position: 3, size: 'medium' },
            { id: 'spending', name: 'Spending Analysis', enabled: false, position: 4, size: 'small' },
          ],
          refreshInterval: 30,
          defaultView: 'overview',
        },
        accessibility: {
          highContrast: false,
          largeText: false,
          screenReader: false,
          keyboardNavigation: true,
          voiceControl: false,
        },
      };

      setSettings(mockSettings);
    } catch (error) {
      toast({
        title: 'Failed to Load Settings',
        description: 'Could not load your account settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updateSettings = (section: keyof AccountSettings, updates: any) => {
    if (!settings) return;

    const newSettings = {
      ...settings,
      [section]: { ...settings[section], ...updates },
    };

    setSettings(newSettings);
    setHasChanges(true);
    onSettingsChange?.(newSettings);
  };

  const saveSettings = async () => {
    if (!settings) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setHasChanges(false);
      
      toast({
        title: 'Settings Saved',
        description: 'Your account settings have been successfully updated.',
      });

      notifySystem('Settings Updated', 'Your account preferences have been saved.');
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSettings = async () => {
    setIsSubmitting(true);
    try {
      await loadSettings();
      setHasChanges(false);
      setShowResetDialog(false);
      
      toast({
        title: 'Settings Reset',
        description: 'Your settings have been reset to default values.',
      });
    } catch (error) {
      toast({
        title: 'Reset Failed',
        description: 'Failed to reset settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSavingsGoal = () => {
    if (!settings) return;

    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name: 'New Goal',
      targetAmount: 1000,
      currentAmount: 0,
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'medium',
    };

    updateSettings('financial', {
      ...settings.financial,
      savingsGoals: [...settings.financial.savingsGoals, newGoal],
    });
  };

  const updateSavingsGoal = (goalId: string, updates: Partial<SavingsGoal>) => {
    if (!settings) return;

    const updatedGoals = settings.financial.savingsGoals.map(goal =>
      goal.id === goalId ? { ...goal, ...updates } : goal
    );

    updateSettings('financial', {
      ...settings.financial,
      savingsGoals: updatedGoals,
    });
  };

  const removeSavingsGoal = (goalId: string) => {
    if (!settings) return;

    const updatedGoals = settings.financial.savingsGoals.filter(goal => goal.id !== goalId);

    updateSettings('financial', {
      ...settings.financial,
      savingsGoals: updatedGoals,
    });
  };

  const updateWidget = (widgetId: string, updates: Partial<DashboardWidget>) => {
    if (!settings) return;

    const updatedWidgets = settings.dashboard.widgets.map(widget =>
      widget.id === widgetId ? { ...widget, ...updates } : widget
    );

    updateSettings('dashboard', {
      ...settings.dashboard,
      widgets: updatedWidgets,
    });
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
          <p className="text-gray-600">Customize your banking experience</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <AlertCircle className="h-3 w-3 mr-1" />
              Unsaved Changes
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={() => setShowResetDialog(true)}
            disabled={isSubmitting}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={!hasChanges || isSubmitting}>
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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Language</Label>
                  <Select
                    value={settings.general.language}
                    onValueChange={(value) => updateSettings('general', { language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                      <SelectItem value="fr-FR">Français</SelectItem>
                      <SelectItem value="de-DE">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Timezone</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) => updateSettings('general', { timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date Format</Label>
                  <Select
                    value={settings.general.dateFormat}
                    onValueChange={(value) => updateSettings('general', { dateFormat: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
                      <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
                      <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
                      <SelectItem value="MMM dd, yyyy">MMM dd, yyyy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Currency</Label>
                  <Select
                    value={settings.general.currency}
                    onValueChange={(value) => updateSettings('general', { currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Display</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Theme</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { value: 'light', icon: Sun, label: 'Light' },
                    { value: 'dark', icon: Moon, label: 'Dark' },
                    { value: 'system', icon: Monitor, label: 'System' },
                  ].map((theme) => (
                    <Button
                      key={theme.value}
                      variant={settings.appearance.theme === theme.value ? "default" : "outline"}
                      className="h-16 flex-col"
                      onClick={() => updateSettings('appearance', { theme: theme.value })}
                    >
                      <theme.icon className="h-5 w-5 mb-1" />
                      {theme.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Color Scheme</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {['blue', 'green', 'purple', 'orange', 'red', 'gray'].map((color) => (
                    <Button
                      key={color}
                      variant={settings.appearance.colorScheme === color ? "default" : "outline"}
                      className={`h-12 w-12 ${color === 'blue' ? 'bg-blue-500' : 
                        color === 'green' ? 'bg-green-500' :
                        color === 'purple' ? 'bg-purple-500' :
                        color === 'orange' ? 'bg-orange-500' :
                        color === 'red' ? 'bg-red-500' : 'bg-gray-500'}`}
                      onClick={() => updateSettings('appearance', { colorScheme: color })}
                    >
                      {settings.appearance.colorScheme === color && (
                        <CheckCircle className="h-4 w-4 text-white" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Font Size</Label>
                  <Select
                    value={settings.appearance.fontSize}
                    onValueChange={(value) => updateSettings('appearance', { fontSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Compact Mode</Label>
                    <Switch
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) => updateSettings('appearance', { compactMode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Animations</Label>
                    <Switch
                      checked={settings.appearance.animations}
                      onCheckedChange={(checked) => updateSettings('appearance', { animations: checked })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Profile Visibility</Label>
                <Select
                  value={settings.privacy.profileVisibility}
                  onValueChange={(value) => updateSettings('privacy', { profileVisibility: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Activity Tracking</p>
                    <p className="text-sm text-gray-600">Allow tracking of your app usage</p>
                  </div>
                  <Switch
                    checked={settings.privacy.activityTracking}
                    onCheckedChange={(checked) => updateSettings('privacy', { activityTracking: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Data Sharing</p>
                    <p className="text-sm text-gray-600">Share anonymous usage data</p>
                  </div>
                  <Switch
                    checked={settings.privacy.dataSharing}
                    onCheckedChange={(checked) => updateSettings('privacy', { dataSharing: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Cookie Preferences</p>
                    <p className="text-sm text-gray-600">Accept functional cookies</p>
                  </div>
                  <Switch
                    checked={settings.privacy.cookiePreferences}
                    onCheckedChange={(checked) => updateSettings('privacy', { cookiePreferences: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-gray-600">Receive promotional content</p>
                  </div>
                  <Switch
                    checked={settings.privacy.marketingEmails}
                    onCheckedChange={(checked) => updateSettings('privacy', { marketingEmails: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Settings */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Default Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Default Account</Label>
                  <Select
                    value={settings.financial.defaultAccount}
                    onValueChange={(value) => updateSettings('financial', { defaultAccount: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking Account</SelectItem>
                      <SelectItem value="savings">Savings Account</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Budget Alerts</p>
                    <p className="text-sm text-gray-600">Get notified when approaching budget limits</p>
                  </div>
                  <Switch
                    checked={settings.financial.budgetAlerts}
                    onCheckedChange={(checked) => updateSettings('financial', { budgetAlerts: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auto-Save Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Auto-Save</p>
                    <p className="text-sm text-gray-600">Automatically save a percentage of income</p>
                  </div>
                  <Switch
                    checked={settings.financial.autoSave.enabled}
                    onCheckedChange={(checked) => updateSettings('financial', {
                      autoSave: { ...settings.financial.autoSave, enabled: checked }
                    })}
                  />
                </div>

                {settings.financial.autoSave.enabled && (
                  <>
                    <div>
                      <Label>Save Percentage</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          type="number"
                          min="1"
                          max="50"
                          value={settings.financial.autoSave.percentage}
                          onChange={(e) => updateSettings('financial', {
                            autoSave: { 
                              ...settings.financial.autoSave, 
                              percentage: parseInt(e.target.value) || 0 
                            }
                          })}
                          className="w-20"
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Round-Up Savings</p>
                        <p className="text-sm text-gray-600">Round up purchases to nearest dollar</p>
                      </div>
                      <Switch
                        checked={settings.financial.autoSave.roundUp}
                        onCheckedChange={(checked) => updateSettings('financial', {
                          autoSave: { ...settings.financial.autoSave, roundUp: checked }
                        })}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Savings Goals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Savings Goals</CardTitle>
                <Button onClick={addSavingsGoal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.financial.savingsGoals.map((goal) => (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Goal Name</Label>
                        <Input
                          value={goal.name}
                          onChange={(e) => updateSavingsGoal(goal.id, { name: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>Target Amount</Label>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            value={goal.targetAmount}
                            onChange={(e) => updateSavingsGoal(goal.id, { 
                              targetAmount: parseFloat(e.target.value) || 0 
                            })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Deadline</Label>
                        <Input
                          type="date"
                          value={goal.deadline}
                          onChange={(e) => updateSavingsGoal(goal.id, { deadline: e.target.value })}
                        />
                      </div>

                      <div className="flex items-end space-x-2">
                        <div className="flex-1">
                          <Label>Priority</Label>
                          <Select
                            value={goal.priority}
                            onValueChange={(value) => updateSavingsGoal(goal.id, { priority: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSavingsGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard Settings */}
        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Layout Style</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { value: 'grid', icon: BarChart3, label: 'Grid' },
                    { value: 'list', icon: FileText, label: 'List' },
                    { value: 'compact', icon: Filter, label: 'Compact' },
                  ].map((layout) => (
                    <Button
                      key={layout.value}
                      variant={settings.dashboard.layout === layout.value ? "default" : "outline"}
                      className="h-16 flex-col"
                      onClick={() => updateSettings('dashboard', { layout: layout.value })}
                    >
                      <layout.icon className="h-5 w-5 mb-1" />
                      {layout.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Default View</Label>
                  <Select
                    value={settings.dashboard.defaultView}
                    onValueChange={(value) => updateSettings('dashboard', { defaultView: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview</SelectItem>
                      <SelectItem value="accounts">Accounts</SelectItem>
                      <SelectItem value="transactions">Transactions</SelectItem>
                      <SelectItem value="investments">Investments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Refresh Interval (seconds)</Label>
                  <Select
                    value={settings.dashboard.refreshInterval.toString()}
                    onValueChange={(value) => updateSettings('dashboard', { 
                      refreshInterval: parseInt(value) 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Widget Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {settings.dashboard.widgets.map((widget) => (
                  <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={widget.enabled}
                        onCheckedChange={(checked) => updateWidget(widget.id, { enabled: checked })}
                      />
                      <div>
                        <p className="font-medium">{widget.name}</p>
                        <p className="text-sm text-gray-600">Position: {widget.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={widget.size}
                        onValueChange={(value) => updateWidget(widget.id, { size: value as any })}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Settings */}
        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">High Contrast</p>
                    <p className="text-sm text-gray-600">Increase color contrast for better visibility</p>
                  </div>
                  <Switch
                    checked={settings.accessibility.highContrast}
                    onCheckedChange={(checked) => updateSettings('accessibility', { highContrast: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Large Text</p>
                    <p className="text-sm text-gray-600">Increase text size for better readability</p>
                  </div>
                  <Switch
                    checked={settings.accessibility.largeText}
                    onCheckedChange={(checked) => updateSettings('accessibility', { largeText: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Screen Reader Support</p>
                    <p className="text-sm text-gray-600">Optimize for screen reading software</p>
                  </div>
                  <Switch
                    checked={settings.accessibility.screenReader}
                    onCheckedChange={(checked) => updateSettings('accessibility', { screenReader: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Keyboard Navigation</p>
                    <p className="text-sm text-gray-600">Enable full keyboard navigation</p>
                  </div>
                  <Switch
                    checked={settings.accessibility.keyboardNavigation}
                    onCheckedChange={(checked) => updateSettings('accessibility', { keyboardNavigation: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Voice Control</p>
                    <p className="text-sm text-gray-600">Enable voice commands and navigation</p>
                  </div>
                  <Switch
                    checked={settings.accessibility.voiceControl}
                    onCheckedChange={(checked) => updateSettings('accessibility', { voiceControl: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Settings</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset all settings to their default values? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={resetSettings} disabled={isSubmitting}>
              {isSubmitting ? 'Resetting...' : 'Reset Settings'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
