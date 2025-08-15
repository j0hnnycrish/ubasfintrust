// Centralized supported currency codes (ISO 4217)
export const SUPPORTED_CURRENCIES = [
  'USD', 'GBP', 'EUR', 'JPY', 'CNY',
  'AED', 'SAR', 'QAR', 'KWD',
  'CHF', 'CAD', 'AUD', 'NZD', 'SGD', 'HKD',
  'SEK', 'NOK', 'DKK',
  'INR', 'KRW', 'THB', 'MYR', 'IDR', 'PHP',
  'ZAR'
];

export function isSupportedCurrency(code?: string): boolean {
  if (!code) return false;
  return SUPPORTED_CURRENCIES.includes(code.toUpperCase());
}
