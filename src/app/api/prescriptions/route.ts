import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prescriptions = await prisma.prescription.findMany({
      where: {
        Doctor: session.user.licenseNumber,
      },
      include: {
        doctor_regNo: {
          select: {
            Name: true,
            Specialisation: true,
            ContactNumber: true,
          },
        },
        patient_contact: {
          select: {
            Name: true,
            Age: true,
            PhoneNumber: true,
            City: true,
            State: true,
            Country: true,
          },
        },
        medicine_list: {
          include: {
            medicine: {
              select: {
                brandName: true,
                drugName: true,
                type: true,
              },
            },
            times: {
              select: {
                timeOfDay: true,
                dosage: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdOn: "desc",
      },
    });

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error("Failed to fetch prescriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescriptions" },
      { status: 500 }
    );
  }
}
