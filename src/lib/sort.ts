/** Shared by the server-side query builder and the client-side sort control. */
export const SORT_OPTIONS = [
  { value: "best", label: "Best match" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "year-desc", label: "Year: newest first" },
  { value: "year-asc", label: "Year: oldest first" },
  { value: "mileage-asc", label: "Mileage: lowest first" },
  { value: "newest", label: "Recently added" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
