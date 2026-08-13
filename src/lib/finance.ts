/** Defaults for the payment estimator, tuned for commercial-truck lending. */
export const FINANCE_DEFAULTS = {
  apr: 8.9,
  termMonths: 60,
  downPaymentPercent: 10,
  salesTaxPercent: 0,
} as const;

export const TERM_OPTIONS = [24, 36, 48, 60, 72, 84] as const;

/**
 * Standard amortized loan payment.
 * Returns whole dollars, rounded up so the estimate never reads low.
 */
export function monthlyPayment({
  price,
  downPayment,
  apr,
  termMonths,
  tradeIn = 0,
}: {
  price: number;
  downPayment: number;
  apr: number;
  termMonths: number;
  tradeIn?: number;
}) {
  const principal = Math.max(price - downPayment - tradeIn, 0);
  if (principal === 0 || termMonths <= 0) return 0;

  const monthlyRate = apr / 100 / 12;
  if (monthlyRate === 0) return Math.ceil(principal / termMonths);

  const factor = Math.pow(1 + monthlyRate, termMonths);
  return Math.ceil((principal * monthlyRate * factor) / (factor - 1));
}

/** The "Est. $831/mo" figure shown on listing cards. */
export function estimatedMonthly(price: number) {
  return monthlyPayment({
    price,
    downPayment: Math.round((price * FINANCE_DEFAULTS.downPaymentPercent) / 100),
    apr: FINANCE_DEFAULTS.apr,
    termMonths: FINANCE_DEFAULTS.termMonths,
  });
}
