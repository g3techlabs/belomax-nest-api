/*
  Warnings:

  - A unique constraint covering the columns `[description,bank]` on the table `statement_terms` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "reset_token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- CreateIndex
CREATE UNIQUE INDEX "statement_terms_description_bank_key" ON "statement_terms"("description", "bank");
