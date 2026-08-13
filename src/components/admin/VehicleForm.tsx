"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { ImageUploader, type UploadedImage } from "@/components/admin/ImageUploader";
import type { VehicleFormState } from "@/app/actions/vehicles";
import {
  AXLE_CONFIGS,
  BODY_TYPES,
  DRIVETRAINS,
  FEATURE_OPTIONS,
  FUEL_TYPES,
  TRANSMISSIONS,
} from "@/lib/site";

const INITIAL: VehicleFormState = { status: "idle" };

export type VehicleFormValues = {
  id?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string | null;
  bodyType?: string;
  condition?: string;
  price?: number;
  msrp?: number | null;
  stockNumber?: string | null;
  vin?: string | null;
  mileage?: number | null;
  engineHours?: number | null;
  engine?: string | null;
  fuelType?: string | null;
  transmission?: string | null;
  drivetrain?: string | null;
  axleConfig?: string | null;
  gvwr?: number | null;
  gvwrClass?: number | null;
  cdlRequired?: boolean;
  payloadCapacity?: number | null;
  towingCapacity?: number | null;
  bodyLength?: number | null;
  pto?: boolean;
  hydraulics?: boolean;
  exteriorColor?: string | null;
  interiorColor?: string | null;
  doors?: number | null;
  seats?: number | null;
  description?: string | null;
  features?: string[];
  location?: string | null;
  status?: string;
  featured?: boolean;
  images?: UploadedImage[];
};

