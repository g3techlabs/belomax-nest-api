/*
  Warnings:

  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "customer" DROP CONSTRAINT "customer_addressId_fkey";

-- AlterTable
ALTER TABLE "document" ALTER COLUMN "urlExpiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- AlterTable
ALTER TABLE "reset_token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- DropTable
DROP TABLE "Address";

-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "additional" TEXT,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
