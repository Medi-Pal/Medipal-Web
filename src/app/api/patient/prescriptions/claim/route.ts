import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST endpoint to claim a prescription when a patient scans a QR code
 * 
 * Request body:
 * - prescriptionId: The ID of the prescription (from QR code)
 * - phoneNumber: The patient's phone number
 * 
 * Returns:
 * - 200: Updated prescription details
 * - 400: Bad request if required parameters are missing
 * - 404: Not found if prescription doesn't exist
 * - 500: Server error
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prescriptionId, phoneNumber } = body;

    if (!prescriptionId || !phoneNumber) {
      return NextResponse.json(
        { error: "Prescription ID and phone number are required" },
        { status: 400 }
      );
    }

    // Find the prescription first
    const existingPrescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
    });

    if (!existingPrescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    // Create or update patient if needed
    const patient = await prisma.patient.upsert({
      where: { PhoneNumber: phoneNumber },
      update: {},  // No updates needed if exists
      create: {
        PhoneNumber: phoneNumber,
        Name: "Patient",  // Default name
        State: "Unknown", // Required field
        Country: "Unknown", // Required field
      },
    });

    // Update the prescription with the patient's phone number
    const updatedPrescription = await prisma.prescription.update({
      where: { id: prescriptionId },
      data: {
        isUsedBy: phoneNumber,
      },
      include: {
        doctor_regNo: {
          select: {
            Name: true,
            Registration_No: true,
            Specialisation: true,
          },
        },
        patient_contact: {
          select: {
            Name: true,
            PhoneNumber: true,
            Age: true,
            City: true,
            State: true,
            Country: true,
          },
        },
        medicine_list: {
          include: {
            medicine: true,
            times: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPrescription);
  } catch (error) {
    console.error("Failed to claim prescription:", error);
    return NextResponse.json(
      { error: "Failed to claim prescription" },
      { status: 500 }
    );
  }
} 