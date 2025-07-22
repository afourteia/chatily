// <SelectItem value="LYD">LYD</SelectItem>
// <SelectItem value="TND">TND</SelectItem>
// <SelectItem value="EGP">EGP</SelectItem>
// <SelectItem value="TRY">TRY</SelectItem>
// <SelectItem value="USD">USD</SelectItem>
// <SelectItem value="EUR">EUR</SelectItem>
// <SelectItem value="GBP">GBP</SelectItem>

type CurrencyData = {
  isVisible: boolean;
  code: string;
  name: string;
  symbol: string;
  decimalDigits: number;
};

export type CurrencyCode = keyof typeof currencySymbols;

export const currencySymbols = {
  LYD: {
    isVisible: true,
    code: 'LYD',
    name: 'دينار ليبي',
    symbol: 'د.ل',
    decimalDigits: 2,
  },
  TND: {
    isVisible: true,
    code: 'TND',
    name: 'دينار تونسي',
    symbol: 'د.ت',
    decimalDigits: 2,
  },
  EGP: {
    isVisible: true,
    code: 'EGP',
    name: 'جنيه مصري',
    symbol: 'ج.م',
    decimalDigits: 2,
  },
  TRY: {
    isVisible: false,
    code: 'TRY',
    name: 'ليرة تركية',
    symbol: '₺',
    decimalDigits: 2,
  },
  USD: {
    isVisible: true,
    code: 'USD',
    name: 'دولار أمريكي',
    symbol: '$',
    decimalDigits: 2,
  },
  EUR: {
    isVisible: false,
    code: 'EUR',
    name: 'يورو',
    symbol: '€',
    decimalDigits: 2,
  },
  GBP: {
    isVisible: false,
    code: 'GBP',
    name: 'جنيه إسترليني',
    symbol: '£',
    decimalDigits: 2,
  },
} as const satisfies Record<string, CurrencyData>;
