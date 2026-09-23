// Prices in the catalog are stored in USD. This converts them to the device's local
// currency using a small STATIC, approximate conversion table — not a live exchange-rate
// API — so the shop stays fully offline like the rest of the app. Rates will drift out of
// date over time; treat displayed prices as illustrative, not exact, and update
// RATES_FROM_USD occasionally if that matters for your use case.
import * as Localization from 'expo-localization';

const RATES_FROM_USD = {
  USD: 1,
  INR: 83,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149,
  AUD: 1.52,
  CAD: 1.36,
  SGD: 1.34,
  AED: 3.67,
  CNY: 7.24,
};

const SYMBOLS = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  SGD: 'S$',
  AED: 'AED ',
  CNY: '¥',
};

let cachedCurrencyCode = null;

export function getDeviceCurrencyCode() {
  if (cachedCurrencyCode) return cachedCurrencyCode;
  try {
    const locales = Localization.getLocales();
    const code = locales && locales[0] && locales[0].currencyCode;
    cachedCurrencyCode = code && RATES_FROM_USD[code] ? code : 'USD';
  } catch (e) {
    cachedCurrencyCode = 'USD';
  }
  return cachedCurrencyCode;
}

export function formatPrice(usdAmount, currencyCode) {
  const code = currencyCode || getDeviceCurrencyCode();
  const rate = RATES_FROM_USD[code] || 1;
  const symbol = SYMBOLS[code] || '$';
  const converted = usdAmount * rate;
  const decimals = code === 'JPY' ? 0 : Number.isInteger(converted) ? 0 : 2;
  return symbol + converted.toFixed(decimals);
}
