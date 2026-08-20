"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { hasValue, queryString, withParam, withToggledValue } from "@/lib/searchParams";
import { FEATURE_OPTIONS, site } from "@/lib/site";
import type { FacetCount, InventoryResult } from "@/lib/vehicles";

const CONDITION_LABEL: Record<string, string> = {
  NEW: "New",
  USED: "Used",
  CERTIFIED: "Certified",
};

const MILEAGE_STEPS = [25000, 50000, 100000, 150000, 200000, 300000];
const HOUR_STEPS = [1000, 2500, 5000, 10000, 20000];

export function InventoryFilters({
  facets,
  priceRange,
  total,
}: {
  facets: InventoryResult["facets"];
  priceRange: InventoryResult["priceRange"];
  total: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const push = (next: URLSearchParams) => {
    startTransition(() => router.push(`/inventory${queryString(next)}`, { scroll: false }));
  };

  const toggle = (key: string, value: string) => push(withToggledValue(params, key, value));
  const set = (key: string, value: string | number | null) => push(withParam(params, key, value));

  const activeCount = countActive(params);

  return (
    <div className="space-y-3">
      <div className="rounded-card border border-ink-200 bg-white p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-lg font-bold text-ink-900">
            {total.toLocaleString()} {total === 1 ? "result" : "results"}
          </p>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => router.push("/inventory")}
              className="text-sm font-semibold text-amber-brand-600 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <KeywordSearch />

        <div className="mt-4 rounded-lg bg-ink-900 p-4 text-white">
          <p className="text-sm font-bold">Not sure what you need?</p>
          <p className="mt-1 text-sm text-ink-300">
            Tell us the job and we&apos;ll match you to the right truck.
          </p>
          <a
            href={site.phoneHref}
            className="mt-3 inline-flex rounded-full bg-amber-brand-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-brand-600"
          >
            Call {site.phone}
          </a>
        </div>
      </div>

      <Section title="Location" defaultOpen>
        <div className="space-y-2 text-sm text-ink-600">
          {site.address && (
            <p className="font-semibold text-ink-900">
              {site.address.city}, {site.address.state} {site.address.zip}
            </p>
          )}
          <p>Every truck listed is on our lot and available to inspect in person.</p>
          <p className="text-ink-500">Nationwide delivery available on request.</p>
        </div>
      </Section>

      <Section title="Price" defaultOpen>
        <RangeInputs
          minKey="priceMin"
          maxKey="priceMax"
          minPlaceholder={`$${priceRange.min.toLocaleString()}`}
          maxPlaceholder={`$${priceRange.max.toLocaleString()}`}
          prefix="$"
          onApply={(key, value) => set(key, value)}
        />
      </Section>

      <Section title="Condition" defaultOpen>
        <CheckList
          options={facets.condition}
          label={(value) => CONDITION_LABEL[value] ?? value}
          checked={(value) => hasValue(params, "condition", value.toLowerCase())}
          onToggle={(value) => toggle("condition", value.toLowerCase())}
        />
      </Section>

      <Section title="Body type" defaultOpen>
        <CheckList
          options={facets.bodyType}
          checked={(value) => hasValue(params, "body", value)}
          onToggle={(value) => toggle("body", value)}
        />
      </Section>

      <Section title="Make">
        <CheckList
          options={facets.make}
          scroll
          checked={(value) => hasValue(params, "make", value)}
          onToggle={(value) => toggle("make", value)}
        />
      </Section>

      <Section title="Year">
        <RangeInputs
          minKey="yearMin"
          maxKey="yearMax"
          minPlaceholder="From"
          maxPlaceholder="To"
          onApply={(key, value) => set(key, value)}
        />
      </Section>

      <Section title="Mileage">
        <RadioList
          name="mileageMax"
          options={MILEAGE_STEPS.map((value) => ({
            value: String(value),
            label: `Under ${value.toLocaleString()} mi`,
          }))}
          current={params.get("mileageMax")}
          onSelect={(value) => set("mileageMax", value)}
        />
      </Section>

      <Section title="Engine hours">
        <RadioList
          name="hoursMax"
          options={HOUR_STEPS.map((value) => ({
            value: String(value),
            label: `Under ${value.toLocaleString()} hrs`,
          }))}
          current={params.get("hoursMax")}
          onSelect={(value) => set("hoursMax", value)}
        />
      </Section>

      <Section title="Axle configuration">
        <CheckList
          options={facets.axleConfig}
          checked={(value) => hasValue(params, "axle", value)}
          onToggle={(value) => toggle("axle", value)}
        />
      </Section>

      <Section title="GVWR class">
        <CheckList
          options={facets.gvwrClass}
          label={(value) => `Class ${value}`}
          checked={(value) => hasValue(params, "class", value)}
          onToggle={(value) => toggle("class", value)}
        />
      </Section>

      <Section title="CDL required">
        <RadioList
          name="cdl"
          options={[
            { value: "no", label: "No CDL required" },
            { value: "yes", label: "CDL required" },
          ]}
          counts={Object.fromEntries(facets.cdl.map((row) => [row.value, row.count]))}
          current={params.get("cdl")}
          onSelect={(value) => set("cdl", value)}
        />
      </Section>

      <Section title="Fuel type">
        <CheckList
          options={facets.fuelType}
          checked={(value) => hasValue(params, "fuel", value)}
          onToggle={(value) => toggle("fuel", value)}
        />
      </Section>

      <Section title="Drivetrain">
        <CheckList
          options={facets.drivetrain}
          checked={(value) => hasValue(params, "drivetrain", value)}
          onToggle={(value) => toggle("drivetrain", value)}
        />
      </Section>

      <Section title="Equipment">
        <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
          {FEATURE_OPTIONS.map((feature) => (
            <label
              key={feature}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 text-sm hover:bg-ink-50"
            >
              <input
                type="checkbox"
                checked={hasValue(params, "features", feature)}
                onChange={() => toggle("features", feature)}
                className="h-4 w-4 rounded border-ink-300 accent-amber-brand-500"
              />
              <span className="text-ink-700">{feature}</span>
            </label>
          ))}
        </div>
      </Section>
    </div>
  );
}

