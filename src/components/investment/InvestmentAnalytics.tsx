import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RechartsTooltipProps 
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Target,
  Calendar,
  BarChart3,
  Download,
  RefreshCw,
  Award,
  AlertTriangle,
  Info
} from 'lucide-react';

interface PerformanceData {
  date: string;
  portfolioValue: number;
  sp500: number;
  nasdaq: number;
}

interface AllocationData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface PerformanceMetrics {
  totalReturn: number;
  totalReturnPercent: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  alpha: number;
  dividendYield: number;
}

interface DividendData {
  month: string;
  amount: number;
  growth: number;
}

interface TopPerformers {
  symbol: string;
  name: string;
  return: number;
  value: number;
}

export function InvestmentAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('1Y');
  const [activeTab, setActiveTab] = useState('performance');
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [allocationData, setAllocationData] = useState<AllocationData[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [dividendData, setDividendData] = useState<DividendData[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformers[]>([]);
  const [worstPerformers, setWorstPerformers] = useState<TopPerformers[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = () => {
    // Mock performance data
    const mockPerformanceData: PerformanceData[] = Array.from({ length: 12 }, (_, i) => {
      const baseValue = 100000;
      const growth = Math.random() * 0.1 + 0.05; // 5-15% growth
      const volatility = Math.random() * 0.02; // 2% volatility
      
      return {
        date: new Date(2024, i, 1).toISOString().split('T')[0],
        portfolioValue: baseValue * (1 + growth * (i / 12)) * (1 + (Math.random() - 0.5) * volatility),
        sp500: baseValue * (1 + 0.08 * (i / 12)) * (1 + (Math.random() - 0.5) * 0.015),
        nasdaq: baseValue * (1 + 0.12 * (i / 12)) * (1 + (Math.random() - 0.5) * 0.02)
      };
    });

    const mockAllocationData: AllocationData[] = [
      { name: 'Stocks', value: 75000, color: '#E53935', percentage: 60 },
      { name: 'ETFs', value: 25000, color: '#D32F2F', percentage: 20 },
      { name: 'Bonds', value: 12500, color: '#C62828', percentage: 10 },
      { name: 'Crypto', value: 7500, color: '#B71C1C', percentage: 6 },
      { name: 'Commodities', value: 5000, color: '#FF5252', percentage: 4 }
    ];

    const mockMetrics: PerformanceMetrics = {
      totalReturn: 8750.50,
      totalReturnPercent: 7.48,
      annualizedReturn: 12.35,
      sharpeRatio: 1.42,
      maxDrawdown: -8.25,
      volatility: 15.67,
      beta: 1.05,
      alpha: 2.8,
      dividendYield: 2.15
    };

    const mockDividendData: DividendData[] = [
      { month: 'Jan', amount: 125.50, growth: 5.2 },
      { month: 'Feb', amount: 132.75, growth: 7.8 },
      { month: 'Mar', amount: 128.30, growth: 3.1 },
      { month: 'Apr', amount: 145.20, growth: 12.5 },
      { month: 'May', amount: 138.90, growth: 8.7 },
      { month: 'Jun', amount: 152.40, growth: 15.2 }
    ];

    const mockTopPerformers: TopPerformers[] = [
      { symbol: 'NVDA', name: 'NVIDIA Corporation', return: 24.5, value: 15250 },
      { symbol: 'AAPL', name: 'Apple Inc.', return: 18.2, value: 45250 },
      { symbol: 'TSLA', name: 'Tesla Inc.', return: 16.8, value: 8950 }
    ];

    const mockWorstPerformers: TopPerformers[] = [
      { symbol: 'META', name: 'Meta Platforms', return: -5.2, value: 12000 },
      { symbol: 'NFLX', name: 'Netflix Inc.', return: -3.8, value: 7500 },
      { symbol: 'PYPL', name: 'PayPal Holdings', return: -2.1, value: 5000 }
    ];

    setPerformanceData(mockPerformanceData);
    setAllocationData(mockAllocationData);
    setMetrics(mockMetrics);
    setDividendData(mockDividendData);
    setTopPerformers(mockTopPerformers);
    setWorstPerformers(mockWorstPerformers);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getMetricStatus = (value: number, threshold: number, isPositive: boolean = true) => {
    const isGood = isPositive ? value >= threshold : value <= threshold;
    return isGood ? 'good' : 'average';
  };

  const CustomTooltip: React.FC<RechartsTooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value as number)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Investment Analytics</h2>
          <p className="text-muted-foreground">Comprehensive portfolio performance analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
              <SelectItem value="3Y">3 Years</SelectItem>
              <SelectItem value="5Y">5 Years</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Return</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalReturn)}</p>
                  <p className={`text-sm ${metrics.totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercent(metrics.totalReturnPercent)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Annualized Return</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPercent(metrics.annualizedReturn)}</p>
                  <Badge variant={getMetricStatus(metrics.annualizedReturn, 10) === 'good' ? 'default' : 'secondary'}>
                    {getMetricStatus(metrics.annualizedReturn, 10) === 'good' ? 'Excellent' : 'Good'}
                  </Badge>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sharpe Ratio</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.sharpeRatio.toFixed(2)}</p>
                  <Badge variant={getMetricStatus(metrics.sharpeRatio, 1.0) === 'good' ? 'default' : 'secondary'}>
                    {getMetricStatus(metrics.sharpeRatio, 1.0) === 'good' ? 'Good' : 'Average'}
                  </Badge>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Max Drawdown</p>
                  <p className="text-2xl font-bold text-red-600">{formatPercent(metrics.maxDrawdown)}</p>
                  <Badge variant={getMetricStatus(Math.abs(metrics.maxDrawdown), 10, false) === 'good' ? 'default' : 'destructive'}>
                    {getMetricStatus(Math.abs(metrics.maxDrawdown), 10, false) === 'good' ? 'Low Risk' : 'High Risk'}
                  </Badge>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
          <TabsTrigger value="dividends">Dividends</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance vs Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="portfolioValue" 
                      stroke="#E53935" 
                      strokeWidth={3}
                      name="Your Portfolio"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sp500" 
                      stroke="#D32F2F" 
                      strokeWidth={2}
                      name="S&P 500"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="nasdaq" 
                      stroke="#C62828" 
                      strokeWidth={2}
                      name="NASDAQ"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Allocation Tab */}
        <TabsContent value="allocation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Allocation Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allocationData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.value)}</p>
                        <p className="text-sm text-gray-500">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Metrics Tab */}
        <TabsContent value="risk" className="space-y-6">
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Volatility</p>
                        <p className="text-sm text-gray-600">Standard deviation of returns</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatPercent(metrics.volatility)}</p>
                        <Badge variant={getMetricStatus(metrics.volatility, 20, false) === 'good' ? 'default' : 'destructive'}>
                          {getMetricStatus(metrics.volatility, 20, false) === 'good' ? 'Low' : 'High'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Beta</p>
                        <p className="text-sm text-gray-600">Market correlation</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{metrics.beta.toFixed(2)}</p>
                        <Badge variant="outline">
                          {metrics.beta > 1 ? 'Aggressive' : 'Conservative'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Alpha</p>
                        <p className="text-sm text-gray-600">Excess return vs market</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${metrics.alpha >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercent(metrics.alpha)}
                        </p>
                        <Badge variant={metrics.alpha >= 0 ? 'default' : 'destructive'}>
                          {metrics.alpha >= 0 ? 'Outperforming' : 'Underperforming'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-200"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          className="text-blue-600"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="65, 100"
                          fill="none"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">6.5</span>
                      </div>
                    </div>
                    <p className="text-lg font-medium">Moderate Risk</p>
                    <p className="text-sm text-gray-600">Your portfolio has balanced risk exposure</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Dividends Tab */}
        <TabsContent value="dividends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dividend Income Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dividendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#E53935" 
                        fill="#E53935" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dividend Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Annual Dividend Yield</p>
                      <p className="text-3xl font-bold text-green-700">{formatPercent(metrics.dividendYield)}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">This Year</p>
                      <p className="text-xl font-bold">{formatCurrency(825.15)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Last Year</p>
                      <p className="text-xl font-bold">{formatCurrency(678.30)}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <p className="text-sm font-medium text-blue-800">Growth Trend</p>
                    </div>
                    <p className="text-sm text-blue-700">
                      Your dividend income has grown 21.6% compared to last year
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rankings Tab */}
        <TabsContent value="rankings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span>Top Performers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.map((performer, index) => (
                    <div key={performer.symbol} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                          <span className="text-sm font-bold text-green-700">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{performer.symbol}</p>
                          <p className="text-sm text-gray-600">{performer.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatPercent(performer.return)}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(performer.value)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Needs Attention</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {worstPerformers.map((performer, index) => (
                    <div key={performer.symbol} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                          <span className="text-sm font-bold text-red-700">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{performer.symbol}</p>
                          <p className="text-sm text-gray-600">{performer.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">{formatPercent(performer.return)}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(performer.value)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