export function VehicleForm({
  action,
  vehicle = {},
  submitLabel,
}: {
  action: (state: VehicleFormState, formData: FormData) => Promise<VehicleFormState>;
  vehicle?: VehicleFormValues;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, INITIAL);
  const [features, setFeatures] = useState<string[]>(vehicle.features ?? []);
  const [customFeature, setCustomFeature] = useState("");

  const allFeatures = Array.from(new Set([...FEATURE_OPTIONS, ...features]));

  const toggleFeature = (feature: string) =>
    setFeatures((current) =>
      current.includes(feature) ? current.filter((entry) => entry !== feature) : [...current, feature],
    );

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" && state.message && (
        <p className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {state.message}
        </p>
      )}

      <Card title="The basics" subtitle="Everything a shopper sees first.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input name="year" label="Year" type="number" required defaultValue={vehicle.year} error={state.errors?.year} />
          <Input name="make" label="Make" required placeholder="Freightliner" defaultValue={vehicle.make} error={state.errors?.make} />
          <Input name="model" label="Model" required placeholder="M2 106" defaultValue={vehicle.model} error={state.errors?.model} />
          <Input name="trim" label="Trim / package" placeholder="Extended Cab" defaultValue={vehicle.trim ?? ""} />
          <Select
            name="bodyType"
            label="Body type"
            required
            options={BODY_TYPES.map((type) => ({ value: type, label: type }))}
            defaultValue={vehicle.bodyType}
            error={state.errors?.bodyType}
          />
          <Select
            name="condition"
            label="Condition"
            options={[
              { value: "USED", label: "Used" },
              { value: "NEW", label: "New" },
              { value: "CERTIFIED", label: "Certified" },
            ]}
            defaultValue={vehicle.condition ?? "USED"}
          />
          <Input
            name="price"
            label="Asking price"
            type="number"
            required
            prefix="$"
            defaultValue={vehicle.price}
            error={state.errors?.price}
          />
          <Input
            name="msrp"
            label="Compare-at / MSRP"
            type="number"
            prefix="$"
            hint="Optional. Shown struck through next to the price."
            defaultValue={vehicle.msrp ?? ""}
          />
          <Input name="stockNumber" label="Stock number" placeholder="HA-1042" defaultValue={vehicle.stockNumber ?? ""} error={state.errors?.stockNumber} />
        </div>
      </Card>

      <Card title="Photos" subtitle="The first photo is the one shoppers see in the grid.">
        <ImageUploader name="images" initial={vehicle.images ?? []} />
      </Card>

      <Card title="Usage & drivetrain">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input name="mileage" label="Mileage" type="number" suffix="mi" defaultValue={vehicle.mileage ?? ""} />
          <Input name="engineHours" label="Engine hours" type="number" suffix="hrs" defaultValue={vehicle.engineHours ?? ""} />
          <Input name="engine" label="Engine" placeholder="Cummins ISB 6.7L" defaultValue={vehicle.engine ?? ""} />
          <Select
            name="fuelType"
            label="Fuel type"
            allowEmpty
            options={FUEL_TYPES.map((type) => ({ value: type, label: type }))}
            defaultValue={vehicle.fuelType ?? ""}
          />
          <Select
            name="transmission"
            label="Transmission"
            allowEmpty
            options={TRANSMISSIONS.map((type) => ({ value: type, label: type }))}
            defaultValue={vehicle.transmission ?? ""}
          />
          <Select
            name="drivetrain"
            label="Drivetrain"
            allowEmpty
            options={DRIVETRAINS.map((type) => ({ value: type, label: type }))}
            defaultValue={vehicle.drivetrain ?? ""}
          />
          <Select
            name="axleConfig"
            label="Axle configuration"
            allowEmpty
            options={AXLE_CONFIGS.map((type) => ({ value: type, label: type }))}
            defaultValue={vehicle.axleConfig ?? ""}
          />
          <Input name="exteriorColor" label="Exterior color" placeholder="White" defaultValue={vehicle.exteriorColor ?? ""} />
          <Input name="interiorColor" label="Interior color" placeholder="Gray cloth" defaultValue={vehicle.interiorColor ?? ""} />
        </div>
      </Card>

      <Card title="Commercial specs" subtitle="These power the construction-specific filters on the store page.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input name="gvwr" label="GVWR" type="number" suffix="lbs" defaultValue={vehicle.gvwr ?? ""} />
          <Input name="gvwrClass" label="GVWR class" type="number" hint="3 through 8" defaultValue={vehicle.gvwrClass ?? ""} />
          <Input name="payloadCapacity" label="Payload capacity" type="number" suffix="lbs" defaultValue={vehicle.payloadCapacity ?? ""} />
          <Input name="towingCapacity" label="Towing capacity" type="number" suffix="lbs" defaultValue={vehicle.towingCapacity ?? ""} />
          <Input name="bodyLength" label="Bed / body length" type="number" step="0.1" suffix="ft" defaultValue={vehicle.bodyLength ?? ""} />
          <Input name="doors" label="Doors" type="number" defaultValue={vehicle.doors ?? ""} />
          <Input name="seats" label="Seats" type="number" defaultValue={vehicle.seats ?? ""} />
          <Input name="vin" label="VIN" placeholder="1FVACWDT8HH..." defaultValue={vehicle.vin ?? ""} />
          <Input name="location" label="Lot location" placeholder="Tampa, FL" defaultValue={vehicle.location ?? ""} />
        </div>

        <div className="mt-5 flex flex-wrap gap-6">
          <Checkbox name="cdlRequired" label="CDL required to drive" defaultChecked={vehicle.cdlRequired} />
          <Checkbox name="pto" label="PTO equipped" defaultChecked={vehicle.pto} />
          <Checkbox name="hydraulics" label="Hydraulics" defaultChecked={vehicle.hydraulics} />
        </div>
      </Card>

      <Card title="Equipment" subtitle="Tick everything the truck has. These show as chips on the listing.">
        {features.map((feature) => (
          <input key={feature} type="hidden" name="features" value={feature} />
        ))}

        <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {allFeatures.map((feature) => (
            <label
              key={feature}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-1.5 py-1.5 text-sm hover:bg-ink-50"
            >
              <input
                type="checkbox"
                checked={features.includes(feature)}
                onChange={() => toggleFeature(feature)}
                className="h-4 w-4 rounded border-ink-300 accent-amber-brand-500"
              />
              <span className="text-ink-700">{feature}</span>
            </label>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <input
            value={customFeature}
            onChange={(event) => setCustomFeature(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                const value = customFeature.trim();
                if (value && !features.includes(value)) setFeatures((current) => [...current, value]);
                setCustomFeature("");
              }
            }}
            placeholder="Add something else — e.g. “Snow plow mount”"
            className="min-w-64 flex-1 rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-amber-brand-400"
          />
          <button
            type="button"
            onClick={() => {
              const value = customFeature.trim();
              if (value && !features.includes(value)) setFeatures((current) => [...current, value]);
              setCustomFeature("");
            }}
            className="rounded-lg border border-ink-300 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50"
          >
            Add
          </button>
        </div>
      </Card>

      <Card title="Description" subtitle="Plain language sells trucks. Mention recent service, known quirks, and what job it suits.">
        <textarea
          name="description"
          rows={7}
          defaultValue={vehicle.description ?? ""}
          placeholder="Single-owner municipal truck, serviced every 250 hours. New brakes and tires at 118k. Bed liner in good shape, hoist tested under load."
          className="w-full rounded-lg border border-ink-300 px-3 py-2.5 text-sm leading-relaxed text-ink-900 placeholder:text-ink-400 focus:border-amber-brand-400"
        />
      </Card>

      <Card title="Visibility">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            name="status"
            label="Listing status"
            options={[
              { value: "PUBLISHED", label: "Live — visible on the website" },
              { value: "DRAFT", label: "Draft — hidden from shoppers" },
              { value: "SOLD", label: "Sold — shown with a sold badge" },
            ]}
            defaultValue={vehicle.status ?? "PUBLISHED"}
          />
          <div className="flex items-end pb-2">
            <Checkbox
              name="featured"
              label="Feature on the homepage and top of search"
              defaultChecked={vehicle.featured}
            />
          </div>
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t border-ink-200 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <Link
          href="/admin"
          className="rounded-full border border-ink-300 px-5 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-50"
        >
          Cancel
        </Link>
        <Submit label={submitLabel} />
      </div>
    </form>
  );
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-amber-brand-500 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-amber-brand-600 disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card border border-ink-200 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-bold text-ink-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-ink-600">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Input({
  name,
  label,
  type = "text",
  required,
  placeholder,
  defaultValue,
  hint,
  error,
  prefix,
  suffix,
  step,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number | null;
  hint?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ink-800">
        {label}
        {required && <span className="ml-0.5 text-amber-brand-600">*</span>}
      </span>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">
            {prefix}
          </span>
        )}
        <input
          type={type}
          name={name}
          step={step}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue ?? ""}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-amber-brand-400 ${
            error ? "border-red-400" : "border-ink-300"
          } ${prefix ? "pl-7" : ""} ${suffix ? "pr-12" : ""}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">
            {suffix}
          </span>
        )}
      </div>
      {error ? (
        <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-ink-500">{hint}</span>
      ) : null}
    </label>
  );
}

function Select({
  name,
  label,
  options,
  defaultValue,
  required,
  allowEmpty,
  error,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  required?: boolean;
  allowEmpty?: boolean;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ink-800">
        {label}
        {required && <span className="ml-0.5 text-amber-brand-600">*</span>}
      </span>
      <select
        name={name}
        required={required}
        defaultValue={defaultValue ?? (allowEmpty ? "" : options[0]?.value)}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-amber-brand-400 ${
          error ? "border-red-400" : "border-ink-300"
        }`}
      >
        {(allowEmpty || !defaultValue) && <option value="">— Select —</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink-800">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4.5 w-4.5 rounded border-ink-300 accent-amber-brand-500"
      />
      {label}
    </label>
  );
}
