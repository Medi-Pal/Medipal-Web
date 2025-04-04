import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "../../../../../../lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.licenseNumber) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { signature } = await request.json();
    if (!signature) {
      return NextResponse.json(
        { error: "Signature is required" },
        { status: 400 }
      );
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id: params.id },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    if (prescription.Doctor !== session.user.licenseNumber) {
      return NextResponse.json(
        { error: "Unauthorized to sign this prescription" },
        { status: 403 }
      );
    }

    const updatedPrescription = await prisma.prescription.update({
      where: { id: params.id },
      data: { signature },
    });

    return NextResponse.json(updatedPrescription);
  } catch (error) {
    console.error("Failed to update signature:", error);
    return NextResponse.json(
      { error: "Failed to update signature" },
      { status: 500 }
    );
  }
}
