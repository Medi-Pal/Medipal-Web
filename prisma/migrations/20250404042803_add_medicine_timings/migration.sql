/*
  Warnings:

  - You are about to drop the column `timeOfDay` on the `MedicinesOnPrescription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MedicinesOnPrescription" DROP COLUMN "timeOfDay";

-- CreateTable
CREATE TABLE "MedicineTiming" (
    "id" SERIAL NOT NULL,
    "timeOfDay" TEXT NOT NULL,
    "dosage" INTEGER NOT NULL,
    "prescriptionID" INTEGER NOT NULL,
    "medicineID" INTEGER NOT NULL,

    CONSTRAINT "MedicineTiming_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MedicineTiming_prescriptionID_medicineID_timeOfDay_key" ON "MedicineTiming"("prescriptionID", "medicineID", "timeOfDay");

-- AddForeignKey
ALTER TABLE "MedicineTiming" ADD CONSTRAINT "MedicineTiming_prescriptionID_medicineID_fkey" FOREIGN KEY ("prescriptionID", "medicineID") REFERENCES "MedicinesOnPrescription"("prescriptionID", "medicineID") ON DELETE RESTRICT ON UPDATE CASCADE;
