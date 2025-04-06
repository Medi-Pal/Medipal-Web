import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Toggle the isVerified status of a doctor
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    console.log(`Attempting to toggle verification status for doctor ${id}`);

    // Find the doctor first to get their current verification status
    const doctor = await prisma.doctor.findUnique({
      where: { Registration_No: id },
      select: { isVerified: true, Name: true },
    });

    if (!doctor) {
      console.log(`Doctor ${id} not found`);
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    console.log(
      `Found doctor with current verification status: ${doctor.isVerified}`
    );
    const newStatus = !doctor.isVerified;

    // Update the doctor's verification status
    const updatedDoctor = await prisma.doctor.update({
      where: { Registration_No: id },
      data: { isVerified: newStatus },
    });

    console.log(
      `Doctor ${id} (${doctor.Name}) verification status updated to: ${updatedDoctor.isVerified}`
    );

    return NextResponse.json(
      {
        message: `Doctor verification status updated to ${
          updatedDoctor.isVerified ? "verified" : "unverified"
        }`,
        isVerified: updatedDoctor.isVerified,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error(`Error updating doctor ${id} verification status:`, error);
    return NextResponse.json(
      {
        error:
          "An error occurred while updating the doctor verification status",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
