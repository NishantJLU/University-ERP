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

    const { code, name, credits, type, semesterId, departmentId } = await req.json();

    if (!code || !name || !semesterId || !departmentId) {
      return NextResponse.json({ success: false, message: "Code, name, semester, and department are required." }, { status: 400 });
    }

    const existing = await prisma.subject.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (existing) {
      return NextResponse.json({ success: false, message: `Subject code '${code}' already exists.` }, { status: 400 });
    }

    const subject = await prisma.subject.create({
      data: {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        credits: Number(credits) || 4,
        type: type || "THEORY",
        semesterId,
        departmentId,
      },
    });

    // Auto-provision basic LMS course hub if a department faculty exists
    const deptFaculty = await prisma.faculty.findFirst({
      where: { departmentId },
    });

    if (deptFaculty) {
      await prisma.lMSCourse.create({
        data: {
          subjectId: subject.id,
          facultyId: deptFaculty.id,
          title: subject.name,
          description: `Course syllabus and learning repository for ${subject.name} (${subject.code}).`,
        },
      });
    }

    await createAuditLog({
      actor: user,
      action: "SUBJECT_CREATE",
      entity: "Subject",
      entityId: subject.id,
      details: { code: subject.code, name: subject.name, credits: subject.credits },
    });

    return NextResponse.json({ success: true, data: subject });
  } catch (error: any) {
    console.error("Failed to create subject:", error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}
