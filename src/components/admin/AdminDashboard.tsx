import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Search,
  Filter,
  Download,
  Settings,
  Shield,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { AccountService, AccountType } from '@/lib/accountService';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'active' | 'pending' | 'suspended' | 'closed';
  kycStatus: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  lastLogin?: Date;
  accounts: Account[];
}

interface Account {
  id: string;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  status: 'active' | 'frozen' | 'closed';
}

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  // New user form state
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    accountType: AccountType.PERSONAL_CHECKING,
    initialDeposit: 1000
  });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalAccounts: users.reduce((sum, u) => sum + u.accounts.length, 0),
    totalBalance: users.reduce((sum, u) => 
      sum + u.accounts.reduce((accSum, acc) => accSum + acc.balance, 0), 0
    )
  };

  const handleCreateUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Generate account information
      const accountInfo = AccountService.generateAccountInfo(
        newUser.accountType,
        newUser.firstName,
        newUser.lastName
      );

      // Create new user with account
      const user: User = {
        id: `user_${Date.now()}`,
        username: accountInfo.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        status: 'active',
        kycStatus: 'approved', // Pre-approved for demo clients
        createdAt: new Date(),
        accounts: [{
          id: `acc_${Date.now()}`,
          accountNumber: accountInfo.accountNumber,
          accountType: newUser.accountType,
          balance: newUser.initialDeposit,
          status: 'active'
        }]
      };

      setUsers(prev => [...prev, user]);
      setIsCreatingUser(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        accountType: AccountType.PERSONAL_CHECKING,
        initialDeposit: 1000
      });

      toast({
        title: 'User Created Successfully',
        description: `Account ${accountInfo.accountNumber} created for ${newUser.firstName} ${newUser.lastName}`,
      });

      // Show login credentials
      toast({
        title: 'Login Credentials',
        description: `Username: ${accountInfo.username} | Account: ${accountInfo.accountNumber} | Password: TempPass123!`,
      });

    } catch (error) {
      toast({
        title: 'Error Creating User',
        description: 'Failed to create user account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddFunds = (userId: string, accountId: string, amount: number) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          accounts: user.accounts.map(acc => {
            if (acc.id === accountId) {
              return { ...acc, balance: acc.balance + amount };
            }
            return acc;
          })
        };
      }
      return user;
    }));

    toast({
      title: 'Funds Added',
      description: `$${amount.toLocaleString()} added to account.`,
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">UBAS Financial Trust - Admin Dashboard</h1>
          <p className="text-gray-600">Manage client accounts for demonstration purposes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Active demo accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAccounts}</div>
              <p className="text-xs text-muted-foreground">All account types</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Simulated funds</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="create">Create Demo Account</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Demo Client Accounts</CardTitle>
                <CardDescription>Manage demonstration accounts for prospective clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-medium">{user.firstName} {user.lastName}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">Username: {user.username}</p>
                        </div>
                        <div className="space-x-2">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                          <Badge variant={user.kycStatus === 'approved' ? 'default' : 'destructive'}>
                            KYC: {user.kycStatus}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="text-right mr-4">
                          <p className="font-medium">
                            ${user.accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.accounts.length} account{user.accounts.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddFunds(user.id, user.accounts[0]?.id, 1000)}
                        >
                          Add $1K
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No users found matching your criteria.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Demo Account</CardTitle>
                <CardDescription>Create a new demonstration account for prospective clients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@company.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select 
                      value={newUser.accountType} 
                      onValueChange={(value) => setNewUser(prev => ({ ...prev, accountType: value as AccountType }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={AccountType.PERSONAL_CHECKING}>Personal Checking</SelectItem>
                        <SelectItem value={AccountType.PERSONAL_SAVINGS}>Personal Savings</SelectItem>
                        <SelectItem value={AccountType.BUSINESS_CHECKING}>Business Checking</SelectItem>
                        <SelectItem value={AccountType.BUSINESS_SAVINGS}>Business Savings</SelectItem>
                        <SelectItem value={AccountType.INVESTMENT}>Investment Account</SelectItem>
                        <SelectItem value={AccountType.PRIVATE_BANKING}>Private Banking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="initialDeposit">Initial Balance ($)</Label>
                    <Input
                      id="initialDeposit"
                      type="number"
                      value={newUser.initialDeposit}
                      onChange={(e) => setNewUser(prev => ({ ...prev, initialDeposit: parseInt(e.target.value) || 0 }))}
                      min="100"
                      step="100"
                    />
                  </div>
                </div>

                <Button onClick={handleCreateUser} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Demo Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Configure system settings for demonstration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input value="UBAS Financial Trust" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Routing Number</Label>
                    <Input value="021000021" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>SWIFT Code</Label>
                    <Input value="UBASFINTRUST" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Demo Mode</Label>
                    <Badge variant="default">ACTIVE</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
