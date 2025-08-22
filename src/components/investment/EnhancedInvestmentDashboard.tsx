import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBankingData } from '@/hooks/useBankingData';
import { investmentAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
// Removed unused Textarea import
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
  Search,
  Plus,
  Minus,
  Bell,
  RefreshCw,
  Download,
  Target,
  Shield,
  Activity,
  Star,
  StarOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
  PlusCircle,
  MinusCircle,
  ExternalLink
} from 'lucide-react';

interface Investment {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'etf' | 'mutual_fund' | 'bond' | 'crypto' | 'commodity';
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  totalGain: number;
  totalGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
  sector?: string;
  exchange?: string;
  dividendYield?: number;
}

interface Portfolio {
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
  cash: number;
  investments: Investment[];
}

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
  dividendYield?: number;
  high52Week?: number;
  low52Week?: number;
}

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  addedAt: string;
}

interface PriceAlert {
  id: string;
  symbol: string;
  alertType: string;
  targetPrice: number;
  currentPrice: number;
  status: 'active' | 'triggered' | 'expired';
  createdAt: string;
}

interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  symbols: string[];
}

interface EnhancedInvestmentDashboardProps {
  onBack: () => void;
}

export function EnhancedInvestmentDashboard({ onBack }: EnhancedInvestmentDashboardProps) {
  const { user } = useAuth();
  const { accounts, formatCurrency } = useBankingData();
  const { toast } = useToast();

  // Data states
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [buyForm, setBuyForm] = useState({
    symbol: '',
    quantity: '',
    orderType: 'market' as 'market' | 'limit' | 'stop',
    limitPrice: '',
    fromAccountId: '',
  });

  const [sellForm, setSellForm] = useState({
    symbol: '',
    quantity: '',
    orderType: 'market' as 'market' | 'limit' | 'stop',
    limitPrice: '',
  });

  const [alertForm, setAlertForm] = useState({
    symbol: '',
    alertType: 'above' as 'above' | 'below',
    targetPrice: '',
    notificationMethod: 'email' as 'email' | 'sms' | 'push',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration - in real app, this would come from API
      const mockPortfolio: Portfolio = {
        totalValue: 125750.50,
        totalGain: 8750.50,
        totalGainPercent: 7.48,
        dayChange: 1250.75,
        dayChangePercent: 1.01,
        cash: 5430.25,
        investments: [
          {
            id: '1',
            symbol: 'AAPL',
            name: 'Apple Inc.',
            type: 'stock',
            quantity: 250,
            avgPrice: 181.00,
            currentPrice: 189.25,
            marketValue: 47312.50,
            totalGain: 2062.50,
            totalGainPercent: 4.56,
            dayChange: 125.50,
            dayChangePercent: 0.67,
            sector: 'Technology',
            exchange: 'NASDAQ',
            dividendYield: 0.44
          },
          {
            id: '2',
            symbol: 'MSFT',
            name: 'Microsoft Corporation',
            type: 'stock',
            quantity: 100,
            avgPrice: 321.00,
            currentPrice: 334.50,
            marketValue: 33450.00,
            totalGain: 1350.00,
            totalGainPercent: 4.21,
            dayChange: 85.25,
            dayChangePercent: 0.26,
            sector: 'Technology',
            exchange: 'NASDAQ',
            dividendYield: 0.72
          },
          {
            id: '3',
            symbol: 'VOO',
            name: 'Vanguard S&P 500 ETF',
            type: 'etf',
            quantity: 75,
            avgPrice: 378.67,
            currentPrice: 385.40,
            marketValue: 28905.00,
            totalGain: 504.75,
            totalGainPercent: 1.78,
            dayChange: 142.00,
            dayChangePercent: 0.49,
            dividendYield: 1.38
          },
          {
            id: '4',
            symbol: 'BTC',
            name: 'Bitcoin',
            type: 'crypto',
            quantity: 0.35,
            avgPrice: 42857.14,
            currentPrice: 45250.00,
            marketValue: 15837.50,
            totalGain: 837.50,
            totalGainPercent: 5.58,
            dayChange: 750.00,
            dayChangePercent: 4.97
          }
        ]
      };

      const mockWatchlist: WatchlistItem[] = [
        {
          symbol: 'TSLA',
          name: 'Tesla Inc.',
          price: 245.67,
          change: 12.45,
          changePercent: 5.34,
          addedAt: '2024-01-15T10:30:00Z'
        },
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          price: 138.21,
          change: -2.15,
          changePercent: -1.53,
          addedAt: '2024-01-14T14:20:00Z'
        }
      ];

      const mockNews: NewsItem[] = [
        {
          id: '1',
          headline: 'Apple Reports Strong Q4 Earnings',
          summary: 'Apple exceeded expectations with record iPhone sales...',
          source: 'Reuters',
          publishedAt: '2024-01-15T15:30:00Z',
          url: '#',
          sentiment: 'positive',
          symbols: ['AAPL']
        },
        {
          id: '2',
          headline: 'Tech Sector Shows Resilience Amid Market Volatility',
          summary: 'Major technology stocks continue to outperform...',
          source: 'Financial Times',
          publishedAt: '2024-01-15T12:15:00Z',
          url: '#',
          sentiment: 'positive',
          symbols: ['AAPL', 'MSFT', 'GOOGL']
        }
      ];

      setPortfolio(mockPortfolio);
      setWatchlist(mockWatchlist);
      setNews(mockNews);
    } catch (error) {
      toast({
        title: 'Error Loading Data',
        description: 'Failed to load investment data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Search investments
  const searchInvestments = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Mock search results
      const mockResults = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          type: 'stock',
          exchange: 'NASDAQ',
          price: 189.25,
          change: 2.15,
          changePercent: 1.15,
          sector: 'Technology'
        },
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          type: 'stock',
          exchange: 'NASDAQ',
          price: 138.21,
          change: -2.15,
          changePercent: -1.53,
          sector: 'Technology'
        }
      ].filter(item => 
        item.symbol.toLowerCase().includes(query.toLowerCase()) ||
        item.name.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(mockResults);
    } catch (error) {
      toast({
        title: 'Search Failed',
        description: 'Could not search investments. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Buy investment
  const buyInvestment = async () => {
    if (!buyForm.symbol || !buyForm.quantity || !buyForm.fromAccountId) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Order Placed',
        description: `Buy order for ${buyForm.quantity} shares of ${buyForm.symbol} has been placed.`,
      });
      
      setShowBuyModal(false);
      resetBuyForm();
      loadData(); // Refresh data
    } catch (error) {
      toast({
        title: 'Order Failed',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sell investment
  const sellInvestment = async () => {
    if (!sellForm.symbol || !sellForm.quantity) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Sell Order Placed',
        description: `Sell order for ${sellForm.quantity} shares of ${sellForm.symbol} has been placed.`,
      });
      
      setShowSellModal(false);
      resetSellForm();
      loadData(); // Refresh data
    } catch (error) {
      toast({
        title: 'Order Failed',
        description: 'There was an error placing your sell order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add to watchlist
  const addToWatchlist = async (symbol: string) => {
    try {
      // Mock adding to watchlist
      const newItem: WatchlistItem = {
        symbol,
        name: `${symbol} Company`, // Would get from API
        price: 100.00, // Would get from API
        change: 0,
        changePercent: 0,
        addedAt: new Date().toISOString()
      };
      
      setWatchlist(prev => [...prev, newItem]);
      
      toast({
        title: 'Added to Watchlist',
        description: `${symbol} has been added to your watchlist.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add to watchlist. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Remove from watchlist
  const removeFromWatchlist = async (symbol: string) => {
    try {
      setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
      
      toast({
        title: 'Removed from Watchlist',
        description: `${symbol} has been removed from your watchlist.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove from watchlist. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const resetBuyForm = () => {
    setBuyForm({
      symbol: '',
      quantity: '',
      orderType: 'market',
      limitPrice: '',
      fromAccountId: '',
    });
  };

  const resetSellForm = () => {
    setSellForm({
      symbol: '',
      quantity: '',
      orderType: 'market',
      limitPrice: '',
    });
  };

  const getInvestmentIcon = (type: Investment['type']) => {
    switch (type) {
      case 'stock':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'etf':
        return <PieChart className="h-5 w-5 text-green-600" />;
      case 'mutual_fund':
        return <BarChart3 className="h-5 w-5 text-purple-600" />;
      case 'bond':
        return <Shield className="h-5 w-5 text-gray-600" />;
      case 'crypto':
        return <Coins className="h-5 w-5 text-orange-600" />;
      case 'commodity':
        return <Globe className="h-5 w-5 text-yellow-600" />;
      default:
        return <Building className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: Investment['type']) => {
    switch (type) {
      case 'stock': return 'bg-blue-100 text-blue-800';
      case 'etf': return 'bg-green-100 text-green-800';
      case 'mutual_fund': return 'bg-purple-100 text-purple-800';
      case 'bond': return 'bg-gray-100 text-gray-800';
      case 'crypto': return 'bg-orange-100 text-orange-800';
      case 'commodity': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading investment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Investment Dashboard</h1>
              <p className="text-gray-600">Portfolio management, trading, and market insights</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={() => loadData()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setShowBuyModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Buy
              </Button>
            </div>
          </div>
        </div>

        {/* Portfolio Summary */}
        {portfolio && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(portfolio.totalValue)}</p>
                    <div className={`flex items-center text-xs ${portfolio.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {portfolio.dayChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                      {formatCurrency(Math.abs(portfolio.dayChange))} ({portfolio.dayChangePercent.toFixed(2)}%)
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Gain/Loss</p>
                    <p className={`text-2xl font-bold ${portfolio.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(portfolio.totalGain))}
                    </p>
                    <p className={`text-xs ${portfolio.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {portfolio.totalGainPercent >= 0 ? '+' : ''}{portfolio.totalGainPercent.toFixed(2)}%
                    </p>
                  </div>
                  {portfolio.totalGain >= 0 ? 
                    <TrendingUp className="h-8 w-8 text-green-600" /> : 
                    <TrendingDown className="h-8 w-8 text-red-600" />
                  }
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cash Balance</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(portfolio.cash)}</p>
                    <p className="text-xs text-gray-500">Available for investing</p>
                  </div>
                  <Building className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Holdings</p>
                    <p className="text-2xl font-bold text-purple-600">{portfolio.investments.length}</p>
                    <p className="text-xs text-gray-500">Different investments</p>
                  </div>
                  <PieChart className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Holdings */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Current Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolio && (
                    <div className="space-y-4">
                      {portfolio.investments.map((investment) => (
                        <div key={investment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-100 rounded-full">
                              {getInvestmentIcon(investment.type)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900">{investment.symbol}</h4>
                                <Badge className={getTypeColor(investment.type)}>{investment.type.toUpperCase()}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">{investment.name}</p>
                              <p className="text-xs text-gray-500">
                                {investment.quantity} shares @ {formatCurrency(investment.avgPrice)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{formatCurrency(investment.marketValue)}</p>
                            <div className={`text-sm ${investment.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {investment.totalGain >= 0 ? '+' : ''}{formatCurrency(investment.totalGain)}
                            </div>
                            <div className={`text-xs ${investment.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {investment.dayChange >= 0 ? '+' : ''}{investment.dayChangePercent.toFixed(2)}% today
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSellForm(prev => ({ ...prev, symbol: investment.symbol, quantity: investment.quantity.toString() }));
                                setSelectedInvestment(investment);
                                setShowSellModal(true);
                              }}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setBuyForm(prev => ({ ...prev, symbol: investment.symbol }));
                                setShowBuyModal(true);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Asset Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolio && (
                    <div className="space-y-4">
                      {['stock', 'etf', 'crypto', 'bond'].map((type) => {
                        const investments = portfolio.investments.filter(inv => inv.type === type);
                        const totalValue = investments.reduce((sum, inv) => sum + inv.marketValue, 0);
                        const percentage = (totalValue / portfolio.totalValue) * 100;
                        
                        if (totalValue === 0) return null;
                        
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getInvestmentIcon(type as Investment['type'])}
                              <span className="capitalize font-medium">{type}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(totalValue)}</p>
                              <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trading Tab */}
          <TabsContent value="trading" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Search and Buy */}
              <Card>
                <CardHeader>
                  <CardTitle>Search & Trade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Search Investments</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search stocks, ETFs, crypto..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            searchInvestments(e.target.value);
                          }}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    {searchResults.length > 0 && (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {searchResults.map((result) => (
                          <div key={result.symbol} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{result.symbol}</span>
                                <Badge variant="outline">{result.type}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">{result.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(result.price)}</p>
                              <div className={`text-sm ${result.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {result.change >= 0 ? '+' : ''}{result.changePercent.toFixed(2)}%
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => addToWatchlist(result.symbol)}
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => {
                                  setBuyForm(prev => ({ ...prev, symbol: result.symbol }));
                                  setShowBuyModal(true);
                                }}
                              >
                                Buy
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" onClick={() => setShowBuyModal(true)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Buy Investment
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setShowSellModal(true)}>
                      <MinusCircle className="h-4 w-4 mr-2" />
                      Sell Investment
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Statements
                    </Button>
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Performance Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Watchlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {watchlist.map((item) => (
                    <div key={item.symbol} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.symbol}</h4>
                        <p className="text-sm text-gray-600">{item.name}</p>
                        <p className="text-xs text-gray-500">Added {new Date(item.addedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.price)}</p>
                        <div className={`text-sm ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeFromWatchlist(item.symbol)}
                        >
                          <StarOff className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setBuyForm(prev => ({ ...prev, symbol: item.symbol }));
                            setShowBuyModal(true);
                          }}
                        >
                          Buy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Research Tab */}
          <TabsContent value="research" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">S&P 500</p>
                        <p className="text-xl font-bold">4,155.38</p>
                        <p className="text-sm text-green-600">+0.75%</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">NASDAQ</p>
                        <p className="text-xl font-bold">12,975.69</p>
                        <p className="text-sm text-red-600">-0.23%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trending Stocks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['AAPL', 'MSFT', 'GOOGL', 'TSLA'].map((symbol) => (
                      <div key={symbol} className="flex items-center justify-between">
                        <span className="font-medium">{symbol}</span>
                        <div className="text-right">
                          <p className="text-sm">$189.25</p>
                          <p className="text-xs text-green-600">+1.15%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-6">
            <div className="space-y-4">
              {news.map((article) => (
                <Card key={article.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {getSentimentIcon(article.sentiment)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{article.headline}</h3>
                          <Badge variant="outline" className="text-xs">
                            {article.source}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                          <div className="flex space-x-1">
                            {article.symbols.map((symbol) => (
                              <Badge key={symbol} variant="outline" className="text-xs">
                                {symbol}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Price Alerts</h2>
              <Button onClick={() => setShowAlertModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
                  <p className="text-gray-600 mb-4">Create price alerts to stay informed about your investments.</p>
                  <Button onClick={() => setShowAlertModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Buy Modal */}
        <Dialog open={showBuyModal} onOpenChange={setShowBuyModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Buy Investment</DialogTitle>
              <DialogDescription>Place a buy order for stocks, ETFs, or other investments</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Symbol</Label>
                  <Input
                    value={buyForm.symbol}
                    onChange={(e) => setBuyForm(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                    placeholder="e.g., AAPL"
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={buyForm.quantity}
                    onChange={(e) => setBuyForm(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="Number of shares"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order Type</Label>
                  <Select 
                    value={buyForm.orderType} 
                    onValueChange={(value: 'market' | 'limit' | 'stop') => 
                      setBuyForm(prev => ({ ...prev, orderType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Order</SelectItem>
                      <SelectItem value="limit">Limit Order</SelectItem>
                      <SelectItem value="stop">Stop Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {buyForm.orderType === 'limit' && (
                  <div>
                    <Label>Limit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={buyForm.limitPrice}
                      onChange={(e) => setBuyForm(prev => ({ ...prev, limitPrice: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label>Pay From Account</Label>
                <Select 
                  value={buyForm.fromAccountId} 
                  onValueChange={(value) => setBuyForm(prev => ({ ...prev, fromAccountId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.accountType} ({account.accountNumber}) - {formatCurrency(account.balance)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowBuyModal(false)}>
                  Cancel
                </Button>
                <Button onClick={buyInvestment} disabled={isSubmitting}>
                  {isSubmitting ? 'Placing Order...' : 'Place Buy Order'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Sell Modal */}
        <Dialog open={showSellModal} onOpenChange={setShowSellModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Sell Investment</DialogTitle>
              <DialogDescription>Place a sell order for your holdings</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Symbol</Label>
                  <Input
                    value={sellForm.symbol}
                    onChange={(e) => setSellForm(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                    placeholder="e.g., AAPL"
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={sellForm.quantity}
                    onChange={(e) => setSellForm(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="Number of shares"
                  />
                  {selectedInvestment && (
                    <p className="text-xs text-gray-500 mt-1">
                      You own {selectedInvestment.quantity} shares
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order Type</Label>
                  <Select 
                    value={sellForm.orderType} 
                    onValueChange={(value: 'market' | 'limit' | 'stop') => 
                      setSellForm(prev => ({ ...prev, orderType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Order</SelectItem>
                      <SelectItem value="limit">Limit Order</SelectItem>
                      <SelectItem value="stop">Stop Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {sellForm.orderType === 'limit' && (
                  <div>
                    <Label>Limit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={sellForm.limitPrice}
                      onChange={(e) => setSellForm(prev => ({ ...prev, limitPrice: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowSellModal(false)}>
                  Cancel
                </Button>
                <Button onClick={sellInvestment} disabled={isSubmitting} variant="destructive">
                  {isSubmitting ? 'Placing Order...' : 'Place Sell Order'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
