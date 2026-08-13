"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { changePassword, createUser, type SimpleState } from "@/app/actions/admin";

const INITIAL: SimpleState = {};

export function AccountForms({ canAddUsers }: { canAddUsers: boolean }) {
  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-2">
      {canAddUsers && <AddUserForm />}
      <ChangePasswordForm />
    </div>
  );
}

function AddUserForm() {
  const [state, formAction] = useActionState(createUser, INITIAL);

  return (
    <section className="rounded-card border border-ink-200 bg-white p-6">
      <h2 className="text-lg font-bold text-ink-900">Add a team member</h2>
      <p className="mt-1 text-sm text-ink-600">
        They&apos;ll be able to add, edit, and remove inventory right away.
      </p>

      <form action={formAction} className="mt-5 space-y-4">
        <Field name="name" label="Name" required />
        <Field name="email" label="Email" type="email" required />
        <Field name="password" label="Temporary password" type="password" required hint="At least 8 characters. They can change it after signing in." />

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink-800">Role</span>
          <select
            name="role"
            defaultValue="STAFF"
            className="w-full rounded-lg border border-ink-300 bg-white px-3 py-2.5 text-sm focus:border-amber-brand-400"
          >
            <option value="STAFF">Staff — manage inventory and leads</option>
            <option value="OWNER">Owner — also manages the team</option>
          </select>
        </label>

        <Feedback state={state} />
        <Submit label="Add team member" />
      </form>
    </section>
  );
}

function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePassword, INITIAL);

  return (
    <section className="rounded-card border border-ink-200 bg-white p-6">
      <h2 className="text-lg font-bold text-ink-900">Change your password</h2>
      <p className="mt-1 text-sm text-ink-600">Updates the account you&apos;re signed in as.</p>

      <form action={formAction} className="mt-5 space-y-4">
        <Field name="password" label="New password" type="password" required autoComplete="new-password" />
        <Field name="confirm" label="Confirm new password" type="password" required autoComplete="new-password" />

        <Feedback state={state} />
        <Submit label="Update password" />
      </form>
    </section>
  );
}

function Feedback({ state }: { state: SimpleState }) {
  if (state.error) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p className="rounded-lg bg-green-50 px-3 py-2.5 text-sm font-medium text-green-800">
        {state.success}
      </p>
    );
  }
  return null;
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-ink-900 px-5 py-3 text-sm font-bold text-white hover:bg-ink-800 disabled:opacity-60"
    >
      {pending ? "Working…" : label}
    </button>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  hint,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ink-800">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-ink-300 px-3 py-2.5 text-sm text-ink-900 focus:border-amber-brand-400"
      />
      {hint && <span className="mt-1 block text-xs text-ink-500">{hint}</span>}
    </label>
  );
}
