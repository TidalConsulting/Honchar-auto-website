/**
 * Demo inventory so the site looks real before real trucks are added.
 * Run with `npm run db:seed`. Safe to re-run — it clears demo vehicles first.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type Seed = {
  year: number;
  make: string;
  model: string;
  trim?: string;
  bodyType: string;
  condition?: "NEW" | "USED" | "CERTIFIED";
  price: number;
  msrp?: number;
  previousPrice?: number;
  mileage?: number;
  engineHours?: number;
  engine?: string;
  fuelType?: string;
  transmission?: string;
  drivetrain?: string;
  axleConfig?: string;
  gvwr?: number;
  gvwrClass?: number;
  cdlRequired?: boolean;
  payloadCapacity?: number;
  towingCapacity?: number;
  bodyLength?: number;
  pto?: boolean;
  hydraulics?: boolean;
  exteriorColor?: string;
  interiorColor?: string;
  doors?: number;
  seats?: number;
  description: string;
  features: string[];
  featured?: boolean;
  status?: "DRAFT" | "PUBLISHED" | "SOLD";
};

const VEHICLES: Seed[] = [
  {
    year: 2019,
    make: "Freightliner",
    model: "M2 106",
    trim: "Tandem Dump",
    bodyType: "Dump Truck",
    price: 89500,
    previousPrice: 94000,
    mileage: 118400,
    engineHours: 6200,
    engine: "Cummins ISB 6.7L",
    fuelType: "Diesel",
    transmission: "Automatic",
    drivetrain: "RWD",
    axleConfig: "6x4",
    gvwr: 66000,
    gvwrClass: 8,
    cdlRequired: true,
    payloadCapacity: 34000,
    bodyLength: 16,
    pto: true,
    hydraulics: true,
    exteriorColor: "White",
    interiorColor: "Gray vinyl",
    doors: 2,
    seats: 3,
    featured: true,
    description:
      "Single-owner municipal dump truck that spent its life hauling road base, not salt. Serviced every 250 hours with records in the folder.\n\nNew brakes and steer tires at 112k. Hoist tested under full load, bed liner in good shape with no soft spots. Air ride seat, cold A/C, and a clean interior for a truck this age.",
    features: ["Air Brakes", "Hydraulic Hoist", "PTO", "Cold A/C", "Engine Brake", "Backup Camera", "New Tires"],
  },
  {
    year: 2021,
    make: "International",
    model: "MV607",
    trim: "Flatbed",
    bodyType: "Flatbed",
    price: 76900,
    mileage: 62300,
    engine: "Cummins B6.7",
    fuelType: "Diesel",
    transmission: "Automatic",
    drivetrain: "RWD",
    axleConfig: "4x2",
    gvwr: 33000,
    gvwrClass: 7,
    cdlRequired: true,
    payloadCapacity: 19500,
    bodyLength: 24,
    exteriorColor: "Red",
    interiorColor: "Black cloth",
    doors: 2,
    seats: 3,
    featured: true,
    description:
      "24-foot steel deck flatbed with stake pockets down both rails and a gooseneck ball in the deck. Came off a lease from a lumber yard — plenty of scratches in the deck, nothing structural.\n\nAllison automatic shifts smooth. Air conditioning blows cold. Ready to work the day you take it.",
    features: ["Gooseneck Hitch", "Air Brakes", "Cruise Control", "Bluetooth", "Toolboxes", "Tow Package"],
  },
  {
    year: 2020,
    make: "Ford",
    model: "F-350",
    trim: "Super Duty XL",
    bodyType: "Pickup Truck",
    price: 42750,
    msrp: 46200,
    mileage: 84100,
    engine: "6.7L Power Stroke V8",
    fuelType: "Diesel",
    transmission: "Automatic",
    drivetrain: "4WD",
    axleConfig: "4x4",
    gvwr: 14000,
    gvwrClass: 3,
    cdlRequired: false,
    payloadCapacity: 4800,
    towingCapacity: 21000,
    bodyLength: 8,
    exteriorColor: "Blue",
    interiorColor: "Gray cloth",
    doors: 4,
    seats: 6,
    featured: true,
    description:
      "Crew cab, long bed, four-wheel drive — the truck every site foreman actually wants. Spray-in bed liner, gooseneck prep in the bed, and a factory trailer brake controller.\n\nNo CDL needed. Runs and drives like a much newer truck.",
    features: [
      "Backup Camera",
      "Bluetooth",
      "Trailer Brake Controller",
      "Gooseneck Hitch",
      "Cruise Control",
      "Power Windows",
      "Running Boards",
      "Cold A/C",
    ],
  },
  {
    year: 2018,
    make: "Peterbilt",
    model: "348",
    trim: "Roll-Off",
    bodyType: "Roll-Off",
    price: 112000,
    mileage: 196800,
    engineHours: 11400,
    engine: "PACCAR PX-9",
    fuelType: "Diesel",
    transmission: "Automatic",
    drivetrain: "RWD",
    axleConfig: "6x4",
    gvwr: 66000,
    gvwrClass: 8,
    cdlRequired: true,
    payloadCapacity: 32000,
    pto: true,
    hydraulics: true,
    exteriorColor: "Black",
    doors: 2,
    seats: 2,
    description:
      "60,000 lb cable hoist roll-off from a demolition outfit that shut down. Hydraulics were rebuilt last spring, cable replaced at the same time.\n\nHigh miles but the drivetrain is sorted — we put it through a full inspection and replaced the turbo and both front tires.",
    features: ["Air Brakes", "Hydraulic Hoist", "PTO", "Engine Brake", "Heated Mirrors", "Winch"],
  },
  {
    year: 2022,
    make: "Isuzu",
    model: "NPR-HD",
    trim: "16ft Box",
    bodyType: "Box Truck",
    price: 58400,
    mileage: 41200,
    engine: "6.6L V8 Gas",
    fuelType: "Gasoline",
    transmission: "Automatic",
    drivetrain: "RWD",
    axleConfig: "4x2",
    gvwr: 14500,
    gvwrClass: 4,
    cdlRequired: false,
    payloadCapacity: 6800,
    bodyLength: 16,
    exteriorColor: "White",
    interiorColor: "Gray vinyl",
    doors: 2,
    seats: 3,
    description:
      "16-foot dry box with a 3,000 lb tuck-under liftgate. Cabover visibility makes it easy in tight neighborhoods and job sites.\n\nUnder 14,500 GVWR so no CDL is required. Perfect for a supply run truck or a mobile shop build.",
    features: ["Liftgate", "Backup Camera", "Bluetooth", "Cold A/C", "Power Windows"],
  },
  {
    year: 2017,
    make: "Kenworth",
    model: "T370",
    trim: "Service Body",
    bodyType: "Service / Utility",
    price: 67900,
    previousPrice: 71500,
    mileage: 143700,
    engineHours: 8900,
    engine: "PACCAR PX-7",
    fuelType: "Diesel",
    transmission: "Automatic",
    drivetrain: "RWD",
    axleConfig: "4x2",
    gvwr: 33000,
    gvwrClass: 7,
    cdlRequired: true,
    pto: true,
    hydraulics: true,
    bodyLength: 14,
    exteriorColor: "Orange",
    doors: 2,
    seats: 2,
    description:
      "Mechanic's truck with a 14-foot utility body, an air compressor, and a 6,000 lb service crane on the rear corner. Every compartment latch works and every light is intact.\n\nSet up by a fleet shop that took care of it. This is a rolling workshop, ready to go.",
    features: ["Crane", "PTO", "Air Brakes", "Toolboxes", "Winch", "Cold A/C", "Heated Mirrors"],
  },
  {
    year: 2016,
    make: "Mack",
    model: "Granite GU713",
    trim: "Mixer",
    bodyType: "Concrete Mixer",
    price: 98500,
    mileage: 208400,
    engineHours: 14200,
    engine: "Mack MP7 11L",
    fuelType: "Diesel",
    transmission: "Automated Manual",
    drivetrain: "RWD",
    axleConfig: "6x4",
    gvwr: 80000,
    gvwrClass: 8,
    cdlRequired: true,
    payloadCapacity: 40000,
    pto: true,
    hydraulics: true,
    exteriorColor: "Yellow",
    doors: 2,
    seats: 2,
    description:
      "10.5 cubic yard McNeilus drum, rear discharge, with the chute rack and fold-down ladder all intact. Drum and rollers inspected — no cracks, no excessive wear.\n\nA workhorse with high hours, priced accordingly. Bring your mechanic.",
    features: ["Air Brakes", "PTO", "Engine Brake", "Hydraulic Hoist", "Heated Mirrors"],
  },
  {
    year: 2023,
    make: "Ram",
    model: "5500",
    trim: "Tradesman Chassis Cab",
    bodyType: "Service / Utility",
    price: 79900,
    msrp: 84500,
    mileage: 27600,
    engine: "6.7L Cummins I6",
    fuelType: "Diesel",
    transmission: "Automatic",
    drivetrain: "4WD",
    axleConfig: "4x4",
    gvwr: 19500,
    gvwrClass: 5,
    cdlRequired: false,
    payloadCapacity: 12000,
    towingCapacity: 35000,
    bodyLength: 11,
    exteriorColor: "White",
    interiorColor: "Black cloth",
    doors: 4,
    seats: 6,
    featured: true,
    description:
      "Nearly new crew cab 5500 with an 11-foot aluminum service body and a factory PTO provision. Still under the balance of the powertrain warranty.\n\nUnder 26,000 lbs GVWR — no CDL required. This is the easiest-to-staff truck on the lot.",
    features: [
      "Toolboxes",
      "Backup Camera",
      "Bluetooth",
      "Navigation",
      "Trailer Brake Controller",
      "Cruise Control",
      "Power Windows",
      "Cold A/C",
    ],
  },
  {
    year: 2015,
    make: "Chevrolet",
    model: "Silverado 3500HD",
    trim: "Work Truck",
    bodyType: "Pickup Truck",
    price: 28900,
    mileage: 164800,
    engine: "6.0L Vortec V8",
    fuelType: "Gasoline",
    transmission: "Automatic",
    drivetrain: "4WD",
    axleConfig: "4x4",
    gvwr: 13025,
    gvwrClass: 3,
    cdlRequired: false,
    payloadCapacity: 4300,
    towingCapacity: 14500,
    bodyLength: 8,
    exteriorColor: "Silver",
    interiorColor: "Gray vinyl",
    doors: 2,
    seats: 3,
    description:
      "Honest, high-mileage work truck at an honest price. Dual rear wheels, gas V8, and a plow mount already on the front.\n\nThe paint has seen better days and there's a dent in the passenger bedside. Mechanically it's sound and it passed our inspection.",
    features: ["Dual Rear Wheels", "Plow Prep", "Tow Package", "Cold A/C", "Cruise Control"],
  },
  {
    year: 2020,
    make: "Freightliner",
    model: "Cascadia 126",
    trim: "Day Cab",
    bodyType: "Semi Tractor",
    price: 74500,
    mileage: 312000,
    engine: "Detroit DD13",
    fuelType: "Diesel",
    transmission: "Automated Manual",
    drivetrain: "RWD",
    axleConfig: "6x4",
    gvwr: 80000,
    gvwrClass: 8,
    cdlRequired: true,
    exteriorColor: "Gray",
    doors: 2,
    seats: 2,
    description:
      "Day cab tractor out of a regional fleet, all highway miles with full service history. Aluminum wheels, air ride, and a clean DOT record.\n\nPulls anything you hook to it. Priced well under retail because of the mileage.",
    features: ["Air Brakes", "Fifth Wheel", "Engine Brake", "Cruise Control", "Bluetooth", "Heated Mirrors"],
  },
  {
    year: 2019,
    make: "Ford",
    model: "F-550",
    trim: "Bucket Truck",
    bodyType: "Bucket / Boom",
    price: 84900,
    mileage: 76400,
    engineHours: 4100,
    engine: "6.7L Power Stroke V8",
    fuelType: "Diesel",
    transmission: "Automatic",
    drivetrain: "4WD",
    axleConfig: "4x4",
    gvwr: 19500,
    gvwrClass: 5,
    cdlRequired: false,
    pto: true,
    hydraulics: true,
    exteriorColor: "White",
    doors: 2,
    seats: 3,
    description:
      "Altec 42-foot working height insulated boom on a 4x4 F-550 chassis. Dielectric tested and certified this year, paperwork included.\n\nOutriggers work as they should, and the whole hydraulic system was gone through before it hit our lot.",
    features: ["Crane", "PTO", "Toolboxes", "Backup Camera", "Cold A/C", "Winch"],
  },
  {
    year: 2021,
    make: "Big Tex",
    model: "22GN",
    trim: "Gooseneck Equipment",
    bodyType: "Trailer",
    price: 16400,
    exteriorColor: "Black",
    bodyLength: 25,
    payloadCapacity: 19000,
    cdlRequired: false,
    description:
      "25-foot gooseneck equipment trailer with dual 10,000 lb axles, mega ramps, and a spare. Deck boards were replaced last year.\n\nLights and brakes all work. Pull it behind anything with a gooseneck ball.",
    features: ["Gooseneck Hitch", "New Tires"],
  },
  {
    year: 2024,
    make: "Hino",
    model: "L6",
    trim: "Dump",
    bodyType: "Dump Truck",
    price: 128900,
    msrp: 136000,
    condition: "NEW",
    mileage: 1240,
    engine: "Hino A09 8.9L",
    fuelType: "Diesel",
    transmission: "Automatic",
    drivetrain: "RWD",
    axleConfig: "4x2",
    gvwr: 33000,
    gvwrClass: 7,
    cdlRequired: true,
    payloadCapacity: 18000,
    bodyLength: 12,
    pto: true,
    hydraulics: true,
    exteriorColor: "White",
    interiorColor: "Gray cloth",
    doors: 2,
    seats: 3,
    description:
      "Brand new 12-foot steel dump body on a Hino L6 chassis, built to order and never put to work. Full factory warranty.\n\nIf you want to stop chasing repairs on an old truck, this is the answer.",
    features: ["Hydraulic Hoist", "PTO", "Air Brakes", "Backup Camera", "Bluetooth", "Cold A/C", "Roll Tarp"],
  },
  {
    year: 2018,
    make: "GMC",
    model: "Savana 3500",
    trim: "Cutaway Box",
    bodyType: "Box Truck",
    price: 34500,
    mileage: 128900,
    engine: "6.0L V8",
    fuelType: "Gasoline",
    transmission: "Automatic",
    drivetrain: "RWD",
    axleConfig: "4x2",
    gvwr: 12300,
    gvwrClass: 3,
    cdlRequired: false,
    bodyLength: 14,
    exteriorColor: "White",
    doors: 2,
    seats: 2,
    status: "SOLD",
    description:
      "14-foot cutaway box van, shelved out for a plumbing contractor. Ladder rack on the roof and a rear roll-up door.",
    features: ["Backup Camera", "Cold A/C", "Toolboxes"],
  },
  {
    year: 2017,
    make: "Volvo",
    model: "VHD",
    trim: "Tri-Axle Dump",
    bodyType: "Dump Truck",
    price: 105000,
    mileage: 231000,
    engineHours: 12800,
    engine: "Volvo D13",
    fuelType: "Diesel",
    transmission: "Automated Manual",
    drivetrain: "RWD",
    axleConfig: "8x4",
    gvwr: 76000,
    gvwrClass: 8,
    cdlRequired: true,
    payloadCapacity: 38000,
    bodyLength: 18,
    pto: true,
    hydraulics: true,
    exteriorColor: "Green",
    doors: 2,
    seats: 2,
    description:
      "Tri-axle with a lift axle and an 18-foot aluminum bed — light enough to carry real weight legally. Air-ride cab, and the I-Shift makes it easy on operators.\n\nCame from a paving contractor who traded up. Well maintained with records.",
    features: ["Air Brakes", "Hydraulic Hoist", "PTO", "Engine Brake", "Roll Tarp", "Heated Mirrors", "Backup Camera"],
  },
  {
    year: 2022,
    make: "Chevrolet",
    model: "Silverado 2500HD",
    trim: "Custom",
    bodyType: "Pickup Truck",
    price: 46900,
    mileage: 54300,
    engine: "6.6L Duramax V8",
    fuelType: "Diesel",
    transmission: "Automatic",
    drivetrain: "4WD",
    axleConfig: "4x4",
    gvwr: 10650,
    gvwrClass: 3,
    cdlRequired: false,
    payloadCapacity: 3200,
    towingCapacity: 18500,
    bodyLength: 6.6,
    exteriorColor: "Black",
    interiorColor: "Black cloth",
    doors: 4,
    seats: 5,
    description:
      "Duramax crew cab with the Z71 package and a bed cover. Clean truck that a supervisor drove, not a truck that lived on a job site.\n\nStill has factory warranty remaining on the powertrain.",
    features: ["Backup Camera", "Bluetooth", "Navigation", "Cruise Control", "Power Windows", "Tow Package", "Running Boards"],
  },
  {
    year: 2014,
    make: "International",
    model: "DuraStar 4300",
    trim: "Flatbed",
    bodyType: "Flatbed",
    price: 39500,
    previousPrice: 43000,
    mileage: 218700,
    engine: "MaxxForce DT",
    fuelType: "Diesel",
    transmission: "Manual",
    drivetrain: "RWD",
    axleConfig: "4x2",
    gvwr: 33000,
    gvwrClass: 7,
    cdlRequired: true,
    payloadCapacity: 17500,
    bodyLength: 20,
    exteriorColor: "White",
    doors: 2,
    seats: 3,
    description:
      "20-foot flatbed with a 6-speed manual. Budget truck for a crew that needs to move material and doesn't mind shifting gears.\n\nEGR work was done at 205k. Sold with a fresh DOT inspection.",
    features: ["Air Brakes", "Toolboxes", "Cold A/C"],
  },
  {
    year: 2023,
    make: "Ford",
    model: "F-600",
    trim: "Dump",
    bodyType: "Dump Truck",
    price: 92400,
    mileage: 18900,
    engine: "7.3L Godzilla V8",
    fuelType: "Gasoline",
    transmission: "Automatic",
    drivetrain: "4WD",
    axleConfig: "4x4",
    gvwr: 22000,
    gvwrClass: 6,
    cdlRequired: false,
    payloadCapacity: 12500,
    bodyLength: 11,
    pto: true,
    hydraulics: true,
    exteriorColor: "Red",
    interiorColor: "Gray vinyl",
    doors: 2,
    seats: 3,
    featured: true,
    description:
      "Under 26,000 lbs GVWR, so any licensed driver on your crew can run it. 11-foot steel dump body with a hoist that lifts fast.\n\nGas engine keeps maintenance simple and cheap compared to a diesel of the same size.",
    features: ["Hydraulic Hoist", "PTO", "Backup Camera", "Bluetooth", "Trailer Brake Controller", "Cold A/C"],
  },
];

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "owner@honcharauto.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "honchar1234";

  const existingUsers = await prisma.user.count();
  if (existingUsers === 0) {
    await prisma.user.create({
      data: {
        name: "Honchar Auto Owner",
        email,
        role: "OWNER",
        passwordHash: await bcrypt.hash(password, 12),
      },
    });
    console.log(`Created owner account: ${email} / ${password}`);
  } else {
    console.log("Users already exist — skipping account creation.");
  }

  await prisma.vehicle.deleteMany({});

  const DAY = 24 * 60 * 60 * 1000;
  const now = Date.now();

  let stock = 1000;
  for (const [index, vehicle] of VEHICLES.entries()) {
    const { features, ...rest } = vehicle;
    const base = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim ?? ""} ${vehicle.bodyType}`;
    const status = vehicle.status ?? "PUBLISHED";

    // Stagger listing dates so days-on-market and "longest on the lot" have
    // something realistic to report in the demo data.
    const listedAt = new Date(now - (14 + index * 9) * DAY);
    const sold = status === "SOLD";

    await prisma.vehicle.create({
      data: {
        ...rest,
        features,
        slug: slugify(base),
        stockNumber: `HA-${stock++}`,
        location: "Cape Coral, FL",
        status,
        listedAt,
        originalPrice: vehicle.price,
        ...(sold
          ? {
              soldAt: new Date(listedAt.getTime() + 26 * DAY),
              soldPrice: Math.round(vehicle.price * 0.94),
            }
          : {}),
      },
    });
  }

  // A couple more completed sales so the averages aren't drawn from one data
  // point. These are demo records; production starts empty.
  const extraSales = [
    { title: "2019 Ford F-250 Super Duty", price: 38900, soldFor: 37000, days: 19 },
    { title: "2020 Ram ProMaster 2500 Cargo Van", price: 31500, soldFor: 29750, days: 41 },
  ];
  for (const [index, sale] of extraSales.entries()) {
    const listedAt = new Date(now - (sale.days + 30) * DAY);
    await prisma.vehicle.create({
      data: {
        year: Number(sale.title.slice(0, 4)),
        make: sale.title.split(" ")[1],
        model: sale.title.split(" ").slice(2).join(" "),
        bodyType: sale.title.includes("Van") ? "Cargo Van" : "Pickup Truck",
        price: sale.price,
        slug: slugify(`${sale.title} sold ${index}`),
        stockNumber: `HA-${stock++}`,
        location: "Cape Coral, FL",
        status: "SOLD",
        description: "Sold. Kept online because the listing still brings in searches.",
        features: [],
        listedAt,
        originalPrice: sale.price,
        soldAt: new Date(listedAt.getTime() + sale.days * DAY),
        soldPrice: sale.soldFor,
      },
    });
  }

  console.log(`Seeded ${VEHICLES.length + extraSales.length} vehicles.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
