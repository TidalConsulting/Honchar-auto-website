"use client";

import { useMemo, useState } from "react";

import { FINANCE_DEFAULTS, TERM_OPTIONS, monthlyPayment } from "@/lib/finance";
import { formatPrice } from "@/lib/format";

export function PaymentCalculator({ price }: { price: number }) {
  const [down, setDown] = useState(
    Math.round((price * FINANCE_DEFAULTS.downPaymentPercent) / 100),
  );
  const [term, setTerm] = useState<number>(FINANCE_DEFAULTS.termMonths);
  const [apr, setApr] = useState<number>(FINANCE_DEFAULTS.apr);
  const [tradeIn, setTradeIn] = useState(0);

  const payment = useMemo(
    () => monthlyPayment({ price, downPayment: down, apr, termMonths: term, tradeIn }),
    [price, down, apr, term, tradeIn],
  );

  const amountFinanced = Math.max(price - down - tradeIn, 0);

  return (
    <div className="rounded-card border border-ink-200 bg-white p-5">
      <h3 className="text-lg font-bold text-ink-900">Estimate your payment</h3>
      <p className="mt-1 text-sm text-ink-600">
        Adjust the numbers to see what this truck looks like monthly.
      </p>

      <div className="mt-5 rounded-xl bg-ink-900 px-5 py-4 text-center">
        <p className="text-xs uppercase tracking-wider text-ink-400">Estimated monthly payment</p>
        <p className="mt-1 text-4xl font-extrabold text-white">
          ${payment.toLocaleString()}
          <span className="text-lg font-semibold text-ink-400">/mo</span>
        </p>
        <p className="mt-1 text-xs text-ink-400">
          {formatPrice(amountFinanced)} financed over {term} months
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <Slider
          label="Down payment"
          value={down}
          min={0}
          max={price}
          step={500}
          display={formatPrice(down)}
          onChange={setDown}
        />
        <Slider
          label="Trade-in value"
          value={tradeIn}
          min={0}
          max={Math.max(price - down, 0)}
          step={500}
          display={formatPrice(tradeIn)}
          onChange={setTradeIn}
        />

        <div>
          <span className="mb-2 block text-sm font-semibold text-ink-800">Loan term</span>
          <div className="flex flex-wrap gap-2">
            {TERM_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTerm(option)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  option === term
                    ? "border-ink-900 bg-ink-900 text-white"
                    : "border-ink-300 text-ink-700 hover:bg-ink-50"
                }`}
              >
                {option} mo
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink-800">
            Estimated APR: {apr.toFixed(1)}%
          </span>
          <input
            type="range"
            min={0}
            max={24}
            step={0.1}
            value={apr}
            onChange={(event) => setApr(Number(event.target.value))}
            className="w-full accent-amber-brand-500"
          />
        </label>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-ink-500">
        Estimate only. Excludes tax, tag, title, and fees. Your actual rate depends on credit,
        business history, and lender approval.
      </p>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-sm font-semibold text-ink-800">
        {label}
        <span className="font-bold text-ink-900">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={Math.max(max, min + step)}
        step={step}
        value={Math.min(value, max)}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-amber-brand-500"
      />
    </label>
  );
}
