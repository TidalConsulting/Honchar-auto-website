/** Helpers for the URL-driven inventory filters. Every filter lives in the query
 *  string so results are shareable, bookmarkable, and server-rendered. */

export function withParam(
  params: URLSearchParams,
  key: string,
  value: string | number | null | undefined,
) {
  const next = new URLSearchParams(params);
  if (value === null || value === undefined || value === "") next.delete(key);
  else next.set(key, String(value));
  next.delete("page");
  return next;
}

/** Multi-select facets are stored as `key=a,b,c`. */
export function withToggledValue(params: URLSearchParams, key: string, value: string) {
  const next = new URLSearchParams(params);
  const current = (next.get(key) ?? "").split(",").filter(Boolean);
  const updated = current.includes(value)
    ? current.filter((entry) => entry !== value)
    : [...current, value];

  if (updated.length) next.set(key, updated.join(","));
  else next.delete(key);
  next.delete("page");
  return next;
}

export function hasValue(params: URLSearchParams, key: string, value: string) {
  return (params.get(key) ?? "").split(",").filter(Boolean).includes(value);
}

export function queryString(params: URLSearchParams) {
  const value = params.toString();
  return value ? `?${value}` : "";
}
