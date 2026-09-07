import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const { name, email, rollNumber, programId, sectionId, phone, gender, guardianName } = await req.json();

    if (!name || !email || !rollNumber || !programId) {
      return NextResponse.json({ success: false, message: "Name, email, roll number, and program are required." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, message: `User with email '${email}' already exists.` }, { status: 400 });
    }

    const existingRoll = await prisma.student.findUnique({
      where: { rollNumber: rollNumber.trim().toUpperCase() },
    });

    if (existingRoll) {
      return NextResponse.json({ success: false, message: `Roll number '${rollNumber}' already exists.` }, { status: 400 });
    }

    // Find semester 1 for this program
    const sem1 = await prisma.semester.findFirst({
      where: { programId, number: 1 },
    });

    if (!sem1) {
      return NextResponse.json({ success: false, message: "Semester 1 not configured for this program yet." }, { status: 400 });
    }

    const passwordHash = await hashPassword("password123");
    const regNo = `JLU-REG-${Math.floor(100000 + Math.random() * 900000)}`;

    const newStudent = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
        role: "STUDENT",
        phone: phone?.trim() || null,
        studentProfile: {
          create: {
            rollNumber: rollNumber.trim().toUpperCase(),
            registrationNo: regNo,
            programId,
            currentSemesterId: sem1.id,
            sectionId: sectionId || null,
            gender: gender || "OTHER",
            guardianName: guardianName?.trim() || null,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    // Auto-create initial semester tuition fee due if fee structure exists
    if (newStudent.studentProfile) {
      const feeStructure = await prisma.feeStructure.findFirst({
        where: { programId, semesterId: sem1.id },
      });

      if (feeStructure) {
        await prisma.studentFeeDue.create({
          data: {
            studentId: newStudent.studentProfile.id,
            feeStructureId: feeStructure.id,
            totalAmount: feeStructure.totalAmount,
            paidAmount: 0,
            dueDate: feeStructure.dueDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            status: "PENDING",
          },
        });
      }
    }

    await createAuditLog({
      actor: user,
      action: "STUDENT_ENROLL",
      entity: "Student",
      entityId: newStudent.studentProfile?.id,
      details: { name: newStudent.name, rollNumber, programId },
    });

    return NextResponse.json({ success: true, data: newStudent });
  } catch (error: any) {
    console.error("Failed to enroll student:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}
