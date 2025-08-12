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
          flex items-center space-x-2 px-3 py-2 rounded-lg border border-brand-200
          bg-white/90 backdrop-blur hover:bg-brand-50 transition-all duration-200
          hover:border-brand-400 focus:outline-none focus:ring-2
          focus:ring-brand-500/40 ${compact ? 'text-sm' : ''} ${className}
        `}
      >
        <Globe className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} text-brand-600`} />
        <span className="font-medium text-brand-800">
          {selectedCurrency.flag} {selectedCurrency.code}
        </span>
        {!compact && (
          <span className="text-brand-600 text-sm">
            {selectedCurrency.symbol}
          </span>
        )}
        <ChevronDown className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} text-brand-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur border border-brand-200 shadow-xl rounded-xl p-2 z-50">
          <div className="px-3 py-2 border-b border-brand-100 mb-2">
            <h3 className="font-semibold text-brand-800 text-sm">Select Display Currency</h3>
            <p className="text-xs text-brand-600">All amounts will be shown in this currency</p>
          </div>

          {GLOBAL_CURRENCIES.map((currency) => (
            <div
              key={currency.code}
              onClick={() => handleCurrencySelect(currency)}
              className={`
                flex items-center justify-between p-3 rounded-lg cursor-pointer
                hover:bg-brand-50 transition-colors
                ${selectedCurrency.code === currency.code ? 'bg-brand-100/60 border border-brand-200' : 'border border-transparent'}
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{currency.flag}</span>
                <div>
                  <div className="font-medium text-brand-800 text-sm">
                    {currency.code} - {currency.symbol}
                  </div>
                  <div className="text-xs text-brand-600">
                    {currency.name}
                  </div>
                </div>
              </div>

              {showRates && currency.rate && (
                <div className="text-right">
                  <div className="text-xs text-brand-600">
                    1 USD = {currency.rate.toFixed(4)}
                  </div>
                  <div className="text-xs text-brand-600 font-medium">Live Rate</div>
                </div>
              )}

              {selectedCurrency.code === currency.code && (
                <div className="w-2 h-2 bg-brand-600 rounded-full"></div>
              )}
            </div>
          ))}

          <div className="px-3 py-2 border-t border-brand-100 mt-2">
            <p className="text-xs text-brand-500 text-center">
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
