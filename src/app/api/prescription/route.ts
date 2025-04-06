import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma"; // Adjust the import path based on your project structure
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Get specific prescription
      const prescription = await prisma.prescription.findUnique({
        where: { id: parseInt(id) },
        include: {
          medicine_list: {
            include: {
              medicine: true,
            },
          },
          doctor_regNo: true,
          patient_contact: true,
        },
      });

      if (!prescription) {
        return NextResponse.json(
          { error: "Prescription not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(prescription);
    }

    // Get all prescriptions for the doctor
    const prescriptions = await prisma.prescription.findMany({
      where: {
        Doctor: session.user.licenseNumber,
      },
      include: {
        medicine_list: {
          include: {
            medicine: true,
          },
        },
        doctor_regNo: true,
        patient_contact: true,
      },
      orderBy: {
        createdOn: "desc",
      },
    });

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error("Prescription fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { patientContact, patientDetails, medicines } = data;

    // Create or update patient
    const patient = await prisma.patient.upsert({
      where: { PhoneNumber: patientContact },
      update: {
        Name: patientDetails.name,
        Age: patientDetails.age ? parseInt(patientDetails.age) : null,
        City: patientDetails.city || null,
        State: patientDetails.state || "Unknown",
        Country: patientDetails.country || "Unknown",
      },
      create: {
        PhoneNumber: patientContact,
        Name: patientDetails.name,
        Age: patientDetails.age ? parseInt(patientDetails.age) : null,
        City: patientDetails.city || null,
        State: patientDetails.state || "Unknown",
        Country: patientDetails.country || "Unknown",
      },
    });

    // Create prescription
    const prescription = await prisma.prescription.create({
      data: {
        Doctor: session.user.licenseNumber,
        isUsedBy: patient.PhoneNumber,
        diagnosis: patientDetails.diagnosis || null,
        medicine_list: {
          create: medicines.map((med: any) => ({
            medicine: {
              connect: {
                Serial_No: med.medicineId,
              },
            },
            dosageType: med.dosageType,
            dosage: med.times[0].dosage,
            duration: med.duration,
            instruction: med.instruction,
            times: {
              create: med.times.map((time: any) => ({
                timeOfDay: time.timeOfDay,
                dosage: time.dosage,
              })),
            },
          })),
        },
      },
      include: {
        medicine_list: {
          include: {
            medicine: true,
            times: true,
          },
        },
      },
    });

    return NextResponse.json({ id: prescription.id });
  } catch (error) {
    console.error("Failed to create prescription:", error);
    return NextResponse.json(
      {
        error: "Failed to create prescription",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
