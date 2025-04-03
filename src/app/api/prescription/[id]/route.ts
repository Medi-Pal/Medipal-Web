import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma'; // Adjust path based on your structure

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prescriptionId = parseInt(params.id);

    if (isNaN(prescriptionId)) {
      return NextResponse.json({ error: 'Invalid prescription ID' }, { status: 400 });
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        medicine_list: {
          include: { medicine: true }, // Fetch medicine details
        },
      },
    });

    if (!prescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
    }

    // Convert BigInt fields to strings
    const serializedPrescription = JSON.parse(
      JSON.stringify(prescription, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return NextResponse.json({ prescription: serializedPrescription }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
