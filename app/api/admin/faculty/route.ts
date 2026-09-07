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

    const { name, email, employeeCode, departmentId, designation, qualification, specialization, phone } = await req.json();

    if (!name || !email || !employeeCode || !departmentId || !designation) {
      return NextResponse.json({ success: false, message: "Name, email, employee code, department, and designation are required." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, message: `User with email '${email}' already exists.` }, { status: 400 });
    }

    const existingFaculty = await prisma.faculty.findUnique({
      where: { employeeCode: employeeCode.trim().toUpperCase() },
    });

    if (existingFaculty) {
      return NextResponse.json({ success: false, message: `Employee code '${employeeCode}' already exists.` }, { status: 400 });
    }

    const passwordHash = await hashPassword("password123");

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
        role: "TEACHER",
        phone: phone?.trim() || null,
        facultyProfile: {
          create: {
            employeeCode: employeeCode.trim().toUpperCase(),
            departmentId,
            designation: designation.trim(),
            qualification: qualification?.trim() || null,
            specialization: specialization?.trim() || null,
          },
        },
      },
      include: {
        facultyProfile: true,
      },
    });

    await createAuditLog({
      actor: user,
      action: "FACULTY_ONBOARD",
      entity: "Faculty",
      entityId: newUser.facultyProfile?.id,
      details: { name: newUser.name, email: newUser.email, code: employeeCode },
    });

    return NextResponse.json({ success: true, data: newUser });
  } catch (error: any) {
    console.error("Failed to onboard faculty:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}
