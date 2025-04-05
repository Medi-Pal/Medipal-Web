import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const Name = formData.get('Name')?.toString();
    const Specialisation = formData.get('Specialisation')?.toString();
    const ContactNumber = formData.get('ContactNumber')?.toString();
    const Email = formData.get('Email')?.toString();
    const password = formData.get('password')?.toString();
    const ConfirmPassword = formData.get('ConfirmPassword')?.toString();
    const Registration_No = formData.get('Registration_No')?.toString();
    const medicalLicenseFile = formData.get('medicalLicenseFile'); // File object
    
    if (!Name || !Specialisation || !ContactNumber || !Email || !password || !ConfirmPassword || !Registration_No) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (password !== ConfirmPassword) {
      return NextResponse.json({ error: 'Password and confirm password do not match.' }, { status: 400 });
    }

    const existingDoctor = await prisma.doctor.findUnique({ where: { Email } });
    if (existingDoctor) {
      return NextResponse.json({ error: 'Doctor with this email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = await prisma.doctor.create({
      data: {
        Name,                 // Ensure this matches the schema's field name
        Specialisation,       // Ensure this matches the schema's field name
        ContactNumber,        // Ensure this matches the schema's field name
        Email,                // Ensure this matches the schema's field name
        password: hashedPassword, // Ensure this matches the schema's field name
        Registration_No,      // Ensure this matches the schema's field name
      },
    });

    return NextResponse.json({ message: 'Doctor registered successfully.', doctor: newDoctor }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while registering the doctor.' }, { status: 500 });
  }
}
