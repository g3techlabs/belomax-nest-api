-- AlterTable
ALTER TABLE "document" ALTER COLUMN "urlExpiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- CONVERSÃO MANUAL: pensioner_paycheck
-- Transforma texto em inteiro sem apagar os dados
ALTER TABLE "pensioner_paycheck"
    ALTER COLUMN "month" TYPE INTEGER USING "month"::integer,
    ALTER COLUMN "year" TYPE INTEGER USING "year"::integer;

-- CONVERSÃO MANUAL: pensioner_paycheck_term
ALTER TABLE "pensioner_paycheck_term"
    ALTER COLUMN "month" TYPE INTEGER USING "month"::integer,
    ALTER COLUMN "year" TYPE INTEGER USING "year"::integer;

-- AlterTable
ALTER TABLE "reset_token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';