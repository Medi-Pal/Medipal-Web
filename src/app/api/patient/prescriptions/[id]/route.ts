import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET endpoint to fetch a single prescription by ID for patient app access
 * 
 * Route parameters:
 * - id: The prescription ID (required)
 * 
 * Returns:
 * - 200: Prescription details
 * - 404: Not found if prescription doesn't exist
 * - 500: Server error
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prescriptionId = params.id;

    if (!prescriptionId) {
      return NextResponse.json(
        { error: "Prescription ID is required" },
        { status: 400 }
      );
    }

    const prescription = await prisma.prescription.findUnique({
      where: {
        id: prescriptionId,
      },
      include: {
        doctor_regNo: {
          select: {
            Name: true,
            Registration_No: true,
            Specialisation: true,
            ContactNumber: true,
          },
        },
        patient_contact: {
          select: {
            Name: true,
            PhoneNumber: true,
            Age: true,
            Gender: true,
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

/**
 * PUT endpoint to update the isUsedBy field when a prescription is viewed
 * 
 * Route parameters:
 * - id: The prescription ID (required)
 * 
 * Body:
 * - phoneNumber: The user's phone number
 * 
 * Returns:
 * - 200: Updated prescription details
 * - 400: Bad request if phone number is missing
 * - 404: Not found if prescription doesn't exist
 * - 500: Server error
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prescriptionId = params.id;
    const data = await req.json();
    const { phoneNumber } = data;

    if (!prescriptionId) {
      return NextResponse.json(
        { error: "Prescription ID is required" },
        { status: 400 }
      );
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Check if prescription exists
    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    // Update isUsedBy field only if it's empty or starts with 'temp_'
    // This ensures we don't overwrite a legitimate user's details
    if (!prescription.isUsedBy || prescription.isUsedBy.startsWith('temp_')) {
      const updatedPrescription = await prisma.prescription.update({
        where: { id: prescriptionId },
        data: { isUsedBy: phoneNumber },
        include: {
          doctor_regNo: {
            select: {
              Name: true,
              Registration_No: true,
              Specialisation: true,
              ContactNumber: true,
            },
          },
          patient_contact: {
            select: {
              Name: true,
              PhoneNumber: true,
              Age: true,
              Gender: true,
              City: true,
              State: true,
              Country: true,
            },
          },
        },
      });

      return NextResponse.json(updatedPrescription);
    }

    // If isUsedBy already has a value, just return the prescription
    return NextResponse.json(prescription);
  } catch (error) {
    console.error("Failed to update prescription usage:", error);
    return NextResponse.json(
      { error: "Failed to update prescription usage" },
      { status: 500 }
    );
  }
} 