function countActive(params: URLSearchParams) {
  let count = 0;
  params.forEach((value, key) => {
    if (["sort", "page"].includes(key) || !value) return;
    count += value.split(",").filter(Boolean).length;
  });
  return count;
}

function KeywordSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const applied = params.get("q") ?? "";

  // Reset the draft whenever the applied search changes (back button, chip removal).
  const [value, setValue] = useState(applied);
  const [lastApplied, setLastApplied] = useState(applied);
  if (applied !== lastApplied) {
    setLastApplied(applied);
    setValue(applied);
  }

  return (
    <form
      className="relative mt-4"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/inventory${queryString(withParam(params, "q", value.trim()))}`, {
          scroll: false,
        });
      }}
    >
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Try “6x4 dump truck”"
        aria-label="Search inventory"
        className="w-full rounded-full border border-ink-300 py-2.5 pl-4 pr-11 text-sm text-ink-900 placeholder:text-ink-400 focus:border-amber-brand-400"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900 text-white hover:bg-amber-brand-500"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
          <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-card border border-ink-200 bg-white [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5">
        <span className="text-base font-semibold text-ink-900">{title}</span>
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-ink-500 transition-transform group-open:rotate-180"
          fill="none"
        >
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="border-t border-ink-100 px-4 py-3.5">{children}</div>
    </details>
  );
}

function CheckList({
  options,
  checked,
  onToggle,
  label,
  scroll = false,
}: {
  options: FacetCount[];
  checked: (value: string) => boolean;
  onToggle: (value: string) => void;
  label?: (value: string) => string;
  scroll?: boolean;
}) {
  if (options.length === 0) {
    return <p className="text-sm text-ink-500">No matches with the current filters.</p>;
  }

  return (
    <div className={scroll ? "max-h-64 space-y-1 overflow-y-auto pr-1" : "space-y-1"}>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 text-sm hover:bg-ink-50"
        >
          <input
            type="checkbox"
            checked={checked(option.value)}
            onChange={() => onToggle(option.value)}
            className="h-4 w-4 rounded border-ink-300 accent-amber-brand-500"
          />
          <span className="flex-1 text-ink-700">{label ? label(option.value) : option.value}</span>
          <span className="text-xs text-ink-400">({option.count})</span>
        </label>
      ))}
    </div>
  );
}

function RadioList({
  name,
  options,
  current,
  onSelect,
  counts,
}: {
  name: string;
  options: { value: string; label: string }[];
  current: string | null;
  onSelect: (value: string | null) => void;
  counts?: Record<string, number>;
}) {
  return (
    <div className="space-y-1">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 text-sm hover:bg-ink-50"
        >
          <input
            type="radio"
            name={name}
            checked={current === option.value}
            onChange={() => onSelect(option.value)}
            className="h-4 w-4 border-ink-300 accent-amber-brand-500"
          />
          <span className="flex-1 text-ink-700">{option.label}</span>
          {counts?.[option.value] !== undefined && (
            <span className="text-xs text-ink-400">({counts[option.value]})</span>
          )}
        </label>
      ))}
      {current && (
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="mt-1 text-sm font-semibold text-amber-brand-600 hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}

function RangeInputs({
  minKey,
  maxKey,
  minPlaceholder,
  maxPlaceholder,
  prefix,
  onApply,
}: {
  minKey: string;
  maxKey: string;
  minPlaceholder: string;
  maxPlaceholder: string;
  prefix?: string;
  onApply: (key: string, value: string | null) => void;
}) {
  const params = useSearchParams();
  const appliedMin = params.get(minKey) ?? "";
  const appliedMax = params.get(maxKey) ?? "";

  const [min, setMin] = useState(appliedMin);
  const [max, setMax] = useState(appliedMax);
  const [applied, setApplied] = useState(`${appliedMin}|${appliedMax}`);
  if (applied !== `${appliedMin}|${appliedMax}`) {
    setApplied(`${appliedMin}|${appliedMax}`);
    setMin(appliedMin);
    setMax(appliedMax);
  }

  const commit = (key: string, value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    onApply(key, cleaned || null);
  };

  return (
    <div className="flex items-center gap-2">
      <Field
        value={min}
        prefix={prefix}
        placeholder={minPlaceholder}
        onChange={setMin}
        onCommit={(value) => commit(minKey, value)}
      />
      <span className="text-ink-400">–</span>
      <Field
        value={max}
        prefix={prefix}
        placeholder={maxPlaceholder}
        onChange={setMax}
        onCommit={(value) => commit(maxKey, value)}
      />
    </div>
  );
}

function Field({
  value,
  onChange,
  onCommit,
  placeholder,
  prefix,
}: {
  value: string;
  onChange: (value: string) => void;
  onCommit: (value: string) => void;
  placeholder: string;
  prefix?: string;
}) {
  return (
    <div className="relative flex-1">
      {prefix && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">
          {prefix}
        </span>
      )}
      <input
        type="number"
        inputMode="numeric"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onBlur={(event) => onCommit(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onCommit((event.target as HTMLInputElement).value);
          }
        }}
        className={`w-full rounded-lg border border-ink-300 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-amber-brand-400 ${
          prefix ? "pl-7 pr-2" : "px-3"
        }`}
      />
    </div>
  );
}
