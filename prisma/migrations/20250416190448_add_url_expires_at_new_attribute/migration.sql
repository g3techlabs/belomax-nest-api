-- AlterTable
ALTER TABLE "document" ADD COLUMN     "urlExpiresAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '15 minutes';

-- AlterTable
ALTER TABLE "reset_token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';
