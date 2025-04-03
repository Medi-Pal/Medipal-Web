import { NextRequest, NextResponse } from "next/server";

interface Doctor {
  name: string;
  specialisation: string;
  phoneNumber: string;
  email: string;
  password: string;
  medicalLicenseNumber: string;
}

const doctors: Doctor[] = []; // Temporary in-memory storage for demonstration

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, specialisation, phoneNumber, email, password, confirmPassword, medicalLicenseNumber } = body;

    if (!name || !specialisation || !phoneNumber || !email || !password || !confirmPassword || !medicalLicenseNumber) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Password and confirm password do not match." }, { status: 400 });
    }

    // Check if the doctor already exists
    const existingDoctor = doctors.find((doc) => doc.email === email);
    if (existingDoctor) {
      return NextResponse.json({ error: "Doctor with this email already exists." }, { status: 409 });
    }

    // Register the doctor
    const newDoctor: Doctor = { name, specialisation, phoneNumber, email, password, medicalLicenseNumber };
    doctors.push(newDoctor);

    return NextResponse.json({ message: "Doctor registered successfully.", doctor: newDoctor }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while registering the doctor." }, { status: 500 });
  }
}
