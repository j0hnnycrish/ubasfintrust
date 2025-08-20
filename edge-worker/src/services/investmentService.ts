interface InvestmentOption {
  id: string
  name: string
  type: 'stock' | 'bond' | 'mutual_fund' | 'etf' | 'cd' | 'money_market'
  description: string
  minimumInvestment: number
  expectedReturn: number
  riskLevel: 'low' | 'medium' | 'high'
  term?: string
  fees: {
    managementFee: number
    transactionFee: number
  }
  currentValue: number
  change24h: number
  marketCap?: number
  sector?: string
}

interface InvestmentPortfolio {
  totalValue: number
  totalGain: number
  totalGainPercent: number
  investments: {
    id: string
    optionId: string
    optionName: string
    shares: number
    currentPrice: number
    totalValue: number
    purchasePrice: number
    purchaseDate: string
    gain: number
    gainPercent: number
  }[]
}

export class InvestmentService {
  private investmentOptions: InvestmentOption[] = [
    // Stocks
    {
      id: 'AAPL',
      name: 'Apple Inc.',
      type: 'stock',
      description: 'Technology company focusing on consumer electronics and software',
      minimumInvestment: 100,
      expectedReturn: 12.5,
      riskLevel: 'medium',
      fees: { managementFee: 0, transactionFee: 0 },
      currentValue: 175.25,
      change24h: 2.15,
      marketCap: 2800000000000,
      sector: 'Technology'
    },
    {
      id: 'GOOGL',
      name: 'Alphabet Inc.',
      type: 'stock',
      description: 'Technology company specializing in internet services and products',
      minimumInvestment: 100,
      expectedReturn: 11.8,
      riskLevel: 'medium',
      fees: { managementFee: 0, transactionFee: 0 },
      currentValue: 142.50,
      change24h: -1.25,
      marketCap: 1800000000000,
      sector: 'Technology'
    },
    {
      id: 'TSLA',
      name: 'Tesla Inc.',
      type: 'stock',
      description: 'Electric vehicle and clean energy company',
      minimumInvestment: 100,
      expectedReturn: 18.5,
      riskLevel: 'high',
      fees: { managementFee: 0, transactionFee: 0 },
      currentValue: 248.75,
      change24h: 8.50,
      marketCap: 800000000000,
      sector: 'Automotive'
    },
    
    // ETFs
    {
      id: 'SPY',
      name: 'SPDR S&P 500 ETF',
      type: 'etf',
      description: 'Tracks the S&P 500 index for broad market exposure',
      minimumInvestment: 50,
      expectedReturn: 10.2,
      riskLevel: 'medium',
      fees: { managementFee: 0.09, transactionFee: 0 },
      currentValue: 425.80,
      change24h: 1.75,
      marketCap: 400000000000,
      sector: 'Diversified'
    },
    {
      id: 'QQQ',
      name: 'Invesco QQQ ETF',
      type: 'etf',
      description: 'Tracks the NASDAQ-100 index focusing on technology stocks',
      minimumInvestment: 50,
      expectedReturn: 12.8,
      riskLevel: 'medium',
      fees: { managementFee: 0.20, transactionFee: 0 },
      currentValue: 365.20,
      change24h: 3.25,
      marketCap: 150000000000,
      sector: 'Technology'
    },
    
    // Bonds
    {
      id: 'TLT',
      name: '20+ Year Treasury Bond ETF',
      type: 'bond',
      description: 'Long-term U.S. Treasury bonds for stable income',
      minimumInvestment: 100,
      expectedReturn: 4.5,
      riskLevel: 'low',
      fees: { managementFee: 0.15, transactionFee: 0 },
      currentValue: 92.15,
      change24h: -0.25,
      marketCap: 25000000000,
      sector: 'Government'
    },
    
    // Mutual Funds
    {
      id: 'FXAIX',
      name: 'Fidelity 500 Index Fund',
      type: 'mutual_fund',
      description: 'Low-cost S&P 500 index mutual fund',
      minimumInvestment: 1,
      expectedReturn: 10.1,
      riskLevel: 'medium',
      fees: { managementFee: 0.015, transactionFee: 0 },
      currentValue: 152.45,
      change24h: 1.85,
      marketCap: 300000000000,
      sector: 'Diversified'
    },
    
    // CDs and Money Market
    {
      id: 'CD_12M',
      name: '12-Month Certificate of Deposit',
      type: 'cd',
      description: 'FDIC-insured certificate with guaranteed return',
      minimumInvestment: 1000,
      expectedReturn: 5.25,
      riskLevel: 'low',
      term: '12 months',
      fees: { managementFee: 0, transactionFee: 0 },
      currentValue: 1000,
      change24h: 0,
      sector: 'Banking'
    },
    {
      id: 'MM_HIGH',
      name: 'High-Yield Money Market',
      type: 'money_market',
      description: 'High-yield money market account with daily liquidity',
      minimumInvestment: 500,
      expectedReturn: 4.75,
      riskLevel: 'low',
      fees: { managementFee: 0, transactionFee: 0 },
      currentValue: 1000,
      change24h: 0,
      sector: 'Banking'
    }
  ]

