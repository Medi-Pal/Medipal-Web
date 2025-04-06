/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- Update existing records (placeholder email for now, should be updated later)
UPDATE "Admin" SET "email" = CONCAT(username, '@medipal.com') WHERE "email" IS NULL;

-- Make the field required after updating existing records
ALTER TABLE "Admin" ALTER COLUMN "email" SET NOT NULL;
