/*
  Warnings:

  - You are about to drop the `contracheque_pensionista` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "contracheque_pensionista" DROP CONSTRAINT "contracheque_pensionista_processId_fkey";

-- DropTable
DROP TABLE "contracheque_pensionista";

-- CreateTable
CREATE TABLE "reset_token" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" VARCHAR(6) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '15 minutes',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reset_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pensioner_paycheck" (
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

    CONSTRAINT "pensioner_paycheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reset_token_userId_key" ON "reset_token"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "pensioner_paycheck_processId_key" ON "pensioner_paycheck"("processId");

-- AddForeignKey
ALTER TABLE "reset_token" ADD CONSTRAINT "reset_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pensioner_paycheck" ADD CONSTRAINT "pensioner_paycheck_processId_fkey" FOREIGN KEY ("processId") REFERENCES "process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
