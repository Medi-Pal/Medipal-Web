import { patientData } from "./patientData";
import { doctorData } from "./doctorData";
import { familyContactData } from "./familyContactData";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // seeding the patient model
  await prisma.patient.createMany({
    data: patientData,
  });

  // seeding the doctor model
  await prisma.doctor.createMany({
    data: doctorData,
  });

  // seeding the emergency_contacts model
  await prisma.emergency_Contacts.createMany({
    data: familyContactData,
  });

  // seeding the medicines model
  // await prisma.medicines.createMany({
  //   data: medicineData,
  // });

  // fetching the all the medicine objects inorder to get their id's
  // const medicines = await prisma.medicines.findMany();
  const doctors = await prisma.doctor.findMany();
  const patients = await prisma.patient.findMany();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // here we do a nested query in this order prescription -> MedicinesOnPrescription -> Medicines
  await prisma.prescription.create({
    data: {
      Doctor: doctors.find(
        (doctor) =>
          doctor.FirstName === "Ravish" && doctor.LastName === "Kolvakar"
      )?.Registration_No!,
      isUsedBy: patients.find(
        (patient) =>
          patient.FirstName === "Brandon" && patient.LastName === "Noronha"
      )?.PhoneNumber!,
      createdOn: today,
      medicine_list: {
        create: [
          {
            medicine: {
              create: {
                brandName: "Crocin",
                type: "tablet",
                drugName: "Paracetamol + Caffein",
                description: "It is used for the relief of headache",
              },
            },
            dosageType: "tablet",
            timeOfDay: "morning",
            dosage: 1,
            duration: 5,
            instruction: "after breakfast",
          },
          {
            medicine: {
              create: {
                brandName: "Cherrycough",
                type: "syrup",
                drugName: "hydrochloride",
                description: "used for cough and respiratory congestion relief",
              },
            },
            dosageType: "ml",
            timeOfDay: "afternoon",
            dosage: 10,
            duration: 10,
            instruction: "after launch",
          },
        ],
      },
    },
  });

  // seeding the prescription model
  // await prisma.prescription.createMany({
  //   data: prescriptions,
  // });

  // for (const prescriptionData of prescriptions) {
  //   const prescription = await prisma.prescription.create({
  //     data:{
  //       createdOn:
  //     }
  //   });
  // }
}

main();
