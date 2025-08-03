import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Shield, 
  Star, 
  Gem, 
  Globe, 
  Award,
  Users,
  TrendingUp,
  Briefcase,
  Phone,
  Calendar,
  CreditCard,
  DollarSign,
  Eye,
  EyeOff,
  Settings,
  Bell,
  LogOut,
  Plane,
  Car,
  Home,
  Palette,
  Wine,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  RefreshCw,
  Zap,
  User
} from 'lucide-react';

interface PrivateBankingDashboardProps {
  onLogout: () => void;
}

export function PrivateBankingDashboard({ onLogout }: PrivateBankingDashboardProps) {
  const [showBalances, setShowBalances] = useState(true);

  // Mock data for private banking client
  const clientData = {
    name: 'Alexander J. Wellington III',
    title: 'Private Banking Client',
    clientId: 'PB-001-2024',
    relationshipManager: 'Victoria Sterling',
    totalNetWorth: 125000000,
    liquidAssets: 45000000,
    portfolioValue: 78000000,
    creditFacilities: 25000000,
    riskProfile: 'Moderate Aggressive',
    preferredCurrency: 'USD'
  };

  const portfolioBreakdown = [
    { category: 'Equities', value: 35000000, percentage: 44.9, change: 8.2 },
    { category: 'Fixed Income', value: 18000000, percentage: 23.1, change: 2.1 },
    { category: 'Alternative Investments', value: 15000000, percentage: 19.2, change: 12.5 },
    { category: 'Real Estate', value: 7000000, percentage: 9.0, change: 5.8 },
    { category: 'Cash & Equivalents', value: 3000000, percentage: 3.8, change: 0.5 }
  ];

  const recentTransactions = [
    { id: 1, type: 'Wire Transfer', description: 'Private Equity Investment - Blackstone Fund VII', amount: -5000000, date: '2024-01-15', status: 'Completed' },
    { id: 2, type: 'Dividend', description: 'Quarterly Dividend - Portfolio Holdings', amount: 125000, date: '2024-01-14', status: 'Completed' },
    { id: 3, type: 'Art Purchase', description: 'Sotheby\'s Auction - Contemporary Art', amount: -2500000, date: '2024-01-12', status: 'Completed' },
    { id: 4, type: 'Real Estate', description: 'Property Acquisition - Manhattan Penthouse', amount: -15000000, date: '2024-01-10', status: 'Pending' }
  ];

  const lifestyleServices = [
    { icon: Plane, title: 'Aircraft Financing', description: 'Gulfstream G650 - $65M facility approved', status: 'Active' },
    { icon: Car, title: 'Luxury Vehicles', description: 'Ferrari Collection - $2.5M credit line', status: 'Available' },
    { icon: Home, title: 'Real Estate', description: 'Global Properties - $50M portfolio', status: 'Managed' },
    { icon: Palette, title: 'Art & Collectibles', description: 'Fine Art Collection - $12M insured value', status: 'Curated' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gold-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-gold-600 rounded-full flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-400 to-yellow-400 bg-clip-text text-transparent">
                  {clientData.name}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  <span>Client ID: {clientData.clientId}</span>
                  <span>•</span>
                  <span>RM: {clientData.relationshipManager}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-gold-600 text-white border-gold-500">
                <Star className="h-3 w-3 mr-1" />
                Private Banking Elite
              </Badge>
              
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                <Phone className="h-4 w-4 mr-2" />
                Contact RM
              </Button>
              
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              
              <Button onClick={onLogout} variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wealth Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center justify-between">
                Total Net Worth
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalances(!showBalances)}
                  className="h-6 w-6 p-0 text-blue-600"
                >
                  {showBalances ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {showBalances ? formatCurrency(clientData.totalNetWorth) : '••••••••'}
              </div>
              <p className="text-xs text-blue-600 mt-1">+12.5% YTD</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700">Liquid Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {showBalances ? formatCurrency(clientData.liquidAssets) : '••••••••'}
              </div>
              <p className="text-xs text-green-600 mt-1">Available for investment</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {showBalances ? formatCurrency(clientData.portfolioValue) : '••••••••'}
              </div>
              <p className="text-xs text-purple-600 mt-1">+8.7% this quarter</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gold-50 to-yellow-100 border-gold-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gold-700">Credit Facilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gold-900">
                {showBalances ? formatCurrency(clientData.creditFacilities) : '••••••••'}
              </div>
              <p className="text-xs text-gold-600 mt-1">Available credit</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Portfolio & Transactions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Portfolio Allocation</span>
                  </span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{item.category}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                              {showBalances ? formatCurrency(item.value) : '••••••••'}
                            </span>
                            <Badge variant={item.change > 0 ? 'default' : 'destructive'} className="text-xs">
                              {formatPercentage(item.change)}
                            </Badge>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.percentage}% of portfolio</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <span>Recent Transactions</span>
                  </span>
                  <Button variant="outline" size="sm">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.amount > 0 ? 
                            <ArrowDownRight className="h-5 w-5 text-green-600" /> : 
                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                          }
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{transaction.type}</h4>
                          <p className="text-sm text-gray-600">{transaction.description}</p>
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {showBalances ? formatCurrency(Math.abs(transaction.amount)) : '••••••••'}
                        </div>
                        <Badge variant={transaction.status === 'Completed' ? 'default' : 'secondary'} className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Services & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-gold-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Investment
                </Button>
                <Button variant="outline" className="w-full">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Wire Transfer
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Concierge
                </Button>
              </CardContent>
            </Card>

            {/* Lifestyle Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gem className="h-5 w-5 text-purple-600" />
                  <span>Lifestyle Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lifestyleServices.map((service, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <service.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{service.title}</h4>
                      <p className="text-xs text-gray-600">{service.description}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Relationship Manager */}
            <Card className="bg-gradient-to-br from-gold-50 to-yellow-50 border-gold-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gold-600" />
                  <span>Your Team</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900">{clientData.relationshipManager}</h4>
                  <p className="text-sm text-gray-600 mb-4">Senior Relationship Manager</p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Direct
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