  getInvestmentOptions(): InvestmentOption[] {
    // Simulate real-time price updates
    return this.investmentOptions.map(option => ({
      ...option,
      currentValue: this.simulatePriceMovement(option.currentValue, option.riskLevel),
      change24h: this.generateDailyChange(option.riskLevel)
    }))
  }

  getInvestmentOption(optionId: string): InvestmentOption | null {
    const option = this.investmentOptions.find(opt => opt.id === optionId)
    if (!option) return null

    return {
      ...option,
      currentValue: this.simulatePriceMovement(option.currentValue, option.riskLevel),
      change24h: this.generateDailyChange(option.riskLevel)
    }
  }

  async createInvestment(
    userId: string, 
    optionId: string, 
    amount: number, 
    accountId: string
  ): Promise<{
    success: boolean
    message: string
    investmentId?: string
  }> {
    const option = this.getInvestmentOption(optionId)
    if (!option) {
      return {
        success: false,
        message: 'Investment option not found'
      }
    }

    if (amount < option.minimumInvestment) {
      return {
        success: false,
        message: `Minimum investment amount is $${option.minimumInvestment}`
      }
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Calculate shares/units
    const shares = amount / option.currentValue
    const transactionFee = option.fees.transactionFee
    const totalCost = amount + transactionFee

    // For demo purposes, assume the investment succeeds
    const investmentId = crypto.randomUUID()

    // In a real system, this would:
    // 1. Verify account balance
    // 2. Deduct funds from account
    // 3. Create investment record
    // 4. Execute the trade

    return {
      success: true,
      message: 'Investment created successfully',
      investmentId
    }
  }

  async getUserPortfolio(userId: string): Promise<InvestmentPortfolio> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

    // Generate sample portfolio for demo
    const sampleInvestments = [
      {
        id: crypto.randomUUID(),
        optionId: 'AAPL',
        optionName: 'Apple Inc.',
        shares: 10,
        currentPrice: 175.25,
        totalValue: 1752.50,
        purchasePrice: 165.00,
        purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
        gain: 102.50,
        gainPercent: 6.21
      },
      {
        id: crypto.randomUUID(),
        optionId: 'SPY',
        optionName: 'SPDR S&P 500 ETF',
        shares: 5,
        currentPrice: 425.80,
        totalValue: 2129.00,
        purchasePrice: 410.00,
        purchaseDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
        gain: 79.00,
        gainPercent: 3.85
      },
      {
        id: crypto.randomUUID(),
        optionId: 'CD_12M',
        optionName: '12-Month Certificate of Deposit',
        shares: 5,
        currentPrice: 1000.00,
        totalValue: 5000.00,
        purchasePrice: 1000.00,
        purchaseDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
        gain: 131.25, // Accrued interest
        gainPercent: 2.63
      }
    ]

    const totalValue = sampleInvestments.reduce((sum, inv) => sum + inv.totalValue, 0)
    const totalGain = sampleInvestments.reduce((sum, inv) => sum + inv.gain, 0)
    const totalGainPercent = (totalGain / (totalValue - totalGain)) * 100

    return {
      totalValue,
      totalGain,
      totalGainPercent,
      investments: sampleInvestments
    }
  }

  async sellInvestment(userId: string, investmentId: string, shares: number): Promise<{
    success: boolean
    message: string
    proceeds?: number
    fee?: number
  }> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000))

    // For demo purposes, calculate sample proceeds
    const currentPrice = 175.25 // Sample current price
    const transactionFee = 0
    const proceeds = shares * currentPrice - transactionFee

    return {
      success: true,
      message: 'Investment sold successfully',
      proceeds,
      fee: transactionFee
    }
  }

  private simulatePriceMovement(basePrice: number, riskLevel: 'low' | 'medium' | 'high'): number {
    const volatility = {
      low: 0.005,    // 0.5% max movement
      medium: 0.02,  // 2% max movement
      high: 0.05     // 5% max movement
    }

    const change = (Math.random() - 0.5) * 2 * volatility[riskLevel]
    return basePrice * (1 + change)
  }

  private generateDailyChange(riskLevel: 'low' | 'medium' | 'high'): number {
    const volatility = {
      low: 0.5,
      medium: 2.0,
      high: 5.0
    }

    return (Math.random() - 0.5) * 2 * volatility[riskLevel]
  }

  // Market analysis utilities
  getMarketSummary() {
    return {
      indices: {
        sp500: { value: 4350.25, change: 1.25, changePercent: 0.029 },
        nasdaq: { value: 13250.75, change: 45.50, changePercent: 0.345 },
        dow: { value: 34150.25, change: -25.75, changePercent: -0.075 }
      },
      topGainers: this.investmentOptions
        .filter(opt => opt.type === 'stock')
        .sort((a, b) => b.change24h - a.change24h)
        .slice(0, 3),
      topLosers: this.investmentOptions
        .filter(opt => opt.type === 'stock')
        .sort((a, b) => a.change24h - b.change24h)
        .slice(0, 3)
    }
  }
}
