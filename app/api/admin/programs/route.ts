import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const { code, name, degreeType, durationYears, departmentId } = await req.json();

    if (!code || !name || !departmentId) {
      return NextResponse.json({ success: false, message: "Code, name, and department are required." }, { status: 400 });
    }

    const existing = await prisma.program.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (existing) {
      return NextResponse.json({ success: false, message: `Program code '${code}' already exists.` }, { status: 400 });
    }

    const currentYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true },
    }) || await prisma.academicYear.findFirst();

    const program = await prisma.program.create({
      data: {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        degreeType: degreeType || "UNDERGRADUATE",
        durationYears: Number(durationYears) || 4,
        departmentId,
      },
    });

    // Auto-generate semesters if an academic year exists
    if (currentYear) {
      const numSemesters = (Number(durationYears) || 4) * 2;
      for (let i = 1; i <= numSemesters; i++) {
        await prisma.semester.create({
          data: {
            number: i,
            academicYearId: currentYear.id,
            programId: program.id,
            isActive: i === 1,
          },
        });
      }
    }

    await createAuditLog({
      actor: user,
      action: "PROGRAM_CREATE",
      entity: "Program",
      entityId: program.id,
      details: { code: program.code, name: program.name },
    });

    return NextResponse.json({ success: true, data: program });
  } catch (error: any) {
    console.error("Failed to create program:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}
