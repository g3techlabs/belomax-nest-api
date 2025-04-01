/*
  Warnings:

  - You are about to drop the column `processId` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `processId` on the `pensioner_paycheck` table. All the data in the column will be lost.
  - You are about to drop the `process` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[automationId]` on the table `pensioner_paycheck` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `automationId` to the `document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `automationId` to the `pensioner_paycheck` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AutomationType" AS ENUM ('CONTRACHEQUE_PENSIONISTAS', 'TERMOS_EXTRATO');

-- CreateEnum
CREATE TYPE "AutomationStatus" AS ENUM ('PENDING', 'FINISHED', 'CANCELLED', 'FAILED');

-- DropForeignKey
ALTER TABLE "document" DROP CONSTRAINT "document_processId_fkey";

-- DropForeignKey
ALTER TABLE "pensioner_paycheck" DROP CONSTRAINT "pensioner_paycheck_processId_fkey";

-- DropForeignKey
ALTER TABLE "process" DROP CONSTRAINT "process_customerId_fkey";

-- DropForeignKey
ALTER TABLE "process" DROP CONSTRAINT "process_userId_fkey";

-- DropIndex
DROP INDEX "pensioner_paycheck_processId_key";

-- AlterTable
ALTER TABLE "document" DROP COLUMN "processId",
ADD COLUMN     "automationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pensioner_paycheck" DROP COLUMN "processId",
ADD COLUMN     "automationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reset_token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- DropTable
DROP TABLE "process";

-- DropEnum
DROP TYPE "ProcessStatus";

-- DropEnum
DROP TYPE "ProcessType";

-- CreateTable
CREATE TABLE "automation" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "AutomationStatus" NOT NULL,
    "userId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "automation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statement_terms" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bank" "StatementBank" NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statement_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statement_terms_to_extract" (
    "id" TEXT NOT NULL,
    "statementTermsId" TEXT NOT NULL,
    "statementExtractId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statement_terms_to_extract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statement_extract" (
    "id" TEXT NOT NULL,
    "automationId" TEXT NOT NULL,
    "bank" "StatementBank" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statement_extract_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "statement_extract_automationId_key" ON "statement_extract"("automationId");

-- CreateIndex
CREATE UNIQUE INDEX "pensioner_paycheck_automationId_key" ON "pensioner_paycheck"("automationId");

-- AddForeignKey
ALTER TABLE "automation" ADD CONSTRAINT "automation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation" ADD CONSTRAINT "automation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "automation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pensioner_paycheck" ADD CONSTRAINT "pensioner_paycheck_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "automation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statement_terms_to_extract" ADD CONSTRAINT "statement_terms_to_extract_statementTermsId_fkey" FOREIGN KEY ("statementTermsId") REFERENCES "statement_terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statement_terms_to_extract" ADD CONSTRAINT "statement_terms_to_extract_statementExtractId_fkey" FOREIGN KEY ("statementExtractId") REFERENCES "statement_extract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statement_extract" ADD CONSTRAINT "statement_extract_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "automation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
