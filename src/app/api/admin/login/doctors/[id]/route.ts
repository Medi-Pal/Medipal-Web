import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client/edge';
import { serialize } from 'v8';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const doctor = await prisma.doctor.findUnique({ where: { Registration_No: id }, include: { Prescription: true } });
    return doctor ? NextResponse.json(serialize(doctor), { status: 200 }) : NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
  }
  