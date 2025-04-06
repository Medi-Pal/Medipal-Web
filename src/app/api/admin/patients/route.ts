import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Fetching patients from database...");
    const patients = await prisma.patient.findMany({
      select: {
        PhoneNumber: true,
        Name: true,
        Age: true,
        City: true,
      },
    });
    console.log("Found patients:", patients.length);

    const formattedPatients = patients.map((patient) => ({
      id: patient.PhoneNumber,
      name: patient.Name,
      phoneNumber: patient.PhoneNumber,
      age: patient.Age,
      city: patient.City,
    }));

    return NextResponse.json(formattedPatients);
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients. Please check server logs." },
      { status: 500 }
    );
  }
}
