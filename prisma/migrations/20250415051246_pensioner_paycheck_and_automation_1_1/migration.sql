/*
  Warnings:

  - A unique constraint covering the columns `[automationId]` on the table `pensioner_paycheck` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "reset_token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- CreateIndex
CREATE UNIQUE INDEX "pensioner_paycheck_automationId_key" ON "pensioner_paycheck"("automationId");
