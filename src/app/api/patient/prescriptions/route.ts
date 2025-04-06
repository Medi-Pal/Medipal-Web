import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET endpoint to fetch prescriptions for a patient by phone number
 * 
 * Query parameters:
 * - phone: The patient's phone number (required)
 * 
 * Returns:
 * - 200: List of prescriptions for the patient
 * - 400: Bad request if phone number is missing
 * - 404: Not found if no prescriptions found
 * - 500: Server error
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phoneNumber = searchParams.get("phone");

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const prescriptions = await prisma.prescription.findMany({
      where: {
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
      orderBy: {
        createdOn: "desc",
      },
    });

    if (!prescriptions || prescriptions.length === 0) {
      return NextResponse.json(
        { error: "No prescriptions found for this phone number" },
        { status: 404 }
      );
    }

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error("Failed to fetch patient prescriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescriptions" },
      { status: 500 }
    );
  }
} 