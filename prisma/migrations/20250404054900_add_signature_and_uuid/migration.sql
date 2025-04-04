/*
  Warnings:

  - The primary key for the `MedicinesOnPrescription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Prescription` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "MedicineTiming" DROP CONSTRAINT "MedicineTiming_prescriptionID_medicineID_fkey";

-- DropForeignKey
ALTER TABLE "MedicinesOnPrescription" DROP CONSTRAINT "MedicinesOnPrescription_prescriptionID_fkey";

-- AlterTable
ALTER TABLE "MedicineTiming" ALTER COLUMN "prescriptionID" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "MedicinesOnPrescription" DROP CONSTRAINT "MedicinesOnPrescription_pkey",
ALTER COLUMN "prescriptionID" SET DATA TYPE TEXT,
ADD CONSTRAINT "MedicinesOnPrescription_pkey" PRIMARY KEY ("prescriptionID", "medicineID");

-- AlterTable
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_pkey",
ADD COLUMN     "signature" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Prescription_id_seq";

-- AddForeignKey
ALTER TABLE "MedicinesOnPrescription" ADD CONSTRAINT "MedicinesOnPrescription_prescriptionID_fkey" FOREIGN KEY ("prescriptionID") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineTiming" ADD CONSTRAINT "MedicineTiming_prescriptionID_medicineID_fkey" FOREIGN KEY ("prescriptionID", "medicineID") REFERENCES "MedicinesOnPrescription"("prescriptionID", "medicineID") ON DELETE RESTRICT ON UPDATE CASCADE;
