-- AlterTable
ALTER TABLE "reset_token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL;
