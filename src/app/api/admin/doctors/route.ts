import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    console.log("Fetching doctors from database...");

    // Use a direct query instead of a transaction to avoid transaction closure issues
    const doctors = await prisma.doctor.findMany({
      select: {
        Registration_No: true,
        Name: true,
        Specialisation: true,
        ContactNumber: true,
        Email: true,
        isVerified: true,
        licenseImageUrl: true,
      },
    });

    console.log("Found doctors:", doctors.length);

    // Log verification status for debugging
    doctors.forEach((doctor) => {
      console.log(
        `Doctor: ${doctor.Name}, ID: ${doctor.Registration_No}, isVerified: ${doctor.isVerified}`
      );
    });

    const formattedDoctors = doctors.map((doctor) => ({
      id: doctor.Registration_No,
      name: doctor.Name,
      specialisation: doctor.Specialisation,
      phoneNumber: doctor.ContactNumber,
      medicalLicense: doctor.Registration_No,
      licenseImageUrl: doctor.licenseImageUrl,
      isVerified: doctor.isVerified,
    }));

    // Set cache-control headers to prevent caching
    return new NextResponse(JSON.stringify(formattedDoctors), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors. Please check server logs." },
      { status: 500 }
    );
  }
}
