/*
  Warnings:

  - You are about to drop the column `endMonth` on the `pensioner_paycheck` table. All the data in the column will be lost.
  - You are about to drop the column `endYear` on the `pensioner_paycheck` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `pensioner_paycheck` table. All the data in the column will be lost.
  - You are about to drop the column `startMonth` on the `pensioner_paycheck` table. All the data in the column will be lost.
  - You are about to drop the column `startYear` on the `pensioner_paycheck` table. All the data in the column will be lost.
  - You are about to drop the column `statementTermsId` on the `statement_terms_to_extract` table. All the data in the column will be lost.
  - Added the required column `month` to the `pensioner_paycheck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pensionerNumber` to the `pensioner_paycheck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `pensioner_paycheck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statementTermId` to the `statement_terms_to_extract` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "automation" DROP CONSTRAINT "automation_customerId_fkey";

-- DropForeignKey
ALTER TABLE "automation" DROP CONSTRAINT "automation_userId_fkey";

-- DropForeignKey
ALTER TABLE "statement_terms_to_extract" DROP CONSTRAINT "statement_terms_to_extract_statementTermsId_fkey";

-- DropIndex
DROP INDEX "pensioner_paycheck_automationId_key";

-- AlterTable
ALTER TABLE "automation" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "customerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pensioner_paycheck" DROP COLUMN "endMonth",
DROP COLUMN "endYear",
DROP COLUMN "number",
DROP COLUMN "startMonth",
DROP COLUMN "startYear",
ADD COLUMN     "month" TEXT NOT NULL,
ADD COLUMN     "pensionerNumber" TEXT NOT NULL,
ADD COLUMN     "year" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reset_token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- AlterTable
ALTER TABLE "statement_terms_to_extract" DROP COLUMN "statementTermsId",
ADD COLUMN     "statementTermId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "automation" ADD CONSTRAINT "automation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation" ADD CONSTRAINT "automation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statement_terms_to_extract" ADD CONSTRAINT "statement_terms_to_extract_statementTermId_fkey" FOREIGN KEY ("statementTermId") REFERENCES "statement_terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
