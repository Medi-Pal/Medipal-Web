import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`Fetching doctor with ID: ${id}`);

    const doctor = await prisma.doctor.findUnique({
      where: { Registration_No: id },
      select: {
        Registration_No: true,
        Name: true,
        Specialisation: true,
        ContactNumber: true,
        Email: true,
        isVerified: true,
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const formattedDoctor = {
      id: doctor.Registration_No,
      name: doctor.Name,
      specialisation: doctor.Specialisation,
      phoneNumber: doctor.ContactNumber,
      email: doctor.Email,
      medicalLicense: doctor.Registration_No,
      isVerified: doctor.isVerified,
    };

    // Add cache control headers to prevent caching
    return new NextResponse(JSON.stringify(formattedDoctor), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor. Please check server logs." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await req.json();

    console.log(`Updating doctor with ID: ${id}`, data);

    const { name, specialisation, phoneNumber, email } = data;

    // Validate required fields
    if (!name || !specialisation || !phoneNumber) {
      return NextResponse.json(
        { error: "Name, specialisation, and phone number are required" },
        { status: 400 }
      );
    }

    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { Registration_No: id },
    });

    if (!existingDoctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Update doctor
    const updatedDoctor = await prisma.doctor.update({
      where: { Registration_No: id },
      data: {
        Name: name,
        Specialisation: specialisation,
        ContactNumber: phoneNumber,
        Email: email,
      },
      select: {
        Registration_No: true,
        Name: true,
        Specialisation: true,
        ContactNumber: true,
        Email: true,
        isVerified: true,
      },
    });

    const formattedDoctor = {
      id: updatedDoctor.Registration_No,
      name: updatedDoctor.Name,
      specialisation: updatedDoctor.Specialisation,
      phoneNumber: updatedDoctor.ContactNumber,
      email: updatedDoctor.Email,
      medicalLicense: updatedDoctor.Registration_No,
      isVerified: updatedDoctor.isVerified,
    };

    return NextResponse.json(formattedDoctor, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error(`Error updating doctor ${params.id}:`, error);
    return NextResponse.json(
      {
        error: "An error occurred while updating the doctor",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`Attempting to delete doctor with ID: ${id}`);

    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { Registration_No: id },
    });

    if (!existingDoctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Delete the doctor
    await prisma.doctor.delete({
      where: { Registration_No: id },
    });

    return NextResponse.json(
      { message: "Doctor deleted successfully" },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error(`Error deleting doctor ${params.id}:`, error);
    return NextResponse.json(
      {
        error: "An error occurred while deleting the doctor",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
