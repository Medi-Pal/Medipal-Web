import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // First delete related emergency contacts
    await prisma.emergency_Contacts.deleteMany({
      where: {
        relatedBy: id,
      },
    });

    // Then delete related prescriptions
    await prisma.prescription.deleteMany({
      where: {
        isUsedBy: id,
      },
    });

    // Finally delete the patient
    await prisma.patient.delete({
      where: {
        PhoneNumber: id,
      },
    });

    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return NextResponse.json(
      { error: "Failed to delete patient" },
      { status: 500 }
    );
  }
}
