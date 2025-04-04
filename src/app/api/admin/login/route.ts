import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client/edge';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(req: Request) {
    const { username, password } = await req.json();
    
    console.log("🔍 Received login request for:", username);

    const admin = await prisma.admin.findUnique({ where: { username } });

    if (!admin) {
        console.log("❌ Admin not found");
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log("✅ Admin found:", admin);

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log("🔐 Password match:", isPasswordValid);

    if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!SECRET_KEY) {
        console.log("❌ JWT_SECRET is missing in environment variables!");
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    const token = jwt.sign({ id: admin.id, role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });

    console.log("🔑 Token generated:", token);

    return NextResponse.json({ token }, { status: 200 });
}

