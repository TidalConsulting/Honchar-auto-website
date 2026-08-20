/**
 * Single source of truth for dealership contact info and copy.
 * Edit this file to update the phone number, address, and hours everywhere.
 */
type Address = { street: string; city: string; state: string; zip: string };
type Reviews = { rating: number; count: number };

export const site = {
  name: "Honchar Auto",
  tagline: "Work-ready trucks and construction vehicles",
  description:
    "Family-owned dealership selling reliable, work-ready trucks and vans — pickups, cargo vans, dump trucks, and flatbeds. Selected and inspected by contractors who run them every day.",

  phone: "(239) 251-8433",
  phoneHref: "tel:+12392518433",
  email: "sales@honcharauto.com",

  /**
   * Set to null to omit every address block site-wide, rather than showing a
   * placeholder — a wrong address on a dealership site sends customers to the
   * wrong place, so this fails closed on purpose.
   */
  address: {
    street: "722 El Dorado Blvd N",
    city: "Cape Coral",
    state: "FL",
    zip: "33993",
  } as Address | null,

  /**
   * Star rating and review count, shown on listing cards and the detail page.
   * Null hides them everywhere.
   *
   * Currently null deliberately: the Google Business Profile has a 5.0 rating
   * from a single review, and "5.0 from 1 review" reads thinner than showing
   * nothing. Set it to { rating: 5.0, count: 1 } to switch the rating UI on,
   * or update the numbers once there are more reviews to point at.
   */
  reviews: null as Reviews | null,

  /** Matches the hours published on the Google Business Profile. */
  hours: [
    { days: "Monday – Saturday", time: "7:00 AM – 9:00 PM" },
    { days: "Sunday", time: "8:00 AM – 4:00 PM" },
  ],
} as const;

/** Full one-line address, or null when no address is configured. */
export const addressLine: string | null = site.address
  ? `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`
  : null;

/** "Fort Myers, FL" — used on listing cards and the detail page. Null when unset. */
export const cityState: string | null = site.address
  ? `${site.address.city}, ${site.address.state}`
  : null;

/** Where the lot is, for page copy. Falls back to the business name. */
export const locationLabel = cityState ?? site.name;

/**
 * Body types offered. Order drives the landing page tiles and filter list.
 * Trim this to what's actually stocked — an empty category shows "0 available".
 */
export const BODY_TYPES = [
  "Pickup Truck",
  "Cargo Van",
  "Dump Truck",
  "Flatbed",
  "Box Truck",
  "Service / Utility",
  "Passenger Van",
  "Roll-Off",
  "Bucket / Boom",
  "Concrete Mixer",
  "Semi Tractor",
  "Trailer",
] as const;

export const FUEL_TYPES = ["Diesel", "Gasoline", "Diesel Hybrid", "Electric", "CNG"] as const;

export const TRANSMISSIONS = ["Automatic", "Manual", "Automated Manual"] as const;

export const DRIVETRAINS = ["RWD", "4WD", "AWD", "FWD"] as const;

export const AXLE_CONFIGS = ["4x2", "4x4", "6x2", "6x4", "6x6", "8x4"] as const;

/** Equipment tags shown as chips on the detail page and used by the admin form. */
export const FEATURE_OPTIONS = [
  "Air Brakes",
  "Backup Camera",
  "Bluetooth",
  "Cold A/C",
  "Crane",
  "Cruise Control",
  "Dual Rear Wheels",
  "Engine Brake",
  "Fifth Wheel",
  "Gooseneck Hitch",
  "Heated Mirrors",
  "Hydraulic Hoist",
  "Liftgate",
  "Navigation",
  "New Tires",
  "Plow Prep",
  "Power Windows",
  "PTO",
  "Roll Tarp",
  "Running Boards",
  "Toolboxes",
  "Tow Package",
  "Trailer Brake Controller",
  "Winch",
] as const;
