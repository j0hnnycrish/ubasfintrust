interface CreditScoreData {
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  factors: {
    paymentHistory: number
    creditUtilization: number
    lengthOfHistory: number
    mixOfCredit: number
    newCredit: number
  }
  recommendations: string[]
  lastUpdated: string
}

interface CreditReportData {
  score: number
  accounts: {
    type: string
    balance: number
    limit?: number
    status: string
    openDate: string
  }[]
  inquiries: {
    date: string
    creditor: string
    type: 'hard' | 'soft'
  }[]
  publicRecords: any[]
  alerts: string[]
}

export class CreditScoreService {
  private baseScores = new Map<string, number>()

  async calculateCreditScore(userId: string): Promise<CreditScoreData> {
    // Simulate API delay for external credit bureau
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000))

    // Get or generate base score for user
    let baseScore = this.baseScores.get(userId)
    if (!baseScore) {
      // Generate realistic score between 300-850
      baseScore = 300 + Math.floor(Math.random() * 550)
      this.baseScores.set(userId, baseScore)
    }

    // Add some variation based on time and random factors
    const variation = Math.floor((Math.random() - 0.5) * 20)
    const currentScore = Math.max(300, Math.min(850, baseScore + variation))

    // Determine grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F'
    if (currentScore >= 750) grade = 'A'
    else if (currentScore >= 700) grade = 'B'
    else if (currentScore >= 650) grade = 'C'
    else if (currentScore >= 600) grade = 'D'
    else grade = 'F'

    // Generate realistic factor scores
    const factors = {
      paymentHistory: Math.max(0, Math.min(100, currentScore / 8.5 + Math.random() * 20)),
      creditUtilization: Math.max(0, Math.min(100, 90 - (currentScore - 300) / 5.5 + Math.random() * 20)),
      lengthOfHistory: Math.max(0, Math.min(100, (currentScore - 300) / 5.5 + Math.random() * 15)),
      mixOfCredit: Math.max(0, Math.min(100, 50 + Math.random() * 40)),
      newCredit: Math.max(0, Math.min(100, 70 + Math.random() * 30))
    }

    // Generate recommendations based on score and factors
    const recommendations: string[] = []
    
    if (currentScore < 650) {
      recommendations.push('Focus on making all payments on time to improve payment history')
      recommendations.push('Keep credit utilization below 30% of available credit')
    }
    
    if (factors.creditUtilization > 50) {
      recommendations.push('Pay down existing credit card balances to improve utilization ratio')
    }
    
    if (factors.lengthOfHistory < 50) {
      recommendations.push('Keep old credit accounts open to maintain credit history length')
    }
    
    if (factors.mixOfCredit < 40) {
      recommendations.push('Consider diversifying your credit mix with different types of accounts')
    }
    
    if (currentScore >= 750) {
      recommendations.push('Excellent credit score! Continue current financial habits')
      recommendations.push('You qualify for the best interest rates and credit terms')
    }

    return {
      score: Math.round(currentScore),
      grade,
      factors: {
        paymentHistory: Math.round(factors.paymentHistory),
        creditUtilization: Math.round(factors.creditUtilization),
        lengthOfHistory: Math.round(factors.lengthOfHistory),
        mixOfCredit: Math.round(factors.mixOfCredit),
        newCredit: Math.round(factors.newCredit)
      },
      recommendations,
      lastUpdated: new Date().toISOString()
    }
  }

  async getDetailedCreditReport(userId: string): Promise<CreditReportData> {
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

    const creditScore = await this.calculateCreditScore(userId)

    // Generate realistic account data
    const accounts = [
      {
        type: 'Credit Card',
        balance: Math.floor(Math.random() * 5000),
        limit: 10000,
        status: 'Current',
        openDate: new Date(Date.now() - Math.random() * 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!
      },
      {
        type: 'Auto Loan',
        balance: Math.floor(Math.random() * 25000),
        status: 'Current',
        openDate: new Date(Date.now() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!
      },
      {
        type: 'Mortgage',
        balance: Math.floor(Math.random() * 300000),
        status: 'Current',
        openDate: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!
      }
    ]

    // Generate recent inquiries
    const inquiries = [
      {
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
        creditor: 'Chase Bank',
        type: 'hard' as const
      },
      {
        date: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
        creditor: 'Credit Karma',
        type: 'soft' as const
      }
    ]

    const alerts: string[] = []
    if (creditScore.score < 600) {
      alerts.push('Low credit score detected - consider credit improvement strategies')
    }

    return {
      score: creditScore.score,
      accounts,
      inquiries,
      publicRecords: [], // Most users don't have public records
      alerts
    }
  }

  async assessLoanEligibility(userId: string, requestedAmount: number): Promise<{
    eligible: boolean
    maxAmount: number
    estimatedRate: number
    terms: string[]
    reasons: string[]
  }> {
    const creditData = await this.calculateCreditScore(userId)
    
    // Base eligibility on credit score
    const eligible = creditData.score >= 580
    
    // Calculate max loan amount based on credit score
    let maxAmount = 0
    if (creditData.score >= 750) maxAmount = 500000
    else if (creditData.score >= 700) maxAmount = 300000
    else if (creditData.score >= 650) maxAmount = 150000
    else if (creditData.score >= 600) maxAmount = 75000
    else if (creditData.score >= 580) maxAmount = 25000
    
    // Calculate estimated interest rate
    let estimatedRate = 25.0 // Default high rate
    if (creditData.score >= 750) estimatedRate = 3.5
    else if (creditData.score >= 700) estimatedRate = 5.0
    else if (creditData.score >= 650) estimatedRate = 8.5
    else if (creditData.score >= 600) estimatedRate = 15.0
    else if (creditData.score >= 580) estimatedRate = 22.0

    const terms = []
    const reasons = []

    if (eligible) {
      terms.push(`Loan amount: Up to $${maxAmount.toLocaleString()}`)
      terms.push(`Estimated APR: ${estimatedRate.toFixed(1)}%`)
      terms.push('Repayment terms: 12-84 months')
      terms.push('No prepayment penalties')
      
      if (creditData.score >= 700) {
        terms.push('Pre-approved status available')
        reasons.push('Excellent credit score qualifies for best rates')
      }
    } else {
      reasons.push(`Credit score of ${creditData.score} is below minimum requirement of 580`)
      reasons.push('Consider improving credit score before reapplying')
    }

    return {
      eligible,
      maxAmount: eligible ? Math.min(maxAmount, requestedAmount * 2) : 0,
      estimatedRate,
      terms,
      reasons
    }
  }
}
