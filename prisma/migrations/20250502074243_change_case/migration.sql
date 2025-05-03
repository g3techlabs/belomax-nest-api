/*
  Warnings:

  - You are about to drop the column `cpf_cnpj` on the `customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpfCnpj]` on the table `customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpfCnpj` to the `customer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "customer_cpf_cnpj_key";

-- AlterTable
ALTER TABLE "customer" DROP COLUMN "cpf_cnpj",
ADD COLUMN     "cpfCnpj" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "document" ALTER COLUMN "urlExpiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- AlterTable
ALTER TABLE "reset_token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- CreateIndex
CREATE UNIQUE INDEX "customer_cpfCnpj_key" ON "customer"("cpfCnpj");
