-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'STAFF');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('NEW', 'USED', 'CERTIFIED');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SOLD');

-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('AVAILABILITY', 'FINANCING', 'TRADE', 'GENERAL');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "stockNumber" TEXT,
    "vin" TEXT,
    "year" INTEGER NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "trim" TEXT,
    "bodyType" TEXT NOT NULL,
    "condition" "Condition" NOT NULL DEFAULT 'USED',
    "price" INTEGER NOT NULL,
    "msrp" INTEGER,
    "previousPrice" INTEGER,
    "mileage" INTEGER,
    "engineHours" INTEGER,
    "engine" TEXT,
    "fuelType" TEXT,
    "transmission" TEXT,
    "drivetrain" TEXT,
    "axleConfig" TEXT,
    "gvwr" INTEGER,
    "gvwrClass" INTEGER,
    "cdlRequired" BOOLEAN NOT NULL DEFAULT false,
    "payloadCapacity" INTEGER,
    "towingCapacity" INTEGER,
    "bodyLength" DOUBLE PRECISION,
    "pto" BOOLEAN NOT NULL DEFAULT false,
    "hydraulics" BOOLEAN NOT NULL DEFAULT false,
    "exteriorColor" TEXT,
    "interiorColor" TEXT,
    "doors" INTEGER,
    "seats" INTEGER,
    "description" TEXT,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "location" TEXT,
    "status" "VehicleStatus" NOT NULL DEFAULT 'PUBLISHED',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_images" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "vehicle_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "type" "LeadType" NOT NULL DEFAULT 'AVAILABILITY',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_slug_key" ON "vehicles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_stockNumber_key" ON "vehicles"("stockNumber");

-- CreateIndex
CREATE INDEX "vehicles_status_createdAt_idx" ON "vehicles"("status", "createdAt");

-- CreateIndex
CREATE INDEX "vehicles_bodyType_idx" ON "vehicles"("bodyType");

-- CreateIndex
CREATE INDEX "vehicles_make_idx" ON "vehicles"("make");

-- CreateIndex
CREATE INDEX "vehicles_price_idx" ON "vehicles"("price");

-- CreateIndex
CREATE INDEX "vehicle_images_vehicleId_position_idx" ON "vehicle_images"("vehicleId", "position");

-- CreateIndex
CREATE INDEX "leads_status_createdAt_idx" ON "leads"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "vehicle_images" ADD CONSTRAINT "vehicle_images_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
