import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Check if we're in development mode or allow it in all environments
    // We're keeping this route available in all environments for admin password resets

    const { username, password, email } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingAdmin) {
      // Update the existing admin's password
      await prisma.admin.update({
        where: { id: existingAdmin.id },
        data: {
          password: hashedPassword,
          // Only update email if provided
          ...(email && { email }),
        },
      });

      return NextResponse.json(
        { message: "Admin password updated successfully" },
        { status: 200 }
      );
    } else {
      // Create a new admin
      await prisma.admin.create({
        data: {
          username,
          password: hashedPassword,
          email: email || `${username}@medipal.com`, // Provide default email if not given
        },
      });

      return NextResponse.json(
        { message: "Admin created successfully" },
        { status: 201 }
      );
    }
  } catch (err) {
    console.error("Admin setup error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
