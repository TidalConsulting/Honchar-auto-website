-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "listedAt" TIMESTAMP(3),
ADD COLUMN     "originalPrice" INTEGER,
ADD COLUMN     "soldAt" TIMESTAMP(3),
ADD COLUMN     "soldPrice" INTEGER;

-- CreateTable
CREATE TABLE "page_views" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "dwellMs" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_views_createdAt_idx" ON "page_views"("createdAt");

-- CreateIndex
CREATE INDEX "page_views_sessionId_idx" ON "page_views"("sessionId");

-- CreateIndex
CREATE INDEX "vehicles_soldAt_idx" ON "vehicles"("soldAt");

-- CreateIndex
CREATE INDEX "vehicles_listedAt_idx" ON "vehicles"("listedAt");
