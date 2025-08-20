import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBankingData } from '@/hooks/useBankingData';
import { useNotificationTriggers } from '@/contexts/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  ScatterChart,
  Scatter,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  LineChart as LineChartIcon,
  Calendar,
  Filter,
  Download,
  Upload,
  FileText,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
  Zap,
  Shield,
  Clock,
  MapPin,
  Tag,
  CreditCard,
  Smartphone,
  Car,
  Home,
  Utensils,
  ShoppingBag,
  Gamepad2,
  Plane,
  Heart,
  GraduationCap,
  Briefcase,
  Gift,
  Coffee,
  Film,
  Music,
  Book,
  Camera,
  Headphones,
  Dumbbell,
  Scissors,
  Stethoscope,
  Fuel,
  Banknote,
  Calculator,
  Percent,
  Star,
  Award,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Activity,
  Users,
  Building,
  Globe
} from 'lucide-react';

interface SpendingCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  amount: number;
  percentage: number;
  transactions: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  budget?: number;
  budgetUsed?: number;
}

interface BudgetItem {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'on-track' | 'warning' | 'exceeded';
  period: 'monthly' | 'weekly' | 'yearly';
}

interface FinancialGoal {
  id: string;
  name: string;
  type: 'savings' | 'debt_payoff' | 'investment' | 'emergency_fund';
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  monthlyContribution: number;
  progress: number;
  onTrack: boolean;
  projectedCompletion?: string;
}

interface AnalyticsData {
  monthlySpending: Array<{
    month: string;
    spending: number;
    income: number;
    savings: number;
    budget: number;
  }>;
  categorySpending: SpendingCategory[];
  budgets: BudgetItem[];
  goals: FinancialGoal[];
  insights: {
    totalSpending: number;
    avgMonthlySpending: number;
    savingsRate: number;
    topCategory: string;
    spendingTrend: 'increasing' | 'decreasing' | 'stable';
    budgetVariance: number;
  };
  cashFlow: Array<{
    date: string;
    inflow: number;
    outflow: number;
    net: number;
    balance: number;
  }>;
  forecasting: Array<{
    month: string;
    predictedSpending: number;
    predictedIncome: number;
    confidence: number;
  }>;
}

interface AnalyticsDashboardProps {
  onBack: () => void;
}

