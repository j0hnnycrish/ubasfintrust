import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate?: number; // Exchange rate relative to USD
}

export const GLOBAL_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 1.0000 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0.9234 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 0.7891 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 149.82 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', rate: 1.3456 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rate: 1.5123 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭', rate: 0.8765 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', rate: 1.3421 },
];

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  showRates?: boolean;
  compact?: boolean;
  className?: string;
}

export function CurrencySelector({
  selectedCurrency,
  onCurrencyChange,
  showRates = false,
  compact = false,
  className = ''
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCurrencySelect = (currency: Currency) => {
    onCurrencyChange(currency);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg border border-banking-gold/20
          bg-white hover:bg-banking-gold/5 transition-all duration-200
          hover:border-banking-gold/40 focus:outline-none focus:ring-2
          focus:ring-banking-gold/20 ${compact ? 'text-sm' : ''} ${className}
        `}
      >
        <Globe className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} text-banking-gold`} />
        <span className="font-medium text-banking-dark">
          {selectedCurrency.flag} {selectedCurrency.code}
        </span>
        {!compact && (
          <span className="text-banking-gray text-sm">
            {selectedCurrency.symbol}
          </span>
        )}
        <ChevronDown className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} text-banking-gray transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-banking-gold/20 shadow-xl rounded-xl p-2 z-50">
          <div className="px-3 py-2 border-b border-banking-gold/10 mb-2">
            <h3 className="font-semibold text-banking-dark text-sm">Select Display Currency</h3>
            <p className="text-xs text-banking-gray">All amounts will be shown in this currency</p>
          </div>

          {GLOBAL_CURRENCIES.map((currency) => (
            <div
              key={currency.code}
              onClick={() => handleCurrencySelect(currency)}
              className={`
                flex items-center justify-between p-3 rounded-lg cursor-pointer
                hover:bg-banking-gold/5 transition-colors
                ${selectedCurrency.code === currency.code ? 'bg-banking-gold/10 border border-banking-gold/20' : ''}
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{currency.flag}</span>
                <div>
                  <div className="font-medium text-banking-dark text-sm">
                    {currency.code} - {currency.symbol}
                  </div>
                  <div className="text-xs text-banking-gray">
                    {currency.name}
                  </div>
                </div>
              </div>

              {showRates && currency.rate && (
                <div className="text-right">
                  <div className="text-xs text-banking-gray">
                    1 USD = {currency.rate.toFixed(4)}
                  </div>
                  <div className="text-xs text-banking-success">
                    Live Rate
                  </div>
                </div>
              )}

              {selectedCurrency.code === currency.code && (
                <div className="w-2 h-2 bg-banking-gold rounded-full"></div>
              )}
            </div>
          ))}

          <div className="px-3 py-2 border-t border-banking-gold/10 mt-2">
            <p className="text-xs text-banking-gray text-center">
              Rates updated every 30 seconds
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Utility function to format amounts in different currencies
export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Utility function to convert between currencies
export function convertCurrency(
  amount: number, 
  fromCurrency: Currency, 
  toCurrency: Currency
): number {
  if (fromCurrency.code === toCurrency.code) return amount;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / (fromCurrency.rate || 1);
  return usdAmount * (toCurrency.rate || 1);
}
