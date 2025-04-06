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

  // Create medicines first
  const crocin = await prisma.medicines.create({
    data: {
      brandName: "Crocin",
      type: "tablet",
      drugName: "Paracetamol + Caffein",
      description: "It is used for the relief of headache",
    }
  });

  const cherrycough = await prisma.medicines.create({
    data: {
      brandName: "Cherrycough",
      type: "syrup",
      drugName: "hydrochloride",
      description: "used for cough and respiratory congestion relief",
    }
  });

  const doctors = await prisma.doctor.findMany();
  const patients = await prisma.patient.findMany();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Create prescription with medicine references
  await prisma.prescription.create({
    data: {
      Doctor: doctors.find((doctor) => doctor.Name === "Ravish Kolvakar")
        ?.Registration_No!,
      isUsedBy: patients.find((patient) => patient.Name === "Brandon Noronha")
        ?.PhoneNumber!,
      createdOn: today,
      medicine_list: {
        create: [
          {
            medicineID: crocin.Serial_No,
            dosageType: "tablet",
            dosage: 1,
            duration: 5,
            instruction: "after breakfast",
            times: {
              create: {
                timeOfDay: "morning",
                dosage: 1
              }
            }
          },
          {
            medicineID: cherrycough.Serial_No,
            dosageType: "ml",
            dosage: 10,
            duration: 10,
            instruction: "after launch",
            times: {
              create: {
                timeOfDay: "afternoon",
                dosage: 10
              }
            }
          },
        ],
      },
    },
  });

  // Create admin with required email field
  await prisma.admin.create({
    data: {
      username: "brandon07",
      password: "medipal123",
      email: "admin@medipal.com",
    },
  });
}

main();
