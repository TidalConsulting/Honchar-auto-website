"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitLead, type LeadFormState } from "@/app/actions/leads";

const INITIAL: LeadFormState = { status: "idle" };

export function LeadForm({
  vehicleId,
  type = "AVAILABILITY",
  heading,
  subheading,
  submitLabel = "Check availability",
  defaultMessage = "",
  compact = false,
}: {
  vehicleId?: string;
  type?: "AVAILABILITY" | "FINANCING" | "TRADE" | "GENERAL";
  heading?: string;
  subheading?: string;
  submitLabel?: string;
  defaultMessage?: string;
  compact?: boolean;
}) {
  const [state, formAction] = useActionState(submitLead, INITIAL);

  if (state.status === "success") {
    return (
      <div className="rounded-card border border-green-200 bg-green-50 p-6 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
            <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-3 text-lg font-bold text-green-900">Request sent</h3>
        <p className="mt-1 text-sm text-green-800">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      {heading && <h3 className="text-lg font-bold text-ink-900">{heading}</h3>}
      {subheading && <p className="-mt-1 text-sm text-ink-600">{subheading}</p>}

      <input type="hidden" name="type" value={type} />
      {vehicleId && <input type="hidden" name="vehicleId" value={vehicleId} />}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={compact ? "space-y-3" : "grid gap-3 sm:grid-cols-2"}>
        <TextField name="name" label="Full name" autoComplete="name" error={state.errors?.name} required />
        <TextField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={state.errors?.email}
          required
        />
      </div>

      <TextField name="phone" label="Phone (optional)" type="tel" autoComplete="tel" error={state.errors?.phone} />

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink-800">
          What do you need it for?
        </span>
        <textarea
          name="message"
          rows={3}
          defaultValue={defaultMessage}
          placeholder="Tell us about the job, your timeline, or any questions."
          className="w-full rounded-lg border border-ink-300 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-amber-brand-400"
        />
      </label>

      {state.status === "error" && state.message && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}

      <SubmitButton label={submitLabel} />

      <p className="text-xs leading-relaxed text-ink-500">
        By submitting you agree to be contacted about this vehicle. We never sell your information.
      </p>
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-amber-brand-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-amber-brand-600 disabled:opacity-60"
    >
      {pending ? "Sending…" : label}
    </button>
  );
}

function TextField({
  name,
  label,
  type = "text",
  autoComplete,
  error,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ink-800">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-amber-brand-400 ${
          error ? "border-red-400" : "border-ink-300"
        }`}
      />
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}
