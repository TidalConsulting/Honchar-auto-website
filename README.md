# Honchar Auto

Website and inventory system for Honchar Auto — dump trucks, flatbeds, box trucks,
and other construction/vocational vehicles.

Two halves:

- **The public site** — a clean landing page and a full store page (the main event)
  with cars.com-style faceted filtering and CarMax-style vehicle detail pages.
- **The dashboard** at `/admin` — where the owner adds, edits, and removes vehicles,
  uploads photos, and works through leads. No developer needed.

## Stack

| Piece      | Choice                                              |
| ---------- | --------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Server Actions), TypeScript |
| Styling    | Tailwind CSS v4                                     |
| Database   | PostgreSQL via Prisma                               |
| Auth       | Email + password accounts, signed JWT session cookie |
| Photos     | Vercel Blob in production, `public/uploads` locally |

---

## Running it locally

You need Node 20+ and a PostgreSQL database.

```bash
npm install
cp .env.example .env          # then fill in DATABASE_URL, DIRECT_URL, AUTH_SECRET
npm run db:migrate            # create the tables
npm run db:seed               # optional: 18 demo trucks + an owner login
npm run dev
```

Open http://localhost:3000. The dashboard is at http://localhost:3000/admin.

**First sign-in.** If no accounts exist, `/admin/login` shows a one-time setup form —
fill it in and you become the owner. If you ran the seed, sign in with
`owner@honcharauto.com` / `honchar1234` and change the password under **Team**.

### Useful commands

```bash
npm run dev         # development server
npm run build       # production build (runs prisma generate first)
npm run start       # serve the production build
npm run lint        # eslint
npm run db:migrate  # create + apply a migration after editing the schema
npm run db:deploy   # apply existing migrations (used in production)
npm run db:seed     # reset vehicles to the demo set
npm run db:studio   # browse the database in a GUI
```

---

## Deploying to Vercel

1. **Create the database.** In the Vercel dashboard → Storage → create a Postgres
   store (Neon works well). Vercel will offer the connection strings.
2. **Import the repo** into Vercel as a new project. Framework preset: Next.js.
3. **Set environment variables** (Project → Settings → Environment Variables):

   | Name                    | Value                                                       |
   | ----------------------- | ----------------------------------------------------------- |
   | `DATABASE_URL`          | pooled connection string from step 1                        |
   | `DIRECT_URL`            | direct (non-pooled) connection string                       |
   | `AUTH_SECRET`           | output of `openssl rand -base64 32`                         |
   | `BLOB_READ_WRITE_TOKEN` | created automatically when you connect a Vercel Blob store  |

4. **Create the Blob store** (Storage → Blob → Connect Project) so photo uploads
   have somewhere to live. Serverless filesystems are read-only, so this is required
   in production — without it, uploads will fail.
5. **Deploy.** The build runs `prisma migrate deploy` before `next build`, so the
   database schema is created on the first deploy.
6. Visit `https://your-domain/admin` and create the owner account.

### Custom domain

Vercel → Project → Settings → Domains → add `honcharauto.com`, then point the
registrar's nameservers or A/CNAME records at Vercel as instructed there.

---

## Day-to-day: managing inventory

Everything lives under `/admin`.

**Add a truck.** Inventory → *Add a vehicle*. Only Year, Make, Model, Body type,
and Asking price are required — fill in the rest whenever you have it. Drag photos
onto the upload box (or tap to browse from a phone); the first photo is the one
shoppers see in the grid, and the arrows reorder them.

**Edit or remove.** Every row has *Edit* and *Delete*. Delete asks for confirmation
and is permanent.

**Statuses.**

- **Live** — visible on the website.
- **Draft** — hidden from shoppers. Use this while you're still taking photos.
- **Sold** — stays online with a *Sold* badge and a "browse similar" prompt, which is
  good for search traffic. Hit *Relist* if it comes back.

**Price drops.** Lower a price and the old one is remembered automatically — the
listing then shows a green price-drop badge, the way cars.com does.

**Featured (★).** Pins a truck to the homepage row and the top of *Best match*.

**Copy.** Duplicates a listing as a draft. Handy when two near-identical units come
in together — copy, change the stock number and mileage, publish.

**Leads.** Every enquiry from a listing, the financing page, or the contact form lands
under Leads with the truck it was about. Mark them contacted or closed as you work
through them; the nav badge counts the new ones.

**Team.** Owners can add staff accounts and change their own password. Staff can
manage inventory and leads but not the team.

## Changing the dealership's details

Phone number, address, hours, rating, the body types offered, and the equipment
checklist all live in one file: [`src/lib/site.ts`](src/lib/site.ts). Edit it and
redeploy — the header, footer, contact page, and filters all read from it.

Payment-estimate defaults (APR, term, down payment) are in
[`src/lib/finance.ts`](src/lib/finance.ts).

---

## How the store page works

Filters are held in the URL (`/inventory?body=Dump+Truck&cdl=no&priceMax=90000`), so
results are shareable, bookmarkable, back-button friendly, and rendered on the server
for SEO. Option counts next to each filter are computed live against the rest of the
active filters, so you never click into an empty result set.

Filterable: keyword, price, condition, body type, make, year, mileage, engine hours,
axle configuration, GVWR class, CDL requirement, fuel type, drivetrain, and equipment.

Vehicles with no photos yet fall back to a generated side-profile illustration that
matches the body type and paint colour, so a half-photographed lot still looks
deliberate.

## Project layout

```
prisma/
  schema.prisma            data model
  seed.ts                  demo inventory
src/
  app/
    (site)/                public site — landing, inventory, detail, about, etc.
    admin/                 dashboard (login + inventory, leads, team)
    actions/               server actions: auth, vehicles, leads, admin
    api/upload             photo uploads
    api/vehicles           lookup for the saved-vehicles page
  components/              shared UI; components/admin/* is dashboard-only
  lib/                     data access, auth, formatting, finance, site config
  proxy.ts                 redirects signed-out visitors away from /admin
```

## Security notes

- Passwords are hashed with bcrypt (cost 12); sessions are signed JWTs in an
  httpOnly, sameSite=lax cookie that expires after 14 days.
- `src/proxy.ts` only checks that a session cookie exists — every admin page and
  server action independently re-verifies the token and reloads the user, so
  deleting an account revokes access immediately.
- All form input is validated with zod on the server before it touches the database.
- Public forms carry a honeypot field to absorb basic bot spam.
