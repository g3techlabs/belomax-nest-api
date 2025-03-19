-- CreateEnum
CREATE TYPE "ProcessType" AS ENUM ('CONTRACHEQUE_PENSIONISTAS', 'TERMOS_EXTRATO');

-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('PENDING', 'FINISHED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "StatementBank" AS ENUM ('BB', 'BRADESCO', 'CAIXA');

-- CreateTable
CREATE TABLE "customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "citizenship" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "occupation" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_cpf_key" ON "customer"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "customer_rg_key" ON "customer"("rg");

-- AddForeignKey
ALTER TABLE "process" ADD CONSTRAINT "process_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process" ADD CONSTRAINT "process_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_processId_fkey" FOREIGN KEY ("processId") REFERENCES "process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
