import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Adjust the import path based on your project structure

export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const doctorRegNo = searchParams.get('doctorRegNo'); // Doctor's Registration Number
  
      if (!doctorRegNo) {
        return NextResponse.json({ error: 'Doctor Registration Number is required' }, { status: 400 });
      }
  
      const prescriptions = await prisma.prescription.findMany({
        where: { Doctor: doctorRegNo },
        include: {
          medicine_list: {
            include: { medicine: true },
          },
          patient_contact: true,
        },
        orderBy: { createdOn: 'desc' }, // Latest first
      });
  
      if (!prescriptions.length) {
        return NextResponse.json({ message: 'No prescriptions found for this doctor' }, { status: 404 });
      }
  
      return NextResponse.json({ prescriptions }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }