import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedInvestmentDashboard } from '@/components/investment/EnhancedInvestmentDashboard';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Globe,
  Building,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Zap
} from 'lucide-react';

interface Investment {
  id: string;
  name: string;
  symbol: string;
  type: 'stock' | 'bond' | 'fund' | 'crypto' | 'commodity';
  value: number;
  change: number;
  changePercent: number;
  quantity: number;
  avgPrice: number;
}

interface Portfolio {
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  investments: Investment[];
}

export function InvestmentDashboard() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEnhancedView, setShowEnhancedView] = useState(false);

  useEffect(() => {
    // Simulate portfolio data
    const mockPortfolio: Portfolio = {
      totalValue: 125750.50,
      totalGain: 8750.50,
      totalGainPercent: 7.48,
      investments: [
        {
          id: '1',
          name: 'Apple Inc.',
          symbol: 'AAPL',
          type: 'stock',
          value: 45250.00,
          change: 125.50,
          changePercent: 2.85,
          quantity: 250,
          avgPrice: 181.00
        },
        {
          id: '2',
          name: 'Microsoft Corporation',
          symbol: 'MSFT',
          type: 'stock',
          value: 32100.00,
          change: -85.25,
          changePercent: -0.26,
          quantity: 100,
          avgPrice: 321.00
        },
        {
          id: '3',
          name: 'Vanguard S&P 500 ETF',
          symbol: 'VOO',
          type: 'fund',
          value: 28400.50,
          change: 142.00,
          changePercent: 0.50,
          quantity: 75,
          avgPrice: 378.67
        },
        {
          id: '4',
          name: 'Bitcoin',
          symbol: 'BTC',
          type: 'crypto',
          value: 15000.00,
          change: 750.00,
          changePercent: 5.26,
          quantity: 0.35,
          avgPrice: 42857.14
        },
        {
          id: '5',
          name: 'US Treasury Bonds',
          symbol: 'UST',
          type: 'bond',
          value: 5000.00,
          change: 25.00,
          changePercent: 0.50,
          quantity: 50,
          avgPrice: 100.00
        }
      ]
    };

    setPortfolio(mockPortfolio);
  }, []);

  // Show enhanced dashboard if enabled
  if (showEnhancedView) {
    return <EnhancedInvestmentDashboard onBack={() => setShowEnhancedView(false)} />;
  }

  const getInvestmentIcon = (type: Investment['type']) => {
    switch (type) {
      case 'stock':
        return <TrendingUp className="h-4 w-4" />;
      case 'bond':
        return <Building className="h-4 w-4" />;
      case 'fund':
        return <PieChart className="h-4 w-4" />;
      case 'crypto':
        return <Coins className="h-4 w-4" />;
      case 'commodity':
        return <Globe className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!portfolio) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Enhanced View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Investment Portfolio</h2>
          <p className="text-muted-foreground">Track and manage your investments</p>
        </div>
        <Button onClick={() => setShowEnhancedView(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Zap className="h-4 w-4 mr-2" />
          Enhanced Trading View
        </Button>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{/* ... rest of component stays the same */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</div>
            <div className={`flex items-center text-xs ${
              portfolio.totalGain >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {portfolio.totalGain >= 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              {formatCurrency(Math.abs(portfolio.totalGain))} ({portfolio.totalGainPercent.toFixed(2)}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">BTC</div>
            <div className="text-xs text-green-600">+5.26% today</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asset Allocation</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-muted-foreground">Different asset types</div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="funds">Funds & ETFs</TabsTrigger>
          <TabsTrigger value="alternative">Alternative</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Holdings</CardTitle>
              <CardDescription>Your complete investment portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio.investments.map((investment) => (
                  <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {getInvestmentIcon(investment.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{investment.name}</h4>
                        <p className="text-sm text-gray-600">
                          {investment.symbol} • {investment.quantity} shares
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(investment.value)}</p>
                      <div className={`flex items-center text-sm ${
                        investment.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {investment.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {investment.changePercent >= 0 ? '+' : ''}{investment.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stocks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Holdings</CardTitle>
              <CardDescription>Individual company stocks in your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio.investments
                  .filter(inv => inv.type === 'stock')
                  .map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{investment.name}</h4>
                          <p className="text-sm text-gray-600">
                            {investment.symbol} • {investment.quantity} shares @ {formatCurrency(investment.avgPrice)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(investment.value)}</p>
                        <Badge variant={investment.change >= 0 ? 'default' : 'destructive'}>
                          {investment.changePercent >= 0 ? '+' : ''}{investment.changePercent.toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funds & ETFs</CardTitle>
              <CardDescription>Diversified investment funds and ETFs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio.investments
                  .filter(inv => inv.type === 'fund' || inv.type === 'bond')
                  .map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-full">
                          {getInvestmentIcon(investment.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{investment.name}</h4>
                          <p className="text-sm text-gray-600">
                            {investment.symbol} • {investment.quantity} units
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(investment.value)}</p>
                        <Badge variant={investment.change >= 0 ? 'default' : 'destructive'}>
                          {investment.changePercent >= 0 ? '+' : ''}{investment.changePercent.toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alternative" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alternative Investments</CardTitle>
              <CardDescription>Cryptocurrency and commodity investments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio.investments
                  .filter(inv => inv.type === 'crypto' || inv.type === 'commodity')
                  .map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-orange-100 rounded-full">
                          {getInvestmentIcon(investment.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{investment.name}</h4>
                          <p className="text-sm text-gray-600">
                            {investment.symbol} • {investment.quantity} units
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(investment.value)}</p>
                        <Badge variant={investment.change >= 0 ? 'default' : 'destructive'}>
                          {investment.changePercent >= 0 ? '+' : ''}{investment.changePercent.toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button className="h-12">
          <TrendingUp className="h-4 w-4 mr-2" />
          Buy Investments
        </Button>
        <Button variant="outline" className="h-12">
          <TrendingDown className="h-4 w-4 mr-2" />
          Sell Holdings
        </Button>
        <Button variant="outline" className="h-12">
          <BarChart3 className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
        <Button variant="outline" className="h-12" onClick={() => setShowEnhancedView(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Advanced Tools
        </Button>
      </div>
    </div>
  );
}
