/**
 * Single source of truth for dealership contact info and copy.
 * Edit this file to update the phone number, address, and hours everywhere.
 */
export const site = {
  name: "Honchar Auto",
  tagline: "Work-ready trucks and construction vehicles",
  description:
    "Honchar Auto sells dump trucks, flatbeds, box trucks, and heavy-duty work vehicles. Inspected, road-tested, and priced up front.",
  phone: "(813) 555-0142",
  phoneHref: "tel:+18135550142",
  email: "sales@honcharauto.com",
  address: {
    street: "4820 Industrial Park Blvd",
    city: "Tampa",
    state: "FL",
    zip: "33619",
  },
  hours: [
    { days: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
    { days: "Saturday", time: "9:00 AM – 4:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  rating: 4.8,
  reviewCount: 212,
} as const;

export const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;

/** Body types offered. Order drives the landing page tiles and filter list. */
export const BODY_TYPES = [
  "Dump Truck",
  "Flatbed",
  "Box Truck",
  "Pickup Truck",
  "Roll-Off",
  "Service / Utility",
  "Concrete Mixer",
  "Bucket / Boom",
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
