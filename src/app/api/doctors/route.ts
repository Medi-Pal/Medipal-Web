import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { serialize } from "v8";

const prisma = new PrismaClient();

export async function GET() {
  const doctors = await prisma.doctor.findMany();

  return NextResponse.json(doctors, { status: 200 });
}
export async function POST(req: Request) {
  try {
    // 1️⃣ Parse the incoming request data
    const { doctor_regNo, patient_contact, medicine_list } = await req.json();

    // 2️⃣ Validate required fields
    if (!doctor_regNo || !patient_contact || !medicine_list.length) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // 3️⃣ Create a new prescription in the database
    const prescription = await prisma.prescription.create({
      data: {
        doctor_regNo,
        patient_contact,
        medicine_list,
      },
    });

    // 4️⃣ Return success response
    return NextResponse.json({ message: "Prescription added successfully!", prescription }, { status: 201 });

  } catch (error) {
    console.error("❌ Error creating prescription:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}