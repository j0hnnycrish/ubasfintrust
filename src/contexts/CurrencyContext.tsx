import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency, GLOBAL_CURRENCIES } from '@/components/global/CurrencySelector';

interface CurrencyContextType {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  convertAmount: (amount: number, fromCurrency: string) => number;
  formatAmount: (amount: number, currencyCode?: string) => string;
  exchangeRates: Record<string, number>;
  updateExchangeRates: () => void;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  // Default to USD, but could be determined by user's location
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    GLOBAL_CURRENCIES.find(c => c.code === 'USD') || GLOBAL_CURRENCIES[0]
  );
  
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time exchange rate updates
  const updateExchangeRates = async () => {
    setIsLoading(true);
    
    // In a real application, this would fetch from a live API
    // For demo purposes, we'll simulate slight fluctuations
    const simulatedRates: Record<string, number> = {};
    
    GLOBAL_CURRENCIES.forEach(currency => {
      if (currency.rate) {
        // Add small random fluctuation (±0.5%)
        const fluctuation = (Math.random() - 0.5) * 0.01;
        simulatedRates[currency.code] = currency.rate * (1 + fluctuation);
      }
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setExchangeRates(simulatedRates);
    setIsLoading(false);
  };

  // Update rates on mount and every 30 seconds
  useEffect(() => {
    updateExchangeRates();
    const interval = setInterval(updateExchangeRates, 30000);
    return () => clearInterval(interval);
  }, []);

  // Convert amount from any currency to the selected display currency
  const convertAmount = (amount: number, fromCurrency: string): number => {
    if (fromCurrency === selectedCurrency.code) return amount;
    
    const fromRate = exchangeRates[fromCurrency] || 
                    GLOBAL_CURRENCIES.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = exchangeRates[selectedCurrency.code] || selectedCurrency.rate || 1;
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  };

  // Format amount in the selected currency or specified currency
  const formatAmount = (amount: number, currencyCode?: string): string => {
    const currency = currencyCode 
      ? GLOBAL_CURRENCIES.find(c => c.code === currencyCode) || selectedCurrency
      : selectedCurrency;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Save selected currency to localStorage
  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency.code);
  }, [selectedCurrency]);

  // Load selected currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      const currency = GLOBAL_CURRENCIES.find(c => c.code === savedCurrency);
      if (currency) {
        setSelectedCurrency(currency);
      }
    }
  }, []);

  const value: CurrencyContextType = {
    selectedCurrency,
    setSelectedCurrency,
    convertAmount,
    formatAmount,
    exchangeRates,
    updateExchangeRates,
    isLoading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

// Hook for getting real-time currency conversion
export function useCurrencyConverter() {
  const { convertAmount, formatAmount, selectedCurrency } = useCurrency();
  
  return {
    convert: convertAmount,
    format: formatAmount,
    displayCurrency: selectedCurrency,
    convertAndFormat: (amount: number, fromCurrency: string) => {
      const converted = convertAmount(amount, fromCurrency);
      return formatAmount(converted);
    }
  };
}

// Hook for multi-currency balance display
export function useMultiCurrencyBalance(balances: Record<string, number>) {
  const { convertAmount, formatAmount, selectedCurrency } = useCurrency();
  
  const totalInDisplayCurrency = Object.entries(balances).reduce((total, [currency, amount]) => {
    return total + convertAmount(amount, currency);
  }, 0);
  
  const formattedTotal = formatAmount(totalInDisplayCurrency);
  
  const balanceBreakdown = Object.entries(balances).map(([currency, amount]) => ({
    currency,
    amount,
    formattedAmount: formatAmount(amount, currency),
    convertedAmount: convertAmount(amount, currency),
    formattedConvertedAmount: formatAmount(convertAmount(amount, currency)),
  }));
  
  return {
    totalInDisplayCurrency,
    formattedTotal,
    balanceBreakdown,
    displayCurrency: selectedCurrency,
  };
}
