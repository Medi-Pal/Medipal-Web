import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma"; // Adjust path based on your structure

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prescription = await prisma.prescription.findUnique({
      where: {
        id: params.id,
      },
      include: {
        doctor_regNo: true,
        patient_contact: true,
        medicine_list: {
          include: {
            medicine: true,
            times: true,
          },
        },
      },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(prescription);
  } catch (error) {
    console.error("Failed to fetch prescription:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescription" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.licenseNumber) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { patientContact, patientDetails, medicines } = data;

    // Verify prescription exists and belongs to the doctor
    const existingPrescription = await prisma.prescription.findUnique({
      where: { id: params.id },
      include: { doctor: true },
    });

    if (!existingPrescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    if (
      existingPrescription.doctor.licenseNumber !== session.user.licenseNumber
    ) {
      return NextResponse.json(
        { error: "Unauthorized to modify this prescription" },
        { status: 403 }
      );
    }

    // Update patient contact if it exists, create if it doesn't
    const patient = await prisma.patientContact.upsert({
      where: { PhoneNumber: patientContact },
      update: {
        Name: patientDetails.name,
        Age: patientDetails.age ? parseInt(patientDetails.age) : null,
        City: patientDetails.city,
        State: patientDetails.state,
        Country: patientDetails.country,
      },
      create: {
        PhoneNumber: patientContact,
        Name: patientDetails.name,
        Age: patientDetails.age ? parseInt(patientDetails.age) : null,
        City: patientDetails.city,
        State: patientDetails.state,
        Country: patientDetails.country,
      },
    });

    // Update prescription
    const updatedPrescription = await prisma.prescription.update({
      where: { id: params.id },
      data: {
        diagnosis: patientDetails.diagnosis,
        patient_contact: {
          connect: { PhoneNumber: patient.PhoneNumber },
        },
        medicine_list: {
          deleteMany: {},
          create: medicines.map((med: any) => ({
            medicine: {
              connect: { Serial_No: med.medicineId },
            },
            dosageType: med.dosageType,
            times: med.times,
            duration: med.duration,
            instruction: med.instruction,
          })),
        },
      },
      include: {
        doctor: true,
        patient_contact: true,
        medicine_list: {
          include: {
            medicine: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPrescription);
  } catch (error) {
    console.error("Error updating prescription:", error);
    return NextResponse.json(
      { error: "Failed to update prescription" },
      { status: 500 }
    );
  }
}
