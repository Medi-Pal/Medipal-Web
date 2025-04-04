import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { serialize } from "v8";

export async function GET(req: Request) {
  const prescriptions = await prisma.prescription.findMany();
  return NextResponse.json(prescriptions, { status: 200 });
}
export async function POST(req: Request) {
  try {
    const { doctor_regNo, medicine_list, patient_contact } = await req.json();
    if (!doctor_regNo || !medicine_list || !patient_contact) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    
    const prescription = await prisma.prescription.create({
      data: { doctor_regNo, medicine_list, patient_contact, createdOn: new Date() },
    });
    
    return NextResponse.json(serialize(prescription), { status: 201 });
  } catch (error) {
    console.error("Prescription creation error:", error);
    return NextResponse.json({ error: 'An error occurred while creating the prescription.' }, { status: 500 });
  }
}