export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const { user } = useAuth();
  const { accounts, transactions, formatCurrency } = useBankingData();
  const { notifySystem } = useNotificationTriggers();
  const { toast } = useToast();

  // Data states
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: 0,
    period: 'monthly' as 'monthly' | 'weekly' | 'yearly',
  });

  const [newGoal, setNewGoal] = useState({
    name: '',
    type: 'savings' as 'savings' | 'debt_payoff' | 'investment' | 'emergency_fund',
    targetAmount: 0,
    deadline: '',
    monthlyContribution: 0,
  });

  // Chart colors - UBA Red palette
  const chartColors = [
    '#E53935', '#D32F2F', '#C62828', '#B71C1C', '#FF5252',
    '#F44336', '#EF5350', '#E57373', '#FFCDD2', '#FFEBEE'
  ];

  // Load analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Mock comprehensive analytics data
      const mockData: AnalyticsData = {
        monthlySpending: [
          { month: 'Jan', spending: 3200, income: 5000, savings: 1800, budget: 3500 },
          { month: 'Feb', spending: 2800, income: 5000, savings: 2200, budget: 3500 },
          { month: 'Mar', spending: 3600, income: 5200, savings: 1600, budget: 3500 },
          { month: 'Apr', spending: 3100, income: 5000, savings: 1900, budget: 3500 },
          { month: 'May', spending: 4200, income: 5500, savings: 1300, budget: 3500 },
          { month: 'Jun', spending: 2900, income: 5000, savings: 2100, budget: 3500 },
          { month: 'Jul', spending: 3800, income: 5300, savings: 1500, budget: 3500 },
          { month: 'Aug', spending: 3400, income: 5000, savings: 1600, budget: 3500 },
        ],
        categorySpending: [
          {
            id: 'food',
            name: 'Food & Dining',
            icon: Utensils,
            color: '#E53935',
            amount: 1250,
            percentage: 28.5,
            transactions: 47,
            trend: 'up',
            trendPercentage: 12.3,
            budget: 1000,
            budgetUsed: 125,
          },
          {
            id: 'transportation',
            name: 'Transportation',
            icon: Car,
            color: '#D32F2F',
            amount: 980,
            percentage: 22.3,
            transactions: 23,
            trend: 'down',
            trendPercentage: 8.1,
            budget: 800,
            budgetUsed: 122.5,
          },
          {
            id: 'shopping',
            name: 'Shopping',
            icon: ShoppingBag,
            color: '#C62828',
            amount: 720,
            percentage: 16.4,
            transactions: 31,
            trend: 'up',
            trendPercentage: 15.7,
            budget: 600,
            budgetUsed: 120,
          },
          {
            id: 'entertainment',
            name: 'Entertainment',
            icon: Film,
            color: '#B71C1C',
            amount: 450,
            percentage: 10.2,
            transactions: 18,
            trend: 'stable',
            trendPercentage: 2.1,
            budget: 400,
            budgetUsed: 112.5,
          },
          {
            id: 'utilities',
            name: 'Bills & Utilities',
            icon: Home,
            color: '#FF5252',
            amount: 620,
            percentage: 14.1,
            transactions: 12,
            trend: 'stable',
            trendPercentage: 1.8,
            budget: 650,
            budgetUsed: 95.4,
          },
          {
            id: 'healthcare',
            name: 'Healthcare',
            icon: Heart,
            color: '#F44336',
            amount: 280,
            percentage: 6.4,
            transactions: 8,
            trend: 'down',
            trendPercentage: 5.2,
            budget: 300,
            budgetUsed: 93.3,
          },
          {
            id: 'other',
            name: 'Other',
            icon: Tag,
            color: '#EF5350',
            amount: 90,
            percentage: 2.1,
            transactions: 15,
            trend: 'stable',
            trendPercentage: 0.5,
          },
        ],
        budgets: [
          {
            id: '1',
            category: 'Food & Dining',
            budgeted: 1000,
            spent: 1250,
            remaining: -250,
            percentage: 125,
            status: 'exceeded',
            period: 'monthly',
          },
          {
            id: '2',
            category: 'Transportation',
            budgeted: 800,
            spent: 680,
            remaining: 120,
            percentage: 85,
            status: 'on-track',
            period: 'monthly',
          },
          {
            id: '3',
            category: 'Shopping',
            budgeted: 600,
            spent: 720,
            remaining: -120,
            percentage: 120,
            status: 'exceeded',
            period: 'monthly',
          },
          {
            id: '4',
            category: 'Entertainment',
            budgeted: 400,
            spent: 350,
            remaining: 50,
            percentage: 87.5,
            status: 'warning',
            period: 'monthly',
          },
          {
            id: '5',
            category: 'Utilities',
            budgeted: 650,
            spent: 620,
            remaining: 30,
            percentage: 95.4,
            status: 'warning',
            period: 'monthly',
          },
        ],
        goals: [
          {
            id: '1',
            name: 'Emergency Fund',
            type: 'emergency_fund',
            targetAmount: 15000,
            currentAmount: 8500,
            deadline: '2024-12-31',
            monthlyContribution: 800,
            progress: 56.7,
            onTrack: true,
            projectedCompletion: '2024-11-15',
          },
          {
            id: '2',
            name: 'Vacation Fund',
            type: 'savings',
            targetAmount: 5000,
            currentAmount: 2800,
            deadline: '2024-08-15',
            monthlyContribution: 500,
            progress: 56,
            onTrack: false,
            projectedCompletion: '2024-09-30',
          },
          {
            id: '3',
            name: 'Pay Off Credit Card',
            type: 'debt_payoff',
            targetAmount: 3200,
            currentAmount: 1800,
            deadline: '2024-10-31',
            monthlyContribution: 400,
            progress: 56.25,
            onTrack: true,
            projectedCompletion: '2024-09-15',
          },
          {
            id: '4',
            name: 'Investment Portfolio',
            type: 'investment',
            targetAmount: 25000,
            currentAmount: 12000,
            deadline: '2025-12-31',
            monthlyContribution: 1000,
            progress: 48,
            onTrack: true,
            projectedCompletion: '2025-11-30',
          },
        ],
        insights: {
          totalSpending: 4390,
          avgMonthlySpending: 3387.5,
          savingsRate: 32.4,
          topCategory: 'Food & Dining',
          spendingTrend: 'increasing',
          budgetVariance: -8.2,
        },
        cashFlow: [
          { date: '2024-01', inflow: 5000, outflow: 3200, net: 1800, balance: 15800 },
          { date: '2024-02', inflow: 5000, outflow: 2800, net: 2200, balance: 18000 },
          { date: '2024-03', inflow: 5200, outflow: 3600, net: 1600, balance: 19600 },
          { date: '2024-04', inflow: 5000, outflow: 3100, net: 1900, balance: 21500 },
          { date: '2024-05', inflow: 5500, outflow: 4200, net: 1300, balance: 22800 },
          { date: '2024-06', inflow: 5000, outflow: 2900, net: 2100, balance: 24900 },
          { date: '2024-07', inflow: 5300, outflow: 3800, net: 1500, balance: 26400 },
          { date: '2024-08', inflow: 5000, outflow: 3400, net: 1600, balance: 28000 },
        ],
        forecasting: [
          { month: 'Sep 2024', predictedSpending: 3500, predictedIncome: 5200, confidence: 85 },
          { month: 'Oct 2024', predictedSpending: 3300, predictedIncome: 5000, confidence: 78 },
          { month: 'Nov 2024', predictedSpending: 3600, predictedIncome: 5100, confidence: 72 },
          { month: 'Dec 2024', predictedSpending: 4200, predictedIncome: 5500, confidence: 65 },
        ],
      };

      setAnalyticsData(mockData);
    } catch (error) {
      toast({
        title: 'Error Loading Analytics',
        description: 'Failed to load analytics data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async () => {
    if (!newBudget.category || newBudget.amount <= 0) {
      toast({
        title: 'Invalid Budget',
        description: 'Please provide a valid category and amount.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const budget: BudgetItem = {
        id: Date.now().toString(),
        category: newBudget.category,
        budgeted: newBudget.amount,
        spent: 0,
        remaining: newBudget.amount,
        percentage: 0,
        status: 'on-track',
        period: newBudget.period,
      };

      if (analyticsData) {
        setAnalyticsData({
          ...analyticsData,
          budgets: [...analyticsData.budgets, budget],
        });
      }

      setNewBudget({ category: '', amount: 0, period: 'monthly' });
      setShowBudgetDialog(false);

      toast({
        title: 'Budget Created',
        description: `Budget for ${newBudget.category} has been created successfully.`,
      });

      notifySystem('Budget Created', `New budget set for ${newBudget.category}`);
    } catch (error) {
      toast({
        title: 'Error Creating Budget',
        description: 'Failed to create budget. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const createGoal = async () => {
    if (!newGoal.name || newGoal.targetAmount <= 0) {
      toast({
        title: 'Invalid Goal',
        description: 'Please provide a valid goal name and target amount.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const goal: FinancialGoal = {
        id: Date.now().toString(),
        name: newGoal.name,
        type: newGoal.type,
        targetAmount: newGoal.targetAmount,
        currentAmount: 0,
        deadline: newGoal.deadline,
        monthlyContribution: newGoal.monthlyContribution,
        progress: 0,
        onTrack: true,
      };

      if (analyticsData) {
        setAnalyticsData({
          ...analyticsData,
          goals: [...analyticsData.goals, goal],
        });
      }

      setNewGoal({
        name: '',
        type: 'savings',
        targetAmount: 0,
        deadline: '',
        monthlyContribution: 0,
      });
      setShowGoalDialog(false);

      toast({
        title: 'Goal Created',
        description: `Financial goal "${newGoal.name}" has been created successfully.`,
      });

      notifySystem('Financial Goal Created', `New goal: ${newGoal.name}`);
    } catch (error) {
      toast({
        title: 'Error Creating Goal',
        description: 'Failed to create goal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const exportAnalytics = async () => {
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Analytics Exported',
        description: 'Your analytics data has been exported successfully.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export analytics data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getBudgetStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'exceeded': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBudgetStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'exceeded': return AlertCircle;
      default: return Info;
    }
  };

  const getGoalTypeIcon = (type: string) => {
    switch (type) {
      case 'savings': return Banknote;
      case 'debt_payoff': return CreditCard;
      case 'investment': return TrendingUp;
      case 'emergency_fund': return Shield;
      default: return Target;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="text-center p-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Unavailable</h3>
            <p className="text-gray-600 mb-4">We couldn't load your analytics data.</p>
            <Button onClick={loadAnalyticsData}>Try Again</Button>
          </CardContent>
        </Card>
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
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive financial insights and analysis</p>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportAnalytics}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(analyticsData.insights.totalSpending)}
                  </p>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">8.2% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Savings Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData.insights.savingsRate}%
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <Banknote className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">Above recommended 20%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Budget Variance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData.insights.budgetVariance}%
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Calculator className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-1" />
                <span className="text-sm text-yellow-600">Over budget</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Category</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.insights.topCategory}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <PieChartIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-600">28.5% of total spending</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Spending Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Spending Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={analyticsData.monthlySpending}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="budget" fill="#FFCDD2" name="Budget" />
                      <Area
                        type="monotone"
                        dataKey="spending"
                        stackId="1"
                        stroke="#E53935"
                        fill="#FFEBEE"
                        name="Spending"
                      />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#D32F2F"
                        strokeWidth={3}
                        name="Income"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.categorySpending}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#E53935"
                        dataKey="amount"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {analyticsData.categorySpending.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Categories Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Category Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analyticsData.categorySpending.slice(0, 6).map((category) => {
                    const IconComponent = category.icon;
                    const TrendIcon = category.trend === 'up' ? TrendingUp : 
                                    category.trend === 'down' ? TrendingDown : Activity;
                    
                    return (
                      <div key={category.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="p-2 rounded-full"
                              style={{ backgroundColor: `${category.color}20` }}
                            >
                              <IconComponent 
                                className="h-4 w-4" 
                                style={{ color: category.color }}
                              />
                            </div>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendIcon 
                              className={`h-3 w-3 ${
                                category.trend === 'up' ? 'text-red-500' :
                                category.trend === 'down' ? 'text-green-500' : 'text-gray-500'
                              }`}
                            />
                            <span className={`text-xs ${
                              category.trend === 'up' ? 'text-red-500' :
                              category.trend === 'down' ? 'text-green-500' : 'text-gray-500'
                            }`}>
                              {category.trendPercentage}%
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">{formatCurrency(category.amount)}</span>
                            <span className="text-sm text-gray-600">{category.percentage}%</span>
                          </div>
                          <p className="text-sm text-gray-600">{category.transactions} transactions</p>
                          {category.budget && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Budget: {formatCurrency(category.budget)}</span>
                                <span className={category.budgetUsed! > 100 ? 'text-red-600' : 'text-green-600'}>
                                  {category.budgetUsed}%
                                </span>
                              </div>
                              <Progress 
                                value={Math.min(category.budgetUsed!, 100)} 
                                className="h-2 mt-1"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spending Analysis Tab */}
          <TabsContent value="spending" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Detailed Category Analysis */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Spending Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={analyticsData.categorySpending}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis />
                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="amount" fill="#E53935" name="Spent" />
                        <Bar dataKey="budget" fill="#FFCDD2" name="Budget" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Category Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.categorySpending.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <div 
                          key={category.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedCategory === category.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedCategory(
                            selectedCategory === category.id ? null : category.id
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <IconComponent 
                                className="h-4 w-4" 
                                style={{ color: category.color }}
                              />
                              <span className="font-medium text-sm">{category.name}</span>
                            </div>
                            <span className="text-sm font-bold">{formatCurrency(category.amount)}</span>
                          </div>
                          {selectedCategory === category.id && (
                            <div className="mt-3 pt-3 border-t space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Transactions:</span>
                                <span>{category.transactions}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Average per transaction:</span>
                                <span>{formatCurrency(category.amount / category.transactions)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Trend:</span>
                                <span className={
                                  category.trend === 'up' ? 'text-red-600' :
                                  category.trend === 'down' ? 'text-green-600' : 'text-gray-600'
                                }>
                                  {category.trend === 'up' ? '+' : category.trend === 'down' ? '-' : ''}
                                  {category.trendPercentage}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Budgets Tab */}
          <TabsContent value="budgets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Budget Management</h2>
              <Button onClick={() => setShowBudgetDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Budget
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget vs Actual Spending</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.budgets}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="category" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="budgeted" fill="#D32F2F" name="Budgeted" />
                      <Bar dataKey="spent" fill="#EF4444" name="Spent" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Budget Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.budgets.map((budget) => {
                      const StatusIcon = getBudgetStatusIcon(budget.status);
                      return (
                        <div key={budget.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <StatusIcon 
                                className={`h-4 w-4 ${getBudgetStatusColor(budget.status)}`}
                              />
                              <span className="font-medium">{budget.category}</span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {formatCurrency(budget.spent)} / {formatCurrency(budget.budgeted)}
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(budget.percentage, 100)} 
                            className={`h-3 ${
                              budget.status === 'exceeded' ? '[&>div]:bg-red-500' :
                              budget.status === 'warning' ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'
                            }`}
                          />
                          <div className="flex items-center justify-between text-sm">
                            <span className={getBudgetStatusColor(budget.status)}>
                              {budget.percentage}% used
                            </span>
                            <span className={budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {budget.remaining >= 0 ? '+' : ''}{formatCurrency(budget.remaining)} remaining
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Financial Goals</h2>
              <Button onClick={() => setShowGoalDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analyticsData.goals.map((goal) => {
                const IconComponent = getGoalTypeIcon(goal.type);
                return (
                  <Card key={goal.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-lg">{goal.name}</CardTitle>
                        </div>
                        <Badge variant={goal.onTrack ? "default" : "destructive"}>
                          {goal.onTrack ? 'On Track' : 'Behind'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-gray-600">{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-3" />
                          <div className="flex items-center justify-between mt-1 text-sm text-gray-600">
                            <span>{formatCurrency(goal.currentAmount)}</span>
                            <span>{formatCurrency(goal.targetAmount)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Monthly Contribution</p>
                            <p className="font-medium">{formatCurrency(goal.monthlyContribution)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Target Date</p>
                            <p className="font-medium">{new Date(goal.deadline).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {goal.projectedCompletion && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium">Projected Completion</p>
                            <p className="text-sm text-gray-600">
                              {new Date(goal.projectedCompletion).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Funds
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Cash Flow Tab */}
          <TabsContent value="cashflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={analyticsData.cashFlow}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="inflow" fill="#C62828" name="Income" />
                    <Bar dataKey="outflow" fill="#EF4444" name="Expenses" />
                    <Line 
                      type="monotone" 
                      dataKey="net" 
                      stroke="#E53935" 
                      strokeWidth={3}
                      name="Net Cash Flow"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Balance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData.cashFlow}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#E53935"
                        fill="#FFEBEE"
                        name="Account Balance"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Total Inflow</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(analyticsData.cashFlow.reduce((sum, item) => sum + item.inflow, 0))}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Total Outflow</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatCurrency(analyticsData.cashFlow.reduce((sum, item) => sum + item.outflow, 0))}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Net Cash Flow</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(analyticsData.cashFlow.reduce((sum, item) => sum + item.net, 0))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={analyticsData.forecasting}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="predictedSpending" fill="#EF4444" name="Predicted Spending" />
                    <Bar dataKey="predictedIncome" fill="#D32F2F" name="Predicted Income" />
                    <Line 
                      type="monotone" 
                      dataKey="confidence" 
                      stroke="#B71C1C" 
                      strokeWidth={2}
                      yAxisId="right"
                      name="Confidence (%)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {analyticsData.forecasting.map((forecast, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{forecast.month}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Predicted Income</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(forecast.predictedIncome)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Predicted Spending</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(forecast.predictedSpending)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Predicted Savings</span>
                        <span className="font-medium text-blue-600">
                          {formatCurrency(forecast.predictedIncome - forecast.predictedSpending)}
                        </span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Confidence</span>
                          <Badge variant="outline">{forecast.confidence}%</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Budget Dialog */}
        <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
              <DialogDescription>
                Set up a budget for a spending category to track your expenses.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={newBudget.category}
                  onValueChange={(value) => setNewBudget(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Bills & Utilities">Bills & Utilities</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Budget Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={newBudget.amount || ''}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    className="pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label>Period</Label>
                <Select
                  value={newBudget.period}
                  onValueChange={(value: 'monthly' | 'weekly' | 'yearly') => 
                    setNewBudget(prev => ({ ...prev, period: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowBudgetDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createBudget}>
                  Create Budget
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Goal Dialog */}
        <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Financial Goal</DialogTitle>
              <DialogDescription>
                Set up a financial goal to track your progress towards achieving it.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Goal Name</Label>
                <Input
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Emergency Fund"
                />
              </div>

              <div>
                <Label>Goal Type</Label>
                <Select
                  value={newGoal.type}
                  onValueChange={(value: 'savings' | 'debt_payoff' | 'investment' | 'emergency_fund') => 
                    setNewGoal(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings Goal</SelectItem>
                    <SelectItem value="debt_payoff">Debt Payoff</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="emergency_fund">Emergency Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Target Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={newGoal.targetAmount || ''}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: parseFloat(e.target.value) || 0 }))}
                    className="pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label>Target Date</Label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>

              <div>
                <Label>Monthly Contribution</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={newGoal.monthlyContribution || ''}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, monthlyContribution: parseFloat(e.target.value) || 0 }))}
                    className="pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowGoalDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createGoal}>
                  Create Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
