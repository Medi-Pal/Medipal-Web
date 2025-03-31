-- CreateEnum
CREATE TYPE "DosageType" AS ENUM ('ml', 'drop', 'tablet');

-- CreateTable
CREATE TABLE "Doctor" (
    "Registration_No" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT,
    "Age" INTEGER NOT NULL,
    "ContactNumber" BIGINT NOT NULL,
    "Email" TEXT NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("Registration_No")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" SERIAL NOT NULL,
    "Doctor" TEXT NOT NULL,
    "isUsedBy" BIGINT NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicines" (
    "Serial_No" SERIAL NOT NULL,
    "brandName" TEXT NOT NULL,
    "type" TEXT,
    "drugName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Medicines_pkey" PRIMARY KEY ("Serial_No")
);

-- CreateTable
CREATE TABLE "MedicinesOnPrescription" (
    "prescriptionID" INTEGER NOT NULL,
    "medicineID" INTEGER NOT NULL,
    "dosageType" "DosageType" NOT NULL,
    "timeOfDay" TEXT NOT NULL,
    "dosage" INTEGER NOT NULL,
    "duration" INTEGER,
    "instruction" TEXT,

    CONSTRAINT "MedicinesOnPrescription_pkey" PRIMARY KEY ("prescriptionID","medicineID")
);

-- CreateTable
CREATE TABLE "Patient" (
    "PhoneNumber" BIGINT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT,
    "Age" INTEGER NOT NULL,
    "City" TEXT,
    "State" TEXT NOT NULL,
    "Country" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("PhoneNumber")
);

-- CreateTable
CREATE TABLE "Emergency_Contacts" (
    "PhoneNumber" BIGINT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT,
    "relation" TEXT,
    "relatedBy" BIGINT NOT NULL,

    CONSTRAINT "Emergency_Contacts_pkey" PRIMARY KEY ("PhoneNumber")
);

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_Doctor_fkey" FOREIGN KEY ("Doctor") REFERENCES "Doctor"("Registration_No") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_isUsedBy_fkey" FOREIGN KEY ("isUsedBy") REFERENCES "Patient"("PhoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicinesOnPrescription" ADD CONSTRAINT "MedicinesOnPrescription_prescriptionID_fkey" FOREIGN KEY ("prescriptionID") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicinesOnPrescription" ADD CONSTRAINT "MedicinesOnPrescription_medicineID_fkey" FOREIGN KEY ("medicineID") REFERENCES "Medicines"("Serial_No") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emergency_Contacts" ADD CONSTRAINT "Emergency_Contacts_relatedBy_fkey" FOREIGN KEY ("relatedBy") REFERENCES "Patient"("PhoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
