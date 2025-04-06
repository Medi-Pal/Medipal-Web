import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma"; // Adjust path based on your structure

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prescription = await prisma.prescription.findUnique({
      where: {
        id: params.id,
      },
      include: {
        doctor_regNo: {
          select: {
            Name: true,
            Registration_No: true,
            Specialisation: true,
          },
        },
        patient_contact: {
          select: {
            Name: true,
            PhoneNumber: true,
            Age: true,
            City: true,
            State: true,
            Country: true,
          },
        },
        medicine_list: {
          include: {
            medicine: true,
            times: true,
          },
        },
      },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    console.log(
      "Returning prescription with diagnosis:",
      prescription.diagnosis
    );

    return NextResponse.json(prescription);
  } catch (error) {
    console.error("Failed to fetch prescription:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescription" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.licenseNumber) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { patientContact, patientDetails, medicines } = data;

    // Verify prescription exists and belongs to the doctor
    const existingPrescription = await prisma.prescription.findUnique({
      where: { id: params.id },
      include: { doctor_regNo: true },
    });

    if (!existingPrescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    if (
      existingPrescription.doctor_regNo.Registration_No !==
      session.user.licenseNumber
    ) {
      return NextResponse.json(
        { error: "Unauthorized to modify this prescription" },
        { status: 403 }
      );
    }

    // Update patient contact if it exists, create if it doesn't
    const patient = await prisma.patient.upsert({
      where: { PhoneNumber: patientContact },
      update: {
        Name: patientDetails.name,
        Age: patientDetails.age ? parseInt(patientDetails.age) : null,
        Gender: patientDetails.gender || null,
        City: patientDetails.city,
        State: patientDetails.state,
        Country: patientDetails.country,
      },
      create: {
        PhoneNumber: patientContact,
        Name: patientDetails.name,
        Age: patientDetails.age ? parseInt(patientDetails.age) : null,
        Gender: patientDetails.gender || null,
        City: patientDetails.city,
        State: patientDetails.state,
        Country: patientDetails.country,
      },
    });

    // Update prescription
    // First, delete all existing medicine timings for this prescription
    await prisma.medicineTiming.deleteMany({
      where: {
        prescriptionID: params.id,
      },
    });

    // Next, delete all existing medicines for this prescription
    await prisma.medicinesOnPrescription.deleteMany({
      where: {
        prescriptionID: params.id,
      },
    });

    // Now update prescription with new medicines
    console.log(
      "Updating prescription with diagnosis:",
      patientDetails.diagnosis
    );

    const updatedPrescription = await prisma.prescription.update({
      where: { id: params.id },
      data: {
        isUsedBy: patient.PhoneNumber,
        diagnosis: patientDetails.diagnosis || null,
        medicine_list: {
          create: medicines.map((med: any) => ({
            medicine: {
              connect: {
                Serial_No: med.medicineId,
              },
            },
            dosageType: med.dosageType,
            dosage: med.times[0].dosage,
            duration: med.duration,
            instruction: med.instruction,
            times: {
              create: med.times.map((time: any) => ({
                timeOfDay: time.timeOfDay,
                dosage: time.dosage,
              })),
            },
          })),
        },
      },
      include: {
        doctor_regNo: true,
        patient_contact: true,
        medicine_list: {
          include: {
            medicine: true,
            times: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPrescription);
  } catch (error) {
    console.error("Error updating prescription:", error);
    return NextResponse.json(
      { error: "Failed to update prescription" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Allow deletion without authentication for temporary prescriptions
    // This is necessary for the cancel functionality to work
    const prescription = await prisma.prescription.findUnique({
      where: { id: params.id },
      include: { doctor_regNo: true },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    // Check for temp prescriptions or authenticated doctor
    const isTemp = prescription.isUsedBy?.startsWith('temp_');
    const isDoctorAuthorized = session?.user?.licenseNumber === prescription.doctor_regNo?.Registration_No;
    
    if (!isTemp && !isDoctorAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized to delete this prescription" },
        { status: 403 }
      );
    }

    // Delete medicine timings first
    await prisma.medicineTiming.deleteMany({
      where: { prescriptionID: params.id }
    });

    // Delete medicines on prescription
    await prisma.medicinesOnPrescription.deleteMany({
      where: { prescriptionID: params.id }
    });

    // Delete the prescription
    await prisma.prescription.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete prescription:", error);
    return NextResponse.json(
      { error: "Failed to delete prescription" },
      { status: 500 }
    );
  }
}
