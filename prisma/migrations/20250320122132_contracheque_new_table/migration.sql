/*
  Warnings:

  - Added the required column `status` to the `process` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "process" ADD COLUMN     "status" "ProcessStatus" NOT NULL;

-- CreateTable
CREATE TABLE "contracheque_pensionista" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "registration" TEXT NOT NULL,
    "bond" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "startMonth" TEXT NOT NULL,
    "startYear" TEXT NOT NULL,
    "endMonth" TEXT NOT NULL,
    "endYear" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracheque_pensionista_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contracheque_pensionista_processId_key" ON "contracheque_pensionista"("processId");

-- AddForeignKey
ALTER TABLE "contracheque_pensionista" ADD CONSTRAINT "contracheque_pensionista_processId_fkey" FOREIGN KEY ("processId") REFERENCES "process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
