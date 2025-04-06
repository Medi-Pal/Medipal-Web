import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { 
      Name, 
      Specialisation, 
      ContactNumber, 
      Email, 
      password, 
      Registration_No, 
      licenseImageUrl 
    } = data;
    
    if (!Name || !Specialisation || !ContactNumber || !Email || !password || !Registration_No || !licenseImageUrl) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const existingDoctor = await prisma.doctor.findUnique({ where: { Email } });
    if (existingDoctor) {
      return NextResponse.json({ error: 'Doctor with this email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = await prisma.doctor.create({
      data: {
        Name,
        Specialisation,
        ContactNumber,
        Email,
        password: hashedPassword,
        Registration_No,
        licenseImageUrl,
      },
    });

    return NextResponse.json({ message: 'Doctor registered successfully.', doctor: newDoctor }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: 'An error occurred while registering the doctor.' }, { status: 500 });
  }
}
