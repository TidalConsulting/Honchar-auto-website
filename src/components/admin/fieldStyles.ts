/**
 * One definition of what a form control looks like in the dashboard, so text
 * inputs, selects, and textareas can't drift to different heights.
 *
 * h-12 gives a comfortable target for someone entering a truck on a phone at
 * the lot, and text-base (16px) stops iOS Safari zooming in on focus, which it
 * does to anything smaller.
 */
const SHARED = "w-full rounded-lg border bg-white px-3.5 text-base text-ink-900 transition-colors placeholder:text-ink-400 focus:border-amber-brand-400";

export const FIELD = `h-12 ${SHARED}`;

export const TEXTAREA = `${SHARED} py-3 leading-relaxed`;

/** Border colour, swapped when a field failed validation. */
export const fieldBorder = (hasError?: boolean) =>
  hasError ? "border-red-400" : "border-ink-300";

/** Checkboxes and radios, sized to match the taller fields. */
export const CHECKBOX = "h-5 w-5 rounded border-ink-300 accent-amber-brand-500";

export const LABEL = "mb-1.5 block text-sm font-semibold text-ink-800";
