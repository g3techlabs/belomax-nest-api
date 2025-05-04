/*
  Warnings:

  - You are about to drop the column `address` on the `customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customer" DROP COLUMN "address",
ADD COLUMN     "addressId" TEXT;

-- AlterTable
ALTER TABLE "document" ALTER COLUMN "urlExpiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- AlterTable
ALTER TABLE "reset_token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "additional" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
