/*
  Warnings:

  - Added the required column `consignableMargin` to the `pensioner_paycheck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netToReceive` to the `pensioner_paycheck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalBenefits` to the `pensioner_paycheck` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PensionerPaycheckTermType" AS ENUM ('BENEFIT', 'DISCOUNT');

-- AlterTable
ALTER TABLE "customer" ALTER COLUMN "rg" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "citizenship" DROP NOT NULL,
ALTER COLUMN "maritalStatus" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pensioner_paycheck" ADD COLUMN     "consignableMargin" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "netToReceive" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalBenefits" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "reset_token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- CreateTable
CREATE TABLE "pensioner_paycheck_term" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "type" "PensionerPaycheckTermType" NOT NULL,
    "code" INTEGER NOT NULL,
    "discrimination" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "pensionerPaycheckId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pensioner_paycheck_term_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pensioner_paycheck_term" ADD CONSTRAINT "pensioner_paycheck_term_pensionerPaycheckId_fkey" FOREIGN KEY ("pensionerPaycheckId") REFERENCES "pensioner_paycheck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
