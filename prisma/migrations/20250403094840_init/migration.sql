-- CreateEnum
CREATE TYPE "DosageType" AS ENUM ('ml', 'drop', 'tablet');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "doctorID" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "Registration_No" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Specialisation" TEXT NOT NULL,
    "ContactNumber" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("Registration_No")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" SERIAL NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Doctor" TEXT NOT NULL,
    "isUsedBy" TEXT NOT NULL,

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
    "dosageType" "DosageType" NOT NULL,
    "timeOfDay" TEXT NOT NULL,
    "dosage" INTEGER NOT NULL,
    "duration" INTEGER,
    "instruction" TEXT,
    "prescriptionID" INTEGER NOT NULL,
    "medicineID" INTEGER NOT NULL,

    CONSTRAINT "MedicinesOnPrescription_pkey" PRIMARY KEY ("prescriptionID","medicineID")
);

-- CreateTable
CREATE TABLE "Patient" (
    "PhoneNumber" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Age" INTEGER,
    "City" TEXT,
    "State" TEXT NOT NULL,
    "Country" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("PhoneNumber")
);

-- CreateTable
CREATE TABLE "Emergency_Contacts" (
    "PhoneNumber" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "relation" TEXT,
    "relatedBy" TEXT NOT NULL,

    CONSTRAINT "Emergency_Contacts_pkey" PRIMARY KEY ("PhoneNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_Email_key" ON "Doctor"("Email");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_doctorID_fkey" FOREIGN KEY ("doctorID") REFERENCES "Doctor"("Registration_No") ON DELETE RESTRICT ON UPDATE CASCADE;

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
