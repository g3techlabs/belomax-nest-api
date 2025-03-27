-- AlterTable
ALTER TABLE "reset_token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';
