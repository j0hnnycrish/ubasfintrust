import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Globe } from 'lucide-react';
// import { useCurrency } from '@/contexts/CurrencyContext';
// import { GLOBAL_CURRENCIES } from '@/components/global/CurrencySelector';

interface ForexRate {
  pair: string;
  rate: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  flag?: string;
}

export function ForexTicker() {
  const [rates, setRates] = useState<ForexRate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const { selectedCurrency, exchangeRates } = useCurrency();
  const selectedCurrency = { code: 'USD', flag: '🇺🇸' };

  // Simulate real-time forex data
  useEffect(() => {
    const generateRandomRate = (base: number, volatility: number = 0.001) => {
      const change = (Math.random() - 0.5) * volatility * 2;
      return base + change;
    };

    const updateRates = () => {
      // Global currency pairs with flags
      const baseRates = [
        { pair: 'EUR/USD', base: 1.0850, high: 1.0890, low: 1.0820, flag: '🇪🇺' },
        { pair: 'GBP/USD', base: 1.2650, high: 1.2680, low: 1.2620, flag: '🇬🇧' },
        { pair: 'USD/JPY', base: 149.50, high: 150.20, low: 149.10, flag: '🇯🇵' },
        { pair: 'USD/CHF', base: 0.8920, high: 0.8950, low: 0.8890, flag: '🇨🇭' },
        { pair: 'AUD/USD', base: 0.6580, high: 0.6610, low: 0.6550, flag: '🇦🇺' },
        { pair: 'USD/CAD', base: 1.3720, high: 1.3750, low: 1.3690, flag: '🇨🇦' },
      ];

      setRates(prevRates => {
        const newRates = baseRates.map(({ pair, base, high, low, flag }) => {
          const previousRate = prevRates.find(r => r.pair === pair)?.rate || base;
          const newRate = generateRandomRate(base, 0.002);
          const change = newRate - previousRate;
          const changePercent = (change / previousRate) * 100;

          return {
            pair,
            rate: newRate,
            change,
            changePercent,
            high,
            low,
            flag
          };
        });

        return newRates;
      });
    };

    // Initial load
    updateRates();

    // Update every 3 seconds
    const interval = setInterval(updateRates, 3000);

    return () => clearInterval(interval);
  }, []); // Remove rates dependency to prevent infinite loop

  // Auto-scroll through rates
  useEffect(() => {
    if (rates.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rates.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [rates.length]);

  if (rates.length === 0) {
    return (
      <div className="bg-banking-dark text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-pulse">Loading market data...</div>
          </div>
        </div>
      </div>
    );
  }

  const currentRate = rates[currentIndex];

  return (
    <div className="bg-banking-dark text-white py-2 border-b border-banking-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Live Market Data Label */}
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-banking-gold" />
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">GLOBAL MARKETS</span>
            <span className="text-xs text-banking-gold">({selectedCurrency.code} Base)</span>
          </div>

          {/* Scrolling Ticker */}
          <div className="flex-1 mx-8 overflow-hidden">
            <div className="flex items-center justify-center space-x-8">
              {/* Desktop: Show multiple rates */}
              <div className="hidden lg:flex items-center space-x-8">
                {rates.slice(0, 4).map((rate) => (
                  <div key={rate.pair} className="flex items-center space-x-2 text-sm">
                    {rate.flag && <span className="text-base">{rate.flag}</span>}
                    <span className="font-medium">{rate.pair}</span>
                    <span className="text-banking-gold">{rate.rate.toFixed(4)}</span>
                    <div className={`flex items-center space-x-1 ${
                      rate.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {rate.change >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{rate.changePercent >= 0 ? '+' : ''}{rate.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile: Show single rate with animation */}
              <div className="lg:hidden flex items-center space-x-2 text-sm">
                {currentRate.flag && <span className="text-base">{currentRate.flag}</span>}
                <span className="font-medium">{currentRate.pair}</span>
                <span className="text-banking-gold">{currentRate.rate.toFixed(4)}</span>
                <div className={`flex items-center space-x-1 ${
                  currentRate.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {currentRate.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{currentRate.changePercent >= 0 ? '+' : ''}{currentRate.changePercent.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Market Status */}
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Markets Open</span>
          </div>
        </div>
      </div>
    </div>
  );
}
