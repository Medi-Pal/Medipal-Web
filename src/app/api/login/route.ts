import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { Registration_No, password } = body;

        console.log("🔍 Received login request for:", Registration_No);

        if (!Registration_No || !password) {
            console.log("❌ Missing Registration_No or password in request body");
            return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

        const doctor = await prisma.doctor.findUnique({
            where: { Registration_No },
        });

        if (!doctor) {
            console.log("❌ Doctor not found");
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        console.log("✅ Doctor found:", doctor);

        if (!doctor.password) {
            console.log("❌ Doctor password is missing");
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        const isPasswordValid = await bcrypt.compare(password, doctor.password);
        console.log("🔐 Password match:", isPasswordValid);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (!SECRET_KEY) {
            console.log("❌ JWT_SECRET is missing in environment variables!");
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        const token = jwt.sign({ regNo: doctor.Registration_No, role: "doctor" }, SECRET_KEY, { expiresIn: "1h" });

        console.log("🔑 Token generated:", token);

        return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
        console.error("🚨 Server error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
