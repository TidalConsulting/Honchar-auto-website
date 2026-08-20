/**
 * Runs `prisma migrate deploy` during the production build.
 *
 * Hosting providers inject database URLs under a handful of different names —
 * Vercel's Postgres/Neon integration alone has used DATABASE_URL,
 * POSTGRES_PRISMA_URL, DATABASE_URL_UNPOOLED, and POSTGRES_URL_NON_POOLING.
 * Rather than making someone hand-copy them into the exact names Prisma wants,
 * this resolves whatever is present and fails with a readable message when
 * something genuinely required is missing.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Loads .env files the way the Prisma CLI does, so local builds work without
 * exporting anything by hand. Hosting providers set real environment variables,
 * which always win over a file.
 */
function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (!match) continue;
      const [, key, raw = ""] = match;
      if (process.env[key] !== undefined) continue;
      process.env[key] = raw.trim().replace(/^(['"])([\s\S]*)\1$/, "$2");
    }
  }
}

loadEnvFiles();

/** Pooled connection the app queries through. */
const POOLED = ["DATABASE_URL", "POSTGRES_PRISMA_URL", "POSTGRES_URL"];

/** Non-pooled connection. Migrations need this — they can't run over PgBouncer. */
const DIRECT = [
  "DIRECT_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
  "DATABASE_URL",
];

function firstSet(names) {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return { name, value: value.trim() };
  }
  return null;
}

function fail(message) {
  console.error(`\n✗ Deployment stopped.\n\n${message}\n`);
  process.exit(1);
}

/**
 * Prints which of the variables we care about are present, without their
 * values. When a deploy fails, this one block says whether the database was
 * ever connected — which is otherwise invisible in a build log.
 */
function reportEnv() {
  const seen = (name) => (process.env[name]?.trim() ? "set" : "—  ");
  const names = [...new Set([...POOLED, ...DIRECT, "AUTH_SECRET", "BLOB_READ_WRITE_TOKEN"])];
  console.log("Environment:");
  for (const name of names) console.log(`  ${seen(name)}  ${name}`);
  console.log("");
}

reportEnv();

const pooled = firstSet(POOLED);
if (!pooled) {
  fail(
    `No database connection string found.\n\n` +
      `Set DATABASE_URL in your hosting provider's environment variables.\n` +
      `On Vercel: Storage → create or connect a Postgres database, which sets this for you.\n\n` +
      `Looked for: ${POOLED.join(", ")}`,
  );
}

const direct = firstSet(DIRECT);

const secret = process.env.AUTH_SECRET?.trim();
if (!secret || secret.length < 24) {
  fail(
    `AUTH_SECRET is ${secret ? "too short" : "missing"}.\n\n` +
      `This signs the staff login sessions, so the dashboard can't run without it.\n` +
      `Generate one with:  openssl rand -base64 32\n` +
      `Then add it as an environment variable named AUTH_SECRET.`,
  );
}

if (!process.env.BLOB_READ_WRITE_TOKEN && process.env.VERCEL) {
  console.warn(
    "\n⚠ BLOB_READ_WRITE_TOKEN is not set. Photo uploads will fail on Vercel, because\n" +
      "  its filesystem is read-only. Fix: Storage → Blob → connect it to this project.\n",
  );
}

console.log(`→ Database: using ${pooled.name}`);
console.log(`→ Migrations: using ${direct.name}${direct.name === pooled.name ? " (pooled — fine for most providers)" : ""}`);

// Call the installed binary directly rather than through npx, which can try
// to resolve or fetch a package in a CI environment.
const prismaBin = path.join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "prisma.cmd" : "prisma",
);
const runner = existsSync(prismaBin) ? prismaBin : "npx";
const args = existsSync(prismaBin)
  ? ["migrate", "deploy"]
  : ["prisma", "migrate", "deploy"];

const result = spawnSync(runner, args, {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: pooled.value, DIRECT_URL: direct.value },
});

if (result.status !== 0) {
  fail(
    `The database migration failed.\n\n` +
      `Most common causes:\n` +
      `  • The database isn't reachable from the build (check the connection string).\n` +
      `  • ${direct.name} points at a pooled connection. Migrations need the direct,\n` +
      `    non-pooled string — on Neon it's the one labelled "unpooled".\n`,
  );
}
