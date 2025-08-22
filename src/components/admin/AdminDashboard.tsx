import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { diagnosticsAPI, adminAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomerManagement } from './CustomerManagement';
import { AccountManagement } from './AccountManagement';
import { TransactionManagement } from './TransactionManagement';
import { SystemSettings } from './SystemSettings';
import { TemplatesManager } from './TemplatesManager';
import { BackdatedTransactionGenerator } from './BackdatedTransactionGenerator';
import { EnhancedAdminOperations } from './EnhancedAdminOperations';
import { UBASLogoCompact } from '@/components/ui/UBASLogo';
import { 
  Users, 
  CreditCard, 
  FileText, 
  Settings, 
  LogOut,
  BarChart3,
  DollarSign,
  Menu,
  Shield,
  Activity,
  Server,
  Database,
  HardDrive,
  RefreshCw,
  Mail
} from 'lucide-react';

export function AdminDashboard() {
  const { adminUser, adminLogout, customers, transactions } = useAdmin();
  if (!adminUser) return <div className="p-8 text-center text-red-700 font-semibold">Not authenticated.</div>;
  // Basic role gating: only allow super_admin (corporate account type mapped earlier)
  if (adminUser.role !== 'super_admin') {
    return <div className="p-8 text-center text-red-700 font-semibold">Insufficient permissions.</div>;
  }
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [diag, setDiag] = useState<any>(null);
  const [diagLoading, setDiagLoading] = useState(false);
  const [emailHealth, setEmailHealth] = useState<any[]>([]);
  const [emailHealthLoading, setEmailHealthLoading] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState<string>('');

  const fetchDiag = async () => {
    setDiagLoading(true);
    try {
      const resp = await diagnosticsAPI.get();
      if (resp.success) setDiag(resp.data);
    } catch(e) {}
    finally { setDiagLoading(false); }
  };
  useEffect(()=>{ if (activeTab==='overview') fetchDiag(); }, [activeTab]);
  // Auto refresh diagnostics every 60s while on overview
  useEffect(()=>{
    if (activeTab !== 'overview') return; 
    const id = setInterval(()=>fetchDiag(), 60000);
    return ()=> clearInterval(id);
  }, [activeTab]);

  const fetchEmailHealth = async () => {
    setEmailHealthLoading(true);
    try {
      const resp = await adminAPI.getEmailHealth();
      if ((resp as any).success) setEmailHealth((resp as any).providers || (resp as any).data?.providers || []);
    } catch(e) {}
    finally { setEmailHealthLoading(false); }
  };

  const sendTestEmail = async () => {
    setTestEmailStatus('');
    try {
      const resp = await adminAPI.sendTestNotification({ userId: adminUser.id, channel: 'email' });
      if (resp.success) setTestEmailStatus('Sent'); else setTestEmailStatus('Failed');
    } catch (e) { setTestEmailStatus('Failed'); }
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'enhanced', label: 'User Management', icon: Users },
    { id: 'customers', label: 'Customer Management', icon: Users },
    { id: 'accounts', label: 'Account Management', icon: CreditCard },
    { id: 'transactions', label: 'Transaction Management', icon: FileText },
    { id: 'generator', label: 'Transaction Generator', icon: Activity },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  const handleLogout = () => {
    adminLogout();
  };

  // Calculate statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalAccounts = customers.reduce((sum, customer) => sum + customer.accounts.length, 0);
  const totalBalance = customers.reduce((sum, customer) => 
    sum + customer.accounts.reduce((accSum, account) => accSum + account.balance, 0), 0
  );
  const totalTransactions = transactions.length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">System Overview</h2>
        <Badge variant="outline" className="text-green-600 border-green-200">
          <Activity className="h-3 w-3 mr-1" />
          System Online
        </Badge>
      </div>

  {/* Statistics & Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {activeCustomers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAccounts}</div>
            <p className="text-xs text-muted-foreground">
              Across all customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              System-wide deposits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              {pendingTransactions} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">System Health {diagLoading && <RefreshCw className="h-3 w-3 animate-spin" />}</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{diag? diag.overall : '...'}</div>
            <p className="text-xs text-muted-foreground">Uptime {diag?.uptimeSeconds ?? '...'}s</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DB / Redis</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">DB: {diag? (diag.db?.ok ? 'OK':'Down') : '...' } {typeof diag?.db?.latencyMs!=='undefined' && `${diag.db.latencyMs}ms`}</div>
            <div className="text-sm">Redis: {diag? (diag.redis?.ok ? 'OK':'Down') : '...'} {typeof diag?.redis?.latencyMs!=='undefined' && `${diag.redis.latencyMs}ms`}</div>
            <Button variant="outline" size="sm" className="mt-2" onClick={fetchDiag} disabled={diagLoading}>{diagLoading? 'Refreshing':'Refresh'}</Button>
          </CardContent>
        </Card>
      </div>

      {/* Provider Health & Email Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><Server className="h-4 w-4" /> Provider Health</CardTitle>
            <Button variant="outline" size="sm" onClick={fetchEmailHealth} disabled={emailHealthLoading}>{emailHealthLoading ? 'Loading...' : 'Refresh'}</Button>
          </CardHeader>
          <CardContent>
            {emailHealth.length === 0 ? (
              <p className="text-sm text-gray-500">No providers configured or unable to fetch status.</p>
            ) : (
              <ul className="space-y-2">
                {emailHealth.map((p:any, idx:number) => (
                  <li key={idx} className="flex items-center justify-between text-sm">
                    <span>{p.name}</span>
                    <span className={p.healthy ? 'text-green-600' : 'text-red-600'}>{p.healthy ? 'Healthy' : 'Down'}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2"><Mail className="h-4 w-4" /> Send Test Email</CardTitle>
            <CardDescription>Send a test notification email to the current admin user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Button onClick={sendTestEmail}>Send Test</Button>
              {testEmailStatus && <span className={`text-sm ${testEmailStatus==='Sent' ? 'text-green-600':'text-red-600'}`}>{testEmailStatus}</span>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2"
              onClick={() => setActiveTab('customers')}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">Add Customer</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2"
              onClick={() => setActiveTab('accounts')}
            >
              <CreditCard className="h-6 w-6" />
              <span className="text-sm">Create Account</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2"
              onClick={() => setActiveTab('transactions')}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Add Transaction</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-6 w-6" />
              <span className="text-sm">System Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <UBASLogoCompact width={140} height={32} className="hover:opacity-90 transition-opacity" />
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-red-600 border-red-200">
                <Shield className="h-3 w-3 mr-1" />
                Administrator
              </Badge>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{adminUser?.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{adminUser?.role}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className={`lg:w-64 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-none first:rounded-t-lg last:rounded-b-lg transition-colors ${
                          activeTab === item.id
                            ? 'bg-red-50 text-red-700 border-r-2 border-red-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'enhanced' && <EnhancedAdminOperations />}
            {activeTab === 'customers' && <CustomerManagement />}
            {activeTab === 'accounts' && <AccountManagement />}
            {activeTab === 'transactions' && <TransactionManagement />}
            {activeTab === 'generator' && <BackdatedTransactionGenerator />}
            {activeTab === 'templates' && <TemplatesManager />}
            {activeTab === 'settings' && <SystemSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
