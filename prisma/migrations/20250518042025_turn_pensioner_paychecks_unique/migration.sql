/*
  Warnings:

  - A unique constraint covering the columns `[month,year,cpf]` on the table `pensioner_paycheck` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "document" ALTER COLUMN "urlExpiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- AlterTable
ALTER TABLE "reset_token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- CreateIndex
CREATE UNIQUE INDEX "pensioner_paycheck_month_year_cpf_key" ON "pensioner_paycheck"("month", "year", "cpf");